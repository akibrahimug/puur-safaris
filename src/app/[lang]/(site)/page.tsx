import type { Metadata } from 'next'
import Link from 'next/link'
import { hasLocale, type Locale, cmsText } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { localePath, cmsPathToLocale } from '@/i18n/routes'
import { getSiteSettings, getTrips, getDestinations, getTestimonials, getHomePage } from '@/lib/data'
import { getGoogleReviews } from '@/lib/google-reviews'
import { buildMetadata } from '@/lib/seo'
import { HeroSection } from '@/components/home/hero-section'
import { TrustStrip } from '@/components/home/trust-strip'
import { WhyChooseUsSection } from '@/components/home/why-choose-us-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'
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

  const [settings, allTrips, destinations, sanityTestimonials, homePage, googleReviews] = await Promise.all([
    getSiteSettings(lang),
    getTrips(lang),
    getDestinations(lang),
    getTestimonials(lang),
    getHomePage(lang),
    getGoogleReviews(),
  ])

  // Merge: Google Reviews first (fresh from Google), then Sanity testimonials
  const testimonials = [...googleReviews, ...sanityTestimonials]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cms = <T,>(v: T | null | undefined) => cmsText(v, (homePage as any)?.language, locale)

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
                  eyebrow={cms(homePage?.featuredTripsEyebrow) ?? dict.home.featuredTripsEyebrow}
                  title={cms(homePage?.featuredTripsTitle) ?? dict.home.featuredTripsTitle}
                  subtitle={cms(homePage?.featuredTripsSubtitle) ?? dict.home.featuredTripsSubtitle}
                  light
                />
                <Button asChild variant="glass">
                  <Link href={localePath(locale, 'safaris')}>
                    {cms(homePage?.featuredTripsCtaLabel) ?? dict.home.allTripsCta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </FadeUp>
            <SafariGrid trips={featuredTrips} locale={locale} labels={{
              featuredBadge: settings?.cardLabels?.featuredBadge ?? dict.cards.featuredBadge,
              priceFromLabel: settings?.cardLabels?.priceFromLabel ?? dict.cards.priceFrom,
              pricePerGroup: settings?.cardLabels?.pricePerGroup ?? dict.cards.pricePerGroup,
              pricePerPerson: settings?.cardLabels?.pricePerPerson ?? dict.cards.pricePerPerson,
              viewLabel: settings?.cardLabels?.viewLabel ?? dict.cards.viewLabel,
            }} />
          </div>
        </section>
      )}

      {/* ── Why choose us ────────────────────────────────────── */}
      <WhyChooseUsSection
        eyebrow={cms(homePage?.featuresEyebrow)}
        title={cms(homePage?.featuresTitle)}
        features={homePage?.features}
        dict={dict}
      />

      {/* ── Destinations ─────────────────────────────────────── */}
      {displayDestinations.length > 0 && (
        <section className="py-24 section-page">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeUp>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
                <SectionHeading
                  eyebrow={cms(homePage?.destinationsEyebrow) ?? dict.home.destinationsEyebrow}
                  title={cms(homePage?.destinationsTitle) ?? dict.home.destinationsTitle}
                  subtitle={cms(homePage?.destinationsSubtitle) ?? dict.home.destinationsSubtitle}
                  light
                />
                <Button asChild variant="glass">
                  <Link href={localePath(locale, 'destinations')}>
                    {cms(homePage?.destinationsCtaLabel) ?? dict.home.allDestinationsCta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </FadeUp>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayDestinations.map((d) => (
                <DestinationCard key={d._id} destination={d} locale={locale} labels={{
                  tripSingularLabel: settings?.cardLabels?.tripSingularLabel ?? dict.cards.tripSingular,
                  tripPluralLabel: settings?.cardLabels?.tripPluralLabel ?? dict.cards.tripPlural,
                  availableLabel: settings?.cardLabels?.availableLabel ?? dict.cards.available,
                }} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials ─────────────────────────────────────── */}
      <TestimonialsSection
        testimonials={testimonials}
        eyebrow={cms(homePage?.testimonialsEyebrow)}
        title={cms(homePage?.testimonialsTitle)}
        subtitle={cms(homePage?.testimonialsSubtitle)}
        verifiedLabel={cms(homePage?.testimonialsVerifiedLabel)}
        moreLabel={cms(homePage?.testimonialsMoreLabel)}
        beginLabel={cms(homePage?.testimonialsBeginLabel)}
        dict={dict}
      />

      {/* ── CTA banner ───────────────────────────────────────── */}
      <section className="relative overflow-hidden py-28 section-page">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(42,125,88,0.5), transparent)' }} />

        <div className="relative container mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <FadeUp>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: '#2a7d58' }}>
              {cms(homePage?.ctaEyebrow) ?? dict.home.ctaEyebrow}
            </p>
            <h2 className="font-serif text-heading font-bold mb-5"
              style={{ color: 'var(--text-primary)' }}>
              {cms(homePage?.ctaTitle) ?? dict.home.ctaTitle}
            </h2>
            <p className="text-base leading-relaxed mb-10 max-w-xl mx-auto"
              style={{ color: 'var(--text-muted)' }}>
              {cms(homePage?.ctaSubtitle) ?? dict.home.ctaSubtitle}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg">
                <Link href={homePage?.ctaButton1Link ? `/${lang}${cmsPathToLocale(homePage.ctaButton1Link, locale)}` : localePath(locale, 'customItinerary')}>
                  {cms(homePage?.ctaButton1Label) ?? dict.home.ctaButton1}
                </Link>
              </Button>
              <Button asChild size="lg" variant="glass">
                <Link href={homePage?.ctaButton2Link ? `/${lang}${cmsPathToLocale(homePage.ctaButton2Link, locale)}` : localePath(locale, 'safaris')}>
                  {cms(homePage?.ctaButton2Label) ?? dict.home.ctaButton2}
                </Link>
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
