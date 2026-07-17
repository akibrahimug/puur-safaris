/**
 * @vitest-environment node
 */
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/data', () => ({
  getSiteSettings: vi.fn(async () => ({
    siteName: 'Puur Uganda Reizen',
    tagline: 'Safari op maat',
    contactEmail: 'info@puurugandareizen.nl',
    phone: '+31 6 1234 5678',
  })),
  getTrips: vi.fn(async () => [
    { _id: '1', title: 'Gorilla Trekking Safari', slug: 'gorilla-trekking', excerpt: 'Ontmoet berggorillas.' },
  ]),
  getDestinations: vi.fn(async () => [
    { _id: '1', name: 'Bwindi', slug: 'bwindi', excerpt: 'Ondoordringbaar woud.' },
  ]),
  getBlogPosts: vi.fn(async () => [
    { _id: '1', title: 'Beste reistijd Uganda', slug: 'beste-reistijd', summary: 'Wanneer te gaan.' },
  ]),
}))

import { GET } from './route'

describe('GET /llms.txt', () => {
  it('returns plain text with the site summary, links, and contact info', async () => {
    const res = await GET()
    expect(res.headers.get('Content-Type')).toBe('text/plain; charset=utf-8')

    const body = await res.text()
    expect(body).toContain('# Puur Uganda Reizen')
    expect(body).toContain('> Safari op maat')
    expect(body).toContain('/nl/safaris/gorilla-trekking')
    expect(body).toContain('Gorilla Trekking Safari')
    expect(body).toContain('/nl/destinations/bwindi')
    expect(body).toContain('/nl/blog/beste-reistijd')
    expect(body).toContain('info@puurugandareizen.nl')
    expect(body).toContain('+31 6 1234 5678')
    expect(body).toContain('/sitemap.xml')
  })
})
