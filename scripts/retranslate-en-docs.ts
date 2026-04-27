/**
 * Re-translate EN documents from their NL siblings.
 *
 * Why: the initial seed-en-translations run silently caught Google
 * Translate failures (rate-limit / transient errors) and wrote NL
 * content into the EN doc. This script finds every EN doc, looks up
 * its NL sibling via translation.metadata, runs the translator again,
 * and patches only the fields that came back different.
 *
 * Behaviour:
 *  - Filters to EN docs whose content still looks Dutch (heuristic),
 *    OR with --all flag, re-translates every EN doc.
 *  - Operates on the published doc (no draft churn).
 *  - Patches in batches with a small delay between docs to avoid
 *    re-tripping any rate limit.
 *  - Skips docs with no NL sibling.
 *
 * Usage:
 *   npx tsx scripts/retranslate-en-docs.ts                 # dry run, only Dutch-flagged
 *   npx tsx scripts/retranslate-en-docs.ts --run           # apply, only Dutch-flagged
 *   npx tsx scripts/retranslate-en-docs.ts --all --run     # re-translate every EN doc
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createClient, type SanityDocument } from '@sanity/client'
import { translatableFields } from '../src/lib/translation/config'
import { translateDocument } from '../src/lib/translation/service'

function loadEnv(file: string) {
  try {
    const raw = readFileSync(join(process.cwd(), file), 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
      if (!m) continue
      let val = m[2]
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1)
      if (process.env[m[1]] === undefined) process.env[m[1]] = val
    }
  } catch {}
}
loadEnv('.env.local')
loadEnv('.env')

const TRANSLATABLE_TYPES = [
  'trip', 'destination', 'blogPost', 'faqItem',
  'homePage', 'aboutPage', 'contactPage', 'safariListingPage',
  'destinationListingPage', 'faqPage', 'blogPage', 'eigenReisschemaPage',
  'blogSubmissionPage', 'bookingPage', 'siteSettings', 'legalPage',
]

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Missing env. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2025-02-19',
  useCdn: false,
  perspective: 'raw',
})

const DRY_RUN = !process.argv.includes('--run')
const ALL = process.argv.includes('--all')

/**
 * Heuristic — does this string still look Dutch?
 * Looks for Dutch-specific patterns (article/preposition combinations,
 * uniquely Dutch words) that wouldn't survive translation.
 */
const DUTCH_MARKERS = [
  /\b(een|de|het|en|van|voor|met|onze|jouw|uw|jij|je|wij|onze)\b/i,
  /\b(reizen|reisschema|bestemming|bekijk|ontdek|maak|creëer|klaar|droom)/i,
  /(ij)/, // common Dutch digraph rare in English
]

function looksDutch(text: unknown): boolean {
  if (typeof text !== 'string') return false
  if (text.length < 4) return false
  let hits = 0
  for (const re of DUTCH_MARKERS) {
    if (re.test(text)) hits++
  }
  return hits >= 1
}

function docIsLikelyDutch(doc: SanityDocument): boolean {
  // Walk top-level string fields and check for Dutch hallmarks.
  for (const value of Object.values(doc)) {
    if (typeof value === 'string' && looksDutch(value)) return true
  }
  return false
}

async function main() {
  // Load translation metadata so we can find each EN doc's NL twin.
  interface Meta {
    translations: Array<{
      language: string
      value: { _ref: string }
    }>
  }
  const metaDocs = await client.fetch<Meta[]>(
    `*[_type == "translation.metadata"]{ translations[] { language, value } }`,
  )

  const nlByEnId = new Map<string, string>()
  for (const meta of metaDocs) {
    const nlEntry = meta.translations?.find((t) => t.language === 'nl')?.value?._ref
    const enEntry = meta.translations?.find((t) => t.language === 'en')?.value?._ref
    if (nlEntry && enEntry) nlByEnId.set(enEntry, nlEntry)
  }

  // Fetch all published EN docs.
  const enDocs = await client.fetch<SanityDocument[]>(
    `*[_type in $types && language == "en" && !(_id in path("drafts.**"))] | order(_type asc, _id asc)`,
    { types: TRANSLATABLE_TYPES },
  )

  console.log(`${enDocs.length} EN docs total.`)

  let retranslated = 0
  let unchanged = 0
  let skippedNoNl = 0
  let skippedClean = 0
  let failed = 0

  for (const en of enDocs) {
    const nlId = nlByEnId.get(en._id)
    if (!nlId) {
      console.warn(`  ! ${en._id} (${en._type}): no NL sibling in translation.metadata, skipping`)
      skippedNoNl++
      continue
    }

    if (!ALL && !docIsLikelyDutch(en)) {
      skippedClean++
      continue
    }

    const fieldConfig = translatableFields[en._type as string]
    if (!fieldConfig) {
      console.warn(`  ! ${en._id} (${en._type}): no fieldConfig, skipping`)
      skippedClean++
      continue
    }

    const nl = await client.fetch<SanityDocument | null>(
      `*[_id == $id][0]`,
      { id: nlId },
    )
    if (!nl) {
      console.warn(`  ! ${en._id} (${en._type}): NL sibling ${nlId} not found, skipping`)
      skippedNoNl++
      continue
    }

    try {
      console.log(`  → re-translating ${en._id} (${en._type})`)
      const translated = await translateDocument(
        nl as unknown as Record<string, unknown>,
        fieldConfig,
        'en',
      )

      // Build patch: only fields that translated returns AND differ from current EN.
      const patch: Record<string, unknown> = {}
      const allFields = [
        ...fieldConfig.text,
        ...fieldConfig.textArray,
        ...fieldConfig.portableText,
        ...Object.keys(fieldConfig.nested),
      ]
      for (const field of allFields) {
        const newVal = (translated as Record<string, unknown>)[field]
        const oldVal = (en as Record<string, unknown>)[field]
        if (newVal === undefined) continue
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          patch[field] = newVal
        }
      }

      if (Object.keys(patch).length === 0) {
        unchanged++
        console.log(`     ✓ already up to date`)
        continue
      }

      console.log(`     would patch ${Object.keys(patch).length} fields: ${Object.keys(patch).slice(0, 6).join(', ')}${Object.keys(patch).length > 6 ? ', …' : ''}`)

      if (!DRY_RUN) {
        await client.patch(en._id).set(patch).commit({ visibility: 'async' })
      }
      retranslated++
      // Pace the runs to avoid Google rate-limiting.
      await new Promise((r) => setTimeout(r, 600))
    } catch (err) {
      console.error(`  ✗ ${en._id} (${en._type}): ${(err as Error).message}`)
      failed++
    }
  }

  console.log(
    `\nResult — re-translated ${retranslated}, unchanged ${unchanged}, skipped (clean) ${skippedClean}, skipped (no NL) ${skippedNoNl}, failed ${failed}.`,
  )
  if (DRY_RUN) console.log('Dry-run only. Run with --run to apply.')
  if (failed > 0) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
