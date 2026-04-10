import 'server-only'
import type { Locale } from './config'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Dictionary = Record<string, any>

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  nl: () => import('./dictionaries/nl.json').then((m) => m.default),
  en: () => import('./dictionaries/en.json').then((m) => m.default),
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]()
}
