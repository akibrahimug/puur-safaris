/**
 * Google Reviews fetcher — uses SerpApi free tier (100 searches/month, no credit card).
 *
 * Reviews are cached for 24 hours in `.translations/google-reviews.json`.
 * With daily caching, this uses ~30 searches/month — well within the free quota.
 *
 * Setup:
 * 1. Sign up at https://serpapi.com (free, no credit card)
 * 2. Set SERPAPI_KEY in .env.local
 * 3. Set GOOGLE_PLACE_ID in .env.local (your Google Maps Place ID)
 *
 * To find your Place ID:
 * https://developers.google.com/maps/documentation/places/web-service/place-id
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import type { Testimonial } from './types'

const CACHE_DIR = join(process.cwd(), '.translations')
const CACHE_FILE = join(CACHE_DIR, 'google-reviews.json')
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

interface GoogleReview {
  user: {
    name: string
    thumbnail?: string
    link?: string
  }
  rating: number
  snippet?: string
  date?: string
  source?: string
}

interface CachedReviews {
  fetchedAt: string
  reviews: GoogleReview[]
}

/**
 * Get cached reviews if still fresh (within TTL).
 */
async function getCachedReviews(): Promise<GoogleReview[] | null> {
  try {
    const raw = await readFile(CACHE_FILE, 'utf-8')
    const cached: CachedReviews = JSON.parse(raw)
    const age = Date.now() - new Date(cached.fetchedAt).getTime()
    if (age < CACHE_TTL) {
      return cached.reviews
    }
    return null // Stale
  } catch {
    return null // No cache
  }
}

/**
 * Save reviews to cache.
 */
async function cacheReviews(reviews: GoogleReview[]): Promise<void> {
  await mkdir(CACHE_DIR, { recursive: true })
  const data: CachedReviews = {
    fetchedAt: new Date().toISOString(),
    reviews,
  }
  await writeFile(CACHE_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

/**
 * Fetch reviews from Google via SerpApi.
 */
async function fetchFromSerpApi(placeId: string): Promise<GoogleReview[]> {
  const apiKey = process.env.SERPAPI_KEY
  if (!apiKey) {
    console.warn('[google-reviews] SERPAPI_KEY not set — skipping')
    return []
  }

  const params = new URLSearchParams({
    engine: 'google_maps_reviews',
    place_id: placeId,
    api_key: apiKey,
    hl: 'nl', // Fetch Dutch reviews (will be translated for EN)
    sort_by: 'qualityScore',
  })

  try {
    const res = await fetch(`https://serpapi.com/search.json?${params.toString()}`)
    if (!res.ok) {
      console.error(`[google-reviews] SerpApi HTTP ${res.status}`)
      return []
    }

    const data = await res.json()
    const reviews: GoogleReview[] = (data.reviews ?? []).map((r: Record<string, unknown>) => ({
      user: {
        name: (r.user as Record<string, unknown>)?.name ?? 'Anonymous',
        thumbnail: (r.user as Record<string, unknown>)?.thumbnail as string | undefined,
        link: (r.user as Record<string, unknown>)?.link as string | undefined,
      },
      rating: (r.rating as number) ?? 5,
      snippet: (r.snippet as string) ?? '',
      date: (r.date as string) ?? '',
      source: 'google',
    }))

    return reviews
  } catch (error) {
    console.error('[google-reviews] Fetch error:', (error as Error).message)
    return []
  }
}

/**
 * Get Google Reviews — cached for 24 hours.
 * Returns reviews in the same Testimonial format used by the rest of the app.
 */
export async function getGoogleReviews(): Promise<Testimonial[]> {
  const placeId = process.env.GOOGLE_PLACE_ID
  if (!placeId) {
    return [] // No place ID configured
  }

  // Check cache first
  let reviews = await getCachedReviews()
  if (!reviews) {
    reviews = await fetchFromSerpApi(placeId)
    if (reviews.length > 0) {
      await cacheReviews(reviews)
    }
  }

  // Convert to Testimonial format
  return reviews.map((r, i) => ({
    _id: `google-review-${i}`,
    name: r.user.name,
    country: undefined,
    rating: r.rating,
    quote: r.snippet ?? '',
    date: r.date,
    profilePhoto: r.user.thumbnail
      ? { asset: { _id: `google-${i}`, url: r.user.thumbnail, metadata: { dimensions: { width: 40, height: 40, aspectRatio: 1 }, lqip: '' } } }
      : undefined,
    bookedTrip: undefined,
    source: 'google' as const,
  }))
}
