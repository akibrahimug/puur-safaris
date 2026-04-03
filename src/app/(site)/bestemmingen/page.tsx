import type { Metadata } from 'next'
import { getSiteSettings, getDestinations, getDestinationListingPage } from '@/lib/data'
import { buildMetadata, getBaseUrl } from '@/lib/seo'
import { PageHero } from '@/components/shared/page-hero'
import { DestinationCard } from '@/components/destination/destination-card'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata(
    {
      title: 'Bestemmingen',
      description: 'Ontdek onze safari bestemmingen in Afrika en Azië. Van de savanne van Kenya tot de bergen van Tanzania.',
      canonical: '/bestemmingen',
    },
    settings
  )
}

export default async function BestemmingListPage() {
  const [destinations, destinationListingPage] = await Promise.all([getDestinations(), getDestinationListingPage()])

  const baseUrl = getBaseUrl()
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Bestemmingen',
    numberOfItems: destinations.length,
    itemListElement: destinations.map((d, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: d.name,
      url: `${baseUrl}/bestemmingen/${d.slug}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <PageHero
        title={destinationListingPage?.heroTitle ?? 'Bestemmingen'}
        subtitle={destinationListingPage?.heroSubtitle ?? 'Elk land een uniek avontuur. Kies uw volgende bestemming.'}
        image={destinations[0]?.heroImage}
      />
      <section className="py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((d) => (
              <DestinationCard key={d._id} destination={d} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
