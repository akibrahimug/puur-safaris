/**
 * Image Migration Script
 * Downloads Unsplash images and uploads them to Sanity's asset pipeline,
 * then patches each document's image fields with the uploaded asset references.
 *
 * Usage:
 *   SANITY_API_WRITE_TOKEN=xxx npx tsx scripts/migrate-images.ts
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '68gnvrgl',
  dataset: 'production',
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

if (!process.env.SANITY_API_WRITE_TOKEN) {
  console.error('Missing SANITY_API_WRITE_TOKEN env variable')
  process.exit(1)
}

// ─── Image-to-document mapping ───────────────────────────────────────────────

interface ImageMapping {
  documentId: string
  field: string // dot path e.g. "heroImage" or "teamMembers[0].image"
  unsplashId: string
  alt: string
}

const mappings: ImageMapping[] = [
  // ── Trips ──
  { documentId: '1b8c43b7-2854-4e12-bf04-ae6992d6e5e6', field: 'heroImage', unsplashId: 'photo-1547471080-7cc2caa01a7e', alt: 'Gnoes tijdens de Grote Trek in Maasai Mara' },
  { documentId: '21f59f66-9e6f-4fd3-bf24-159471fea401', field: 'heroImage', unsplashId: 'photo-1516426122078-c23e76319801', alt: 'Leeuwen in de Serengeti bij zonsondergang' },
  { documentId: 'c0211e72-dba5-4d7d-b681-8f9e15db1115', field: 'heroImage', unsplashId: 'photo-1516026672322-bc52d61a55d5', alt: 'Berggorilla in Volcanoes National Park, Rwanda' },
  { documentId: 'b02d3d39-5105-4ca2-9335-f9e0f7c87bfb', field: 'heroImage', unsplashId: 'photo-1535941339077-2dd1c7963098', alt: 'Zonsondergang over het Okavango Delta' },
  { documentId: '38e2d8c7-340b-4343-a549-2a5189d7b173', field: 'heroImage', unsplashId: 'photo-1589308078059-be1415eab4c3', alt: 'Kilimanjaro boven de wolken, Tanzania' },
  { documentId: '0beded15-55ff-4ef9-8025-0fb0734d5cec', field: 'heroImage', unsplashId: 'photo-1583422409516-2895a77efded', alt: 'Olifanten in Kruger National Park' },

  // ── Destinations ──
  { documentId: '84d45dd0-663c-46d3-aee6-ec1ff51e2ecd', field: 'heroImage', unsplashId: 'photo-1547471080-7cc2caa01a7e', alt: 'Olifanten in de Maasai Mara, Kenya' },
  { documentId: 'ac9f9574-1451-4292-b4dc-16cf2852e0ac', field: 'heroImage', unsplashId: 'photo-1516426122078-c23e76319801', alt: 'Leeuwen in de Serengeti, Tanzania' },
  { documentId: '7515e7fc-ea60-4d17-b6f7-a3d12a76c809', field: 'heroImage', unsplashId: 'photo-1535941339077-2dd1c7963098', alt: 'Okavango Delta, Botswana' },
  { documentId: 'e5a032c9-be9d-4f77-a105-40f82324f004', field: 'heroImage', unsplashId: 'photo-1583422409516-2895a77efded', alt: 'Kruger National Park, Zuid-Afrika' },
  { documentId: '0afd9480-d05d-42e5-aa74-869fb498b865', field: 'heroImage', unsplashId: 'photo-1516026672322-bc52d61a55d5', alt: 'Berggorilla in Rwanda' },
  { documentId: '6ce2e414-a026-4f05-a9be-48b72bc219cc', field: 'heroImage', unsplashId: 'photo-1528543606781-2f6e6857f318', alt: 'Victoria Falls, Zambia' },

  // ── Blog Posts ──
  { documentId: 'db43bfd6-683d-4a50-8b75-5e47d0db04cd', field: 'featuredImage', unsplashId: 'photo-1516426122078-c23e76319801', alt: 'Gnoes tijdens de Grote Trek' },
  { documentId: '2b243ccc-0c3e-4ed4-ab77-267e95e3712b', field: 'featuredImage', unsplashId: 'photo-1516026672322-bc52d61a55d5', alt: 'Berggorilla in Rwanda' },
  { documentId: 'aee68fc2-0431-4732-aee2-973fa20f614c', field: 'featuredImage', unsplashId: 'photo-1547471080-7cc2caa01a7e', alt: 'Savanne in Kenya bij zonsondergang' },
  { documentId: '617dfc81-b897-4178-bcd4-2837efae5bd2', field: 'featuredImage', unsplashId: 'photo-1535941339077-2dd1c7963098', alt: 'Okavango Delta vanuit de lucht' },
  { documentId: '89c3ae4c-960e-4125-8b25-5e285e273607', field: 'featuredImage', unsplashId: 'photo-1528543606781-2f6e6857f318', alt: 'Safari bagage en uitrusting' },
  { documentId: '4d2707a4-d20b-49f2-bb24-9a00a6c8e991', field: 'featuredImage', unsplashId: 'photo-1551632811-561732d1e306', alt: 'Kilimanjaro bij zonsopgang' },

  // ── HomePage ──
  { documentId: 'd19bf121-7909-4312-84ed-751e6d22ac7e', field: 'heroImage', unsplashId: 'photo-1516426122078-c23e76319801', alt: 'Safari in Afrika' },

  // ── AboutPage ──
  { documentId: '772794f3-d6aa-4942-9d9a-8c91ba908c9c', field: 'heroImage', unsplashId: 'photo-1549366021-9f1d07c3be09', alt: 'Savanne landschap' },
  { documentId: '772794f3-d6aa-4942-9d9a-8c91ba908c9c', field: 'teamMembers[0].image', unsplashId: 'photo-1506277886164-e25aa3f4ef7f', alt: 'Kibrahim' },
  { documentId: '772794f3-d6aa-4942-9d9a-8c91ba908c9c', field: 'teamMembers[1].image', unsplashId: 'photo-1438761681033-6461ffad8d80', alt: 'Emma de Vries' },
  { documentId: '772794f3-d6aa-4942-9d9a-8c91ba908c9c', field: 'teamMembers[2].image', unsplashId: 'photo-1500648767791-00dcc994a43e', alt: 'David Mbeki' },

  // ── Site Settings ──
  { documentId: 'siteSettings', field: 'defaultOgImage', unsplashId: 'photo-1516426122078-c23e76319801', alt: 'Puur Safaris — Authentieke Safari Ervaringen' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Cache: unsplashId → uploaded asset reference (avoids re-uploading duplicates)
const assetCache = new Map<string, { _type: 'reference'; _ref: string }>()

async function downloadAndUpload(unsplashId: string): Promise<{ _type: 'reference'; _ref: string }> {
  if (assetCache.has(unsplashId)) {
    return assetCache.get(unsplashId)!
  }

  const url = `https://images.unsplash.com/${unsplashId}?w=1600&q=85`
  console.log(`  Downloading ${unsplashId}...`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`)

  const buffer = Buffer.from(await res.arrayBuffer())
  console.log(`  Uploading to Sanity (${(buffer.length / 1024).toFixed(0)} KB)...`)

  const asset = await client.assets.upload('image', buffer, {
    filename: `${unsplashId}.jpg`,
    contentType: 'image/jpeg',
  })

  const ref = { _type: 'reference' as const, _ref: asset._id }
  assetCache.set(unsplashId, ref)
  return ref
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nMigrating ${mappings.length} images to Sanity...\n`)

  for (const mapping of mappings) {
    const { documentId, field, unsplashId, alt } = mapping
    console.log(`[${documentId}] ${field}`)

    try {
      const assetRef = await downloadAndUpload(unsplashId)

      // Handle nested array paths like "teamMembers[0].image"
      const arrayMatch = field.match(/^(\w+)\[(\d+)\]\.(\w+)$/)

      if (arrayMatch) {
        const [, arrayField, indexStr, nestedField] = arrayMatch
        const index = parseInt(indexStr, 10)

        // Fetch current doc to get the _key of the array item
        const doc = await client.fetch(
          `*[_id == $id || _id == "drafts." + $id][0]{${arrayField}}`,
          { id: documentId }
        )
        const items = doc?.[arrayField]
        if (!items?.[index]) {
          console.log(`  ⚠ Array item ${arrayField}[${index}] not found, skipping`)
          continue
        }

        const key = items[index]._key
        if (key) {
          await client
            .patch(documentId)
            .set({ [`${arrayField}[_key=="${key}"].${nestedField}`]: { _type: 'image', asset: assetRef, alt } })
            .commit()
        } else {
          // No _key — use index-based approach by rebuilding the array item
          const updatedItems = [...items]
          updatedItems[index] = { ...updatedItems[index], [nestedField]: { _type: 'image', asset: assetRef, alt } }
          await client.patch(documentId).set({ [arrayField]: updatedItems }).commit()
        }
      } else {
        // Simple top-level field
        await client
          .patch(documentId)
          .set({ [field]: { _type: 'image', asset: assetRef, alt } })
          .commit()
      }

      console.log(`  ✓ Done`)
    } catch (err) {
      console.error(`  ✗ Error: ${err instanceof Error ? err.message : err}`)
    }
  }

  console.log(`\nMigration complete! ${assetCache.size} unique images uploaded.\n`)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
