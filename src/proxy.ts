import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales } from './i18n/config'

const LOCALE_COOKIE = 'NEXT_LOCALE'

/**
 * Locale used when we can't determine the visitor's country (local dev,
 * non-Vercel host) and their browser doesn't signal a preference. NL is the
 * editorial source of truth, but the audience is international, so the neutral
 * fallback is EN.
 */
const ROUTING_FALLBACK_LOCALE = 'en'

/**
 * Countries where Dutch is an official language. Visitors geolocated here are
 * routed to /nl regardless of their browser's Accept-Language — a .nl Dutch
 * travel agency wants Dutch-country visitors on the Dutch site even when their
 * OS/browser happens to be set to English (very common in NL/BE). Vercel
 * injects the ISO-3166-1 alpha-2 country code via the `x-vercel-ip-country`
 * header (the same value `@vercel/functions`' `geolocation()` reads).
 */
const DUTCH_SPEAKING_COUNTRIES = new Set([
  'NL', // Netherlands
  'BE', // Belgium (Flanders)
  'SR', // Suriname
  'AW', // Aruba
  'CW', // Curaçao
  'SX', // Sint Maarten
  'BQ', // Caribbean Netherlands (Bonaire, Sint Eustatius, Saba)
])

/** Paths that should never be locale-prefixed */
const IGNORED_PREFIXES = [
  '/studio',
  '/api',
  '/_next',
  '/favicon.ico',
  '/sitemap.xml',
  '/robots.txt',
]

function getPathnameLocale(pathname: string): string | null {
  for (const locale of locales) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return locale
    }
  }
  return null
}

function isLocale(value: string | undefined): value is typeof locales[number] {
  return !!value && locales.includes(value as typeof locales[number])
}

/**
 * Decide the locale for an unprefixed request.
 *
 * Priority: visitor's **country** (geo) → browser Accept-Language → EN.
 *
 * Geo is authoritative: anyone physically in a Dutch-speaking country (NL, BE,
 * …) gets /nl even if their browser is set to English, and anyone elsewhere
 * gets /en. Vercel injects the country via `x-vercel-ip-country`; when that
 * header is absent (local dev, non-Vercel host) we degrade gracefully to the
 * ranked Accept-Language signal, then to EN.
 *
 * There is intentionally **no cookie persistence**: with no UI language
 * switcher, the cookie was just hidden state that latched onto whichever
 * locale-prefixed URL the visitor accidentally landed on (a shared link, an
 * old bookmark) and overrode their real preference for a year.
 */
function getPreferredLocale(request: NextRequest): string {
  const country = request.headers.get('x-vercel-ip-country')?.toUpperCase()
  if (country) {
    return DUTCH_SPEAKING_COUNTRIES.has(country) ? 'nl' : ROUTING_FALLBACK_LOCALE
  }

  // No geo signal (local dev / non-Vercel) → fall back to Accept-Language.
  const acceptLang = request.headers.get('accept-language') ?? ''
  // Parse "en-US,en;q=0.9,nl;q=0.8" → ranked list of base languages
  const ranked = acceptLang
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=')
      return { tag: tag.split('-')[0]?.toLowerCase(), weight: q ? parseFloat(q) : 1 }
    })
    .filter((entry) => entry.tag)
    .sort((a, b) => b.weight - a.weight)

  for (const { tag } of ranked) {
    if (isLocale(tag)) return tag
  }

  return ROUTING_FALLBACK_LOCALE
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip ignored paths
  if (IGNORED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  // Skip static files (with extensions)
  if (/\.\w+$/.test(pathname)) {
    return NextResponse.next()
  }

  const pathnameLocale = getPathnameLocale(pathname)
  if (pathnameLocale) {
    // Forward to the page; the root layout reads `x-locale` to render the
    // correct <html lang="…">. We also clear any legacy NEXT_LOCALE cookie
    // from the previous sticky-cookie implementation so it stops overriding
    // Accept-Language on root visits.
    const response = NextResponse.next()
    response.headers.set('x-locale', pathnameLocale)
    if (request.cookies.has(LOCALE_COOKIE)) {
      response.cookies.delete(LOCALE_COOKIE)
    }
    return response
  }

  // No locale prefix → redirect based on Accept-Language only.
  const locale = getPreferredLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname}`

  const response = NextResponse.redirect(url)
  if (request.cookies.has(LOCALE_COOKIE)) {
    response.cookies.delete(LOCALE_COOKIE)
  }
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}
