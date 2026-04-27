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
 * Decide the locale for an unprefixed request.
 * Priority: sticky cookie → Accept-Language → EN fallback.
 *
 * NL only when the browser explicitly signals it (`nl`, `nl-NL`, etc.) and
 * outranks any English preference. Visitors whose Accept-Language is
 * something else entirely (German, French, Spanish, …) see EN.
 */
function getPreferredLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value
  if (isLocale(cookieLocale)) return cookieLocale

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
    // Persist the URL's locale as the sticky cookie so future unprefixed
    // visits land in the same locale. This makes locale "remember" itself
    // without needing a UI switcher.
    const response = NextResponse.next()
    response.headers.set('x-locale', pathnameLocale)
    if (request.cookies.get(LOCALE_COOKIE)?.value !== pathnameLocale) {
      response.cookies.set(LOCALE_COOKIE, pathnameLocale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      })
    }
    return response
  }

  // No locale prefix → redirect to /{locale}{pathname}
  const locale = getPreferredLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname}`

  const response = NextResponse.redirect(url)
  response.cookies.set(LOCALE_COOKIE, locale, { path: '/', maxAge: 60 * 60 * 24 * 365 })
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}
