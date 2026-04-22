export const locales = ['nl', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'nl'

export function hasLocale(value: unknown): value is Locale {
  return typeof value === 'string' && locales.includes(value as Locale)
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
