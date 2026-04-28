import { describe, it, expect } from 'vitest'
import {
  cn,
  formatPrice,
  formatDate,
  formatMonth,
  truncate,
  categoryLabel,
  difficultyLabel,
  blogCategoryLabel,
  faqCategoryLabel,
} from './utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('resolves conflicting tailwind classes', () => {
    const result = cn('p-4', 'p-2')
    expect(result).toBe('p-2')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'extra')).toBe('base extra')
  })
})

describe('formatPrice', () => {
  it('formats 2500 as Dutch EUR', () => {
    const result = formatPrice(2500)
    expect(result).toContain('2.500')
    expect(result).toContain('€')
  })

  it('formats 0', () => {
    const result = formatPrice(0)
    expect(result).toContain('0')
    expect(result).toContain('€')
  })

  it('formats large numbers', () => {
    const result = formatPrice(1250000)
    expect(result).toContain('1.250.000')
    expect(result).toContain('€')
  })
})

describe('formatDate', () => {
  it('formats 2026-06-15 in Dutch', () => {
    const result = formatDate('2026-06-15')
    expect(result).toContain('15')
    expect(result.toLowerCase()).toContain('juni')
    expect(result).toContain('2026')
  })
})

describe('formatMonth', () => {
  it('formats 2026-06-15 as month + year', () => {
    const result = formatMonth('2026-06-15')
    expect(result.toLowerCase()).toContain('juni')
    expect(result).toContain('2026')
  })
})

describe('truncate', () => {
  it('truncates and appends ellipsis', () => {
    expect(truncate('hello world', 5)).toBe('hello…')
  })

  it('returns string unchanged when at boundary', () => {
    expect(truncate('hello', 5)).toBe('hello')
  })

  it('returns string unchanged when under boundary', () => {
    expect(truncate('hi', 5)).toBe('hi')
  })

  it('handles empty string', () => {
    expect(truncate('', 5)).toBe('')
  })
})

describe('categoryLabel', () => {
  it.each([
    ['wildlife', 'Wildlife Safari'],
    ['hiking', 'Berg & Trekking'],
    ['culture', 'Cultuur & Gemeenschap'],
    ['beach', 'Strand & Ontspanning'],
    ['combined', 'Combinatiereis'],
  ])('maps "%s" to "%s"', (key, label) => {
    expect(categoryLabel(key)).toBe(label)
  })

  it('returns unknown key as-is', () => {
    expect(categoryLabel('unknown')).toBe('unknown')
  })
})

describe('difficultyLabel', () => {
  it.each([
    ['easy', 'Makkelijk'],
    ['moderate', 'Gemiddeld'],
    ['challenging', 'Uitdagend'],
  ])('maps "%s" to "%s"', (key, label) => {
    expect(difficultyLabel(key)).toBe(label)
  })

  it('returns unknown key as-is', () => {
    expect(difficultyLabel('extreme')).toBe('extreme')
  })
})

describe('blogCategoryLabel', () => {
  it.each([
    ['stories', 'Reisverhalen'],
    ['tips', 'Tips & Advies'],
    ['wildlife', 'Wildlife'],
    ['culture', 'Cultuur'],
    ['guides', 'Bestemmingsgidsen'],
    ['news', 'Nieuws'],
  ])('maps "%s" to "%s"', (key, label) => {
    expect(blogCategoryLabel(key)).toBe(label)
  })

  it('returns unknown key as-is', () => {
    expect(blogCategoryLabel('other')).toBe('other')
  })
})

describe('faqCategoryLabel', () => {
  it.each([
    ['general', 'Algemeen'],
    ['booking', 'Boeking & Betaling'],
    ['travel', 'Reizen & Visa'],
    ['accommodation', 'Accommodatie'],
    ['safety', 'Veiligheid & Gezondheid'],
    ['packing', 'Inpakken & Voorbereiding'],
  ])('maps "%s" to "%s"', (key, label) => {
    expect(faqCategoryLabel(key)).toBe(label)
  })

  it('returns unknown key as-is', () => {
    expect(faqCategoryLabel('misc')).toBe('misc')
  })
})

// Locale-aware fallbacks: ensure EN callers see EN strings, not Dutch ones.
// This is the regression we guard against — `dict.categories` may not be passed
// at every call site, and silently rendering Dutch on /en is the resulting bug.
describe('locale-aware label fallbacks', () => {
  describe('categoryLabel', () => {
    it.each([
      ['wildlife', 'Wildlife Safari'],
      ['hiking', 'Mountain & Trekking'],
      ['culture', 'Culture & Community'],
      ['beach', 'Beach & Relaxation'],
      ['combined', 'Combination Trip'],
    ])('returns the EN fallback for "%s" when locale is en', (key, label) => {
      expect(categoryLabel(key, 'en')).toBe(label)
    })

    it('falls back to NL when locale is unrecognised', () => {
      expect(categoryLabel('combined', 'fr')).toBe('Combinatiereis')
    })

    it('prefers the passed dict over the locale fallback', () => {
      expect(categoryLabel('combined', 'en', { combined: 'Custom Label' })).toBe('Custom Label')
    })
  })

  describe('difficultyLabel', () => {
    it.each([
      ['easy', 'Easy'],
      ['moderate', 'Moderate'],
      ['challenging', 'Challenging'],
    ])('returns the EN fallback for "%s" when locale is en', (key, label) => {
      expect(difficultyLabel(key, 'en')).toBe(label)
    })

    it('looks up the dict using the prefixed key shape (`difficultyEasy`)', () => {
      expect(difficultyLabel('easy', 'en', { difficultyEasy: 'Beginner' })).toBe('Beginner')
    })
  })

  describe('blogCategoryLabel', () => {
    it.each([
      ['stories', 'Travel Stories'],
      ['tips', 'Tips & Advice'],
      ['guides', 'Destination Guides'],
      ['news', 'News'],
    ])('returns the EN fallback for "%s" when locale is en', (key, label) => {
      expect(blogCategoryLabel(key, 'en')).toBe(label)
    })
  })

  describe('faqCategoryLabel', () => {
    it.each([
      ['general', 'General'],
      ['booking', 'Booking & Payment'],
      ['travel', 'Travel & Visa'],
      ['accommodation', 'Accommodation'],
      ['safety', 'Safety & Health'],
      ['packing', 'Packing & Preparation'],
    ])('returns the EN fallback for "%s" when locale is en', (key, label) => {
      expect(faqCategoryLabel(key, 'en')).toBe(label)
    })
  })
})

describe('formatDate locale awareness', () => {
  it('formats in Dutch by default', () => {
    expect(formatDate('2026-06-15')).toMatch(/15 juni 2026/)
  })

  it('formats in English when locale is en', () => {
    // en-GB locale produces "15 June 2026" (no comma, no ordinal)
    expect(formatDate('2026-06-15', 'en')).toMatch(/15 June 2026/)
  })
})
