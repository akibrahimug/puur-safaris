import type { Metadata } from 'next'
import { hasLocale, type Locale, cmsText } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getSiteSettings, getTrips, getSafariListingPage } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { stegaClean } from '@sanity/client/stega'
import { PageHero } from '@/components/shared/page-hero'
import { SafariGrid } from '@/components/safari/safari-grid'

interface Props {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang as Locale : 'nl'
  const dict = await getDictionary(locale)
  const settings = await getSiteSettings(lang)
  return buildMetadata(
    {
      title: dict.safari.heroTitle,
      description: dict.safari.heroSubtitle,
      canonical: `/${lang}/safari-reizen`,
      locale,
      alternates: { nl: '/nl/safari-reizen', en: '/en/safaris' },
    },
    settings
  )
}

export default async function SafariReizenPage({ params }: Props) {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang as Locale : 'nl'
  const dict = await getDictionary(locale)

  const [trips, safariListingPage] = await Promise.all([getTrips(lang), getSafariListingPage(lang)])

  const cms = <T,>(v: T | null | undefined) => cmsText(v, (safariListingPage as any)?.language, locale)

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: dict.safari.heroTitle,
    numberOfItems: trips.length,
    itemListElement: trips.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: stegaClean(t.title),
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${lang}/safari-reizen/${stegaClean(t.slug)}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <PageHero
        title={cms(safariListingPage?.heroTitle) ?? dict.safari.heroTitle}
        subtitle={cms(safariListingPage?.heroSubtitle) ?? dict.safari.heroSubtitle}
        image={safariListingPage?.heroImage ?? trips[1]?.heroImage}
      />
      <section className="section-page py-16">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <SafariGrid trips={trips} locale={locale} emptyMessage={dict.cards.noSafarisFound} labels={{
            featuredBadge: dict.cards.featuredBadge,
            priceFromLabel: dict.cards.priceFrom,
            pricePerGroup: dict.cards.pricePerGroup,
            pricePerPerson: dict.cards.pricePerPerson,
            viewLabel: dict.cards.viewLabel,
          }} />
        </div>
      </section>
    </>
  )
}
