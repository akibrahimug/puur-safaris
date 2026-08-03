import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales } from './i18n/config'

const LOCALE_COOKIE = 'NEXT_LOCALE'

/**
 * Explicit locale choice the visitor made via the country banner — either by
 * switching ("View in English" / "Bekijk in het Nederlands") or by dismissing
 * it (= "keep the locale I'm on"). Once set it (a) suppresses the banner
 * forever and (b) overrides geo on unprefixed `/` redirects so the visitor is
 * never auto-routed away from their chosen locale. Written client-side by
 * <CountryBanner> with a one-year lifetime.
 */
const LOCALE_CHOICE_COOKIE = 'puur_locale'

/**
 * Locale used when we can't determine the visitor's country (local dev,
 * non-Vercel host) and their browser doesn't signal a preference. NL is the
 * editorial source of truth, but the audience is international, so the neutral
 * fallback is EN.
 */
const ROUTING_FALLBACK_LOCALE = 'en'

/**
 * Countries where Dutch is *the* dominant language. Visitors geolocated here
 * are routed to /nl regardless of their browser's Accept-Language — a .nl Dutch
 * travel agency wants Dutch-country visitors on the Dutch site even when their
 * OS/browser happens to be set to English (very common in NL). Vercel injects
 * the ISO-3166-1 alpha-2 country code via the `x-vercel-ip-country` header (the
 * same value `@vercel/functions`' `geolocation()` reads).
 *
 * **Belgium (BE) is intentionally NOT here** — it's bilingual (Flemish Dutch +
 * French Wallonia), so forcing /nl would land French-speaking Belgians on Dutch.
 * BE instead falls back to the browser's Accept-Language (see getPreferredLocale).
 */
const DUTCH_SPEAKING_COUNTRIES = new Set([
  'NL', // Netherlands
  'SR', // Suriname
  'AW', // Aruba
  'CW', // Curaçao
  'SX', // Sint Maarten
  'BQ', // Caribbean Netherlands (Bonaire, Sint Eustatius, Saba)
])

/** Countries that defer to browser language instead of a forced locale. */
const BROWSER_LANGUAGE_COUNTRIES = new Set([
  'BE', // Belgium — bilingual (Flemish/French)
])

/** Paths that should never be locale-prefixed */
const IGNORED_PREFIXES = [
  '/studio',
  '/api',
  '/_next',
  '/favicon.ico',
  '/sitemap.xml',
  '/robots.txt',
  // Sentry's tunnelRoute (next.config.ts) — proxies client-side error/replay
  // events through this same-origin path to dodge ad-blockers. If the locale
  // proxy redirects it, the tunnel dead-ends and client-side events are
  // silently dropped.
  '/monitoring',
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

/** The visitor's saved explicit locale choice, if any (from the country banner). */
function getLocaleChoice(request: NextRequest): string | null {
  const value = request.cookies.get(LOCALE_CHOICE_COOKIE)?.value
  return isLocale(value) ? value : null
}

/**
 * Decide the locale for an unprefixed request.
 *
 * Priority: visitor's **country** (geo) → browser Accept-Language → EN.
 *
 * Geo is mostly authoritative:
 *   - A Dutch-dominant country (NL, SR, …) → /nl even if the browser is English.
 *   - A bilingual country (BE) → decided by Accept-Language (Flemish→nl, else en).
 *   - Any other identified country → /en.
 *   - No country header (local dev, non-Vercel host) → Accept-Language, then EN.
 *
 * Vercel injects the country via `x-vercel-ip-country`.
 *
 * There is intentionally **no cookie persistence**: with no UI language
 * switcher, the cookie was just hidden state that latched onto whichever
 * locale-prefixed URL the visitor accidentally landed on (a shared link, an
 * old bookmark) and overrode their real preference for a year.
 */
function getPreferredLocale(request: NextRequest): string {
  const country = request.headers.get('x-vercel-ip-country')?.toUpperCase()
  if (country) {
    if (DUTCH_SPEAKING_COUNTRIES.has(country)) return 'nl'
    // Non-Dutch, non-bilingual country → EN regardless of browser language.
    if (!BROWSER_LANGUAGE_COUNTRIES.has(country)) return ROUTING_FALLBACK_LOCALE
    // Bilingual country (BE) falls through to the Accept-Language check below.
  }

  // Bilingual country or no geo signal → fall back to Accept-Language.
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
    // Decide whether to surface the country banner. The visitor's "preferred"
    // locale is their saved choice if they made one, otherwise geo/Accept-
    // Language. Show the banner whenever that differs from the locale they're
    // actually viewing — so a non-Dutch visitor who follows a link to /nl sees
    // it, AND someone who later navigates BACK to the wrong locale (or uses the
    // header language toggle) sees it again, rather than nothing happening. The
    // banner's own Dismiss writes the current locale as the choice, which is the
    // escape hatch that stops it nagging on the locale they've settled on.
    const preferred = getLocaleChoice(request) ?? getPreferredLocale(request)
    const bannerTarget = preferred !== pathnameLocale ? preferred : ''

    // Headers must be set on the *request* (`NextResponse.next({ request })`)
    // for Server Components to read them via `headers()`. The root layout reads
    // `x-locale` for <html lang="…">; the (site) layout reads `x-locale-banner`.
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-locale', pathnameLocale)
    requestHeaders.set('x-locale-banner', bannerTarget)

    const response = NextResponse.next({ request: { headers: requestHeaders } })
    // Mirror x-locale on the response for observability (and the proxy tests).
    response.headers.set('x-locale', pathnameLocale)
    if (request.cookies.has(LOCALE_COOKIE)) {
      response.cookies.delete(LOCALE_COOKIE)
    }
    return response
  }

  // No locale prefix → redirect. An explicit saved choice wins over geo so the
  // visitor is never auto-routed away from the locale they picked; otherwise
  // fall back to country → Accept-Language detection.
  const locale = getLocaleChoice(request) ?? getPreferredLocale(request)
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
