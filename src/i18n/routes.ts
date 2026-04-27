import type { Locale } from './config'

/**
 * Single source of truth for localised routes.
 *
 * Each entry stores the NL and EN URL segments (no locale prefix).
 * - `list: true`  marks routes that have a `/:slug` detail variant
 *                 (e.g. /safari-reizen/:slug → /safaris/:slug).
 * - `slugTail`    encodes a path segment that lives *after* the slug
 *                 (e.g. /safari-reizen/:slug/boeken → /safaris/:slug/book).
 *
 * Adding a new localised route here is the only change needed —
 * `getNlRewrites()` derives the rewrite table for next.config from this map.
 */
const routeMap = {
  home:              { nl: '',                      en: '',                  list: false },
  safaris:           { nl: '/safari-reizen',        en: '/safaris',          list: true  },
  safariDetail:      { nl: '/safari-reizen',        en: '/safaris',          list: false },
  safariBook:        { nl: '/safari-reizen',        en: '/safaris',          list: false, slugTail: { nl: '/boeken', en: '/book' } },
  destinations:      { nl: '/bestemmingen',         en: '/destinations',     list: true  },
  destinationDetail: { nl: '/bestemmingen',         en: '/destinations',     list: false },
  blog:              { nl: '/blog',                 en: '/blog',             list: false },
  blogDetail:        { nl: '/blog',                 en: '/blog',             list: false },
  blogSubmit:        { nl: '/blog/inzenden',        en: '/blog/submit',      list: false },
  blogPreview:       { nl: '/blog/preview',         en: '/blog/preview',     list: false },
  about:             { nl: '/over-ons',             en: '/about',            list: false },
  contact:           { nl: '/contact',              en: '/contact',          list: false },
  faq:               { nl: '/faq',                  en: '/faq',              list: false },
  customItinerary:   { nl: '/eigen-reisschema',     en: '/custom-itinerary', list: false },
  privacy:           { nl: '/privacybeleid',        en: '/privacy',          list: false },
  terms:             { nl: '/algemene-voorwaarden', en: '/terms',            list: false },
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
 * Convert a Dutch CMS path to the correct path for the given locale.
 * CMS always stores Dutch paths (NL is the source of truth). Query strings
 * and hash fragments are preserved verbatim.
 *
 * @example cmsPathToLocale('/safari-reizen', 'en') → '/safaris'
 * @example cmsPathToLocale('/safari-reizen/gorilla-trek', 'en') → '/safaris/gorilla-trek'
 * @example cmsPathToLocale('/safari-reizen?category=wildlife', 'en') → '/safaris?category=wildlife'
 */
export function cmsPathToLocale(nlPath: string, locale: Locale): string {
  if (locale === 'nl') return nlPath

  // Strip query / hash before matching, then re-attach unchanged.
  const splitIdx = nlPath.search(/[?#]/)
  const path = splitIdx >= 0 ? nlPath.slice(0, splitIdx) : nlPath
  const suffix = splitIdx >= 0 ? nlPath.slice(splitIdx) : ''

  for (const route of Object.values(routeMap)) {
    const nlBase = route.nl
    if (!nlBase) continue
    if (path === nlBase) {
      return route[locale] + suffix
    }
    if (path.startsWith(nlBase + '/')) {
      const slug = path.slice(nlBase.length)
      return route[locale] + slug + suffix
    }
  }

  return nlPath
}

/**
 * Derive the NL → EN rewrite table for next.config from `routeMap`.
 *
 * Next.js renders all locales from English-named page files under
 * `src/app/[lang]/(site)/`, so for routes where the NL segment differs
 * from EN we rewrite `/nl/<dutch>` → `/nl/<english>`.
 */
export function getNlRewrites(): Array<{ source: string; destination: string }> {
  const rewrites: Array<{ source: string; destination: string }> = []
  const seen = new Set<string>()

  const push = (source: string, destination: string) => {
    if (seen.has(source)) return
    seen.add(source)
    rewrites.push({ source, destination })
  }

  for (const route of Object.values(routeMap)) {
    if (route.nl === route.en) continue

    if ('slugTail' in route && route.slugTail) {
      push(
        `/nl${route.nl}/:slug${route.slugTail.nl}`,
        `/nl${route.en}/:slug${route.slugTail.en}`,
      )
      continue
    }

    push(`/nl${route.nl}`, `/nl${route.en}`)
    if (route.list) {
      push(`/nl${route.nl}/:slug`, `/nl${route.en}/:slug`)
    }
  }

  return rewrites
}
