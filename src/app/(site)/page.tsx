import type { Metadata } from 'next'
import Link from 'next/link'
import { siteSettings } from '@/data/site-settings'
import { trips } from '@/data/trips'
import { destinations } from '@/data/destinations'
import { testimonials } from '@/data/testimonials'
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

export const revalidate = 3600

export function generateMetadata(): Metadata {
  return buildMetadata(
    {
      title: siteSettings.defaultSeoTitle ?? siteSettings.siteName,
      description: siteSettings.defaultSeoDescription,
      canonical: '/',
    },
    siteSettings
  )
}

export default function HomePage() {
  const featuredTrips = trips.filter((t) => t.featured)

  return (
    <>
      <HeroSection settings={siteSettings} />

      {/* ── Trust strip — credibility before the trips ───────── */}
      <TrustStrip />

      {/* ── Featured safaris ─────────────────────────────────── */}
      {featuredTrips.length > 0 && (
        <section className="py-24 section-page">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeUp>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
                <SectionHeading
                  eyebrow="Uitgelichte Reizen"
                  title="Safari Reizen"
                  subtitle="Handpicked avonturen voor een onvergetelijke ervaring in Oost-Afrika."
                  light
                />
                <Button asChild variant="glass">
                  <Link href="/safari-reizen">
                    Alle reizen <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </FadeUp>
            <SafariGrid trips={featuredTrips} />
          </div>
        </section>
      )}

      {/* ── Why choose us ────────────────────────────────────── */}
      <WhyChooseUsSection />

      {/* ── Destinations ─────────────────────────────────────── */}
      {destinations.length > 0 && (
        <section className="py-24 section-page">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeUp>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
                <SectionHeading
                  eyebrow="Bestemmingen"
                  title="Ontdek Oost-Afrika"
                  subtitle="Elk land een ander avontuur. Van Ugandese gorilla treks tot de serengeti vlakten."
                  light
                />
                <Button asChild variant="glass">
                  <Link href="/bestemmingen">
                    Alle bestemmingen <ArrowRight className="h-4 w-4" />
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
      <TestimonialsSection testimonials={testimonials} />

      {/* ── CTA banner ───────────────────────────────────────── */}
      <section className="relative overflow-hidden py-28 section-page">
        {/* Centred gold top-border accent only */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(42,125,88,0.5), transparent)' }} />

        <div className="relative container mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <FadeUp>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: '#2a7d58' }}>
              Begin uw avontuur
            </p>
            <h2 className="font-serif text-heading font-bold mb-5"
              style={{ color: 'var(--text-primary)' }}>
              Klaar voor uw droomsafari?
            </h2>
            <p className="text-base leading-relaxed mb-10 max-w-xl mx-auto"
              style={{ color: 'var(--text-muted)' }}>
              Laat ons een gepersonaliseerde offerte voor u samenstellen. Gratis en vrijblijvend — wij kennen elk pad in Oost-Afrika.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/eigen-reisschema">Eigen Reisschema</Link>
              </Button>
              <Button asChild size="lg" variant="glass">
                <Link href="/safari-reizen">Bekijk alle reizen</Link>
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
