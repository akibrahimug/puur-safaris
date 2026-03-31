import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { siteSettings } from '@/data/site-settings'
import { tripDetails } from '@/data/trips'
import { buildMetadata, mergeWithSeoFields, getBaseUrl } from '@/lib/seo'
import { formatPrice, categoryLabel, difficultyLabel } from '@/lib/utils'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PortableTextRenderer } from '@/components/shared/portable-text-renderer'
import { SafariItinerary } from '@/components/safari/safari-itinerary'
import { ContactForm } from '@/components/shared/contact-form'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, Users, TrendingUp, CheckCircle2, XCircle } from 'lucide-react'

export const revalidate = 300

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return Object.keys(tripDetails).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const trip = tripDetails[slug]

  if (!trip) return {}

  return buildMetadata(
    mergeWithSeoFields(
      {
        title: trip.title,
        description: trip.excerpt,
        image: trip.heroImage,
        canonical: `/safari-reizen/${slug}`,
      },
      trip.seo
    ),
    siteSettings
  )
}

export default async function SafariDetailPage({ params }: Props) {
  const { slug } = await params
  const trip = tripDetails[slug]

  if (!trip) notFound()

  const baseUrl = getBaseUrl()
  const heroUrl = trip.heroImage?.asset?.url ?? null

  const tourSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: trip.title,
    description: trip.excerpt,
    url: `${baseUrl}/safari-reizen/${slug}`,
    ...(heroUrl && { image: heroUrl }),
    ...(trip.destination && {
      touristType: trip.category ? categoryLabel(trip.category) : undefined,
      itinerary: {
        '@type': 'ItemList',
        itemListElement: trip.itinerary?.map((day, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: day.title,
          description: day.description,
        })),
      },
    }),
    offers: {
      '@type': 'Offer',
      price: trip.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
    provider: {
      '@type': 'Organization',
      name: 'Puur Safaris',
      url: baseUrl,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tourSchema) }}
      />

      {/* Hero */}
      <div className="relative h-[50vh] min-h-[360px] bg-stone-900">
        {heroUrl && (
          <Image
            src={heroUrl}
            alt={trip.heroImage?.alt ?? trip.title}
            fill
            priority
            className="object-cover opacity-70"
            placeholder={trip.heroImage?.asset?.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={trip.heroImage?.asset?.metadata?.lqip}
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="container mx-auto max-w-7xl">
            <Breadcrumbs />
            <h1 className="font-serif text-4xl font-bold text-white sm:text-5xl drop-shadow">
              {trip.title}
            </h1>
            {trip.destination && (
              <div className="mt-2 flex items-center gap-1.5 text-white/80">
                <MapPin className="h-4 w-4" />
                <span>{trip.destination.name}, {trip.destination.country}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-xl bg-amber-50 p-4 text-center">
                <Clock className="h-5 w-5 text-amber-700 mx-auto mb-1" />
                <p className="text-xs text-stone-500 mb-0.5">Duur</p>
                <p className="font-semibold text-stone-900 text-sm">{trip.duration}</p>
              </div>
              {trip.difficulty && (
                <div className="rounded-xl bg-amber-50 p-4 text-center">
                  <TrendingUp className="h-5 w-5 text-amber-700 mx-auto mb-1" />
                  <p className="text-xs text-stone-500 mb-0.5">Niveau</p>
                  <p className="font-semibold text-stone-900 text-sm">
                    {difficultyLabel(trip.difficulty)}
                  </p>
                </div>
              )}
              {trip.minPersons && (
                <div className="rounded-xl bg-amber-50 p-4 text-center">
                  <Users className="h-5 w-5 text-amber-700 mx-auto mb-1" />
                  <p className="text-xs text-stone-500 mb-0.5">Groepsgrootte</p>
                  <p className="font-semibold text-stone-900 text-sm">
                    {trip.minPersons}
                    {trip.maxPersons && `–${trip.maxPersons}`} pers.
                  </p>
                </div>
              )}
              {trip.category && (
                <div className="rounded-xl bg-amber-50 p-4 text-center">
                  <MapPin className="h-5 w-5 text-amber-700 mx-auto mb-1" />
                  <p className="text-xs text-stone-500 mb-0.5">Type</p>
                  <p className="font-semibold text-stone-900 text-sm">
                    {categoryLabel(trip.category)}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            {trip.fullDescription && (
              <section>
                <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">Over deze reis</h2>
                <PortableTextRenderer value={trip.fullDescription as unknown[]} />
              </section>
            )}

            {/* Highlights */}
            {trip.highlights && trip.highlights.length > 0 && (
              <section>
                <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">Hoogtepunten</h2>
                <ul className="space-y-2">
                  {trip.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-stone-700">
                      <CheckCircle2 className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Itinerary */}
            {trip.itinerary && trip.itinerary.length > 0 && (
              <section>
                <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">Dag-tot-dag Reisschema</h2>
                <SafariItinerary itinerary={trip.itinerary} />
              </section>
            )}

            {/* Included / Excluded */}
            {((trip.included?.length ?? 0) > 0 || (trip.excluded?.length ?? 0) > 0) && (
              <section>
                <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">In- en uitbegrepen</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {trip.included && trip.included.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-green-700 mb-2">Inbegrepen</h3>
                      <ul className="space-y-1.5">
                        {trip.included.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {trip.excluded && trip.excluded.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-red-700 mb-2">Niet inbegrepen</h3>
                      <ul className="space-y-1.5">
                        {trip.excluded.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                            <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar: price + enquiry */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <span className="text-sm text-stone-500">Prijs vanaf</span>
                <p className="text-4xl font-bold text-amber-700">{formatPrice(trip.price)}</p>
                <span className="text-sm text-stone-400">
                  {trip.priceType === 'per_group' ? 'per groep' : 'per persoon'}
                </span>
              </div>

              <div className="space-y-2 mb-6">
                {trip.duration && (
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Duur</span>
                    <span className="font-medium text-stone-800">{trip.duration}</span>
                  </div>
                )}
                {trip.difficulty && (
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Niveau</span>
                    <Badge variant="secondary">{difficultyLabel(trip.difficulty)}</Badge>
                  </div>
                )}
              </div>

              <Button asChild size="lg" className="w-full mb-3">
                <a href="#offerte">Offerte aanvragen</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link href="/contact">Stel een vraag</Link>
              </Button>
            </div>
          </aside>
        </div>

        {/* Enquiry form */}
        <div id="offerte" className="mt-20 scroll-mt-24">
          <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">
            Vraag een offerte aan voor: {trip.title}
          </h2>
          <div className="max-w-2xl">
            <ContactForm prefilledSafari={trip.title} />
          </div>
        </div>
      </div>
    </>
  )
}
