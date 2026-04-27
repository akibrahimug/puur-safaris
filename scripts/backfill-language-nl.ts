/**
 * One-off migration: tag every existing translatable document with
 * `language: "nl"`. Idempotent — only sets the field if missing, never
 * overwrites other content. Run once after enabling the i18n plugin so
 * the existing NL corpus is correctly labelled and the plugin can show
 * editors the Translations panel.
 *
 * Usage:
 *   npx tsx scripts/backfill-language-nl.ts
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createClient } from '@sanity/client'

// Minimal .env.local loader (no dependency on dotenv).
function loadEnv(file: string) {
  try {
    const raw = readFileSync(join(process.cwd(), file), 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
      if (!m) continue
      const key = m[1]
      let val = m[2]
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1)
      }
      if (process.env[key] === undefined) process.env[key] = val
    }
  } catch {
    // optional
  }
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
  console.error('Missing Sanity env. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2025-01-01',
  useCdn: false,
})

async function main() {
  // Fetch every doc (published + draft) of a translatable type that is
  // missing the language field. We process both halves so the editor's
  // in-progress draft also picks up the tag — the patch sets ONLY the
  // language field, preserving every other change in the draft.
  const docs = await client.fetch<{ _id: string; _type: string }[]>(
    `*[_type in $types && !defined(language)] | order(_id asc) { _id, _type }`,
    { types: TRANSLATABLE_TYPES },
  )

  console.log(`Found ${docs.length} document(s) needing language tag.`)
  if (docs.length === 0) return

  let success = 0
  let failed = 0

  for (const doc of docs) {
    try {
      await client.patch(doc._id).setIfMissing({ language: 'nl' }).commit({ autoGenerateArrayKeys: false })
      console.log(`  ✓ ${doc._id} (${doc._type})`)
      success++
    } catch (err) {
      console.error(`  ✗ ${doc._id}: ${(err as Error).message}`)
      failed++
    }
  }

  console.log(`\nDone — ${success} tagged, ${failed} failed.`)
  if (failed > 0) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
