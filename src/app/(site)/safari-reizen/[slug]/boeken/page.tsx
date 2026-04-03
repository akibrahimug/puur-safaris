import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTripDetail, getBookingPage } from '@/lib/data'
import { PageHero } from '@/components/shared/page-hero'
import { BookingForm } from '@/components/booking/booking-form'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const trip = await getTripDetail(slug)
  if (!trip) return {}
  return {
    title: `Boek ${trip.title} — Puur Safaris`,
    description: `Boek uw safari reis ${trip.title} bij Puur Safaris.`,
  }
}

export default async function BookingPage({ params }: Props) {
  const { slug } = await params
  const [trip, bookingPage] = await Promise.all([getTripDetail(slug), getBookingPage()])
  if (!trip) notFound()

  return (
    <>
      <PageHero
        title={`Boek: ${trip.title}`}
        subtitle={bookingPage?.heroSubtitle ?? 'Vul uw gegevens in en wij bevestigen uw boeking binnen 2 werkdagen.'}
        eyebrow={bookingPage?.heroEyebrow ?? 'Boeking'}
        image={trip.heroImage}
      />
      <section className="py-16 section-page">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <BookingForm
            tripTitle={trip.title}
            tripSlug={slug}
            tripPrice={trip.price}
            tripPriceType={trip.priceType}
            tripDuration={trip.duration}
            tripDestination={trip.destination ?? null}
          />
        </div>
      </section>
    </>
  )
}
