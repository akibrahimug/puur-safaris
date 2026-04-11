import type { Metadata } from 'next'
import { stegaClean } from '@sanity/client/stega'
import { ogLocales, type Locale, defaultLocale, locales } from '@/i18n/config'
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
  locale?: Locale
  /** Alternate paths per locale for hreflang (e.g., { nl: '/nl/blog', en: '/en/blog' }) */
  alternates?: Partial<Record<Locale, string>>
}

/**
 * Build Next.js Metadata. SEO is auto-generated from the page's title, description,
 * and hero image — content editors never need to fill in SEO fields manually.
 */
export function buildMetadata(
  options: BuildMetadataOptions,
  settings?: SiteSettings | null,
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
    locale = defaultLocale,
    alternates: altPaths,
  } = options

  const siteName = stegaClean(settings?.siteName ?? 'Puur Safaris')
  const cleanTitle = stegaClean(title)
  const fullTitle = cleanTitle === siteName ? siteName : `${cleanTitle} | ${siteName}`
  const metaDescription = stegaClean(
    description ?? settings?.defaultSeoDescription ?? 'Discover authentic safari experiences tailored to you.',
  )

  const ogImage = image ?? settings?.defaultOgImage
  const ogImageUrl = ogImage?.asset?.url ? stegaClean(ogImage.asset.url) : undefined

  const baseUrl = getBaseUrl()

  // Build hreflang alternates
  const languages: Record<string, string> = {}
  if (altPaths) {
    for (const loc of locales) {
      if (altPaths[loc]) {
        languages[loc] = `${baseUrl}${altPaths[loc]}`
      }
    }
    // x-default points to the default locale version
    if (altPaths[defaultLocale]) {
      languages['x-default'] = `${baseUrl}${altPaths[defaultLocale]}`
    }
  }

  return {
    title: fullTitle,
    description: metaDescription,
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    alternates: {
      canonical: canonical ? `${baseUrl}${canonical}` : undefined,
      ...(Object.keys(languages).length > 0 && { languages }),
    },
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      siteName,
      locale: ogLocales[locale],
      type,
      ...(type === 'article' && { publishedTime, modifiedTime }),
      ...(ogImageUrl && {
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: cleanTitle }],
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

/**
 * Auto-generate page SEO from hero content.
 * Falls back to manual seo fields if they exist, but they're never required.
 */
export function autoSeo(
  hero: { title?: string; subtitle?: string; image?: SanityImage },
  seo?: SeoFields,
): Pick<BuildMetadataOptions, 'title' | 'description' | 'image' | 'noIndex'> {
  return {
    title: seo?.title ?? hero.title ?? '',
    description: seo?.description ?? hero.subtitle,
    image: seo?.ogImage ?? hero.image,
    noIndex: seo?.noIndex,
  }
}

/**
 * @deprecated Use autoSeo instead. Kept for backward compat during migration.
 */
export function mergeWithSeoFields(
  base: BuildMetadataOptions,
  seo?: SeoFields,
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

export interface BreadcrumbItem {
  name: string
  path: string
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  const baseUrl = getBaseUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${baseUrl}${item.path}`,
    })),
  }
}

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

export function websiteJsonLd(settings?: SiteSettings | null, locale: Locale = defaultLocale) {
  const baseUrl = getBaseUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: stegaClean(settings?.siteName ?? 'Puur Safaris'),
    url: baseUrl,
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/${locale}/safaris?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Blog post Article JSON-LD with all recommended fields for rich results.
 */
export function blogArticleJsonLd(post: {
  title: string
  summary: string
  author?: string
  publishedAt: string
  slug: string
  imageUrl?: string | null
  locale?: Locale
}) {
  const baseUrl = getBaseUrl()
  const locale = post.locale ?? defaultLocale
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: stegaClean(post.title),
    description: stegaClean(post.summary),
    datePublished: stegaClean(post.publishedAt),
    url: `${baseUrl}/${locale}/blog/${stegaClean(post.slug)}`,
    inLanguage: locale,
    ...(post.imageUrl && { image: stegaClean(post.imageUrl) }),
    ...(post.author && {
      author: { '@type': 'Person', name: stegaClean(post.author) },
    }),
    publisher: {
      '@type': 'Organization',
      name: 'Puur Safaris',
      url: baseUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/${locale}/blog/${stegaClean(post.slug)}`,
    },
  }
}

/**
 * Blog listing CollectionPage JSON-LD.
 */
export function blogCollectionJsonLd(
  posts: { title: string; slug: string }[],
  locale: Locale = defaultLocale,
) {
  const baseUrl = getBaseUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: locale === 'nl' ? 'Blog & Reisverhalen' : 'Blog & Travel Stories',
    url: `${baseUrl}/${locale}/blog`,
    inLanguage: locale,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: posts.length,
      itemListElement: posts.map((post, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: stegaClean(post.title),
        url: `${baseUrl}/${locale}/blog/${stegaClean(post.slug)}`,
      })),
    },
  }
}
