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
  privacy:           { nl: '/privacybeleid',        en: '/privacy-policy' },
  terms:             { nl: '/algemene-voorwaarden', en: '/terms-and-conditions' },
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

/** All route entries — used to generate rewrites */
export const allRoutes = routeMap
