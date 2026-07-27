/**
 * @vitest-environment node
 */
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/data', () => ({
  getTripSlugs: vi.fn(async () => ['gorilla-trekking']),
  getDestinationSlugs: vi.fn(async () => ['bwindi']),
  getBlogPostSlugs: vi.fn(async () => ['beste-reistijd']),
}))

import sitemap from './sitemap'

describe('sitemap', () => {
  it('emits locale-prefixed URLs, never bare/unprefixed ones', async () => {
    const entries = await sitemap()
    for (const { url } of entries) {
      expect(url).toMatch(/^https?:\/\/[^/]+\/(nl|en)(\/|$)/)
    }
  })

  it('uses the Dutch URL segment for nl entries on routes where nl/en differ', async () => {
    const entries = await sitemap()
    const urls = entries.map((e) => e.url)

    expect(urls).toContain('http://localhost:3000/nl/safari-reizen')
    expect(urls).toContain('http://localhost:3000/en/safaris')
    expect(urls).toContain('http://localhost:3000/nl/bestemmingen')
    expect(urls).toContain('http://localhost:3000/en/destinations')
    expect(urls).toContain('http://localhost:3000/nl/safari-reizen/gorilla-trekking')
    expect(urls).toContain('http://localhost:3000/en/safaris/gorilla-trekking')
    expect(urls).toContain('http://localhost:3000/nl/bestemmingen/bwindi')
    expect(urls).toContain('http://localhost:3000/en/destinations/bwindi')
    expect(urls).toContain('http://localhost:3000/nl/blog/beste-reistijd')
    expect(urls).toContain('http://localhost:3000/en/blog/beste-reistijd')
  })

  it('includes both locales for the homepage and static pages', async () => {
    const entries = await sitemap()
    const urls = entries.map((e) => e.url)
    expect(urls).toContain('http://localhost:3000/nl')
    expect(urls).toContain('http://localhost:3000/en')
    expect(urls).toContain('http://localhost:3000/nl/contact')
    expect(urls).toContain('http://localhost:3000/en/contact')
  })
})
