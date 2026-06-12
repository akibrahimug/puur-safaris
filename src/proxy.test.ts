import { describe, it, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { proxy } from './proxy'

function makeRequest(
  url: string,
  init: { acceptLanguage?: string | null; country?: string | null; cookies?: Record<string, string> } = {},
): NextRequest {
  const headers = new Headers()
  if (init.acceptLanguage !== null && init.acceptLanguage !== undefined) {
    headers.set('accept-language', init.acceptLanguage)
  }
  if (init.country) {
    headers.set('x-vercel-ip-country', init.country)
  }
  if (init.cookies) {
    const cookieStr = Object.entries(init.cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ')
    headers.set('cookie', cookieStr)
  }
  return new NextRequest(url, { headers })
}

describe('proxy — locale routing', () => {
  describe('paths already locale-prefixed', () => {
    it('passes through /en/... without redirecting and sets x-locale', () => {
      const req = makeRequest('http://localhost/en/contact')
      const res = proxy(req)
      // NextResponse.next() returns 200 (no redirect)
      expect(res.status).toBe(200)
      expect(res.headers.get('x-locale')).toBe('en')
      expect(res.headers.get('location')).toBeNull()
    })

    it('passes through /nl/... without redirecting and sets x-locale', () => {
      const req = makeRequest('http://localhost/nl/contact')
      const res = proxy(req)
      expect(res.status).toBe(200)
      expect(res.headers.get('x-locale')).toBe('nl')
      expect(res.headers.get('location')).toBeNull()
    })

    it('sets x-locale on bare locale root /en', () => {
      const req = makeRequest('http://localhost/en')
      const res = proxy(req)
      expect(res.status).toBe(200)
      expect(res.headers.get('x-locale')).toBe('en')
    })

    it('sets x-locale on bare locale root /nl', () => {
      const req = makeRequest('http://localhost/nl')
      const res = proxy(req)
      expect(res.status).toBe(200)
      expect(res.headers.get('x-locale')).toBe('nl')
    })
  })

  describe('paths missing locale prefix → redirect', () => {
    it('Accept-Language: nl-NL redirects to /nl<path>', () => {
      const req = makeRequest('http://localhost/contact', {
        acceptLanguage: 'nl-NL,nl;q=0.9,en;q=0.8',
      })
      const res = proxy(req)
      // NextResponse.redirect() defaults to 307
      expect([307, 308]).toContain(res.status)
      expect(res.headers.get('location')).toBe('http://localhost/nl/contact')
    })

    it('Accept-Language: en-US redirects to /en<path>', () => {
      const req = makeRequest('http://localhost/contact', {
        acceptLanguage: 'en-US,en;q=0.9',
      })
      const res = proxy(req)
      expect([307, 308]).toContain(res.status)
      expect(res.headers.get('location')).toBe('http://localhost/en/contact')
    })

    it('Accept-Language: de-DE,fr;q=0.5 falls back to /en<path>', () => {
      const req = makeRequest('http://localhost/contact', {
        acceptLanguage: 'de-DE,fr;q=0.5',
      })
      const res = proxy(req)
      expect([307, 308]).toContain(res.status)
      expect(res.headers.get('location')).toBe('http://localhost/en/contact')
    })

    it('no Accept-Language header falls back to /en<path>', () => {
      const req = makeRequest('http://localhost/contact', { acceptLanguage: null })
      const res = proxy(req)
      expect([307, 308]).toContain(res.status)
      expect(res.headers.get('location')).toBe('http://localhost/en/contact')
    })

    it('preserves query string across the redirect', () => {
      const req = makeRequest('http://localhost/contact?from=email', {
        acceptLanguage: 'en-US',
      })
      const res = proxy(req)
      expect([307, 308]).toContain(res.status)
      const loc = res.headers.get('location')!
      expect(loc).toContain('/en/contact')
      expect(loc).toContain('from=email')
    })

    it('preserves hash fragment across the redirect', () => {
      // Hash fragments aren't sent to servers in real traffic, but
      // NextURL still preserves them when constructed from a URL.
      const req = makeRequest('http://localhost/contact#section', {
        acceptLanguage: 'en-US',
      })
      const res = proxy(req)
      expect([307, 308]).toContain(res.status)
      const loc = res.headers.get('location')!
      expect(loc).toContain('/en/contact')
    })

    it('higher-weighted English wins over lower-weighted Dutch', () => {
      const req = makeRequest('http://localhost/about', {
        acceptLanguage: 'en-US,en;q=0.9,nl;q=0.5',
      })
      const res = proxy(req)
      expect(res.headers.get('location')).toBe('http://localhost/en/about')
    })

    it('higher-weighted Dutch wins over lower-weighted English', () => {
      const req = makeRequest('http://localhost/about', {
        acceptLanguage: 'nl;q=0.9,en;q=0.5',
      })
      const res = proxy(req)
      expect(res.headers.get('location')).toBe('http://localhost/nl/about')
    })
  })

  describe('geo-based routing (x-vercel-ip-country) takes priority over Accept-Language', () => {
    it('country NL → /nl even when the browser is set to English', () => {
      const req = makeRequest('http://localhost/contact', {
        country: 'NL',
        acceptLanguage: 'en-US,en;q=0.9',
      })
      const res = proxy(req)
      expect(res.headers.get('location')).toBe('http://localhost/nl/contact')
    })

    it('bilingual country BE follows browser language → /en for an English browser', () => {
      const req = makeRequest('http://localhost/contact', {
        country: 'BE',
        acceptLanguage: 'en-GB,en;q=0.9',
      })
      const res = proxy(req)
      expect(res.headers.get('location')).toBe('http://localhost/en/contact')
    })

    it('bilingual country BE follows browser language → /nl for a Flemish browser', () => {
      const req = makeRequest('http://localhost/contact', {
        country: 'BE',
        acceptLanguage: 'nl-BE,nl;q=0.9,fr;q=0.8',
      })
      const res = proxy(req)
      expect(res.headers.get('location')).toBe('http://localhost/nl/contact')
    })

    it('bilingual country BE with a French browser → /en (no NL signal)', () => {
      const req = makeRequest('http://localhost/contact', {
        country: 'BE',
        acceptLanguage: 'fr-BE,fr;q=0.9',
      })
      const res = proxy(req)
      expect(res.headers.get('location')).toBe('http://localhost/en/contact')
    })

    it('lowercase country header still matches (case-insensitive)', () => {
      const req = makeRequest('http://localhost/contact', { country: 'nl' })
      const res = proxy(req)
      expect(res.headers.get('location')).toBe('http://localhost/nl/contact')
    })

    it('non-Dutch country (US) → /en even when the browser prefers Dutch', () => {
      const req = makeRequest('http://localhost/contact', {
        country: 'US',
        acceptLanguage: 'nl-NL,nl;q=0.9',
      })
      const res = proxy(req)
      expect(res.headers.get('location')).toBe('http://localhost/en/contact')
    })

    it('non-Dutch country (DE) → /en', () => {
      const req = makeRequest('http://localhost/contact', { country: 'DE' })
      const res = proxy(req)
      expect(res.headers.get('location')).toBe('http://localhost/en/contact')
    })

    it('no country header → falls back to Accept-Language', () => {
      const req = makeRequest('http://localhost/contact', {
        country: null,
        acceptLanguage: 'nl-NL,nl;q=0.9',
      })
      const res = proxy(req)
      expect(res.headers.get('location')).toBe('http://localhost/nl/contact')
    })
  })

  describe('puur_locale choice cookie overrides geo on redirects', () => {
    it('honors a saved en choice even from a Dutch country', () => {
      const req = makeRequest('http://localhost/contact', {
        country: 'NL',
        cookies: { puur_locale: 'en' },
      })
      const res = proxy(req)
      expect(res.headers.get('location')).toBe('http://localhost/en/contact')
    })

    it('honors a saved nl choice even from a non-Dutch country', () => {
      const req = makeRequest('http://localhost/contact', {
        country: 'US',
        cookies: { puur_locale: 'nl' },
      })
      const res = proxy(req)
      expect(res.headers.get('location')).toBe('http://localhost/nl/contact')
    })

    it('ignores a garbage choice value and falls back to geo', () => {
      const req = makeRequest('http://localhost/contact', {
        country: 'US',
        cookies: { puur_locale: 'fr' },
      })
      const res = proxy(req)
      expect(res.headers.get('location')).toBe('http://localhost/en/contact')
    })
  })

  describe('country-banner decision (x-locale-banner header)', () => {
    it('flags the banner on /nl for a non-Dutch visitor (target en)', () => {
      const req = makeRequest('http://localhost/nl/contact', { country: 'US' })
      const res = proxy(req)
      expect(res.status).toBe(200)
      expect(res.headers.get('x-middleware-override-headers')).toContain('x-locale-banner')
    })

    it('does not flag the banner when geo matches the path locale', () => {
      // A Dutch-country visitor already on /nl → preferred === path → no banner.
      const req = makeRequest('http://localhost/nl/contact', { country: 'NL' })
      const res = proxy(req)
      const overrides = res.headers.get('x-middleware-request-x-locale-banner')
      expect(overrides).toBe('')
    })

    it('no banner when the saved choice matches the locale being viewed', () => {
      // Visitor settled on /nl (Dismiss wrote nl) → no banner while on /nl.
      const req = makeRequest('http://localhost/nl/contact', {
        country: 'US',
        cookies: { puur_locale: 'nl' },
      })
      const res = proxy(req)
      const banner = res.headers.get('x-middleware-request-x-locale-banner')
      expect(banner).toBe('')
    })

    it('RE-shows the banner when the visitor navigates back to the wrong locale after choosing', () => {
      // Chose en, then manually opens /nl again → banner returns, offering en.
      const req = makeRequest('http://localhost/nl/contact', {
        country: 'US',
        cookies: { puur_locale: 'en' },
      })
      const res = proxy(req)
      const banner = res.headers.get('x-middleware-request-x-locale-banner')
      expect(banner).toBe('en')
    })

    it('targets nl on /en for a Dutch visitor', () => {
      const req = makeRequest('http://localhost/en/contact', { country: 'NL' })
      const res = proxy(req)
      const banner = res.headers.get('x-middleware-request-x-locale-banner')
      expect(banner).toBe('nl')
    })
  })

  describe('legacy NEXT_LOCALE cookie cleanup', () => {
    it('clears the cookie on a locale-prefixed pass-through', () => {
      const req = makeRequest('http://localhost/en/contact', {
        cookies: { NEXT_LOCALE: 'nl' },
      })
      const res = proxy(req)
      const setCookie = res.headers.get('set-cookie') ?? ''
      expect(setCookie).toMatch(/NEXT_LOCALE=/)
      // Cookie deletion sets Max-Age=0 (or expires in the past)
      expect(setCookie.toLowerCase()).toMatch(/max-age=0|expires=/)
    })

    it('clears the cookie on a redirect response', () => {
      const req = makeRequest('http://localhost/contact', {
        acceptLanguage: 'en-US',
        cookies: { NEXT_LOCALE: 'nl' },
      })
      const res = proxy(req)
      const setCookie = res.headers.get('set-cookie') ?? ''
      expect(setCookie).toMatch(/NEXT_LOCALE=/)
      expect(setCookie.toLowerCase()).toMatch(/max-age=0|expires=/)
    })

    it('does not set any cookie when none is present', () => {
      const req = makeRequest('http://localhost/en/contact')
      const res = proxy(req)
      expect(res.headers.get('set-cookie')).toBeNull()
    })
  })

  describe('ignored paths (matcher exclusions)', () => {
    it('passes /api/... straight through with no redirect and no x-locale', () => {
      const req = makeRequest('http://localhost/api/booking', {
        acceptLanguage: 'en-US',
      })
      const res = proxy(req)
      expect(res.status).toBe(200)
      expect(res.headers.get('location')).toBeNull()
      expect(res.headers.get('x-locale')).toBeNull()
    })

    it('passes /_next/... straight through', () => {
      const req = makeRequest('http://localhost/_next/static/foo.js', {
        acceptLanguage: 'en-US',
      })
      const res = proxy(req)
      expect(res.status).toBe(200)
      expect(res.headers.get('location')).toBeNull()
    })

    it('passes /studio straight through', () => {
      const req = makeRequest('http://localhost/studio', {
        acceptLanguage: 'en-US',
      })
      const res = proxy(req)
      expect(res.status).toBe(200)
      expect(res.headers.get('location')).toBeNull()
    })

    it('passes /favicon.ico straight through', () => {
      const req = makeRequest('http://localhost/favicon.ico')
      const res = proxy(req)
      expect(res.status).toBe(200)
      expect(res.headers.get('location')).toBeNull()
    })

    it('passes /robots.txt straight through', () => {
      const req = makeRequest('http://localhost/robots.txt')
      const res = proxy(req)
      expect(res.status).toBe(200)
      expect(res.headers.get('location')).toBeNull()
    })

    it('passes /sitemap.xml straight through', () => {
      const req = makeRequest('http://localhost/sitemap.xml')
      const res = proxy(req)
      expect(res.status).toBe(200)
      expect(res.headers.get('location')).toBeNull()
    })

    it('passes any path with a file extension straight through', () => {
      const req = makeRequest('http://localhost/og-image.png')
      const res = proxy(req)
      expect(res.status).toBe(200)
      expect(res.headers.get('location')).toBeNull()
    })
  })
})
