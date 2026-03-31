/**
 * Data access layer — each function tries Sanity first, falls back to dummy data.
 *
 * Migrate one function at a time by updating its Sanity query block.
 * Dummy data is imported statically; Sanity data is fetched at runtime.
 *
 * To skip Sanity for a specific resource while still having others live,
 * simply return the dummy import directly instead of calling sanityFetch().
 */

import { sanityFetch } from './sanity-fetch'
import {
  siteSettingsQuery,
  tripListQuery,
  tripDetailQuery,
  tripSlugsQuery,
  destinationListQuery,
  destinationDetailQuery,
  destinationSlugsQuery,
  blogListQuery,
  blogPostDetailQuery,
  blogPostSlugsQuery,
  faqQuery,
} from '@/sanity/queries'

// ─── Dummy data fallbacks ─────────────────────────────────────────────────────
import { siteSettings as dummySiteSettings } from '@/data/site-settings'
import { trips as dummyTrips } from '@/data/trips'
import { destinations as dummyDestinations } from '@/data/destinations'
import { blogPosts as dummyBlogPosts, blogPostDetails as dummyBlogPostDetails } from '@/data/blog-posts'
import { faqItems as dummyFaqItems } from '@/data/faq'

import type {
  SiteSettings,
  TripCard,
  TripDetail,
  DestinationCard,
  DestinationDetail,
  BlogPostCard,
  BlogPostDetail,
  FaqItem,
} from './types'

// ─── Site Settings ────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await sanityFetch<SiteSettings>(
    siteSettingsQuery,
    {},
    { next: { revalidate: 3600 } },
  )
  return data ?? dummySiteSettings
}

// ─── Trips ────────────────────────────────────────────────────────────────────
// Still on dummy data — uncomment Sanity fetch when ready to migrate

export async function getTrips(): Promise<TripCard[]> {
  // SANITY: uncomment when trips are entered in the Studio
  // const data = await sanityFetch<TripCard[]>(tripListQuery, {}, { next: { revalidate: 300 } })
  // return data?.length ? data : dummyTrips
  void tripListQuery // keep import live until migration
  return dummyTrips
}

export async function getTripDetail(slug: string): Promise<TripDetail | null> {
  // SANITY: uncomment when trips are entered in the Studio
  // return sanityFetch<TripDetail>(tripDetailQuery, { slug }, { next: { revalidate: 300 } })
  void tripDetailQuery
  void slug
  return null // pages fall back to dummy lookup themselves
}

export async function getTripSlugs(): Promise<string[]> {
  // SANITY: uncomment when trips are entered in the Studio
  // const data = await sanityFetch<{ slug: string }[]>(tripSlugsQuery)
  // return data?.map((d) => d.slug) ?? []
  void tripSlugsQuery
  return dummyTrips.map((t) => t.slug)
}

// ─── Destinations ─────────────────────────────────────────────────────────────

export async function getDestinations(): Promise<DestinationCard[]> {
  // SANITY: uncomment when destinations are entered in the Studio
  // const data = await sanityFetch<DestinationCard[]>(destinationListQuery, {}, { next: { revalidate: 3600 } })
  // return data?.length ? data : dummyDestinations
  void destinationListQuery
  return dummyDestinations
}

export async function getDestinationDetail(slug: string): Promise<DestinationDetail | null> {
  void destinationDetailQuery
  void slug
  return null
}

export async function getDestinationSlugs(): Promise<string[]> {
  void destinationSlugsQuery
  return dummyDestinations.map((d) => d.slug)
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export async function getBlogPosts(): Promise<BlogPostCard[]> {
  // SANITY: uncomment when blog posts are entered in the Studio
  // const data = await sanityFetch<BlogPostCard[]>(blogListQuery, {}, { next: { revalidate: 600 } })
  // return data?.length ? data : dummyBlogPosts
  void blogListQuery
  return dummyBlogPosts
}

export async function getBlogPostDetail(slug: string): Promise<BlogPostDetail | null> {
  void blogPostDetailQuery
  void slug
  return null
}

export async function getBlogPostSlugs(): Promise<string[]> {
  void blogPostSlugsQuery
  return dummyBlogPosts.map((p) => p.slug)
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export async function getFaqItems(): Promise<FaqItem[]> {
  // SANITY: uncomment when FAQ items are entered in the Studio
  // const data = await sanityFetch<FaqItem[]>(faqQuery, {}, { next: { revalidate: 3600 } })
  // return data?.length ? data : dummyFaqItems
  void faqQuery
  return dummyFaqItems
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
// (no separate query file — included in homepageQuery when ready)
// Dummy import kept here so the dummy data file stays referenced.
export { dummyBlogPostDetails }
