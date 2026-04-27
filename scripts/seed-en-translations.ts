/**
 * One-off migration: create EN siblings for every published NL document
 * of a translatable type, populated with auto-translated content (glossary
 * applied) and linked via `translation.metadata`.
 *
 * Behaviour:
 *  - Idempotent. Skips any NL doc that already has an EN sibling.
 *  - Creates EN docs as DRAFTS so editors review and publish manually.
 *    Until they publish, `/en` visitors continue to see the auto-translate
 *    fallback path from the data layer.
 *  - Mirrors the plugin's metadata shape:
 *      { _type: "translation.metadata",
 *        schemaTypes: [docType],
 *        translations: [{ _key, language, _type, value: { _ref, _weak } }, …] }
 *  - Does not modify any NL document.
 *  - Refs inside the EN doc (e.g. trip → destination) still point to the
 *    original NL ref. With `weakReferences: true` in the plugin config that's
 *    legal; editors can re-link to EN siblings later via the studio.
 *
 * Usage:
 *   npx tsx scripts/seed-en-translations.ts          # dry run shows summary
 *   npx tsx scripts/seed-en-translations.ts --run    # actually create docs
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
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
  'trip',
  'destination',
  'blogPost',
  'faqItem',
  'homePage',
  'aboutPage',
  'contactPage',
  'safariListingPage',
  'destinationListingPage',
  'faqPage',
  'blogPage',
  'eigenReisschemaPage',
  'blogSubmissionPage',
  'bookingPage',
  'siteSettings',
  'legalPage',
]

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Missing env. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN.')
  process.exit(1)
}

const client = createClient({ projectId, dataset, token, apiVersion: '2025-02-19', useCdn: false })

const DRY_RUN = !process.argv.includes('--run')

function shortKey() {
  return randomUUID().replace(/-/g, '').slice(0, 12)
}

function makeTranslationEntry(language: string, ref: string) {
  return {
    _key: shortKey(),
    _type: 'internationalizedArrayReferenceValue',
    language,
    value: {
      _type: 'reference',
      _ref: ref,
      _weak: true,
    },
  }
}

/** System fields we should never copy onto a sibling. */
const STRIP_KEYS = new Set([
  '_id',
  '_rev',
  '_createdAt',
  '_updatedAt',
  '_originalId',
  'language',
])

function stripSystemFields(doc: SanityDocument) {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(doc)) {
    if (!STRIP_KEYS.has(k)) out[k] = v
  }
  return out
}

interface MetadataDoc {
  _id: string
  _type: 'translation.metadata'
  schemaTypes: string[]
  translations: Array<{
    _key: string
    _type: string
    language: string
    value: { _type: 'reference'; _ref: string; _weak?: boolean }
  }>
}

async function main() {
  const nlDocs = await client.fetch<SanityDocument[]>(
    `*[_type in $types && language == "nl" && !(_id in path("drafts.**"))] | order(_type asc, _id asc)`,
    { types: TRANSLATABLE_TYPES },
  )

  const alreadyLinked = await client.fetch<MetadataDoc[]>(
    `*[_type == "translation.metadata"]{ _id, _type, schemaTypes, translations[] { _key, _type, language, value } }`,
  )

  const enRefByNlId = new Map<string, string>()
  const metadataByNlId = new Map<string, MetadataDoc>()
  for (const meta of alreadyLinked) {
    const nlEntry = meta.translations?.find((t) => t.language === 'nl')
    if (!nlEntry?.value?._ref) continue
    metadataByNlId.set(nlEntry.value._ref, meta)
    const enEntry = meta.translations?.find((t) => t.language === 'en')
    if (enEntry?.value?._ref) enRefByNlId.set(nlEntry.value._ref, enEntry.value._ref)
  }

  console.log(`${nlDocs.length} NL docs; ${enRefByNlId.size} already have EN siblings.`)
  if (DRY_RUN) console.log('DRY RUN — pass --run to apply changes.')

  let created = 0
  let skipped = 0
  let failed = 0

  for (const nl of nlDocs) {
    const docType = nl._type as string
    if (enRefByNlId.has(nl._id)) {
      skipped++
      continue
    }

    const fieldConfig = translatableFields[docType]
    if (!fieldConfig) {
      console.warn(`  ! ${nl._id} (${docType}): no fieldConfig, skipping`)
      skipped++
      continue
    }

    try {
      console.log(`  → ${nl._id} (${docType})`)

      const translated = await translateDocument(stripSystemFields(nl) as Record<string, unknown>, fieldConfig, 'en')

      const enDocId = randomUUID()
      const draftId = `drafts.${enDocId}`
      const enDocBody = {
        _id: draftId,
        _type: docType,
        ...translated,
        language: 'en',
      }

      if (DRY_RUN) {
        console.log(`     would create draft ${draftId}`)
      } else {
        await client.create(enDocBody)

        const existingMeta = metadataByNlId.get(nl._id)
        if (existingMeta) {
          // Append EN entry to existing metadata.
          await client
            .patch(existingMeta._id)
            .setIfMissing({ translations: [] })
            .insert('after', 'translations[-1]', [makeTranslationEntry('en', enDocId)])
            .commit()
        } else {
          // Fresh metadata doc linking NL + EN.
          await client.create({
            _id: randomUUID(),
            _type: 'translation.metadata',
            schemaTypes: [docType],
            translations: [
              makeTranslationEntry('nl', nl._id),
              makeTranslationEntry('en', enDocId),
            ],
          })
        }
      }
      created++
    } catch (err) {
      console.error(`  ✗ ${nl._id} (${docType}): ${(err as Error).message}`)
      failed++
    }
  }

  console.log(`\nResult — created ${created}, skipped ${skipped}, failed ${failed}.`)
  if (DRY_RUN) console.log('Dry-run only. Run with --run to apply.')
  if (failed > 0) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
