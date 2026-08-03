/**
 * Translation service — uses the free Google Translate web API via google-translate-api-x.
 * No API key, no billing, no signup. Uses the same backend as translate.google.com.
 *
 * Key optimization: batches ALL strings from a document using the library's
 * built-in batch support, so one document ≈ one network roundtrip.
 */

import translate from 'google-translate-api-x'
import * as Sentry from '@sentry/nextjs'
import type { TranslatableFieldConfig } from './config'
import { applyGlossary, restoreGlossary } from './glossary'

// ─── Batch translate ─────────────────────────────────────────────────────────

/**
 * Translate an array of strings. Uses google-translate-api-x's batch mode
 * which sends all strings in a single request.
 *
 * Glossary handling: each string is pre-processed to swap forced phrases /
 * protected proper nouns with opaque placeholders, then sent to Google, then
 * restored. This keeps brand terms and place names intact.
 */
async function translateTexts(
  texts: (string | null | undefined)[],
  targetLang: string,
): Promise<(string | null | undefined)[]> {
  const entries: { index: number; text: string; restorations: Map<string, string> }[] = []
  for (let i = 0; i < texts.length; i++) {
    if (texts[i] && typeof texts[i] === 'string' && texts[i]!.trim()) {
      const { text, restorations } = applyGlossary(texts[i]!)
      entries.push({ index: i, text, restorations })
    }
  }
  if (entries.length === 0) return texts

  const results = [...texts]

  try {
    // google-translate-api-x supports array input natively
    const res = await translate(
      entries.map((e) => e.text),
      { from: 'nl', to: targetLang },
    )
    const resArray = Array.isArray(res) ? res : [res]
    for (let i = 0; i < entries.length; i++) {
      const translated = resArray[i]?.text ?? entries[i].text
      results[entries[i].index] = restoreGlossary(translated, entries[i].restorations)
    }
  } catch (error) {
    console.error('[translation] Google Translate error:', (error as Error).message)
    // Return originals on failure. Captured (not just logged) because this
    // is the exact silent-failure path that lands untranslated NL content
    // in EN docs during bulk seeding — see CLAUDE.md's retranslate-en-docs
    // note. Without this, the only way to notice is a manual repair-script run.
    Sentry.captureException(error, { tags: { module: 'translation-service' } })
  }

  return results
}

// ─── Portable Text translation ───────────────────────────────────────────────

async function translatePortableText(
  blocks: unknown[],
  targetLang: string,
): Promise<unknown[]> {
  if (!blocks?.length) return blocks

  const spans: { blockIdx: number; childIdx: number; text: string }[] = []
  for (let bi = 0; bi < blocks.length; bi++) {
    const block = blocks[bi] as Record<string, unknown>
    if (block._type === 'block' && Array.isArray(block.children)) {
      for (let ci = 0; ci < block.children.length; ci++) {
        const child = block.children[ci] as Record<string, unknown>
        if (child._type === 'span' && typeof child.text === 'string' && child.text.trim()) {
          spans.push({ blockIdx: bi, childIdx: ci, text: child.text })
        }
      }
    }
  }
  if (spans.length === 0) return blocks

  const translated = await translateTexts(
    spans.map((s) => s.text),
    targetLang,
  )

  const result = JSON.parse(JSON.stringify(blocks)) as Record<string, unknown>[]
  for (let i = 0; i < spans.length; i++) {
    const { blockIdx, childIdx } = spans[i]
    const block = result[blockIdx] as Record<string, unknown>
    const children = block.children as Record<string, unknown>[]
    children[childIdx].text = translated[i]
  }

  return result
}

// ─── Document translation ────────────────────────────────────────────────────

export async function translateDocument<T extends Record<string, unknown>>(
  doc: T,
  fieldConfig: TranslatableFieldConfig,
  targetLang: string,
): Promise<T> {
  const result = { ...doc }

  // 1. Plain text fields (one batch call)
  if (fieldConfig.text.length > 0) {
    const values = fieldConfig.text.map((f) => doc[f] as string | null | undefined)
    const translated = await translateTexts(values, targetLang)
    for (let i = 0; i < fieldConfig.text.length; i++) {
      if (translated[i] !== undefined) {
        ;(result as Record<string, unknown>)[fieldConfig.text[i]] = translated[i]
      }
    }
  }

  // 2. String arrays (one batch call each)
  for (const field of fieldConfig.textArray) {
    const arr = doc[field]
    if (Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'string') {
      ;(result as Record<string, unknown>)[field] = await translateTexts(arr, targetLang)
    }
  }

  // 3. Portable Text
  for (const field of fieldConfig.portableText) {
    const value = doc[field]
    if (Array.isArray(value) && value.length > 0) {
      ;(result as Record<string, unknown>)[field] = await translatePortableText(value, targetLang)
    }
  }

  // 4. Nested objects/arrays
  for (const [field, nestedConfig] of Object.entries(fieldConfig.nested)) {
    const val = doc[field]
    if (!val) continue

    // Plain nested object (e.g. cardLabels)
    if (typeof val === 'object' && !Array.isArray(val)) {
      const obj = val as Record<string, unknown>
      if (nestedConfig.text.length > 0) {
        const values = nestedConfig.text.map((f) => obj[f] as string | null | undefined)
        const translated = await translateTexts(values, targetLang)
        const translatedObj = { ...obj }
        for (let i = 0; i < nestedConfig.text.length; i++) {
          if (translated[i] !== undefined) {
            translatedObj[nestedConfig.text[i]] = translated[i]
          }
        }
        ;(result as Record<string, unknown>)[field] = translatedObj
      }
      continue
    }

    // Array of objects — collect ALL text, translate in one batch
    if (!Array.isArray(val) || val.length === 0) continue

    const allTexts: { itemIdx: number; fieldName: string; text: string }[] = []
    for (let ii = 0; ii < val.length; ii++) {
      const item = val[ii] as Record<string, unknown>
      if (typeof item !== 'object' || item === null) continue
      for (const tf of nestedConfig.text) {
        const v = item[tf]
        if (typeof v === 'string' && v.trim()) {
          allTexts.push({ itemIdx: ii, fieldName: tf, text: v })
        }
      }
    }

    if (allTexts.length > 0) {
      const translated = await translateTexts(
        allTexts.map((t) => t.text),
        targetLang,
      )
      const translatedArr = val.map((item: unknown) =>
        typeof item === 'object' && item !== null ? { ...(item as Record<string, unknown>) } : item,
      )
      for (let i = 0; i < allTexts.length; i++) {
        const { itemIdx, fieldName } = allTexts[i]
        ;(translatedArr[itemIdx] as Record<string, unknown>)[fieldName] = translated[i]
      }
      ;(result as Record<string, unknown>)[field] = translatedArr
    }

    // Portable text in nested items
    for (const ptField of nestedConfig.portableText) {
      const arr = (result as Record<string, unknown>)[field] as unknown[]
      for (let ii = 0; ii < arr.length; ii++) {
        const item = arr[ii] as Record<string, unknown>
        if (Array.isArray(item[ptField]) && (item[ptField] as unknown[]).length > 0) {
          item[ptField] = await translatePortableText(item[ptField] as unknown[], targetLang)
        }
      }
    }
  }

  return result
}
