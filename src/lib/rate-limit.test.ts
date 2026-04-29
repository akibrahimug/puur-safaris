import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { __resetRateLimitForTests, getClientIp, rateLimit } from './rate-limit'

describe('rateLimit', () => {
  beforeEach(() => {
    __resetRateLimitForTests()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-29T10:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('allows requests under the limit and decrements `remaining`', () => {
    const a = rateLimit({ endpoint: 'contact', ip: '1.1.1.1', limit: 3, windowMs: 60_000 })
    const b = rateLimit({ endpoint: 'contact', ip: '1.1.1.1', limit: 3, windowMs: 60_000 })
    expect(a).toEqual({ ok: true, retryAfterSeconds: 0, remaining: 2 })
    expect(b).toEqual({ ok: true, retryAfterSeconds: 0, remaining: 1 })
  })

  it('rejects with retryAfter once the limit is reached', () => {
    for (let i = 0; i < 3; i++) {
      rateLimit({ endpoint: 'contact', ip: '1.1.1.1', limit: 3, windowMs: 60_000 })
    }
    const blocked = rateLimit({ endpoint: 'contact', ip: '1.1.1.1', limit: 3, windowMs: 60_000 })
    expect(blocked.ok).toBe(false)
    expect(blocked.remaining).toBe(0)
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0)
    expect(blocked.retryAfterSeconds).toBeLessThanOrEqual(60)
  })

  it('refills the bucket once the window has elapsed', () => {
    for (let i = 0; i < 3; i++) {
      rateLimit({ endpoint: 'contact', ip: '1.1.1.1', limit: 3, windowMs: 60_000 })
    }
    expect(rateLimit({ endpoint: 'contact', ip: '1.1.1.1', limit: 3, windowMs: 60_000 }).ok).toBe(false)

    vi.advanceTimersByTime(60_001)
    const refilled = rateLimit({ endpoint: 'contact', ip: '1.1.1.1', limit: 3, windowMs: 60_000 })
    expect(refilled).toEqual({ ok: true, retryAfterSeconds: 0, remaining: 2 })
  })

  it('keeps separate buckets per endpoint', () => {
    for (let i = 0; i < 3; i++) {
      rateLimit({ endpoint: 'contact', ip: '1.1.1.1', limit: 3, windowMs: 60_000 })
    }
    // Same IP but different endpoint — fresh bucket
    expect(
      rateLimit({ endpoint: 'booking', ip: '1.1.1.1', limit: 3, windowMs: 60_000 }).ok,
    ).toBe(true)
  })

  it('keeps separate buckets per ip', () => {
    for (let i = 0; i < 3; i++) {
      rateLimit({ endpoint: 'contact', ip: '1.1.1.1', limit: 3, windowMs: 60_000 })
    }
    expect(
      rateLimit({ endpoint: 'contact', ip: '2.2.2.2', limit: 3, windowMs: 60_000 }).ok,
    ).toBe(true)
  })
})

describe('getClientIp', () => {
  it('extracts the first IP from x-forwarded-for', () => {
    const req = new Request('http://localhost/', {
      headers: { 'x-forwarded-for': '203.0.113.5, 70.41.3.18, 150.172.238.178' },
    })
    expect(getClientIp(req)).toBe('203.0.113.5')
  })

  it('falls back to x-real-ip when x-forwarded-for is absent', () => {
    const req = new Request('http://localhost/', { headers: { 'x-real-ip': '10.0.0.5' } })
    expect(getClientIp(req)).toBe('10.0.0.5')
  })

  it('returns "unknown" when neither header is present (local dev)', () => {
    const req = new Request('http://localhost/')
    expect(getClientIp(req)).toBe('unknown')
  })

  it('trims whitespace around forwarded values', () => {
    const req = new Request('http://localhost/', { headers: { 'x-forwarded-for': '   1.2.3.4   ' } })
    expect(getClientIp(req)).toBe('1.2.3.4')
  })
})
