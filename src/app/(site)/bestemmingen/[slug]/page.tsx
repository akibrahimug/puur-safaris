import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getSiteSettings, getDestinationDetail, getDestinationSlugs } from '@/lib/data'
import { buildMetadata, mergeWithSeoFields, getBaseUrl } from '@/lib/seo'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PortableTextRenderer } from '@/components/shared/portable-text-renderer'
import { SectionHeading } from '@/components/shared/section-heading'
import { SafariGrid } from '@/components/safari/safari-grid'
import { stegaClean } from '@sanity/client/stega'
import { Sun, Thermometer, MapPin } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getDestinationSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const settings = await getSiteSettings()
  const destination = await getDestinationDetail(slug)

  if (!destination) return {}

  return buildMetadata(
    mergeWithSeoFields(
      {
        title: destination.name,
        description: destination.excerpt,
        image: destination.heroImage,
        canonical: `/bestemmingen/${slug}`,
      },
      destination.seo
    ),
    settings
  )
}

export default async function BestemmingDetailPage({ params }: Props) {
  const { slug } = await params
  const [destination, settings] = await Promise.all([getDestinationDetail(slug), getSiteSettings()])
  const labels = settings?.destinationDetailLabels

  if (!destination) notFound()

  const baseUrl = getBaseUrl()
  const heroUrl = destination.heroImage?.asset?.url || null

  const relatedTrips = destination.relatedTrips ?? []

  const destinationSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: stegaClean(destination.name),
    description: stegaClean(destination.excerpt),
    url: `${baseUrl}/bestemmingen/${stegaClean(slug)}`,
    ...(heroUrl && { image: stegaClean(heroUrl) }),
    containedInPlace: {
      '@type': 'Country',
      name: stegaClean(destination.country),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationSchema) }}
      />

      {/* Hero */}
      <div className="relative h-[50vh] min-h-[360px] bg-ink">
        {heroUrl && (
          <Image
            src={heroUrl}
            alt={destination.heroImage?.alt ?? destination.name}
            fill
            priority
            className="object-cover opacity-70"
            placeholder={destination.heroImage?.asset?.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={destination.heroImage?.asset?.metadata?.lqip}
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="container mx-auto max-w-7xl">
            <Breadcrumbs />
            <h1 className="font-serif text-4xl font-bold text-white sm:text-5xl drop-shadow">
              {destination.name}
            </h1>
            <div className="mt-2 flex items-center gap-1.5 text-white/80">
              <MapPin className="h-4 w-4" />
              <span>{destination.country} · {destination.continent}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main */}
          <div className="lg:col-span-2">
            {destination.description && (
              <PortableTextRenderer value={destination.description as unknown[]} />
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {destination.climate && (
              <div className="rounded-xl border border-[rgba(42,125,88,0.18)] bg-[var(--card-strip-bg)] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="h-4 w-4 text-gold" />
                  <h3 className="font-semibold text-[var(--text-primary)] text-sm">{labels?.climateHeading ?? 'Klimaat'}</h3>
                </div>
                <p className="text-sm text-[var(--text-muted)]">{destination.climate}</p>
              </div>
            )}
            {destination.bestTimeToVisit && (
              <div className="rounded-xl border border-[rgba(42,125,88,0.18)] bg-[var(--card-strip-bg)] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sun className="h-4 w-4 text-gold" />
                  <h3 className="font-semibold text-[var(--text-primary)] text-sm">{labels?.bestTimeHeading ?? 'Beste tijd om te bezoeken'}</h3>
                </div>
                <p className="text-sm text-[var(--text-muted)]">{destination.bestTimeToVisit}</p>
              </div>
            )}
          </aside>
        </div>

        {/* Related safaris */}
        {relatedTrips.length > 0 && (
          <section className="mt-16">
            <SectionHeading
              title={`${labels?.relatedTripsHeadingPrefix ?? 'Safari reizen in'} ${destination.name}`}
              subtitle={`${relatedTrips.length} reis${relatedTrips.length !== 1 ? 'en' : ''} beschikbaar`}
              className="mb-8"
            />
            <SafariGrid trips={relatedTrips} />
          </section>
        )}
      </div>
    </>
  )
}
