/**
 * @vitest-environment node
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the translation service so the test doesn't hit the real Google
// Translate backend. The mock receives the source fields object and returns a
// shallow-cloned object with all string values prefixed with "EN:" — that way
// every original-vs-translated comparison registers a change and the route's
// "only return changed fields" diff logic exercises the full path.
vi.mock('@/lib/translation/service', () => ({
  translateDocument: vi.fn(async (fields: Record<string, unknown>) => {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(fields)) {
      if (typeof v === 'string') out[k] = `EN: ${v}`
      else out[k] = v
    }
    return out
  }),
}))

import { POST } from './route'

function makeReq(body: unknown) {
  return new Request('http://localhost/api/translate-doc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

describe('POST /api/translate-doc', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 400 when JSON body is malformed', async () => {
    const res = await POST(makeReq('not-json{'))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/Invalid JSON/i)
  })

  it('returns 400 when docType is missing', async () => {
    const res = await POST(makeReq({ fields: { title: 'x' } }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/docType/i)
  })

  it('returns 400 when fields object is missing', async () => {
    const res = await POST(makeReq({ docType: 'trip' }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/fields/i)
  })

  it('returns 400 for an unknown docType', async () => {
    const res = await POST(makeReq({ docType: 'definitelyNotAType', fields: {} }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/Unknown docType/i)
  })

  it('returns an empty fields object (no-op) when target language is nl', async () => {
    const res = await POST(
      makeReq({ docType: 'trip', fields: { title: 'Bwindi' }, targetLang: 'nl' }),
    )
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ ok: true, fields: {} })
  })

  it('translates and returns only the fields that changed', async () => {
    const res = await POST(
      makeReq({
        docType: 'trip',
        fields: { title: 'Bwindi', excerpt: 'Een unieke ervaring' },
        targetLang: 'en',
      }),
    )
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
    // Both string fields changed (prefix "EN: " applied)
    expect(body.fields.title).toBe('EN: Bwindi')
    expect(body.fields.excerpt).toBe('EN: Een unieke ervaring')
  })

  it('uses "en" as the default target language when none is provided', async () => {
    const { translateDocument } = await import('@/lib/translation/service')
    await POST(makeReq({ docType: 'trip', fields: { title: 'Test' } }))
    expect(translateDocument).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Test' }),
      expect.any(Object),
      'en',
    )
  })

  it('returns 500 when the translation service throws', async () => {
    const { translateDocument } = await import('@/lib/translation/service')
    vi.mocked(translateDocument).mockRejectedValueOnce(new Error('rate-limited'))

    const res = await POST(
      makeReq({ docType: 'trip', fields: { title: 'x' }, targetLang: 'en' }),
    )
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toMatch(/Translation failed/i)
    expect(body.detail).toBe('rate-limited')
  })
})
