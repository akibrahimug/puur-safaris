import type { Metadata } from 'next'
import { hasLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getDestinations, getTrips, getEigenReisschemaPage, getSiteSettings } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { PageHero } from '@/components/shared/page-hero'
import { TripBuilder } from '@/components/trip-builder/trip-builder'

interface Props {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang as Locale : 'nl'
  const [settings, eigenReisschemaPage] = await Promise.all([
    getSiteSettings(lang),
    getEigenReisschemaPage(lang),
  ])
  return buildMetadata(
    {
      title: eigenReisschemaPage?.heroTitle,
      description: eigenReisschemaPage?.heroSubtitle,
      canonical: `/${lang}/custom-itinerary`,
      locale,
      alternates: { nl: '/nl/eigen-reisschema', en: '/en/custom-itinerary' },
    },
    settings
  )
}

export default async function EigenReisschemaPage({ params }: Props) {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang as Locale : 'nl'
  const dict = await getDictionary(locale)

  const [destinations, trips, eigenReisschemaPage] = await Promise.all([getDestinations(lang), getTrips(lang), getEigenReisschemaPage(lang)])


  return (
    <>
      <PageHero
        title={eigenReisschemaPage?.heroTitle}
        subtitle={eigenReisschemaPage?.heroSubtitle}
        eyebrow={eigenReisschemaPage?.heroEyebrow}
        image={eigenReisschemaPage?.heroImage ?? trips[0]?.heroImage}
      />
      <section className="py-16 section-page">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <TripBuilder destinations={destinations} dict={dict} />
        </div>
      </section>
    </>
  )
}
