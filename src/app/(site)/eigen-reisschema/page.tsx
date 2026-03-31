import type { Metadata } from 'next'
import { destinations } from '@/data/destinations'
import { PageHero } from '@/components/shared/page-hero'
import { TripBuilder } from '@/components/trip-builder/trip-builder'

export const metadata: Metadata = {
  title: 'Eigen Reisschema — Puur Safaris',
  description: 'Stel je eigen droomsafari samen. Kies bestemmingen, reisduur, reisstijl en laat ons een gepersonaliseerd reisschema voor je maken.',
}

export default function EigenReisschemaPage() {
  return (
    <>
      <PageHero
        title="Eigen Reisschema"
        subtitle="Stel je droomsafari samen. Wij verwerken je wensen en maken een volledig gepersonaliseerd reisschema voor je."
        eyebrow="Op maat gemaakt"
      />
      <section className="py-16 section-page">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <TripBuilder destinations={destinations} />
        </div>
      </section>
    </>
  )
}
