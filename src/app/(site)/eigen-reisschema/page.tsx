import type { Metadata } from 'next'
import { getDestinations, getTrips, getEigenReisschemaPage } from '@/lib/data'
import { PageHero } from '@/components/shared/page-hero'
import { TripBuilder } from '@/components/trip-builder/trip-builder'

export const metadata: Metadata = {
  title: 'Eigen Reisschema — Puur Safaris',
  description: 'Stel je eigen droomsafari samen. Kies bestemmingen, reisduur, reisstijl en laat ons een gepersonaliseerd reisschema voor je maken.',
}

export default async function EigenReisschemaPage() {
  const [destinations, trips, eigenReisschemaPage] = await Promise.all([getDestinations(), getTrips(), getEigenReisschemaPage()])

  return (
    <>
      <PageHero
        title={eigenReisschemaPage?.heroTitle ?? 'Eigen Reisschema'}
        subtitle={eigenReisschemaPage?.heroSubtitle ?? 'Stel je droomsafari samen. Wij verwerken je wensen en maken een volledig gepersonaliseerd reisschema voor je.'}
        eyebrow={eigenReisschemaPage?.heroEyebrow ?? 'Op maat gemaakt'}
        image={trips[0]?.heroImage}
      />
      <section className="py-16 section-page">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <TripBuilder destinations={destinations} />
        </div>
      </section>
    </>
  )
}
