/**
 * One-off migration: publish every EN draft created by seed-en-translations.
 *
 * Why: when EN docs exist only as drafts, the public data layer can't find
 * a published `language == "en"` doc and falls through to the auto-translate
 * path. That path renders without stega encoding (no click-to-edit) and
 * occasionally drifts visually from the published NL render. Publishing the
 * drafts makes /en a first-class CMS-driven render, matching /nl exactly.
 *
 * Behaviour:
 *  - Idempotent. Skips drafts where a published twin already exists.
 *  - Atomically publishes via Sanity transaction:
 *      createOrReplace(publishedDoc) + delete(draftId)
 *  - Doesn't touch NL docs.
 *
 * Usage:
 *   npx tsx scripts/publish-en-drafts.ts          # dry run
 *   npx tsx scripts/publish-en-drafts.ts --run    # apply
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createClient, type SanityDocument } from '@sanity/client'

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

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2025-02-19',
  useCdn: false,
  perspective: 'raw',
})

const DRY_RUN = !process.argv.includes('--run')

async function main() {
  const drafts = await client.fetch<SanityDocument[]>(
    `*[_type in $types && language == "en" && _id in path("drafts.**")] | order(_type asc, _id asc)`,
    { types: TRANSLATABLE_TYPES },
  )

  const publishedIds = await client.fetch<string[]>(
    `*[_type in $types && language == "en" && !(_id in path("drafts.**"))]._id`,
    { types: TRANSLATABLE_TYPES },
  )
  const publishedSet = new Set(publishedIds)

  console.log(`${drafts.length} EN drafts; ${publishedIds.length} EN published.`)
  if (DRY_RUN) console.log('DRY RUN — pass --run to apply changes.')

  let published = 0
  let skipped = 0
  let failed = 0

  for (const draft of drafts) {
    const publishedId = draft._id.replace(/^drafts\./, '')
    if (publishedSet.has(publishedId)) {
      skipped++
      continue
    }

    try {
      console.log(`  → publishing ${draft._id} (${draft._type})`)

      if (DRY_RUN) {
        console.log(`     would create published ${publishedId} and delete draft`)
      } else {
        // Strip _id, _rev, _createdAt, _updatedAt; let Sanity manage them.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, _rev, _createdAt, _updatedAt, ...body } = draft
        await client
          .transaction()
          .createOrReplace({ ...body, _id: publishedId })
          .delete(draft._id)
          .commit({ visibility: 'async' })
      }
      published++
    } catch (err) {
      console.error(`  ✗ ${draft._id}: ${(err as Error).message}`)
      failed++
    }
  }

  console.log(`\nResult — published ${published}, skipped ${skipped}, failed ${failed}.`)
  if (DRY_RUN) console.log('Dry-run only. Run with --run to apply.')
  if (failed > 0) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
