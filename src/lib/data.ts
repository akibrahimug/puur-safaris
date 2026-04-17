/**
 * Data access layer — all content fetched from Sanity CMS.
 *
 * NL is the single source of truth. All queries fetch NL content.
 * For other locales, content is auto-translated via Google Translate
 * with file-based caching (only re-translates when the NL source changes).
 */

import { sanityFetch } from '@/sanity/live'
import { defaultLocale } from '@/i18n/config'
import { maybeTranslate, maybeTranslateArray } from '@/lib/translation'
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
  legalPageQuery,
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
  LegalPage,
  BookingPage,
} from './types'

// Helper: fetch NL, optionally translate
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchAndTranslate<T>(
  query: string,
  docType: string,
  language: string,
  params?: Record<string, unknown>,
): Promise<T | null> {
  const { data } = await sanityFetch({ query, params })
  if (!data) return null
  if (language === defaultLocale) return data as T
  const translated = await maybeTranslate(data as Record<string, unknown>, docType, language)
  return translated as T | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchArrayAndTranslate<T>(
  query: string,
  docType: string,
  language: string,
  params?: Record<string, unknown>,
): Promise<T[]> {
  const { data } = await sanityFetch({ query, params })
  const items = (data ?? []) as Record<string, unknown>[]
  if (language === defaultLocale) return items as T[]
  const translated = await maybeTranslateArray(items, docType, language)
  return translated as T[]
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export async function getSiteSettings(language: string = defaultLocale): Promise<SiteSettings> {
  const result = await fetchAndTranslate<SiteSettings & Record<string, unknown>>(
    siteSettingsQuery, 'siteSettings', language,
  )
  return result ?? { siteName: 'Puur Uganda Reizen' } as SiteSettings
}

// ─── Trips ────────────────────────────────────────────────────────────────────

export async function getTrips(language: string = defaultLocale): Promise<TripCard[]> {
  return fetchArrayAndTranslate(tripListQuery, 'trip', language)
}

export async function getTripDetail(slug: string, language: string = defaultLocale): Promise<TripDetail | null> {
  return fetchAndTranslate(tripDetailQuery, 'trip', language, { slug })
}

export async function getTripSlugs(): Promise<string[]> {
  const { data } = await sanityFetch({ query: tripSlugsQuery, perspective: 'published', stega: false })
  return data?.map((d: { slug: string }) => d.slug) ?? []
}

// ─── Destinations ─────────────────────────────────────────────────────────────

export async function getDestinations(language: string = defaultLocale): Promise<DestinationCard[]> {
  return fetchArrayAndTranslate(destinationListQuery, 'destination', language)
}

export async function getDestinationDetail(slug: string, language: string = defaultLocale): Promise<DestinationDetail | null> {
  return fetchAndTranslate(destinationDetailQuery, 'destination', language, { slug })
}

export async function getDestinationSlugs(): Promise<string[]> {
  const { data } = await sanityFetch({ query: destinationSlugsQuery, perspective: 'published', stega: false })
  return data?.map((d: { slug: string }) => d.slug) ?? []
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export async function getBlogPosts(language: string = defaultLocale): Promise<BlogPostCard[]> {
  return fetchArrayAndTranslate(blogListQuery, 'blogPost', language)
}

export async function getBlogPostDetail(slug: string, language: string = defaultLocale): Promise<BlogPostDetail | null> {
  return fetchAndTranslate(blogPostDetailQuery, 'blogPost', language, { slug })
}

export async function getBlogPostPreview(slug: string): Promise<(BlogPostDetail & { status?: string; submitterEmail?: string }) | null> {
  const { data } = await sanityFetch({ query: blogPostPreviewQuery, params: { slug } })
  return data ?? null
}

export async function getBlogPostSlugs(): Promise<string[]> {
  const { data } = await sanityFetch({ query: blogPostSlugsQuery, perspective: 'published', stega: false })
  return data?.map((d: { slug: string }) => d.slug) ?? []
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export async function getFaqItems(language: string = defaultLocale): Promise<FaqItem[]> {
  return fetchArrayAndTranslate(faqQuery, 'faqItem', language)
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export async function getTestimonials(language: string = defaultLocale): Promise<Testimonial[]> {
  return fetchArrayAndTranslate(testimonialListQuery, 'testimonial', language)
}

// ─── Homepage ─────────────────────────────────────────────────────────────────

export async function getHomePage(language: string = defaultLocale): Promise<HomePage | null> {
  return fetchAndTranslate(homePageQuery, 'homePage', language)
}

// ─── About Page ───────────────────────────────────────────────────────────────

export async function getAboutPage(language: string = defaultLocale): Promise<AboutPage | null> {
  return fetchAndTranslate(aboutPageQuery, 'aboutPage', language)
}

// ─── Contact Page ────────────────────────────────────────────────────────────

export async function getContactPage(language: string = defaultLocale): Promise<ContactPage | null> {
  return fetchAndTranslate(contactPageQuery, 'contactPage', language)
}

// ─── Safari Listing Page ─────────────────────────────────────────────────────

export async function getSafariListingPage(language: string = defaultLocale): Promise<SimpleHeroPage | null> {
  return fetchAndTranslate(safariListingPageQuery, 'safariListingPage', language)
}

// ─── Destination Listing Page ────────────────────────────────────────────────

export async function getDestinationListingPage(language: string = defaultLocale): Promise<SimpleHeroPage | null> {
  return fetchAndTranslate(destinationListingPageQuery, 'destinationListingPage', language)
}

// ─── FAQ Page ────────────────────────────────────────────────────────────────

export async function getFaqPage(language: string = defaultLocale): Promise<FaqPage | null> {
  return fetchAndTranslate(faqPageQuery, 'faqPage', language)
}

// ─── Blog Page ───────────────────────────────────────────────────────────────

export async function getBlogPage(language: string = defaultLocale): Promise<BlogPage | null> {
  return fetchAndTranslate(blogPageQuery, 'blogPage', language)
}

// ─── Eigen Reisschema Page ───────────────────────────────────────────────────

export async function getEigenReisschemaPage(language: string = defaultLocale): Promise<EigenReisschemaPage | null> {
  return fetchAndTranslate(eigenReisschemaPageQuery, 'eigenReisschemaPage', language)
}

// ─── Blog Submission Page ────────────────────────────────────────────────────

export async function getBlogSubmissionPage(language: string = defaultLocale): Promise<BlogSubmissionPage | null> {
  return fetchAndTranslate(blogSubmissionPageQuery, 'blogSubmissionPage', language)
}

// ─── Legal Page ─────────────────────────────────────────────────────────────

export async function getLegalPage(slugs: string[], language: string = defaultLocale): Promise<LegalPage | null> {
  return fetchAndTranslate<LegalPage>(legalPageQuery, 'legalPage', language, { slugs })
}

// ─── Booking Page ────────────────────────────────────────────────────────────

export async function getBookingPage(language: string = defaultLocale): Promise<BookingPage | null> {
  return fetchAndTranslate(bookingPageQuery, 'bookingPage', language)
}
