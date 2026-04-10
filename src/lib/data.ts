/**
 * Data access layer — all content fetched from Sanity CMS via defineLive.
 * Every function accepts a `language` parameter (defaults to 'nl').
 */

import { sanityFetch } from '@/sanity/live'
import { defaultLocale, type Locale } from '@/i18n/config'
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
  blogPostPreviewQuery,
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

export async function getSiteSettings(language: string = defaultLocale): Promise<SiteSettings> {
  const { data } = await sanityFetch({ query: siteSettingsQuery, params: { language } })
  return data ?? { siteName: 'Puur Safaris' } as SiteSettings
}

// ─── Trips ────────────────────────────────────────────────────────────────────

export async function getTrips(language: string = defaultLocale): Promise<TripCard[]> {
  const { data } = await sanityFetch({ query: tripListQuery, params: { language } })
  return data ?? []
}

export async function getTripDetail(slug: string, language: string = defaultLocale): Promise<TripDetail | null> {
  const { data } = await sanityFetch({ query: tripDetailQuery, params: { slug, language } })
  return data ?? null
}

export async function getTripSlugs(language: string = defaultLocale): Promise<string[]> {
  const { data } = await sanityFetch({ query: tripSlugsQuery, params: { language }, perspective: 'published', stega: false })
  return data?.map((d: { slug: string }) => d.slug) ?? []
}

// ─── Destinations ─────────────────────────────────────────────────────────────

export async function getDestinations(language: string = defaultLocale): Promise<DestinationCard[]> {
  const { data } = await sanityFetch({ query: destinationListQuery, params: { language } })
  return data ?? []
}

export async function getDestinationDetail(slug: string, language: string = defaultLocale): Promise<DestinationDetail | null> {
  const { data } = await sanityFetch({ query: destinationDetailQuery, params: { slug, language } })
  return data ?? null
}

export async function getDestinationSlugs(language: string = defaultLocale): Promise<string[]> {
  const { data } = await sanityFetch({ query: destinationSlugsQuery, params: { language }, perspective: 'published', stega: false })
  return data?.map((d: { slug: string }) => d.slug) ?? []
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export async function getBlogPosts(language: string = defaultLocale): Promise<BlogPostCard[]> {
  const { data } = await sanityFetch({ query: blogListQuery, params: { language } })
  return data ?? []
}

export async function getBlogPostDetail(slug: string, language: string = defaultLocale): Promise<BlogPostDetail | null> {
  const { data } = await sanityFetch({ query: blogPostDetailQuery, params: { slug, language } })
  return data ?? null
}

export async function getBlogPostPreview(slug: string): Promise<(BlogPostDetail & { status?: string; submitterEmail?: string }) | null> {
  const { data } = await sanityFetch({ query: blogPostPreviewQuery, params: { slug } })
  return data ?? null
}

export async function getBlogPostSlugs(language: string = defaultLocale): Promise<string[]> {
  const { data } = await sanityFetch({ query: blogPostSlugsQuery, params: { language }, perspective: 'published', stega: false })
  return data?.map((d: { slug: string }) => d.slug) ?? []
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export async function getFaqItems(language: string = defaultLocale): Promise<FaqItem[]> {
  const { data } = await sanityFetch({ query: faqQuery, params: { language } })
  return data ?? []
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export async function getTestimonials(language: string = defaultLocale): Promise<Testimonial[]> {
  const { data } = await sanityFetch({ query: testimonialListQuery, params: { language } })
  return data ?? []
}

// ─── Homepage ─────────────────────────────────────────────────────────────────

export async function getHomePage(language: string = defaultLocale): Promise<HomePage | null> {
  const { data } = await sanityFetch({ query: homePageQuery, params: { language } })
  return data ?? null
}

// ─── About Page ───────────────────────────────────────────────────────────────

export async function getAboutPage(language: string = defaultLocale): Promise<AboutPage | null> {
  const { data } = await sanityFetch({ query: aboutPageQuery, params: { language } })
  return data ?? null
}

// ─── Contact Page ────────────────────────────────────────────────────────────

export async function getContactPage(language: string = defaultLocale): Promise<ContactPage | null> {
  const { data } = await sanityFetch({ query: contactPageQuery, params: { language } })
  return data ?? null
}

// ─── Safari Listing Page ─────────────────────────────────────────────────────

export async function getSafariListingPage(language: string = defaultLocale): Promise<SimpleHeroPage | null> {
  const { data } = await sanityFetch({ query: safariListingPageQuery, params: { language } })
  return data ?? null
}

// ─── Destination Listing Page ────────────────────────────────────────────────

export async function getDestinationListingPage(language: string = defaultLocale): Promise<SimpleHeroPage | null> {
  const { data } = await sanityFetch({ query: destinationListingPageQuery, params: { language } })
  return data ?? null
}

// ─── FAQ Page ────────────────────────────────────────────────────────────────

export async function getFaqPage(language: string = defaultLocale): Promise<FaqPage | null> {
  const { data } = await sanityFetch({ query: faqPageQuery, params: { language } })
  return data ?? null
}

// ─── Blog Page ───────────────────────────────────────────────────────────────

export async function getBlogPage(language: string = defaultLocale): Promise<BlogPage | null> {
  const { data } = await sanityFetch({ query: blogPageQuery, params: { language } })
  return data ?? null
}

// ─── Eigen Reisschema Page ───────────────────────────────────────────────────

export async function getEigenReisschemaPage(language: string = defaultLocale): Promise<EigenReisschemaPage | null> {
  const { data } = await sanityFetch({ query: eigenReisschemaPageQuery, params: { language } })
  return data ?? null
}

// ─── Blog Submission Page ────────────────────────────────────────────────────

export async function getBlogSubmissionPage(language: string = defaultLocale): Promise<BlogSubmissionPage | null> {
  const { data } = await sanityFetch({ query: blogSubmissionPageQuery, params: { language } })
  return data ?? null
}

// ─── Booking Page ────────────────────────────────────────────────────────────

export async function getBookingPage(language: string = defaultLocale): Promise<BookingPage | null> {
  const { data } = await sanityFetch({ query: bookingPageQuery, params: { language } })
  return data ?? null
}
