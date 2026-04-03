import type { Metadata } from 'next'
import Link from 'next/link'
import { getSiteSettings, getTrips, getDestinations, getTestimonials, getHomePage } from '@/lib/data'
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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata(
    {
      title: settings.defaultSeoTitle ?? settings.siteName,
      description: settings.defaultSeoDescription,
      canonical: '/',
    },
    settings
  )
}

export default async function HomePage() {
  const [settings, allTrips, destinations, testimonials, homePage] = await Promise.all([
    getSiteSettings(),
    getTrips(),
    getDestinations(),
    getTestimonials(),
    getHomePage(),
  ])

  const featuredTrips = allTrips.filter((t) => t.featured)

  return (
    <>
      <HeroSection settings={settings} homePage={homePage} />

      {/* ── Trust strip — credibility before the trips ───────── */}
      <TrustStrip items={homePage?.trustItems} />

      {/* ── Featured safaris ─────────────────────────────────── */}
      {featuredTrips.length > 0 && (
        <section className="py-24 section-page">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeUp>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
                <SectionHeading
                  eyebrow={homePage?.featuredTripsEyebrow ?? 'Uitgelichte Reizen'}
                  title={homePage?.featuredTripsTitle ?? 'Safari Reizen'}
                  subtitle={homePage?.featuredTripsSubtitle ?? 'Handpicked avonturen voor een onvergetelijke ervaring in Oost-Afrika.'}
                  light
                />
                <Button asChild variant="glass">
                  <Link href="/safari-reizen">
                    {homePage?.featuredTripsCtaLabel ?? 'Alle reizen'} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </FadeUp>
            <SafariGrid trips={featuredTrips} />
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
      {destinations.length > 0 && (
        <section className="py-24 section-page">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeUp>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
                <SectionHeading
                  eyebrow={homePage?.destinationsEyebrow ?? 'Bestemmingen'}
                  title={homePage?.destinationsTitle ?? 'Ontdek Oost-Afrika'}
                  subtitle={homePage?.destinationsSubtitle ?? 'Elk land een ander avontuur. Van Ugandese gorilla treks tot de serengeti vlakten.'}
                  light
                />
                <Button asChild variant="glass">
                  <Link href="/bestemmingen">
                    {homePage?.destinationsCtaLabel ?? 'Alle bestemmingen'} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </FadeUp>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {destinations.map((d) => (
                <DestinationCard key={d._id} destination={d} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials ─────────────────────────────────────── */}
      <TestimonialsSection
        testimonials={testimonials}
        eyebrow={homePage?.testimonialsEyebrow}
        title={homePage?.testimonialsTitle}
        subtitle={homePage?.testimonialsSubtitle}
        verifiedLabel={homePage?.testimonialsVerifiedLabel}
        moreLabel={homePage?.testimonialsMoreLabel}
        beginLabel={homePage?.testimonialsBeginLabel}
      />

      {/* ── CTA banner ───────────────────────────────────────── */}
      <section className="relative overflow-hidden py-28 section-page">
        {/* Centred gold top-border accent only */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(42,125,88,0.5), transparent)' }} />

        <div className="relative container mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <FadeUp>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: '#2a7d58' }}>
              {homePage?.ctaEyebrow ?? 'Begin uw avontuur'}
            </p>
            <h2 className="font-serif text-heading font-bold mb-5"
              style={{ color: 'var(--text-primary)' }}>
              {homePage?.ctaTitle ?? 'Klaar voor uw droomsafari?'}
            </h2>
            <p className="text-base leading-relaxed mb-10 max-w-xl mx-auto"
              style={{ color: 'var(--text-muted)' }}>
              {homePage?.ctaSubtitle ?? 'Laat ons een gepersonaliseerde offerte voor u samenstellen. Gratis en vrijblijvend — wij kennen elk pad in Oost-Afrika.'}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg">
                <Link href={homePage?.ctaButton1Link ?? '/eigen-reisschema'}>{homePage?.ctaButton1Label ?? 'Eigen Reisschema'}</Link>
              </Button>
              <Button asChild size="lg" variant="glass">
                <Link href={homePage?.ctaButton2Link ?? '/safari-reizen'}>{homePage?.ctaButton2Label ?? 'Bekijk alle reizen'}</Link>
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
