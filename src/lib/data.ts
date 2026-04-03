/**
 * Data access layer — all content fetched from Sanity CMS via defineLive.
 */

import { sanityFetch } from '@/sanity/live'
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
  testimonialListQuery,
  homePageQuery,
  aboutPageQuery,
  contactPageQuery,
  safariListingPageQuery,
  destinationListingPageQuery,
  faqPageQuery,
  blogPageQuery,
  eigenReisschemaPageQuery,
  blogSubmissionPageQuery,
  bookingPageQuery,
} from '@/sanity/queries'

import type {
  SiteSettings,
  TripCard,
  TripDetail,
  DestinationCard,
  DestinationDetail,
  BlogPostCard,
  BlogPostDetail,
  FaqItem,
  Testimonial,
  HomePage,
  AboutPage,
  ContactPage,
  SimpleHeroPage,
  FaqPage,
  BlogPage,
  EigenReisschemaPage,
  BlogSubmissionPage,
  BookingPage,
} from './types'

// ─── Site Settings ────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings> {
  const { data } = await sanityFetch({ query: siteSettingsQuery })
  return data ?? { siteName: 'Puur Safaris' } as SiteSettings
}

// ─── Trips ────────────────────────────────────────────────────────────────────

export async function getTrips(): Promise<TripCard[]> {
  const { data } = await sanityFetch({ query: tripListQuery })
  return data ?? []
}

export async function getTripDetail(slug: string): Promise<TripDetail | null> {
  const { data } = await sanityFetch({ query: tripDetailQuery, params: { slug } })
  return data ?? null
}

export async function getTripSlugs(): Promise<string[]> {
  const { data } = await sanityFetch({ query: tripSlugsQuery, perspective: 'published', stega: false })
  return data?.map((d: { slug: string }) => d.slug) ?? []
}

// ─── Destinations ─────────────────────────────────────────────────────────────

export async function getDestinations(): Promise<DestinationCard[]> {
  const { data } = await sanityFetch({ query: destinationListQuery })
  return data ?? []
}

export async function getDestinationDetail(slug: string): Promise<DestinationDetail | null> {
  const { data } = await sanityFetch({ query: destinationDetailQuery, params: { slug } })
  return data ?? null
}

export async function getDestinationSlugs(): Promise<string[]> {
  const { data } = await sanityFetch({ query: destinationSlugsQuery, perspective: 'published', stega: false })
  return data?.map((d: { slug: string }) => d.slug) ?? []
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export async function getBlogPosts(): Promise<BlogPostCard[]> {
  const { data } = await sanityFetch({ query: blogListQuery })
  return data ?? []
}

export async function getBlogPostDetail(slug: string): Promise<BlogPostDetail | null> {
  const { data } = await sanityFetch({ query: blogPostDetailQuery, params: { slug } })
  return data ?? null
}

export async function getBlogPostSlugs(): Promise<string[]> {
  const { data } = await sanityFetch({ query: blogPostSlugsQuery, perspective: 'published', stega: false })
  return data?.map((d: { slug: string }) => d.slug) ?? []
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export async function getFaqItems(): Promise<FaqItem[]> {
  const { data } = await sanityFetch({ query: faqQuery })
  return data ?? []
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export async function getTestimonials(): Promise<Testimonial[]> {
  const { data } = await sanityFetch({ query: testimonialListQuery })
  return data ?? []
}

// ─── Homepage ─────────────────────────────────────────────────────────────────

export async function getHomePage(): Promise<HomePage | null> {
  const { data } = await sanityFetch({ query: homePageQuery })
  return data ?? null
}

// ─── About Page ───────────────────────────────────────────────────────────────

export async function getAboutPage(): Promise<AboutPage | null> {
  const { data } = await sanityFetch({ query: aboutPageQuery })
  return data ?? null
}

// ─── Contact Page ────────────────────────────────────────────────────────────

export async function getContactPage(): Promise<ContactPage | null> {
  const { data } = await sanityFetch({ query: contactPageQuery })
  return data ?? null
}

// ─── Safari Listing Page ─────────────────────────────────────────────────────

export async function getSafariListingPage(): Promise<SimpleHeroPage | null> {
  const { data } = await sanityFetch({ query: safariListingPageQuery })
  return data ?? null
}

// ─── Destination Listing Page ────────────────────────────────────────────────

export async function getDestinationListingPage(): Promise<SimpleHeroPage | null> {
  const { data } = await sanityFetch({ query: destinationListingPageQuery })
  return data ?? null
}

// ─── FAQ Page ────────────────────────────────────────────────────────────────

export async function getFaqPage(): Promise<FaqPage | null> {
  const { data } = await sanityFetch({ query: faqPageQuery })
  return data ?? null
}

// ─── Blog Page ───────────────────────────────────────────────────────────────

export async function getBlogPage(): Promise<BlogPage | null> {
  const { data } = await sanityFetch({ query: blogPageQuery })
  return data ?? null
}

// ─── Eigen Reisschema Page ───────────────────────────────────────────────────

export async function getEigenReisschemaPage(): Promise<EigenReisschemaPage | null> {
  const { data } = await sanityFetch({ query: eigenReisschemaPageQuery })
  return data ?? null
}

// ─── Blog Submission Page ────────────────────────────────────────────────────

export async function getBlogSubmissionPage(): Promise<BlogSubmissionPage | null> {
  const { data } = await sanityFetch({ query: blogSubmissionPageQuery })
  return data ?? null
}

// ─── Booking Page ────────────────────────────────────────────────────────────

export async function getBookingPage(): Promise<BookingPage | null> {
  const { data } = await sanityFetch({ query: bookingPageQuery })
  return data ?? null
}
