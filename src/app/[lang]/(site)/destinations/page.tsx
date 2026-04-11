import type { Metadata } from 'next'
import { hasLocale, type Locale, cmsText } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getSiteSettings, getDestinations, getDestinationListingPage } from '@/lib/data'
import { buildMetadata, getBaseUrl } from '@/lib/seo'
import { PageHero } from '@/components/shared/page-hero'
import { DestinationCard } from '@/components/destination/destination-card'

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
      title: dict.destinations.heroTitle,
      description: dict.destinations.heroSubtitle,
      canonical: `/${lang}/destinations`,
      locale,
      alternates: { nl: '/nl/bestemmingen', en: '/en/destinations' },
    },
    settings
  )
}

export default async function BestemmingListPage({ params }: Props) {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang as Locale : 'nl'
  const dict = await getDictionary(locale)

  const [destinations, destinationListingPage, settings] = await Promise.all([getDestinations(lang), getDestinationListingPage(lang), getSiteSettings(lang)])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cms = <T,>(v: T | null | undefined) => cmsText(v, (destinationListingPage as any)?.language, locale)

  const baseUrl = getBaseUrl()
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: dict.destinations.heroTitle,
    numberOfItems: destinations.length,
    itemListElement: destinations.map((d, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: d.name,
      url: `${baseUrl}/${lang}/destinations/${d.slug}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <PageHero
        title={cms(destinationListingPage?.heroTitle) ?? dict.destinations.heroTitle}
        subtitle={cms(destinationListingPage?.heroSubtitle) ?? dict.destinations.heroSubtitle}
        image={destinationListingPage?.heroImage ?? destinations[0]?.heroImage}
      />
      <section className="py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((d) => (
              <DestinationCard key={d._id} destination={d} locale={locale} labels={{
                tripSingularLabel: settings?.cardLabels?.tripSingularLabel ?? dict.cards.tripSingular,
                tripPluralLabel: settings?.cardLabels?.tripPluralLabel ?? dict.cards.tripPlural,
                availableLabel: settings?.cardLabels?.availableLabel ?? dict.cards.available,
              }} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
