/**
 * @vitest-environment node
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const { sendSpy, createSpy } = vi.hoisted(() => ({
  sendSpy: vi.fn(),
  createSpy: vi.fn(),
}))
vi.mock('resend', () => ({
  Resend: class {
    emails = { send: sendSpy }
  },
}))

vi.mock('@/sanity/write-client', () => ({
  writeClient: {
    create: (...args: unknown[]) => createSpy(...args),
  },
}))

import { POST } from './route'
import { NextRequest } from 'next/server'
import { __resetRateLimitForTests } from '@/lib/rate-limit'

function makeReq(body: unknown) {
  return new NextRequest('http://localhost/api/booking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

const validBody = {
  voornaam: 'Sarah',
  achternaam: 'de Boer',
  email: 'sarah@example.com',
  telefoon: '+31612345678',
  geboortedatum: '1990-01-15',
  vertrekdatum: '2026-08-15',
  retourdatum: '2026-08-25',
  aantalVolwassenen: 2,
  aantalKinderen: 1,
  tripTitle: 'Gorilla Trek Bwindi',
  tripSlug: 'gorilla-trek-bwindi',
  nationaliteit: 'Nederlandse',
  paspoortnummer: 'NL1234567',
}

describe('POST /api/booking', () => {
  beforeEach(() => {
    sendSpy.mockReset()
    sendSpy.mockResolvedValue({ id: 'mock-email-id' })
    createSpy.mockReset()
    createSpy.mockResolvedValue({ _id: 'booking-doc-id' })
    vi.stubEnv('ADMIN_EMAIL', 'admin@example.com')
    vi.stubEnv('EMAIL_FROM', 'noreply@example.com')
    vi.stubEnv('RESEND_API_KEY', 'test-key')
    __resetRateLimitForTests()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('rejects when required fields are missing', async () => {
    const res = await POST(makeReq({ voornaam: 'Sarah' }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/Ongeldige invoer/i)
    expect(Array.isArray(body.details)).toBe(true)
  })

  it('rejects when aantalVolwassenen is below the schema minimum', async () => {
    const res = await POST(makeReq({ ...validBody, aantalVolwassenen: 0 }))
    expect(res.status).toBe(400)
  })

  it('returns 500 when EMAIL_FROM is not configured', async () => {
    vi.stubEnv('EMAIL_FROM', '')
    const res = await POST(makeReq(validBody))
    expect(res.status).toBe(500)
    expect(createSpy).not.toHaveBeenCalled()
    expect(sendSpy).not.toHaveBeenCalled()
  })

  it('happy path: returns success with a booking number matching PS-YYYY-XXXX', async () => {
    const res = await POST(makeReq(validBody))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.bookingNumber).toMatch(/^PS-\d{4}-[A-Z0-9]{4}$/)
  })

  it('persists the booking in Sanity BEFORE sending the customer email', async () => {
    // Track call order across mocks. Sanity create must happen first so the
    // lead is captured in CMS even if email sending later flakes.
    const order: string[] = []
    createSpy.mockImplementation(async () => {
      order.push('sanity-create')
      return { _id: 'booking-doc-id' }
    })
    sendSpy.mockImplementation(async () => {
      order.push('email-send')
      return { id: 'mock-email-id' }
    })

    await POST(makeReq(validBody))

    expect(order[0]).toBe('sanity-create')
    expect(order[1]).toBe('email-send')
  })

  it('writes the booking to Sanity with status "pending" and a generated bookingNumber', async () => {
    const res = await POST(makeReq(validBody))
    const body = await res.json()
    expect(createSpy).toHaveBeenCalledTimes(1)
    const doc = createSpy.mock.calls[0][0]
    expect(doc._type).toBe('booking')
    expect(doc.status).toBe('pending')
    expect(doc.bookingNumber).toBe(body.bookingNumber)
    expect(doc.email).toBe(validBody.email)
    expect(doc.tripSlug).toBe(validBody.tripSlug)
  })

  it('still returns 200 when the admin email fails (try/catch is intentional)', async () => {
    sendSpy
      .mockResolvedValueOnce({ id: 'customer-ok' })
      .mockRejectedValueOnce(new Error('admin smtp down'))

    const res = await POST(makeReq(validBody))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.bookingNumber).toMatch(/^PS-\d{4}-[A-Z0-9]{4}$/)
  })

  it('returns 500 when the Sanity write fails', async () => {
    createSpy.mockRejectedValueOnce(new Error('sanity down'))
    const res = await POST(makeReq(validBody))
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toMatch(/Versturen mislukt/i)
    // No emails should have been sent if booking write failed
    expect(sendSpy).not.toHaveBeenCalled()
  })
})
