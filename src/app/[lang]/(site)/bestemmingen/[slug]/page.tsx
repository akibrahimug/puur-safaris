import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { hasLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { localePath } from '@/i18n/routes'
import { getSiteSettings, getDestinationDetail, getDestinationSlugs } from '@/lib/data'
import { buildMetadata, autoSeo, getBaseUrl, breadcrumbJsonLd } from '@/lib/seo'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PortableTextRenderer } from '@/components/shared/portable-text-renderer'
import { SectionHeading } from '@/components/shared/section-heading'
import { SafariGrid } from '@/components/safari/safari-grid'
import { stegaClean } from '@sanity/client/stega'
import { Sun, Thermometer, MapPin, Trees, Users, Hotel } from 'lucide-react'

interface Props {
  params: Promise<{ lang: string; slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getDestinationSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lang } = await params
  const locale = hasLocale(lang) ? lang as Locale : 'nl'
  const settings = await getSiteSettings(lang)
  const destination = await getDestinationDetail(slug, lang)

  if (!destination) return {}

  return buildMetadata(
    {
      ...autoSeo(
        { title: destination.name, subtitle: destination.excerpt, image: destination.heroImage },
        destination.seo,
      ),
      canonical: `/${lang}/bestemmingen/${slug}`,
      locale,
      alternates: { nl: `/nl/bestemmingen/${slug}`, en: `/en/destinations/${slug}` },
    },
    settings,
  )
}

