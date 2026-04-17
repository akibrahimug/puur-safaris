export const locales = ['nl', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'nl'

export function hasLocale(value: unknown): value is Locale {
  return typeof value === 'string' && locales.includes(value as Locale)
}

/**
 * Returns a CMS value directly. Content is now pre-translated in the data layer
 * (NL → target language via DeepL), so no language comparison is needed.
 *
 * @deprecated The data layer now handles translation. This function is kept for
 * backward compatibility during the migration — it simply passes through the value.
 */
export function cmsText<T>(value: T | null | undefined, _docLang?: string | null | undefined, _locale?: string): T | undefined {
  return value ?? undefined
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
