import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { stegaClean } from '@sanity/client/stega'
import { locales, hasLocale, type Locale } from '@/i18n/config'
import { getSiteSettings } from '@/lib/data'
import { buildMetadata, organizationJsonLd, websiteJsonLd, getBaseUrl } from '@/lib/seo'

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}

  const settings = await getSiteSettings(lang as Locale)
  const baseUrl = getBaseUrl()

  return {
    ...buildMetadata(
      {
        title: settings.defaultSeoTitle ?? settings.siteName,
        description: settings.defaultSeoDescription,
      },
      settings,
    ),
    metadataBase: new URL(baseUrl),
    applicationName: stegaClean(settings.siteName),
    // NOTE: do NOT set `icons` from the Sanity logo's raw asset URL. The logo
    // is a large, non-square JPG (the original upload) — using it as a favicon
    // shadows the proper `src/app/favicon.ico` and renders blurry in the tab.
    // Next.js serves the static multi-size favicon.ico automatically. If a
    // CMS-driven favicon is ever wanted, generate a square optimised icon with
    // `sanityImageUrl(settings.logo, 256)`, not `settings.logo.asset.url`.
    keywords: ['safari', 'Uganda safaris', 'gorilla trekking', 'wildlife safari', 'Africa travel', 'safari tours'],
    authors: [{ name: stegaClean(settings.siteName) }],
    creator: stegaClean(settings.siteName),
    publisher: stegaClean(settings.siteName),
    formatDetection: { email: false, telephone: false },
  }
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const locale = lang as Locale
  const settings = await getSiteSettings(locale)
  const orgSchema = organizationJsonLd(settings)
  const webSchema = websiteJsonLd(settings, locale)

  return (
    <>
      <meta httpEquiv="content-language" content={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSchema) }}
      />
      {children}
    </>
  )
}
