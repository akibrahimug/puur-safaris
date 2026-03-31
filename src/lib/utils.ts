import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatMonth(date: string): string {
  return new Intl.DateTimeFormat('nl-NL', {
    year: 'numeric',
    month: 'long',
  }).format(new Date(date))
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length).trim() + '…'
}

export function categoryLabel(category: string): string {
  const labels: Record<string, string> = {
    wildlife: 'Wildlife Safari',
    hiking: 'Berg & Trekking',
    culture: 'Cultuur & Gemeenschap',
    beach: 'Strand & Ontspanning',
    combined: 'Combinatiereis',
  }
  return labels[category] ?? category
}

export function difficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    easy: 'Makkelijk',
    moderate: 'Gemiddeld',
    challenging: 'Uitdagend',
  }
  return labels[difficulty] ?? difficulty
}

export function blogCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    stories: 'Reisverhalen',
    tips: 'Tips & Advies',
    wildlife: 'Wildlife',
    culture: 'Cultuur',
    guides: 'Bestemmingsgidsen',
    news: 'Nieuws',
  }
  return labels[category] ?? category
}

export function faqCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    general: 'Algemeen',
    booking: 'Boeking & Betaling',
    travel: 'Reizen & Visa',
    accommodation: 'Accommodatie',
    safety: 'Veiligheid & Gezondheid',
    packing: 'Inpakken & Voorbereiding',
  }
  return labels[category] ?? category
}
