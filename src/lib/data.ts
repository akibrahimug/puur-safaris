/**
 * Data access layer — all content fetched from Sanity CMS.
 *
 * Each translatable doc type has parallel NL/EN siblings via the
 * @sanity/document-internationalization plugin. Queries take a `$lang`
 * parameter and filter on `language == $lang`.
 *
 * Resolution order for a fetch with `language === "en"`:
 *   1. Fetch the EN-tagged sibling. If it exists, return it as-is.
 *   2. Fall back to NL and run `maybeTranslate` so untranslated docs
 *      still render cleanly in EN. Editors can replace the auto-translated
 *      content by creating an EN sibling and publishing it.
 *
 * For `language === "nl"` (the source of truth), only step 1 is used.
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
  googleReviewsFeaturedQuery,
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

/**
 * Fetch a single doc filtered by language. If nothing comes back AND the
 * caller asked for a non-NL locale, fall back to the NL sibling and run it
 * through `maybeTranslate` so the page still renders.
 */
async function fetchAndTranslate<T>(
  query: string,
  docType: string,
  language: string,
  params?: Record<string, unknown>,
): Promise<T | null> {
  const { data } = await sanityFetch({ query, params: { ...params, lang: language } })
  if (data) {
    return data as T
  }
  if (language !== defaultLocale) {
    const { data: nlData } = await sanityFetch({ query, params: { ...params, lang: defaultLocale } })
    if (!nlData) return null
    const translated = await maybeTranslate(nlData as Record<string, unknown>, docType, language)
    return translated as T | null
  }
  return null
}

/**
 * Same idea for arrays. Empty list in the requested language → fall back
 * to NL and translate each item.
 */
async function fetchArrayAndTranslate<T>(
  query: string,
  docType: string,
  language: string,
  params?: Record<string, unknown>,
): Promise<T[]> {
  const { data } = await sanityFetch({ query, params: { ...params, lang: language } })
  const items = (data ?? []) as Record<string, unknown>[]
  if (items.length > 0) {
    return items as T[]
  }
  if (language !== defaultLocale) {
    const { data: nlData } = await sanityFetch({ query, params: { ...params, lang: defaultLocale } })
    const nlItems = (nlData ?? []) as Record<string, unknown>[]
    if (nlItems.length === 0) return []
    const translated = await maybeTranslateArray(nlItems, docType, language)
    return translated as T[]
  }
  return []
}

/** Dedupe a list of {slug} objects across languages — same trip in NL and EN
 * shares a slug, but generateStaticParams should produce one entry per slug. */
function uniqueSlugs(rows: { slug?: string | null }[] | null | undefined): string[] {
  const seen = new Set<string>()
  for (const row of rows ?? []) {
    if (row?.slug) seen.add(row.slug)
  }
  return Array.from(seen)
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
  return uniqueSlugs(data)
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
  return uniqueSlugs(data)
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
  return uniqueSlugs(data)
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export async function getFaqItems(language: string = defaultLocale): Promise<FaqItem[]> {
  return fetchArrayAndTranslate(faqQuery, 'faqItem', language)
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
// Source-language artefacts (the traveller's own words). Not language-filtered.

export async function getTestimonials(language: string = defaultLocale): Promise<Testimonial[]> {
  const { data } = await sanityFetch({ query: testimonialListQuery, params: { lang: language } })
  return (data ?? []) as Testimonial[]
}

// ─── Google Reviews ───────────────────────────────────────────────────────────

interface GoogleReviewDoc {
  _id: string
  authorName?: string
  country?: string | null
  rating?: number
  reviewText?: string
  reviewDate?: string
  sourceUrl?: string | null
  authorPhoto?: Testimonial['profilePhoto'] | null
}

export async function getGoogleReviews(language: string = defaultLocale): Promise<Testimonial[]> {
  const { data } = await sanityFetch({ query: googleReviewsFeaturedQuery, params: { lang: language } })
  const docs = (data ?? []) as GoogleReviewDoc[]
  return docs.map((doc) => ({
    _id: doc._id,
    name: doc.authorName ?? '',
    country: doc.country ?? undefined,
    rating: doc.rating ?? 5,
    quote: doc.reviewText ?? '',
    date: doc.reviewDate ?? undefined,
    profilePhoto: doc.authorPhoto ?? undefined,
    bookedTrip: undefined,
    source: 'google' as const,
  }))
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
