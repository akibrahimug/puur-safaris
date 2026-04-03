import type { Metadata } from 'next'
import { getSiteSettings, getDestinations, getDestinationListingPage } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
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

  return (
    <>
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
