import { describe, it, expect } from 'vitest'
import { localePath, cmsPathToLocale, getNlRewrites, getNlCanonicalRedirects } from './routes'

describe('localePath', () => {
  it('uses the Dutch segment for nl locale on routes where nl/en segments differ', () => {
    expect(localePath('nl', 'destinations')).toBe('/nl/bestemmingen')
    expect(localePath('nl', 'destinationDetail', 'queen-elizabeth-nationaal-park')).toBe(
      '/nl/bestemmingen/queen-elizabeth-nationaal-park',
    )
    expect(localePath('nl', 'safaris')).toBe('/nl/safari-reizen')
    expect(localePath('nl', 'safariDetail', '6-dagen-jinja-en-sipi-falls')).toBe(
      '/nl/safari-reizen/6-dagen-jinja-en-sipi-falls',
    )
    expect(localePath('nl', 'about')).toBe('/nl/over-ons')
    expect(localePath('nl', 'customItinerary')).toBe('/nl/eigen-reisschema')
    expect(localePath('nl', 'privacy')).toBe('/nl/privacybeleid')
    expect(localePath('nl', 'terms')).toBe('/nl/algemene-voorwaarden')
    expect(localePath('nl', 'blogSubmit')).toBe('/nl/blog/inzenden')
  })

  it('uses the English segment for en locale on the same routes', () => {
    expect(localePath('en', 'destinationDetail', 'queen-elizabeth-nationaal-park')).toBe(
      '/en/destinations/queen-elizabeth-nationaal-park',
    )
    expect(localePath('en', 'safariDetail', '6-dagen-jinja-en-sipi-falls')).toBe(
      '/en/safaris/6-dagen-jinja-en-sipi-falls',
    )
  })

  it('appends the locale-specific slugTail for routes that have one', () => {
    expect(localePath('nl', 'safariBook', '6-dagen-jinja-en-sipi-falls')).toBe(
      '/nl/safari-reizen/6-dagen-jinja-en-sipi-falls/boeken',
    )
    expect(localePath('en', 'safariBook', '6-dagen-jinja-en-sipi-falls')).toBe(
      '/en/safaris/6-dagen-jinja-en-sipi-falls/book',
    )
  })

  it('omits the slug segment when none is given', () => {
    expect(localePath('nl', 'home')).toBe('/nl')
    expect(localePath('en', 'contact')).toBe('/en/contact')
  })
})

describe('cmsPathToLocale', () => {
  it('returns the nl path unchanged for nl locale', () => {
    expect(cmsPathToLocale('/safari-reizen/gorilla-trek', 'nl')).toBe('/safari-reizen/gorilla-trek')
  })

  it('maps nl segments to en segments', () => {
    expect(cmsPathToLocale('/safari-reizen', 'en')).toBe('/safaris')
    expect(cmsPathToLocale('/safari-reizen/gorilla-trek', 'en')).toBe('/safaris/gorilla-trek')
  })

  it('preserves query strings and hash fragments', () => {
    expect(cmsPathToLocale('/safari-reizen?category=wildlife', 'en')).toBe('/safaris?category=wildlife')
  })
})

describe('getNlRewrites', () => {
  it('includes a rewrite for every route whose nl/en segments differ', () => {
    const rewrites = getNlRewrites()
    expect(rewrites).toContainEqual({ source: '/nl/bestemmingen', destination: '/nl/destinations' })
    expect(rewrites).toContainEqual({ source: '/nl/bestemmingen/:slug', destination: '/nl/destinations/:slug' })
    expect(rewrites).toContainEqual({
      source: '/nl/safari-reizen/:slug/boeken',
      destination: '/nl/safaris/:slug/book',
    })
  })
})

describe('getNlCanonicalRedirects', () => {
  it('is the mirror image of getNlRewrites: every rewrite destination redirects back to its source', () => {
    const rewrites = getNlRewrites()
    const redirects = getNlCanonicalRedirects()
    expect(redirects).toHaveLength(rewrites.length)
    for (const rewrite of rewrites) {
      expect(redirects).toContainEqual({
        source: rewrite.destination,
        destination: rewrite.source,
        permanent: true,
      })
    }
  })

  it('redirects the English-segment duplicate under /nl back to the Dutch canonical URL', () => {
    const redirects = getNlCanonicalRedirects()
    expect(redirects).toContainEqual({
      source: '/nl/safaris/:slug',
      destination: '/nl/safari-reizen/:slug',
      permanent: true,
    })
    expect(redirects).toContainEqual({
      source: '/nl/destinations',
      destination: '/nl/bestemmingen',
      permanent: true,
    })
    expect(redirects).toContainEqual({
      source: '/nl/safaris/:slug/book',
      destination: '/nl/safari-reizen/:slug/boeken',
      permanent: true,
    })
  })
})
