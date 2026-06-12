/**
 * One-off: remove the hero "social proof" (reviews) data from every homePage
 * document — both the avatars array and the text. The hero section now only
 * renders that block when real data is present, so clearing these fields hides
 * it on the live site.
 *
 * Usage:
 *   npx tsx scripts/clear-hero-social-proof.ts
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createClient } from '@sanity/client'

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
  perspective: 'raw', // see drafts too
})

const FIELDS = ['heroSocialProofAvatars', 'heroSocialProofText']

async function main() {
  const docs = await client.fetch<{ _id: string }[]>(
    `*[_type == "homePage" && (defined(heroSocialProofAvatars) || defined(heroSocialProofText))]{ _id }`,
  )

  console.log(`Found ${docs.length} homePage document(s) with social proof data.`)
  if (docs.length === 0) return

  for (const doc of docs) {
    await client.patch(doc._id).unset(FIELDS).commit({ autoGenerateArrayKeys: false })
    console.log(`  ✓ cleared ${doc._id}`)
  }
}

main().then(() => {
  console.log('Done.')
  process.exit(0)
}).catch((err) => {
  console.error(err)
  process.exit(1)
})
