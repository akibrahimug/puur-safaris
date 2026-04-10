import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const INTL_LOCALE: Record<string, string> = { nl: 'nl-NL', en: 'en-GB' }

export function formatPrice(price: number, locale = 'nl'): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale] ?? 'nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date: string, locale = 'nl'): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale] ?? 'nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatMonth(date: string, locale = 'nl'): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale] ?? 'nl-NL', {
    year: 'numeric',
    month: 'long',
  }).format(new Date(date))
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length).trim() + '…'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CatDict = Record<string, any> | undefined

const defaultCategoryLabels: Record<string, string> = {
  wildlife: 'Wildlife Safari',
  hiking: 'Berg & Trekking',
  culture: 'Cultuur & Gemeenschap',
  beach: 'Strand & Ontspanning',
  combined: 'Combinatiereis',
}

export function categoryLabel(category: string, cats?: CatDict): string {
  return cats?.[category] ?? defaultCategoryLabels[category] ?? category
}

const defaultDifficultyLabels: Record<string, string> = {
  easy: 'Makkelijk',
  moderate: 'Gemiddeld',
  challenging: 'Uitdagend',
}

export function difficultyLabel(difficulty: string, cats?: CatDict): string {
  const key = `difficulty${difficulty.charAt(0).toUpperCase()}${difficulty.slice(1)}`
  return cats?.[key] ?? defaultDifficultyLabels[difficulty] ?? difficulty
}

const defaultBlogCategoryLabels: Record<string, string> = {
  stories: 'Reisverhalen',
  tips: 'Tips & Advies',
  wildlife: 'Wildlife',
  culture: 'Cultuur',
  guides: 'Bestemmingsgidsen',
  news: 'Nieuws',
}

export function blogCategoryLabel(category: string, cats?: CatDict): string {
  const key = `blog${category.charAt(0).toUpperCase()}${category.slice(1)}`
  return cats?.[key] ?? defaultBlogCategoryLabels[category] ?? category
}

const defaultFaqCategoryLabels: Record<string, string> = {
  general: 'Algemeen',
  booking: 'Boeking & Betaling',
  travel: 'Reizen & Visa',
  accommodation: 'Accommodatie',
  safety: 'Veiligheid & Gezondheid',
  packing: 'Inpakken & Voorbereiding',
}

export function faqCategoryLabel(category: string, cats?: CatDict): string {
  const key = `faq${category.charAt(0).toUpperCase()}${category.slice(1)}`
  return cats?.[key] ?? defaultFaqCategoryLabels[category] ?? category
}