export default async function DestinationDetailPage({ params }: Props) {
  const { slug, lang } = await params
  const locale = hasLocale(lang) ? lang as Locale : 'nl'
  const dict = await getDictionary(locale)

  const [destination, settings] = await Promise.all([getDestinationDetail(slug, lang), getSiteSettings(lang)])
  const labels = settings?.destinationDetailLabels

  if (!destination) notFound()

  const baseUrl = getBaseUrl()
  const heroUrl = destination.heroImage?.asset?.url || null
  const relatedTrips = destination.relatedTrips ?? []
  const gallery = destination.gallery ?? []
  const wildlife = destination.wildlifeHighlights ?? []
  const accommodations = destination.accommodations ?? []

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: dict.common.home, path: `/${lang}` },
    { name: dict.nav.destinations, path: localePath(locale, 'destinations') },
    { name: stegaClean(destination.name)!, path: `/${lang}/bestemmingen/${stegaClean(slug)}` },
  ])

  const destinationSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: stegaClean(destination.name),
    description: stegaClean(destination.excerpt),
    url: `${baseUrl}/${lang}/bestemmingen/${stegaClean(slug)}`,
    inLanguage: lang,
    ...(heroUrl && { image: stegaClean(heroUrl) }),
    ...(destination.coordinates && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: destination.coordinates.lat,
        longitude: destination.coordinates.lng,
      },
    }),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ── Hero ────────────────────────────────────────────── */}
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

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-20">

        {/* ── Description + Sidebar ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {destination.description && (
              <PortableTextRenderer value={destination.description as unknown[]} />
            )}
          </div>

          <aside className="space-y-4">
            {destination.climate && (
              <div className="rounded-xl border border-[rgba(42,125,88,0.18)] bg-[var(--card-strip-bg)] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="h-4 w-4 text-gold" />
                  <h3 className="font-semibold text-[var(--text-primary)] text-sm">{labels?.climateHeading ?? dict.destinations.climateHeading}</h3>
                </div>
                <p className="text-sm text-[var(--text-muted)]">{destination.climate}</p>
              </div>
            )}
            {destination.bestTimeToVisit && (
              <div className="rounded-xl border border-[rgba(42,125,88,0.18)] bg-[var(--card-strip-bg)] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sun className="h-4 w-4 text-gold" />
                  <h3 className="font-semibold text-[var(--text-primary)] text-sm">{labels?.bestTimeHeading ?? dict.destinations.bestTimeHeading}</h3>
                </div>
                <p className="text-sm text-[var(--text-muted)]">{destination.bestTimeToVisit}</p>
              </div>
            )}

            {/* Map placeholder — coordinates shown if available */}
            {destination.coordinates && (
              <div className="rounded-xl border border-[rgba(42,125,88,0.18)] bg-[var(--card-strip-bg)] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-gold" />
                  <h3 className="font-semibold text-[var(--text-primary)] text-sm">{dict.destinations.locationHeading}</h3>
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800">
                  <iframe
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${destination.coordinates.lng - 0.5}%2C${destination.coordinates.lat - 0.3}%2C${destination.coordinates.lng + 0.5}%2C${destination.coordinates.lat + 0.3}&layer=mapnik&marker=${destination.coordinates.lat}%2C${destination.coordinates.lng}`}
                    className="absolute inset-0 w-full h-full border-0"
                    loading="lazy"
                    title={`${stegaClean(destination.name)} location`}
                  />
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* ── Photo Gallery ─────────────────────────────────── */}
        {gallery.length > 0 && (
          <section>
            <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)] mb-6">{dict.destinations.galleryHeading}</h2>
            <div className={`grid gap-3 ${
              gallery.length === 1 ? 'grid-cols-1' :
              gallery.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
              gallery.length <= 4 ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4' :
              'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
            }`}>
              {gallery.map((img, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] group ${
                    i === 0 && gallery.length > 2 ? 'sm:col-span-2 sm:row-span-2 aspect-square' : 'aspect-[4/3]'
                  }`}
                >
                  <Image
                    src={img.asset.url}
                    alt={img.alt ?? destination.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes={i === 0 && gallery.length > 2 ? '50vw' : '25vw'}
                  />
                  {img.caption && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <p className="text-xs text-white/90">{img.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Wildlife & Nature ─────────────────────────────── */}
        {(destination.wildlifeDescription || wildlife.length > 0) && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Trees className="h-6 w-6 text-gold" />
              <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)]">
                {destination.wildlifeHeading ?? dict.destinations.wildlifeHeading}
              </h2>
            </div>
            {destination.wildlifeDescription && (
              <p className="text-[var(--text-muted)] leading-relaxed mb-8 max-w-3xl">
                {destination.wildlifeDescription}
              </p>
            )}
            {wildlife.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {wildlife.map((animal, i) => (
                  <div key={i} className="group rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-hidden">
                    {animal.image?.asset?.url && (
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={animal.image.asset.url}
                          alt={animal.image.alt ?? animal.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="25vw"
                        />
                      </div>
                    )}
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-[var(--text-primary)]">{animal.name}</h3>
                      {animal.description && (
                        <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">{animal.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Community & Culture ───────────────────────────── */}
        {(destination.communityDescription || destination.communityImage) && (
          <section className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {destination.communityImage?.asset?.url && (
                <div className="relative min-h-[300px] lg:min-h-full">
                  <Image
                    src={destination.communityImage.asset.url}
                    alt={destination.communityImage.alt ?? 'Community'}
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                </div>
              )}
              <div className="p-8 sm:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-5 w-5 text-gold" />
                  <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)]">
                    {destination.communityHeading ?? dict.destinations.communityHeading}
                  </h2>
                </div>
                {destination.communityDescription && (
                  <PortableTextRenderer value={destination.communityDescription as unknown[]} />
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── Accommodations ────────────────────────────────── */}
        {accommodations.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Hotel className="h-6 w-6 text-gold" />
              <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)]">
                {destination.accommodationsHeading ?? dict.destinations.accommodationsHeading}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {accommodations.map((acc, i) => (
                <div key={i} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-strip-bg)] overflow-hidden group">
                  {acc.image?.asset?.url && (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={acc.image.asset.url}
                        alt={acc.image.alt ?? acc.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="33vw"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-[var(--text-primary)]">{acc.name}</h3>
                      {acc.type && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                          {acc.type}
                        </span>
                      )}
                    </div>
                    {acc.description && (
                      <p className="text-sm text-[var(--text-muted)] leading-relaxed">{acc.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Related safaris ───────────────────────────────── */}
        {relatedTrips.length > 0 && (
          <section>
            <SectionHeading
              title={`${labels?.relatedTripsHeadingPrefix ?? dict.destinations.relatedTripsPrefix} ${destination.name}`}
              subtitle={`${relatedTrips.length} ${relatedTrips.length !== 1 ? dict.destinations.tripsAvailablePlural : dict.destinations.tripsAvailableSingular}`}
              className="mb-8"
            />
            <SafariGrid trips={relatedTrips} />
          </section>
        )}
      </div>
    </>
  )
}
