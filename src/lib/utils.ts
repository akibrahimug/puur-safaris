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

// Label lookup order for the helpers below: 1) the passed dictionary (`cats`,
// usually `dict.categories`), 2) the per-locale default map, 3) the raw key.
// `locale` defaults to 'nl' because Dutch is the source language — but EN
// callers MUST pass it, otherwise EN pages render Dutch fallbacks like
// "Combinatiereis" / "Uitdagend".
const defaultCategoryLabels: Record<string, Record<string, string>> = {
  nl: {
    wildlife: 'Wildlife Safari',
    hiking: 'Berg & Trekking',
    culture: 'Cultuur & Gemeenschap',
    beach: 'Strand & Ontspanning',
    combined: 'Combinatiereis',
  },
  en: {
    wildlife: 'Wildlife Safari',
    hiking: 'Mountain & Trekking',
    culture: 'Culture & Community',
    beach: 'Beach & Relaxation',
    combined: 'Combination Trip',
  },
}

export function categoryLabel(category: string, locale: string = 'nl', cats?: CatDict): string {
  const fallbacks = defaultCategoryLabels[locale] ?? defaultCategoryLabels.nl
  return cats?.[category] ?? fallbacks[category] ?? category
}

const defaultDifficultyLabels: Record<string, Record<string, string>> = {
  nl: { easy: 'Makkelijk', moderate: 'Gemiddeld', challenging: 'Uitdagend' },
  en: { easy: 'Easy', moderate: 'Moderate', challenging: 'Challenging' },
}

export function difficultyLabel(difficulty: string, locale: string = 'nl', cats?: CatDict): string {
  // The dict stores difficulty under prefixed keys (`difficultyEasy`, …) so
  // they don't collide with `categories` keys living in the same map.
  const key = `difficulty${difficulty.charAt(0).toUpperCase()}${difficulty.slice(1)}`
  const fallbacks = defaultDifficultyLabels[locale] ?? defaultDifficultyLabels.nl
  return cats?.[key] ?? fallbacks[difficulty] ?? difficulty
}

const defaultBlogCategoryLabels: Record<string, Record<string, string>> = {
  nl: {
    stories: 'Reisverhalen',
    tips: 'Tips & Advies',
    wildlife: 'Wildlife',
    culture: 'Cultuur',
    guides: 'Bestemmingsgidsen',
    news: 'Nieuws',
  },
  en: {
    stories: 'Travel Stories',
    tips: 'Tips & Advice',
    wildlife: 'Wildlife',
    culture: 'Culture',
    guides: 'Destination Guides',
    news: 'News',
  },
}

export function blogCategoryLabel(category: string, locale: string = 'nl', cats?: CatDict): string {
  const key = `blog${category.charAt(0).toUpperCase()}${category.slice(1)}`
  const fallbacks = defaultBlogCategoryLabels[locale] ?? defaultBlogCategoryLabels.nl
  return cats?.[key] ?? fallbacks[category] ?? category
}

const defaultFaqCategoryLabels: Record<string, Record<string, string>> = {
  nl: {
    general: 'Algemeen',
    booking: 'Boeking & Betaling',
    travel: 'Reizen & Visa',
    accommodation: 'Accommodatie',
    safety: 'Veiligheid & Gezondheid',
    packing: 'Inpakken & Voorbereiding',
  },
  en: {
    general: 'General',
    booking: 'Booking & Payment',
    travel: 'Travel & Visa',
    accommodation: 'Accommodation',
    safety: 'Safety & Health',
    packing: 'Packing & Preparation',
  },
}

export function faqCategoryLabel(category: string, locale: string = 'nl', cats?: CatDict): string {
  const key = `faq${category.charAt(0).toUpperCase()}${category.slice(1)}`
  const fallbacks = defaultFaqCategoryLabels[locale] ?? defaultFaqCategoryLabels.nl
  return cats?.[key] ?? fallbacks[category] ?? category
}
