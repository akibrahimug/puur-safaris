/**
 * Translation entry point — used by the data layer to auto-translate documents.
 *
 * Usage:
 *   const nlTrip = await fetchFromSanity(...)
 *   const enTrip = await maybeTranslate(nlTrip, 'trip', 'en')
 */

import { translatableFields } from './config'
import { getCached, setCache } from './cache'
import { translateDocument } from './service'

/**
 * Translate a Sanity document from NL to the target language.
 *
 * Uses the free MyMemory Translation API (no API key required).
 * - Returns the original document unchanged if targetLang is 'nl'.
 * - Checks the file cache first; only calls the API on cache miss.
 * - Falls back to the untranslated document if translation fails.
 * - Set MYMEMORY_EMAIL env var to increase free quota from 1k to 10k words/day.
 *
 * The document must include `_id`, `_rev`, and `_type` fields from Sanity.
 */
export async function maybeTranslate<T extends Record<string, unknown>>(
  doc: T | null,
  docType: string,
  targetLang: string,
): Promise<T | null> {
  if (!doc) return null
  if (targetLang === 'nl') return doc

  const fieldConfig = translatableFields[docType]
  if (!fieldConfig) return doc // Unknown type, pass through

  const docId = (doc._id ?? doc.id ?? 'unknown') as string
  const docRev = (doc._rev ?? '') as string

  // Check cache — translations are cached by document revision,
  // so they only re-translate when the NL source content changes.
  if (docRev) {
    const cached = await getCached(docId, targetLang, docRev)
    if (cached) {
      return { ...doc, ...cached, language: targetLang } as T
    }
  }

  try {
    const translated = await translateDocument(doc, fieldConfig, targetLang)
    // Cache only the changed fields
    const changedFields: Record<string, unknown> = {}
    for (const key of Object.keys(translated)) {
      if (translated[key] !== doc[key]) {
        changedFields[key] = translated[key]
      }
    }
    if (docRev && Object.keys(changedFields).length > 0) {
      await setCache(docId, targetLang, docRev, changedFields)
    }
    return { ...translated, language: targetLang } as T
  } catch (error) {
    console.error(`[translation] Failed to translate ${docType} ${docId}:`, error)
    return doc // Graceful fallback — show NL content
  }
}

/**
 * Translate an array of documents.
 */
export async function maybeTranslateArray<T extends Record<string, unknown>>(
  docs: T[],
  docType: string,
  targetLang: string,
): Promise<T[]> {
  if (targetLang === 'nl' || !docs?.length) return docs
  return Promise.all(docs.map((doc) => maybeTranslate(doc, docType, targetLang) as Promise<T>))
}
