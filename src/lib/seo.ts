import type { Metadata } from 'next'
import { stegaClean } from '@sanity/client/stega'
import type { SanityImage, SeoFields, SiteSettings } from './types'

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'http://localhost:3000'
}

export function toAbsoluteUrl(path: string): string {
  return `${getBaseUrl()}${path}`
}

interface BuildMetadataOptions {
  title: string
  description?: string
  image?: SanityImage
  canonical?: string
  noIndex?: boolean
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
}

export function buildMetadata(
  options: BuildMetadataOptions,
  settings?: SiteSettings | null
): Metadata {
  const {
    title,
    description,
    image,
    canonical,
    noIndex = false,
    type = 'website',
    publishedTime,
    modifiedTime,
  } = options

  const siteName = stegaClean(settings?.siteName ?? 'Puur Safaris')
  const cleanTitle = stegaClean(title)
  const fullTitle = cleanTitle === siteName ? siteName : `${cleanTitle} | ${siteName}`
  const metaDescription = stegaClean(
    description ?? settings?.defaultSeoDescription ?? 'Ontdek authentieke safari ervaringen op maat.'
  )

  const ogImage = image ?? settings?.defaultOgImage
  const ogImageUrl = ogImage?.asset?.url ?? undefined

  const baseUrl = getBaseUrl()

  return {
    title: fullTitle,
    description: metaDescription,
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    alternates: {
      canonical: canonical ? `${baseUrl}${canonical}` : undefined,
    },
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      siteName,
      locale: 'nl_NL',
      type,
      ...(type === 'article' && { publishedTime, modifiedTime }),
      ...(ogImageUrl && {
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: metaDescription,
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
  }
}

export function mergeWithSeoFields(
  base: BuildMetadataOptions,
  seo?: SeoFields
): BuildMetadataOptions {
  return {
    ...base,
    title: seo?.title ?? base.title,
    description: seo?.description ?? base.description,
    image: seo?.ogImage ?? base.image,
    noIndex: seo?.noIndex ?? base.noIndex,
  }
}

// ─── JSON-LD HELPERS ──────────────────────────────────────────────────────────

export function organizationJsonLd(settings?: SiteSettings | null) {
  const baseUrl = getBaseUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: stegaClean(settings?.siteName ?? 'Puur Safaris'),
    url: baseUrl,
    ...(settings?.contactEmail && { email: stegaClean(settings.contactEmail) }),
    ...(settings?.phone && { telephone: stegaClean(settings.phone) }),
    ...(settings?.address && { address: stegaClean(settings.address) }),
    ...(settings?.socialMedia?.instagram && {
      sameAs: [
        stegaClean(settings.socialMedia.instagram),
        stegaClean(settings.socialMedia.facebook),
        stegaClean(settings.socialMedia.youtube),
      ].filter(Boolean),
    }),
  }
}

export function websiteJsonLd(settings?: SiteSettings | null) {
  const baseUrl = getBaseUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: stegaClean(settings?.siteName ?? 'Puur Safaris'),
    url: baseUrl,
    inLanguage: 'nl',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/safari-reizen?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}
