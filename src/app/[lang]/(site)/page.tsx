import type { Metadata } from 'next'
import Link from 'next/link'
import { hasLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { localePath, cmsPathToLocale } from '@/i18n/routes'
import { getSiteSettings, getTrips, getDestinations, getHomePage } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { HeroSection } from '@/components/home/hero-section'
import { TrustStrip } from '@/components/home/trust-strip'
import { WhyChooseUsSection } from '@/components/home/why-choose-us-section'
import { SectionHeading } from '@/components/shared/section-heading'
import { SafariGrid } from '@/components/safari/safari-grid'
import { DestinationCard } from '@/components/destination/destination-card'
import { Button } from '@/components/ui/button'
import { FadeUp } from '@/components/motion/fade-up'
import { ArrowRight } from 'lucide-react'

interface Props {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const settings = await getSiteSettings(lang)
  return buildMetadata(
    {
      title: settings.defaultSeoTitle ?? settings.siteName,
      description: settings.defaultSeoDescription,
      canonical: `/${lang}`,
      locale: hasLocale(lang) ? lang as Locale : 'nl',
      alternates: { nl: '/nl', en: '/en' },
    },
    settings,
  )
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang as Locale : 'nl'
  const dict = await getDictionary(locale)

  const [settings, allTrips, destinations, homePage] = await Promise.all([
    getSiteSettings(lang),
    getTrips(lang),
    getDestinations(lang),
    getHomePage(lang),
  ])

  const featuredTrips = allTrips.filter((t) => t.featured).slice(0, 3)
  const displayDestinations = destinations.slice(0, 3)

  return (
    <>
      <HeroSection settings={settings} homePage={homePage} dict={dict} locale={locale} />

      {/* ── Trust strip — credibility before the trips ───────── */}
      <TrustStrip items={homePage?.trustItems} />

      {/* ── Featured safaris ─────────────────────────────────── */}
      {featuredTrips.length > 0 && (
        <section className="py-24 section-page">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeUp>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
                <SectionHeading
                  eyebrow={homePage?.featuredTripsEyebrow}
                  title={homePage?.featuredTripsTitle}
                  subtitle={homePage?.featuredTripsSubtitle}
                  light
                />
                <Button asChild variant="glass">
                  <Link href={localePath(locale, 'safaris')}>
                    {homePage?.featuredTripsCtaLabel} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </FadeUp>
            <SafariGrid trips={featuredTrips} locale={locale} labels={{
              featuredBadge: settings?.cardLabels?.featuredBadge,
              priceFromLabel: settings?.cardLabels?.priceFromLabel,
              pricePerGroup: settings?.cardLabels?.pricePerGroup,
              pricePerPerson: settings?.cardLabels?.pricePerPerson,
              viewLabel: settings?.cardLabels?.viewLabel,
            }} />
          </div>
        </section>
      )}

      {/* ── Why choose us ────────────────────────────────────── */}
      <WhyChooseUsSection
        eyebrow={homePage?.featuresEyebrow}
        title={homePage?.featuresTitle}
        features={homePage?.features}
      />

      {/* ── Destinations ─────────────────────────────────────── */}
      {displayDestinations.length > 0 && (
        <section className="py-24 section-page">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeUp>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
                <SectionHeading
                  eyebrow={homePage?.destinationsEyebrow}
                  title={homePage?.destinationsTitle}
                  subtitle={homePage?.destinationsSubtitle}
                  light
                />
                <Button asChild variant="glass">
                  <Link href={localePath(locale, 'destinations')}>
                    {homePage?.destinationsCtaLabel} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </FadeUp>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayDestinations.map((d) => (
                <DestinationCard key={d._id} destination={d} locale={locale} labels={{
                  tripSingularLabel: settings?.cardLabels?.tripSingularLabel,
                  tripPluralLabel: settings?.cardLabels?.tripPluralLabel,
                  availableLabel: settings?.cardLabels?.availableLabel,
                }} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials — hidden for now. Restore by re-adding <TestimonialsSection> and the
             getTestimonials + getGoogleReviews fetches (see data.ts). ──────────────────── */}

      {/* ── CTA banner ───────────────────────────────────────── */}
      <section className="relative overflow-hidden py-28 section-page">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(42,125,88,0.5), transparent)' }} />

        <div className="relative container mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <FadeUp>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: '#2a7d58' }}>
              {homePage?.ctaEyebrow}
            </p>
            <h2 className="font-serif text-heading font-bold mb-5"
              style={{ color: 'var(--text-primary)' }}>
              {homePage?.ctaTitle}
            </h2>
            <p className="text-base leading-relaxed mb-10 max-w-xl mx-auto"
              style={{ color: 'var(--text-muted)' }}>
              {homePage?.ctaSubtitle}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg">
                <Link href={homePage?.ctaButton1Link ? `/${lang}${cmsPathToLocale(homePage.ctaButton1Link, locale)}` : localePath(locale, 'customItinerary')}>
                  {homePage?.ctaButton1Label}
                </Link>
              </Button>
              <Button asChild size="lg" variant="glass">
                <Link href={homePage?.ctaButton2Link ? `/${lang}${cmsPathToLocale(homePage.ctaButton2Link, locale)}` : localePath(locale, 'safaris')}>
                  {homePage?.ctaButton2Label}
                </Link>
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
