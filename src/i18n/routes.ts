import type { Locale } from './config'

/**
 * Route key → locale-specific path segment (without locale prefix).
 * Dutch paths match the current URL structure exactly.
 */
const routeMap = {
  home:              { nl: '',                      en: '' },
  safaris:           { nl: '/safari-reizen',        en: '/safaris' },
  safariDetail:      { nl: '/safari-reizen',        en: '/safaris' },
  safariBook:        { nl: '/safari-reizen',        en: '/safaris' },
  destinations:      { nl: '/bestemmingen',         en: '/destinations' },
  destinationDetail: { nl: '/bestemmingen',         en: '/destinations' },
  blog:              { nl: '/blog',                 en: '/blog' },
  blogDetail:        { nl: '/blog',                 en: '/blog' },
  blogSubmit:        { nl: '/blog/inzenden',        en: '/blog/submit' },
  blogPreview:       { nl: '/blog/preview',         en: '/blog/preview' },
  about:             { nl: '/over-ons',             en: '/about' },
  contact:           { nl: '/contact',              en: '/contact' },
  faq:               { nl: '/faq',                  en: '/faq' },
  customItinerary:   { nl: '/eigen-reisschema',     en: '/custom-itinerary' },
  privacy:           { nl: '/privacybeleid',        en: '/privacy' },
  terms:             { nl: '/algemene-voorwaarden', en: '/terms' },
} as const

export type RouteKey = keyof typeof routeMap

/**
 * Build a locale-prefixed path.
 * @example localePath('en', 'safaris', 'serengeti') → '/en/safaris/serengeti'
 */
export function localePath(locale: Locale, route: RouteKey, slug?: string): string {
  const base = `/${locale}${routeMap[route][locale]}`
  return slug ? `${base}/${slug}` : base
}

/**
 * Get the path segment for a route in a given locale (no prefix).
 * Useful for next.config rewrites.
 */
export function routeSegment(locale: Locale, route: RouteKey): string {
  return routeMap[route][locale]
}

/**
 * Convert a Dutch CMS path to the correct path for the given locale.
 * CMS always stores Dutch paths (NL is the source of truth).
 * For EN routes, this maps e.g. `/safari-reizen` → `/safaris`.
 *
 * If the path contains a slug (e.g. `/safari-reizen/some-trip`), the base
 * segment is mapped and the slug is preserved.
 *
 * @example cmsPathToLocale('/safari-reizen', 'en') → '/safaris'
 * @example cmsPathToLocale('/safari-reizen/gorilla-trek', 'en') → '/safaris/gorilla-trek'
 * @example cmsPathToLocale('/safari-reizen', 'nl') → '/safari-reizen' (unchanged)
 */
export function cmsPathToLocale(nlPath: string, locale: Locale): string {
  if (locale === 'nl') return nlPath

  // Build a reverse lookup: NL path → route key
  for (const [, paths] of Object.entries(routeMap)) {
    const nlBase = paths.nl
    if (!nlBase) continue
    // Exact match or starts with the NL base + '/'
    if (nlPath === nlBase) {
      return paths[locale]
    }
    if (nlPath.startsWith(nlBase + '/')) {
      const slug = nlPath.slice(nlBase.length)
      return paths[locale] + slug
    }
  }

  // No mapping found — return as-is (e.g. /blog, /contact, /faq)
  return nlPath
}

/** All route entries — used to generate rewrites */
export const allRoutes = routeMap
