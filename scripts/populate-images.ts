/**
 * One-off migration: fill every EMPTY image field across all documents using
 * images that already exist in the Sanity asset library. Existing images are
 * never touched; only fields that currently have no asset are populated.
 * Assets are reused (cycled) across documents. No new content structure is
 * created — empty/absent arrays (e.g. a trip with no gallery) are left as-is;
 * only image fields that already exist in the document are filled.
 *
 * Idempotent: re-running only fills whatever is still empty.
 * Handles both published documents and drafts (perspective: 'raw').
 *
 * Usage:
 *   npx tsx scripts/populate-images.ts          # dry run — prints the plan
 *   npx tsx scripts/populate-images.ts --run     # apply the changes
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
      let val = m[2]
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1)
      }
      if (process.env[m[1]] === undefined) process.env[m[1]] = val
    }
  } catch {
    /* ignore — env may be provided by the shell */
  }
}
loadEnv('.env.local')

const APPLY = process.argv.includes('--run')

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
  perspective: 'raw', // see drafts as well as published docs
})

// ─── What to fill, per document type ─────────────────────────────────────────
// simple:     dot-paths to a single image field (object of type `image`)
// itemArrays: arrays of objects where each object has an image subfield
// imageArrays: arrays whose items ARE images directly
type Spec = {
  simple?: string[]
  itemArrays?: { path: string; imageField: string }[]
  imageArrays?: string[]
}

const SPECS: Record<string, Spec> = {
  trip: { simple: ['heroImage', 'seo.ogImage'] },
  destination: {
    simple: ['heroImage', 'communityImage', 'seo.ogImage'],
    imageArrays: ['gallery'],
    itemArrays: [
      { path: 'wildlifeHighlights', imageField: 'image' },
      { path: 'accommodations', imageField: 'image' },
    ],
  },
  blogPost: { simple: ['featuredImage', 'authorImage', 'seo.ogImage'] },
  aboutPage: {
    simple: ['heroImage', 'seo.ogImage'],
    itemArrays: [{ path: 'teamMembers', imageField: 'image' }],
  },
  homePage: { simple: ['heroImage', 'seo.ogImage'], imageArrays: ['heroSocialProofAvatars'] },
  blogPage: { simple: ['heroImage', 'seo.ogImage'] },
  blogSubmissionPage: { simple: ['heroImage', 'seo.ogImage'] },
  bookingPage: { simple: ['heroImage'] }, // schema has no seo field
  contactPage: { simple: ['heroImage', 'seo.ogImage'] },
  destinationListingPage: { simple: ['heroImage', 'seo.ogImage'] },
  eigenReisschemaPage: { simple: ['heroImage', 'seo.ogImage'] },
  faqPage: { simple: ['heroImage', 'seo.ogImage'] },
  legalPage: { simple: ['heroImage', 'seo.ogImage'] },
  safariListingPage: { simple: ['heroImage', 'seo.ogImage'] },
  siteSettings: { simple: ['logo', 'defaultOgImage'] },
  googleReview: { simple: ['authorPhoto'] },
  testimonial: { simple: ['profilePhoto'] },
}

// ─── Asset pool ──────────────────────────────────────────────────────────────
let assetCursor = 0
let assetIds: string[] = []
function nextAsset(): string {
  const id = assetIds[assetCursor % assetIds.length]
  assetCursor++
  return id
}
function imageValue() {
  return { _type: 'image', asset: { _type: 'reference', _ref: nextAsset() } }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
type Json = Record<string, unknown>
function getByPath(obj: Json, path: string): unknown {
  return path.split('.').reduce<unknown>((o, k) => (o == null ? undefined : (o as Json)[k]), obj)
}
function hasAsset(v: unknown): boolean {
  return !!(v && typeof v === 'object' && (v as Json).asset && ((v as Json).asset as Json)?._ref)
}

async function main() {
  const types = Object.keys(SPECS)
  assetIds = await client.fetch<string[]>(`*[_type == "sanity.imageAsset"]._id`)
  if (assetIds.length === 0) {
    console.error('No image assets found in the dataset — nothing to populate with.')
    process.exit(1)
  }
  console.log(`Asset pool: ${assetIds.length} images.`)

  const docs = await client.fetch<Json[]>(`*[_type in $types]`, { types })
  console.log(`Scanning ${docs.length} document(s) across ${types.length} types.\n`)

  let docsTouched = 0
  let fieldsFilled = 0
  let failed = 0

  for (const doc of docs) {
    const id = doc._id as string
    const spec = SPECS[doc._type as string]
    const setIfMissing: Json = {}
    const set: Json = {}
    const plan: string[] = []

    // Single image fields
    for (const path of spec.simple ?? []) {
      if (!hasAsset(getByPath(doc, path))) {
        setIfMissing[path] = imageValue()
        plan.push(path)
      }
    }

    // Arrays of images (item itself is the image)
    for (const path of spec.imageArrays ?? []) {
      const arr = getByPath(doc, path)
      if (!Array.isArray(arr)) continue
      for (const item of arr as Json[]) {
        const key = item?._key as string | undefined
        if (!key) continue
        if (!hasAsset(item)) {
          set[`${path}[_key=="${key}"]._type`] = 'image'
          set[`${path}[_key=="${key}"].asset`] = { _type: 'reference', _ref: nextAsset() }
          plan.push(`${path}[${key}]`)
        }
      }
    }

    // Arrays of objects with an image subfield
    for (const { path, imageField } of spec.itemArrays ?? []) {
      const arr = getByPath(doc, path)
      if (!Array.isArray(arr)) continue
      for (const item of arr as Json[]) {
        const key = item?._key as string | undefined
        if (!key) continue
        if (!hasAsset(item[imageField])) {
          set[`${path}[_key=="${key}"].${imageField}`] = imageValue()
          plan.push(`${path}[${key}].${imageField}`)
        }
      }
    }

    if (plan.length === 0) continue
    docsTouched++
    fieldsFilled += plan.length
    console.log(`${APPLY ? '✓' : '•'} ${id} (${doc._type}) → ${plan.join(', ')}`)

    if (APPLY) {
      try {
        let patch = client.patch(id)
        if (Object.keys(setIfMissing).length) patch = patch.setIfMissing(setIfMissing)
        if (Object.keys(set).length) patch = patch.set(set)
        await patch.commit({ autoGenerateArrayKeys: false })
      } catch (err) {
        console.error(`  ✗ failed: ${(err as Error).message}`)
        failed++
      }
    }
  }

  console.log(
    `\n${APPLY ? 'Applied' : 'Dry run'} — ${fieldsFilled} field(s) across ${docsTouched} document(s)` +
      (failed ? `, ${failed} failed` : '') +
      (APPLY ? '.' : '. Re-run with --run to apply.'),
  )
  if (failed > 0) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
