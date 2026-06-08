/**
 * @vitest-environment node
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// ── Mocks ────────────────────────────────────────────────────────────────────
// Resend is constructed at module-load time inside the route — so we have to
// mock it BEFORE the route is imported. The mock returns a stable `send` spy
// that the test suite can assert against.
const { sendSpy } = vi.hoisted(() => ({ sendSpy: vi.fn() }))
vi.mock('resend', () => ({
  Resend: class {
    emails = { send: sendSpy }
  },
}))

import { POST } from './route'
import { NextRequest } from 'next/server'
import { __resetRateLimitForTests } from '@/lib/rate-limit'

function makeReq(body: unknown) {
  return new NextRequest('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

const validBody = {
  naam: 'Sarah de Boer',
  email: 'sarah@example.com',
  telefoon: '+31612345678',
  voorkeursContact: 'email',
  aantalReizigers: '2',
  voorkeursPeriode: 'Augustus 2026',
  budgetIndicatie: '4000-6000',
  onderwerp: 'Vraag over safari',
  bericht: 'Ik wil graag meer weten over de mogelijke gorilla treks in Bwindi en de combinatie met Queen Elizabeth.',
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    sendSpy.mockReset()
    sendSpy.mockResolvedValue({ id: 'mock-email-id' })
    vi.stubEnv('ADMIN_EMAIL', 'admin@example.com')
    vi.stubEnv('EMAIL_FROM', 'noreply@example.com')
    vi.stubEnv('RESEND_API_KEY', 'test-key')
    // Reset the in-process rate-limit bucket so tests don't cascade-fail
    // once the per-IP cap is reached (default IP for tests is "unknown").
    __resetRateLimitForTests()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('rejects an empty body with 400 + Zod issues', async () => {
    const res = await POST(makeReq({}))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/Ongeldige invoer/i)
    expect(Array.isArray(body.details)).toBe(true)
    expect(body.details.length).toBeGreaterThan(0)
  })

  it('rejects an invalid email with 400', async () => {
    const res = await POST(makeReq({ ...validBody, email: 'not-an-email' }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/Ongeldige invoer/i)
    expect(body.details.some((i: { path: (string | number)[] }) => i.path.includes('email'))).toBe(true)
  })

  it('rejects a too-short message with 400', async () => {
    const res = await POST(makeReq({ ...validBody, bericht: 'short' }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.details.some((i: { path: (string | number)[] }) => i.path.includes('bericht'))).toBe(true)
  })

  it('returns 500 when ADMIN_EMAIL is not configured', async () => {
    vi.stubEnv('ADMIN_EMAIL', '')
    const res = await POST(makeReq(validBody))
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toMatch(/Server niet geconfigureerd/i)
    // Mail must NOT be sent if config check fails
    expect(sendSpy).not.toHaveBeenCalled()
  })

  it('happy path: sends customer + admin email and returns 200', async () => {
    const res = await POST(makeReq(validBody))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ success: true })

    // Two emails sent: customer first, then admin
    expect(sendSpy).toHaveBeenCalledTimes(2)
    const [first, second] = sendSpy.mock.calls
    expect(first[0].to).toBe(validBody.email)
    expect(first[0].subject).toMatch(/Bedankt voor uw bericht/)
    expect(second[0].to).toBe('admin@example.com')
    expect(second[0].replyTo).toBe(validBody.email)
    expect(second[0].subject).toMatch(/Nieuw bericht/)
  })

  it('uses the eigen-reisschema subject variant when onderwerp is "Eigen Reisschema Aanvraag"', async () => {
    await POST(
      makeReq({ ...validBody, onderwerp: 'Eigen Reisschema Aanvraag' }),
    )
    expect(sendSpy).toHaveBeenCalledTimes(2)
    expect(sendSpy.mock.calls[0][0].subject).toBe(
      'Bevestiging: Eigen Reisschema Aanvraag',
    )
  })

  it('still returns 200 when the admin email send fails (try/catch is intentional)', async () => {
    // First call (customer) succeeds; second call (admin) throws.
    sendSpy
      .mockResolvedValueOnce({ id: 'customer-ok' })
      .mockRejectedValueOnce(new Error('admin smtp down'))

    const res = await POST(makeReq(validBody))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ success: true })
  })

  it('returns 500 when the customer email send fails (no try/catch around it)', async () => {
    sendSpy.mockRejectedValueOnce(new Error('customer smtp down'))
    const res = await POST(makeReq(validBody))
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toMatch(/Versturen mislukt/i)
  })

  describe('rate limiting', () => {
    function withIp(body: unknown, ip: string) {
      return new NextRequest('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
        body: JSON.stringify(body),
      })
    }

    it('returns 429 + Retry-After once the per-IP limit is exceeded', async () => {
      // Limit is 5/min for /api/contact — 6th call from the same IP gets 429.
      for (let i = 0; i < 5; i++) {
        const r = await POST(withIp(validBody, '203.0.113.1'))
        expect(r.status).toBe(200)
      }
      const blocked = await POST(withIp(validBody, '203.0.113.1'))
      expect(blocked.status).toBe(429)
      expect(blocked.headers.get('Retry-After')).toMatch(/^\d+$/)
      // Email send count must NOT increase on the blocked attempt
      expect(sendSpy).toHaveBeenCalledTimes(5 * 2) // 5 successful runs × 2 mails each
    })

    it('keeps separate buckets per IP', async () => {
      for (let i = 0; i < 5; i++) {
        await POST(withIp(validBody, '203.0.113.2'))
      }
      // Different IP → fresh bucket → still allowed
      const fromOtherIp = await POST(withIp(validBody, '203.0.113.3'))
      expect(fromOtherIp.status).toBe(200)
    })
  })

  describe('honeypot', () => {
    it('returns success without sending email when the honeypot field is filled', async () => {
      const res = await POST(makeReq({ ...validBody, referralSource: 'https://spammy.example' }))
      // Silent 200 — bot shouldn't learn it was filtered
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toEqual({ success: true })
      // Critical: NO email sent
      expect(sendSpy).not.toHaveBeenCalled()
    })

    it('treats whitespace-only honeypot as empty (legitimate submission)', async () => {
      const res = await POST(makeReq({ ...validBody, referralSource: '   ' }))
      expect(res.status).toBe(200)
      // Whitespace-only does NOT trigger honeypot — emails go out as usual
      expect(sendSpy).toHaveBeenCalledTimes(2)
    })
  })
})
