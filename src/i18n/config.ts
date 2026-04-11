export const locales = ['nl', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'nl'

export function hasLocale(value: unknown): value is Locale {
  return typeof value === 'string' && locales.includes(value as Locale)
}

/**
 * Returns a CMS value only when the document's language matches the requested locale.
 * When the CMS doc is a Dutch fallback on an English route, returns `undefined`
 * so the dictionary string is used instead.
 *
 * The docLang is stripped of stega encoding (zero-width chars) before comparison
 * so visual editing in the Presentation Tool is not broken.
 */
export function cmsText<T>(value: T | null | undefined, docLang: string | null | undefined, locale: string): T | undefined {
  // Strip zero-width stega characters from the language field before comparing
  const cleanLang = docLang?.replace(/[\u200B-\u200F\u2028-\u202F\uFEFF\uFE00-\uFE0F]/g, '')
  if (!cleanLang || cleanLang === locale) return value ?? undefined
  return undefined
}

/** Language metadata used in Sanity Studio and SEO */
export const localeLabels: Record<Locale, string> = {
  nl: 'Nederlands',
  en: 'English',
}

/** OpenGraph locale codes */
export const ogLocales: Record<Locale, string> = {
  nl: 'nl_NL',
  en: 'en_US',
}
