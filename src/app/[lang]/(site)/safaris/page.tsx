import type { Metadata } from 'next'
import { hasLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getSiteSettings, getTrips, getSafariListingPage } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { stegaClean } from '@sanity/client/stega'
import { PageHero } from '@/components/shared/page-hero'
import { SafariFilterGrid } from '@/components/safari/safari-filter-grid'

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
      canonical: `/${lang}/safaris`,
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

  const [allTrips, safariListingPage, settings] = await Promise.all([getTrips(lang), getSafariListingPage(lang), getSiteSettings(lang)])

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: dict.safari.heroTitle,
    numberOfItems: allTrips.length,
    itemListElement: allTrips.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: stegaClean(t.title),
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${lang}/safaris/${stegaClean(t.slug)}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <PageHero
        title={safariListingPage?.heroTitle ?? dict.safari.heroTitle}
        subtitle={safariListingPage?.heroSubtitle ?? dict.safari.heroSubtitle}
        image={safariListingPage?.heroImage ?? allTrips[1]?.heroImage}
      />
      <section className="section-page py-16">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <SafariFilterGrid
            allTrips={allTrips}
            locale={locale}
            emptyMessage={dict.cards.noSafarisFound}
            viewAllLabel={dict.faq?.viewAll ?? 'Alles bekijken'}
            categoryLabels={dict.categories ?? {}}
            labels={{
              featuredBadge: settings?.cardLabels?.featuredBadge ?? dict.cards.featuredBadge,
              priceFromLabel: settings?.cardLabels?.priceFromLabel ?? dict.cards.priceFrom,
              pricePerGroup: settings?.cardLabels?.pricePerGroup ?? dict.cards.pricePerGroup,
              pricePerPerson: settings?.cardLabels?.pricePerPerson ?? dict.cards.pricePerPerson,
              viewLabel: settings?.cardLabels?.viewLabel ?? dict.cards.viewLabel,
            }}
          />
        </div>
      </section>
    </>
  )
}
