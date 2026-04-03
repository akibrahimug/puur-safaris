import type { Metadata } from 'next'
import { siteSettings } from '@/data/site-settings'
import { destinations } from '@/data/destinations'
import { trips } from '@/data/trips'
import { buildMetadata } from '@/lib/seo'
import { PageHero } from '@/components/shared/page-hero'
import { DestinationCard } from '@/components/destination/destination-card'

export const revalidate = 3600

export function generateMetadata(): Metadata {
  return buildMetadata(
    {
      title: 'Bestemmingen',
      description: 'Ontdek onze safari bestemmingen in Afrika en Azië. Van de savanne van Kenya tot de bergen van Tanzania.',
      canonical: '/bestemmingen',
    },
    siteSettings
  )
}

export default function BestemmingListPage() {
  return (
    <>
      <PageHero
        title="Bestemmingen"
        subtitle="Elk land een uniek avontuur. Kies uw volgende bestemming."
        image={trips[5]?.heroImage}
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
