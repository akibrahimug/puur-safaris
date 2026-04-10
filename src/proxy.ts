import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from './i18n/config'

const LOCALE_COOKIE = 'NEXT_LOCALE'

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

function getPreferredLocale(request: NextRequest): string {
  // 1. Check cookie
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value
  if (cookieLocale && locales.includes(cookieLocale as typeof locales[number])) {
    return cookieLocale
  }

  // 2. Check Accept-Language header
  const acceptLang = request.headers.get('accept-language') ?? ''
  for (const locale of locales) {
    if (acceptLang.includes(locale)) return locale
  }

  // 3. Default
  return defaultLocale
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

  // Already has a locale prefix → continue
  if (getPathnameLocale(pathname)) {
    return NextResponse.next()
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
