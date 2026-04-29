import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

/**
 * Mock the upstream Google Translate library so no real network call ever
 * fires. Tests can override the mock per-suite via `mockTranslate.mockResolvedValue(...)`
 * or `.mockImplementation(...)`.
 */
const mockTranslate = vi.fn()
vi.mock('google-translate-api-x', () => ({
  default: (texts: unknown, ...rest: unknown[]) => mockTranslate(texts, ...rest),
}))

let dir: string
let originalCwd: string

beforeEach(() => {
  originalCwd = process.cwd()
  dir = mkdtempSync(join(tmpdir(), 'puur-svc-'))
  process.chdir(dir)
  vi.resetModules()
  mockTranslate.mockReset()
  // Default: echo a [TR] prefix so we can tell translated values apart.
  mockTranslate.mockImplementation(async (texts: string | string[]) => {
    const arr = Array.isArray(texts) ? texts : [texts]
    return arr.map((t) => ({ text: `[TR]${t}` }))
  })
})

afterEach(() => {
  process.chdir(originalCwd)
  rmSync(dir, { recursive: true, force: true })
})

describe('maybeTranslate', () => {
  it('is a no-op when targetLang === "nl"', async () => {
    const { maybeTranslate } = await import('./index')
    const doc = { _id: 'x', _rev: 'r', _type: 'trip', title: 'Hallo', excerpt: 'Test' }
    const result = await maybeTranslate(doc, 'trip', 'nl')
    expect(result).toBe(doc) // identical reference, no copy
    expect(mockTranslate).not.toHaveBeenCalled()
  })

  it('returns null when given a null doc', async () => {
    const { maybeTranslate } = await import('./index')
    expect(await maybeTranslate(null, 'trip', 'en')).toBeNull()
  })

  it('passes through unknown doc types without calling Translate', async () => {
    const { maybeTranslate } = await import('./index')
    const doc = { _id: 'x', _rev: 'r', _type: 'mystery', title: 'Hallo' }
    const result = await maybeTranslate(doc, 'mystery', 'en')
    expect(result).toBe(doc)
    expect(mockTranslate).not.toHaveBeenCalled()
  })

  it('calls the translator and returns translated fields for a known type', async () => {
    const { maybeTranslate } = await import('./index')
    const doc: Record<string, unknown> = {
      _id: 'doc1',
      _rev: 'rev1',
      _type: 'trip',
      title: 'Avontuurlijke reis',
      excerpt: 'Een korte beschrijving',
      slug: { current: 'avontuur' }, // non-translatable, should pass through
    }
    const result = await maybeTranslate(doc, 'trip', 'en')
    expect(mockTranslate).toHaveBeenCalled()
    expect(result?.title).toContain('[TR]')
    expect(result?.excerpt).toContain('[TR]')
    // Untranslated fields untouched
    expect(result?.slug).toEqual({ current: 'avontuur' })
    // Stamps the language
    expect(result?.language).toBe('en')
  })

  it('only translates fields listed in translatableFields for the doc type', async () => {
    const { maybeTranslate } = await import('./index')
    // For doc type 'testimonial' the config translates name/country/quote only.
    const doc = {
      _id: 'tm1',
      _rev: 'r1',
      _type: 'testimonial',
      name: 'Jan',
      country: 'Nederland',
      quote: 'Geweldig!',
      stars: 5, // numeric — never translated
      slug: { current: 'jan' },
    }
    const result = await maybeTranslate(doc, 'testimonial', 'en')
    expect(result?.name).toBe('[TR]Jan')
    expect(result?.country).toBe('[TR]Nederland')
    expect(result?.quote).toBe('[TR]Geweldig!')
    expect(result?.stars).toBe(5)
    expect(result?.slug).toEqual({ current: 'jan' })
  })

  it('returns the originals when the translator throws (silent-failure caveat)', async () => {
    mockTranslate.mockReset()
    mockTranslate.mockRejectedValue(new Error('rate limited'))
    const { maybeTranslate } = await import('./index')
    const doc: Record<string, unknown> = {
      _id: 'doc-fail',
      _rev: 'rev1',
      _type: 'trip',
      title: 'Avontuur',
      excerpt: 'Korte tekst',
    }
    const result = await maybeTranslate(doc, 'trip', 'en')
    // The pipeline swallows the error and returns the source content,
    // stamped with the target language.
    expect(result?.title).toBe('Avontuur')
    expect(result?.excerpt).toBe('Korte tekst')
    expect(result?.language).toBe('en')
  })

  it('reads from the file cache and skips the translator on a hit', async () => {
    const { maybeTranslate } = await import('./index')
    const doc: Record<string, unknown> = {
      _id: 'cached-doc',
      _rev: 'rev-fixed',
      _type: 'trip',
      title: 'Origineel',
      excerpt: 'Origineel excerpt',
    }
    // First call populates the cache
    const first = await maybeTranslate(doc, 'trip', 'en')
    expect(first?.title).toBe('[TR]Origineel')
    expect(mockTranslate).toHaveBeenCalledTimes(1)

    // Second call: same docId + same _rev → cache hit, no new translator call
    mockTranslate.mockClear()
    const second = await maybeTranslate(doc, 'trip', 'en')
    expect(mockTranslate).not.toHaveBeenCalled()
    expect(second?.title).toBe('[TR]Origineel')
    expect(second?.language).toBe('en')
  })

  it('re-translates when _rev changes (cache miss on stale)', async () => {
    const { maybeTranslate } = await import('./index')
    const v1 = {
      _id: 'doc-rev',
      _rev: 'rev-1',
      _type: 'trip',
      title: 'Eerste versie',
    }
    await maybeTranslate(v1, 'trip', 'en')
    expect(mockTranslate).toHaveBeenCalledTimes(1)

    const v2 = { ...v1, _rev: 'rev-2', title: 'Tweede versie' }
    mockTranslate.mockClear()
    const result = await maybeTranslate(v2, 'trip', 'en')
    expect(mockTranslate).toHaveBeenCalledTimes(1)
    expect(result?.title).toBe('[TR]Tweede versie')
  })
})

describe('translateTexts (via maybeTranslate batch shape)', () => {
  it('passes the array of strings to the translator in one call', async () => {
    const { maybeTranslate } = await import('./index')
    const doc = {
      _id: 'd',
      _rev: 'r',
      _type: 'trip',
      title: 'A',
      excerpt: 'B',
      duration: 'C',
      difficulty: 'D',
      category: 'E',
    }
    await maybeTranslate(doc, 'trip', 'en')
    // First call is the batch of plain text fields
    const firstCall = mockTranslate.mock.calls[0]
    expect(Array.isArray(firstCall[0])).toBe(true)
    expect(firstCall[0]).toEqual(['A', 'B', 'C', 'D', 'E'])
  })

  it('skips empty / blank strings inside the batch', async () => {
    const { maybeTranslate } = await import('./index')
    const doc = {
      _id: 'd',
      _rev: 'r',
      _type: 'trip',
      title: 'A',
      excerpt: '',
      duration: '   ',
      difficulty: 'D',
      category: null,
    }
    await maybeTranslate(doc, 'trip', 'en')
    const firstCall = mockTranslate.mock.calls[0]
    // Only the non-blank values are sent for translation
    expect(firstCall[0]).toEqual(['A', 'D'])
  })
})
