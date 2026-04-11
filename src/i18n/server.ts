import 'server-only'
import type { Locale } from './config'
import { hasLocale, defaultLocale, cmsText } from './config'
import { getDictionary } from './dictionaries'
import { localePath, type RouteKey } from './routes'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Dict = Record<string, any>

/**
 * Central i18n context for server components.
 *
 * Call once at the top of every page:
 *   const i18n = await getI18n(params)
 *
 * Then use throughout:
 *   i18n.locale       – validated locale
 *   i18n.dict         – full dictionary for this locale
 *   i18n.t(cmsDoc)    – returns a `cms()` helper bound to a CMS document
 *   i18n.path(route)  – locale-aware URL path
 */
export async function getI18n(params: Promise<{ lang: string }>) {
  const { lang } = await params
  const locale = hasLocale(lang) ? (lang as Locale) : defaultLocale
  const dict = await getDictionary(locale)

  return {
    lang,
    locale,
    dict,

    /**
     * Build a locale-prefixed path using the route map.
     * @example i18n.path('safaris', 'my-slug') → '/en/safaris/my-slug'
     */
    path(route: RouteKey, slug?: string): string {
      return localePath(locale, route, slug)
    },

    /**
     * Create a `cms()` helper bound to a specific CMS document.
     * Returns CMS values only when the doc language matches the route locale;
     * otherwise returns undefined so the dict fallback kicks in.
     *
     * @example
     * const cms = i18n.t(homePage)
     * cms(homePage?.heroTitle) ?? dict.home.heroTitle
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    t(doc: any) {
      const docLang = doc?.language as string | null | undefined
      return <T,>(value: T | null | undefined): T | undefined =>
        cmsText(value, docLang, locale)
    },
  }
}

export type I18n = Awaited<ReturnType<typeof getI18n>>
