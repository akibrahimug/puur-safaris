import { describe, it, expect } from 'vitest'
import {
  applyGlossary,
  restoreGlossary,
  PHRASE_GLOSSARY,
  PROTECTED_TERMS,
  TRANSLATOR_VERSION,
} from './glossary'

/**
 * Helper that mirrors what the translation pipeline does:
 *   apply → (Google call would happen here) → restore
 * For these tests we skip the Google step entirely so we can verify the
 * forced-substitution + protected-term mechanisms in isolation.
 */
function roundtrip(text: string): string {
  const { text: prepared, restorations } = applyGlossary(text)
  return restoreGlossary(prepared, restorations)
}

describe('TRANSLATOR_VERSION', () => {
  it('is exported and is a primitive (string or number)', () => {
    // We only sanity-check that it exists and is serialisable into the
    // cache key — the actual value (currently 4) is allowed to drift.
    expect(['string', 'number']).toContain(typeof TRANSLATOR_VERSION)
  })
})

describe('applyGlossary — forced phrase substitutions', () => {
  it('replaces "Eigen Reisschema" with a placeholder mapped to "Custom Itinerary"', () => {
    const { text, restorations } = applyGlossary('Bekijk je Eigen Reisschema online')
    expect(text).not.toContain('Eigen Reisschema')
    // Placeholder is some Zg<n>Zg token
    expect(text).toMatch(/Zg\d+Zg/)
    // The restoration map must contain the EN replacement
    const values = Array.from(restorations.values())
    expect(values).toContain('Custom Itinerary')
  })

  it('substitutes multiple matches in one string', () => {
    const { text, restorations } = applyGlossary(
      'Onze safari reizen en safari reis pakketten',
    )
    expect(text).not.toContain('safari reizen')
    expect(text).not.toContain('safari reis')
    // Two distinct placeholders for two distinct matches
    const placeholders = text.match(/Zg\d+Zg/g) ?? []
    expect(placeholders.length).toBeGreaterThanOrEqual(2)
    const values = Array.from(restorations.values())
    expect(values).toContain('safari trips')
    expect(values).toContain('safari trip')
  })

  it('mirrors case from the matched phrase onto the EN replacement', () => {
    // Title Case input → Title Case output
    const titleRoundtrip = roundtrip('Safari Reizen')
    expect(titleRoundtrip).toBe('Safari Trips')

    // lowercase input → lowercase output (target is already lowercase)
    const lowerRoundtrip = roundtrip('safari reizen')
    expect(lowerRoundtrip).toBe('safari trips')

    // ALL CAPS input → ALL CAPS output
    const upperRoundtrip = roundtrip('SAFARI REIZEN')
    expect(upperRoundtrip).toBe('SAFARI TRIPS')
  })

  it('handles single-word substitutions like "reizigers" → "travellers"', () => {
    expect(roundtrip('De reizigers waren tevreden')).toBe(
      'De travellers waren tevreden',
    )
  })

  it('leaves text without any glossary or protected matches unchanged', () => {
    const text = 'Een gewone Nederlandse zin zonder bijzondere termen.'
    const { text: prepared, restorations } = applyGlossary(text)
    expect(prepared).toBe(text)
    expect(restorations.size).toBe(0)
    expect(restoreGlossary(prepared, restorations)).toBe(text)
  })

  it('returns input unchanged for empty string', () => {
    const { text, restorations } = applyGlossary('')
    expect(text).toBe('')
    expect(restorations.size).toBe(0)
  })
})

describe('applyGlossary — protected proper nouns round-trip', () => {
  it.each(['Bwindi', 'Murchison Falls', 'Queen Elizabeth', 'Kibale', 'Entebbe'])(
    'preserves %s through apply→restore unchanged',
    (term) => {
      // Use a sentence that contains no glossary phrases so the only
      // transformation is the protected-term placeholder round-trip.
      const sentence = `Bezoek ${term} dit jaar`
      expect(roundtrip(sentence)).toBe(sentence)
    },
  )

  it('preserves the original casing of a protected term match', () => {
    // PROTECTED_TERMS uses case-insensitive matching but restoration uses
    // the originally-matched text, so casing round-trips exactly.
    expect(roundtrip('we visited bwindi yesterday')).toBe(
      'we visited bwindi yesterday',
    )
    expect(roundtrip('We visited BWINDI yesterday')).toBe(
      'We visited BWINDI yesterday',
    )
  })

  it('handles multiple protected terms in one string', () => {
    const input = 'Routes door Bwindi, Murchison Falls en Queen Elizabeth'
    expect(roundtrip(input)).toBe(input)
  })
})

describe('restoreGlossary', () => {
  it('returns input unchanged when restorations map is empty', () => {
    expect(restoreGlossary('hello world', new Map())).toBe('hello world')
  })

  it('returns input unchanged when input is empty', () => {
    const map = new Map([['Zg0Zg', 'Custom Itinerary']])
    expect(restoreGlossary('', map)).toBe('')
  })

  it('replaces every placeholder, even when Google lower-cased the token', () => {
    const map = new Map([['Zg0Zg', 'Custom Itinerary']])
    // Google sometimes lowercases the placeholder — restore should still match.
    expect(restoreGlossary('See your zg0zg here', map)).toBe(
      'See your Custom Itinerary here',
    )
  })

  it('replaces multiple placeholders in one pass', () => {
    const map = new Map([
      ['Zg0Zg', 'Custom Itinerary'],
      ['Zg1Zg', 'safari trips'],
    ])
    expect(restoreGlossary('A Zg0Zg with Zg1Zg', map)).toBe(
      'A Custom Itinerary with safari trips',
    )
  })
})

describe('PHRASE_GLOSSARY shape', () => {
  it('every entry is { nl: RegExp, en: string }', () => {
    for (const entry of PHRASE_GLOSSARY) {
      expect(entry.nl).toBeInstanceOf(RegExp)
      expect(typeof entry.en).toBe('string')
      expect(entry.en.length).toBeGreaterThan(0)
    }
  })

  it('uses the global flag so multiple matches are substituted', () => {
    for (const entry of PHRASE_GLOSSARY) {
      expect(entry.nl.flags).toContain('g')
    }
  })
})

describe('PROTECTED_TERMS shape', () => {
  it('is a non-empty list of unique strings', () => {
    expect(PROTECTED_TERMS.length).toBeGreaterThan(0)
    const unique = new Set(PROTECTED_TERMS)
    expect(unique.size).toBe(PROTECTED_TERMS.length)
  })
})
