import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSiteSettings, getTripDetail, getTripSlugs } from '@/lib/data'
import { buildMetadata, mergeWithSeoFields, getBaseUrl, breadcrumbJsonLd } from '@/lib/seo'
import { formatPrice, categoryLabel, difficultyLabel } from '@/lib/utils'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PortableTextRenderer } from '@/components/shared/portable-text-renderer'
import { SafariItinerary } from '@/components/safari/safari-itinerary'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { stegaClean } from '@sanity/client/stega'
import { Clock, MapPin, Users, TrendingUp, CheckCircle2 } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getTripSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const settings = await getSiteSettings()
  const trip = await getTripDetail(slug)

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
    settings
  )
}

export default async function SafariDetailPage({ params }: Props) {
  const { slug } = await params
  const [trip, settings] = await Promise.all([getTripDetail(slug), getSiteSettings()])
  const labels = settings?.safariDetailLabels

  if (!trip) notFound()

  const baseUrl = getBaseUrl()
  const heroUrl = trip.heroImage?.asset?.url || null

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Safari Reizen', path: '/safari-reizen' },
    { name: stegaClean(trip.title)!, path: `/safari-reizen/${stegaClean(slug)}` },
  ])

  const tourSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: stegaClean(trip.title),
    description: stegaClean(trip.excerpt),
    url: `${baseUrl}/safari-reizen/${stegaClean(slug)}`,
    ...(heroUrl && { image: stegaClean(heroUrl) }),
    ...(trip.destination && {
      touristType: trip.category ? categoryLabel(stegaClean(trip.category)!) : undefined,
      itinerary: {
        '@type': 'ItemList',
        itemListElement: trip.itinerary?.map((day, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: stegaClean(day.title),
          description: stegaClean(day.description),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <div className="relative h-[50vh] min-h-[360px] bg-ink">
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
              <div className="rounded-xl bg-[rgba(42,125,88,0.07)] p-4 text-center">
                <Clock className="h-5 w-5 text-gold mx-auto mb-1" />
                <p className="text-xs text-[var(--text-muted)] mb-0.5">{labels?.durationLabel ?? 'Duur'}</p>
                <p className="font-semibold text-[var(--text-primary)] text-sm">{trip.duration}</p>
              </div>
              {trip.difficulty && (
                <div className="rounded-xl bg-[rgba(42,125,88,0.07)] p-4 text-center">
                  <TrendingUp className="h-5 w-5 text-gold mx-auto mb-1" />
                  <p className="text-xs text-[var(--text-muted)] mb-0.5">{labels?.levelLabel ?? 'Niveau'}</p>
                  <p className="font-semibold text-[var(--text-primary)] text-sm">
                    {difficultyLabel(trip.difficulty)}
                  </p>
                </div>
              )}
              {trip.minPersons && (
                <div className="rounded-xl bg-[rgba(42,125,88,0.07)] p-4 text-center">
                  <Users className="h-5 w-5 text-gold mx-auto mb-1" />
                  <p className="text-xs text-[var(--text-muted)] mb-0.5">{labels?.groupSizeLabel ?? 'Groepsgrootte'}</p>
                  <p className="font-semibold text-[var(--text-primary)] text-sm">
                    {trip.minPersons}
                    {trip.maxPersons && `–${trip.maxPersons}`} pers.
                  </p>
                </div>
              )}
              {trip.category && (
                <div className="rounded-xl bg-[rgba(42,125,88,0.07)] p-4 text-center">
                  <MapPin className="h-5 w-5 text-gold mx-auto mb-1" />
                  <p className="text-xs text-[var(--text-muted)] mb-0.5">{labels?.typeLabel ?? 'Type'}</p>
                  <p className="font-semibold text-[var(--text-primary)] text-sm">
                    {categoryLabel(trip.category)}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            {trip.fullDescription && (
              <section>
                <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)] mb-4">{labels?.aboutTripHeading ?? 'Over deze reis'}</h2>
                <PortableTextRenderer value={trip.fullDescription as unknown[]} />
              </section>
            )}

            {/* Highlights */}
            {trip.highlights && trip.highlights.length > 0 && (
              <section>
                <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)] mb-4">{labels?.highlightsHeading ?? 'Hoogtepunten'}</h2>
                <ul className="space-y-2">
                  {trip.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[var(--text-primary)]">
                      <CheckCircle2 className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Itinerary */}
            {trip.itinerary && trip.itinerary.length > 0 && (
              <section>
                <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)] mb-4">{labels?.itineraryHeading ?? 'Dag-tot-dag Reisschema'}</h2>
                <SafariItinerary itinerary={trip.itinerary} mealLabels={{ breakfast: labels?.breakfastLabel, lunch: labels?.lunchLabel, dinner: labels?.dinnerLabel }} />
              </section>
            )}

            {/* Included / Excluded */}
            {((trip.included?.length ?? 0) > 0 || (trip.excluded?.length ?? 0) > 0) && (
              <section>
                <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)] mb-4">{labels?.includedExcludedHeading ?? 'In- en uitbegrepen'}</h2>
                <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card-strip-bg)', border: '1px solid rgba(42,125,88,0.18)' }}>
                  {trip.included && trip.included.length > 0 && (
                    <div className="px-5 py-4" style={{ borderBottom: (trip.excluded?.length ?? 0) > 0 ? '1px solid rgba(42,125,88,0.1)' : 'none' }}>
                      <p className="text-[10px] font-semibold uppercase tracking-widest mb-3 text-gold">{labels?.includedLabel ?? 'Inbegrepen'}</p>
                      <div className="flex flex-wrap gap-2">
                        {trip.included.map((item, i) => (
                          <span key={i} className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                            style={{ background: 'rgba(42,125,88,0.1)', color: 'var(--text-primary)', border: '1px solid rgba(42,125,88,0.2)' }}>
                            <span className="text-gold text-[10px]">✓</span>{item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {trip.excluded && trip.excluded.length > 0 && (
                    <div className="px-5 py-4">
                      <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#c0485a' }}>{labels?.excludedLabel ?? 'Niet inbegrepen'}</p>
                      <div className="flex flex-wrap gap-2">
                        {trip.excluded.map((item, i) => (
                          <span key={i} className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                            style={{ background: 'rgba(139,28,44,0.08)', color: 'var(--text-primary)', border: '1px solid rgba(139,28,44,0.18)' }}>
                            <span style={{ color: '#c0485a', fontSize: '10px' }}>✕</span>{item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar: price + enquiry */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20 rounded-2xl border border-[rgba(42,125,88,0.18)] bg-[var(--card-strip-bg)] p-6 shadow-sm">
              <div className="mb-4">
                <span className="text-sm text-[var(--text-muted)]">{labels?.priceFromSidebarLabel ?? 'Prijs vanaf'}</span>
                <p className="text-4xl font-bold text-gold">{formatPrice(trip.price)}</p>
                <span className="text-sm text-[var(--text-subtle)]">
                  {trip.priceType === 'per_group' ? (settings?.cardLabels?.pricePerGroup ?? 'per groep') : (settings?.cardLabels?.pricePerPerson ?? 'per persoon')}
                </span>
              </div>

              <div className="space-y-2 mb-6">
                {trip.duration && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)]">{labels?.durationLabel ?? 'Duur'}</span>
                    <span className="font-medium text-[var(--text-primary)]">{trip.duration}</span>
                  </div>
                )}
                {trip.difficulty && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)]">{labels?.levelLabel ?? 'Niveau'}</span>
                    <Badge variant="secondary">{difficultyLabel(trip.difficulty)}</Badge>
                  </div>
                )}
              </div>

              <Button asChild size="lg" className="w-full mb-3">
                <Link href={`/safari-reizen/${slug}/boeken`}>{labels?.bookTripCtaLabel ?? 'Boek deze reis'}</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link href="/eigen-reisschema">{labels?.eigenReisschemaCtaLabel ?? 'Eigen Reisschema'}</Link>
              </Button>
            </div>
          </aside>
        </div>

      </div>
    </>
  )
}
