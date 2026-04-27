/**
 * File-based translation cache.
 *
 * Translations are cached as JSON files in `.translations/` (gitignored).
 * Cache key = `{documentId}:{targetLang}`. Each entry stores the translated
 * document fields plus the source document `_rev` used for staleness detection.
 *
 * When the source `_rev` changes, the cache entry is considered stale and
 * the document is re-translated.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { TRANSLATOR_VERSION } from './glossary'

const CACHE_DIR = join(process.cwd(), '.translations')

interface CacheEntry {
  sourceRev: string
  translatedAt: string
  data: Record<string, unknown>
}

function cacheKey(docId: string, targetLang: string): string {
  // Sanitize document ID for filesystem (replace dots, slashes).
  // The translator version is part of the filename so updates to the
  // glossary or pipeline auto-invalidate prior translations without
  // requiring a manual cache wipe.
  const safeId = docId.replace(/[^a-zA-Z0-9_-]/g, '_')
  return `${safeId}_${targetLang}_v${TRANSLATOR_VERSION}.json`
}

export async function getCached(
  docId: string,
  targetLang: string,
  sourceRev: string,
): Promise<Record<string, unknown> | null> {
  try {
    const filePath = join(CACHE_DIR, cacheKey(docId, targetLang))
    const raw = await readFile(filePath, 'utf-8')
    const entry: CacheEntry = JSON.parse(raw)
    if (entry.sourceRev === sourceRev) {
      return entry.data
    }
    // Stale — source document has changed
    return null
  } catch {
    // File doesn't exist or is corrupt
    return null
  }
}

export async function setCache(
  docId: string,
  targetLang: string,
  sourceRev: string,
  data: Record<string, unknown>,
): Promise<void> {
  await mkdir(CACHE_DIR, { recursive: true })
  const entry: CacheEntry = {
    sourceRev,
    translatedAt: new Date().toISOString(),
    data,
  }
  const filePath = join(CACHE_DIR, cacheKey(docId, targetLang))
  await writeFile(filePath, JSON.stringify(entry, null, 2), 'utf-8')
}
