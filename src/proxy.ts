import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales } from './i18n/config'

const LOCALE_COOKIE = 'NEXT_LOCALE'

/**
 * Locale used when the visitor's browser doesn't explicitly prefer NL or EN.
 * NL is the editorial source of truth, but the audience is international —
 * Dutch speakers get NL only when their browser signals it, everyone else
 * sees EN by default.
 */
const ROUTING_FALLBACK_LOCALE = 'en'

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
 * Decide the locale for an unprefixed request from the browser's Accept-Language.
 *
 * Priority: ranked Accept-Language → EN fallback. There is intentionally **no
 * cookie persistence**: with no UI language switcher, the cookie was just
 * hidden state that latched onto whichever locale-prefixed URL the visitor
 * accidentally landed on (a shared link, an old bookmark) and overrode their
 * actual browser-language preference for a year. Accept-Language is set by
 * the visitor's OS/browser settings and is the authoritative signal.
 *
 * NL only when the browser explicitly signals it (`nl`, `nl-NL`, etc.) and
 * outranks any English preference. Visitors whose Accept-Language is
 * something else entirely (German, French, Spanish, …) see EN.
 */
function getPreferredLocale(request: NextRequest): string {
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
