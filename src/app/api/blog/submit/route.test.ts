/**
 * @vitest-environment node
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const { sendSpy, createSpy, fetchSpy, uploadSpy } = vi.hoisted(() => ({
  sendSpy: vi.fn(),
  createSpy: vi.fn(),
  fetchSpy: vi.fn(),
  uploadSpy: vi.fn(),
}))
vi.mock('resend', () => ({
  Resend: class {
    emails = { send: sendSpy }
  },
}))

vi.mock('@/sanity/write-client', () => ({
  writeClient: {
    create: (...args: unknown[]) => createSpy(...args),
    fetch: (...args: unknown[]) => fetchSpy(...args),
    assets: {
      upload: (...args: unknown[]) => uploadSpy(...args),
    },
  },
}))

import { POST } from './route'
import { NextRequest } from 'next/server'
import { __resetRateLimitForTests } from '@/lib/rate-limit'

function makeFormDataReq(fields: Record<string, string | Blob>) {
  const fd = new FormData()
  for (const [k, v] of Object.entries(fields)) fd.append(k, v)
  return new NextRequest('http://localhost/api/blog/submit', {
    method: 'POST',
    body: fd,
  })
}

const validSections = JSON.stringify([
  { title: 'Day 1', body: 'Arrival in Entebbe', imageLayout: 'none' },
  { title: 'Day 2', body: 'Drive to Bwindi', imageLayout: 'single' },
  { title: 'Day 3', body: 'Gorilla trek', imageLayout: 'grid' },
])

const validFields = {
  bookingNumber: 'PS-2026-A1B2',
  email: 'sarah@example.com',
  telefoon: '+31612345678',
  title: 'My Bwindi adventure',
  authorName: 'Sarah de Boer',
  authorBio: 'Reisgek en wildlife liefhebber.',
  intro: 'Een onvergetelijke reis naar Oeganda.',
  sections: validSections,
}

describe('POST /api/blog/submit', () => {
  beforeEach(() => {
    sendSpy.mockReset()
    sendSpy.mockResolvedValue({ id: 'mock-email-id' })
    createSpy.mockReset()
    createSpy.mockResolvedValue({ _id: 'blog-doc-id' })
    fetchSpy.mockReset()
    fetchSpy.mockResolvedValue({ _id: 'booking-doc-id', status: 'pending' })
    uploadSpy.mockReset()
    let n = 0
    uploadSpy.mockImplementation(async () => ({ _id: `asset-${++n}` }))
    __resetRateLimitForTests()
    vi.stubEnv('ADMIN_EMAIL', 'admin@example.com')
    vi.stubEnv('EMAIL_FROM', 'noreply@example.com')
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://www.puurugandareizen.nl')
    vi.stubEnv('RESEND_API_KEY', 'test-key')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('rejects when bookingNumber does not match the required PS-YYYY-XXXX format', async () => {
    const res = await POST(makeFormDataReq({ ...validFields, bookingNumber: 'BAD-FORMAT' }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/Ongeldige invoer/i)
  })

  it('rejects when fewer than 3 sections are submitted', async () => {
    const tooFew = JSON.stringify([
      { title: 'Day 1', body: 'Arrival', imageLayout: 'none' },
      { title: 'Day 2', body: 'Trek', imageLayout: 'none' },
    ])
    const res = await POST(makeFormDataReq({ ...validFields, sections: tooFew }))
    expect(res.status).toBe(400)
  })

  it('returns 403 when the booking lookup returns null (no matching booking)', async () => {
    fetchSpy.mockResolvedValueOnce(null)
    const res = await POST(makeFormDataReq(validFields))
    expect(res.status).toBe(403)
    const body = await res.json()
    expect(body.error).toMatch(/komen niet overeen/i)
    expect(createSpy).not.toHaveBeenCalled()
  })

  it('returns 403 when the booking exists but is cancelled', async () => {
    fetchSpy.mockResolvedValueOnce({ _id: 'booking-doc-id', status: 'cancelled' })
    const res = await POST(makeFormDataReq(validFields))
    expect(res.status).toBe(403)
    const body = await res.json()
    expect(body.error).toMatch(/geannuleerd/i)
    expect(createSpy).not.toHaveBeenCalled()
  })

  it('happy path: creates a blogPost with status pending_review and persists author bio + author image', async () => {
    const heroFile = new File(['hero-bytes'], 'hero.jpg', { type: 'image/jpeg' })
    const authorFile = new File(['author-bytes'], 'author.jpg', { type: 'image/jpeg' })

    const res = await POST(
      makeFormDataReq({
        ...validFields,
        heroImage: heroFile,
        authorPhoto: authorFile,
      }),
    )
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.id).toBe('blog-doc-id')

    expect(createSpy).toHaveBeenCalledTimes(1)
    const doc = createSpy.mock.calls[0][0]
    expect(doc._type).toBe('blogPost')
    expect(doc.status).toBe('pending_review')
    expect(doc.author).toBe(validFields.authorName)
    // Regression coverage: authorBio and authorImage must be persisted on the
    // doc — both were silently dropped in a recent bug.
    expect(doc.authorBio).toBe(validFields.authorBio)
    expect(doc.authorImage).toBeDefined()
    expect(doc.authorImage.asset._ref).toMatch(/^asset-/)
    expect(doc.featuredImage).toBeDefined()
    expect(doc.featuredImage.asset._ref).toMatch(/^asset-/)
    expect(doc.submitterEmail).toBe(validFields.email)
    expect(doc.submitterBooking._ref).toBe('booking-doc-id')
  })

  it('still creates the doc when no images are uploaded (authorImage/featuredImage become undefined)', async () => {
    const res = await POST(makeFormDataReq(validFields))
    expect(res.status).toBe(200)
    const doc = createSpy.mock.calls[0][0]
    expect(doc.authorImage).toBeUndefined()
    expect(doc.featuredImage).toBeUndefined()
  })

  it('sends the submitter confirmation and the admin notification with preview + studio URLs', async () => {
    await POST(makeFormDataReq(validFields))

    expect(sendSpy).toHaveBeenCalledTimes(2)
    const [submitter, admin] = sendSpy.mock.calls
    expect(submitter[0].to).toBe(validFields.email)
    expect(submitter[0].subject).toMatch(/Reisverslag ontvangen/)

    expect(admin[0].to).toBe('admin@example.com')
    expect(admin[0].subject).toMatch(/Nieuw reisverslag ter beoordeling/)

    // Render the admin email to assert it contains the right preview + studio
    // URLs derived from NEXT_PUBLIC_SITE_URL + slug + doc id.
    const { render } = await import('@react-email/render')
    const html = await render(admin[0].react)
    expect(html).toContain('https://www.puurugandareizen.nl/blog/preview/my-bwindi-adventure')
    expect(html).toContain('https://www.puurugandareizen.nl/studio/structure/blogPost;blog-doc-id')
  })

  it('skips the admin notification when ADMIN_EMAIL is not set, but still confirms to the submitter', async () => {
    vi.stubEnv('ADMIN_EMAIL', '')
    await POST(makeFormDataReq(validFields))
    expect(sendSpy).toHaveBeenCalledTimes(1)
    expect(sendSpy.mock.calls[0][0].to).toBe(validFields.email)
  })
})
