import type { Metadata } from 'next'
import { hasLocale, type Locale } from '@/i18n/config'
import { localePath } from '@/i18n/routes'
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
  const [settings, destinationListingPage] = await Promise.all([
    getSiteSettings(lang),
    getDestinationListingPage(lang),
  ])
  return buildMetadata(
    {
      title: destinationListingPage?.heroTitle,
      description: destinationListingPage?.heroSubtitle,
      canonical: localePath(locale, 'destinations'),
      locale,
      alternates: { nl: '/nl/bestemmingen', en: '/en/destinations' },
    },
    settings
  )
}

export default async function BestemmingListPage({ params }: Props) {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang as Locale : 'nl'

  const [destinations, destinationListingPage, settings] = await Promise.all([getDestinations(lang), getDestinationListingPage(lang), getSiteSettings(lang)])


  const baseUrl = getBaseUrl()
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: destinationListingPage?.heroTitle ?? '',
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
        title={destinationListingPage?.heroTitle}
        subtitle={destinationListingPage?.heroSubtitle}
        image={destinationListingPage?.heroImage ?? destinations[0]?.heroImage}
      />
      <section className="py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((d) => (
              <DestinationCard key={d._id} destination={d} locale={locale} labels={{
                tripSingularLabel: settings?.cardLabels?.tripSingularLabel,
                tripPluralLabel: settings?.cardLabels?.tripPluralLabel,
                availableLabel: settings?.cardLabels?.availableLabel,
              }} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
