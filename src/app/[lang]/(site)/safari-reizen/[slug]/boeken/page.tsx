import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getTripDetail, getBookingPage, getSiteSettings } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { PageHero } from '@/components/shared/page-hero'
import { BookingForm } from '@/components/booking/booking-form'

interface Props {
  params: Promise<{ lang: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lang } = await params
  const locale = hasLocale(lang) ? lang as Locale : 'nl'
  const dict = await getDictionary(locale)
  const [trip, settings] = await Promise.all([getTripDetail(slug, lang), getSiteSettings(lang)])
  if (!trip) return {}
  return buildMetadata(
    {
      title: `${dict.booking.heroEyebrow}: ${trip.title}`,
      description: dict.booking.heroSubtitle,
      canonical: `/${lang}/safari-reizen/${slug}/boeken`,
      locale,
    },
    settings,
  )
}

export default async function BookingPage({ params }: Props) {
  const { slug, lang } = await params
  const locale = hasLocale(lang) ? lang as Locale : 'nl'
  const dict = await getDictionary(locale)

  const [trip, bookingPage] = await Promise.all([getTripDetail(slug, lang), getBookingPage(lang)])
  if (!trip) notFound()

  return (
    <>
      <PageHero
        title={`${dict.booking.heroEyebrow}: ${trip.title}`}
        subtitle={bookingPage?.heroSubtitle ?? dict.booking.heroSubtitle}
        eyebrow={bookingPage?.heroEyebrow ?? dict.booking.heroEyebrow}
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
