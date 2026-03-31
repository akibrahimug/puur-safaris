import type { Metadata } from 'next'
import { siteSettings } from '@/data/site-settings'
import { buildMetadata, getBaseUrl } from '@/lib/seo'
import { PageHero } from '@/components/shared/page-hero'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const revalidate = 3600

export function generateMetadata(): Metadata {
  return buildMetadata(
    {
      title: 'Over Ons',
      description: 'Leer Puur Safaris kennen. Wij zijn gepassioneerde reizigers en safari experts die uw droomreis werkelijkheid maken.',
      canonical: '/over-ons',
    },
    siteSettings
  )
}

export default function OverOnsPage() {
  const baseUrl = getBaseUrl()
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    url: `${baseUrl}/over-ons`,
    name: `Over ${siteSettings.siteName}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <PageHero
        title="Over Puur Safaris"
        subtitle="Wij zijn een gepassioneerd team van safari experts."
      />
      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-stone max-w-none">
            <h2 className="font-serif text-3xl font-bold text-stone-900 mb-6">Onze missie</h2>
            <p className="text-stone-700 text-lg leading-relaxed mb-6">
              Bij Puur Safaris geloven wij in reizen op zijn puurste. Geen massatoerisme, geen
              drukke groepen — maar intieme, op maat gemaakte safari ervaringen die u raken tot in
              de kern.
            </p>
            <p className="text-stone-700 text-lg leading-relaxed mb-6">
              Wij werken uitsluitend met lokale gidsen die hun omgeving door en door kennen. Dit
              garandeert niet alleen een authentieke ervaring, maar draagt ook bij aan de lokale
              gemeenschap en het behoud van natuur.
            </p>

            <h2 className="font-serif text-3xl font-bold text-stone-900 mt-12 mb-6">Waarom wij?</h2>
            <ul className="space-y-3 text-stone-700">
              <li className="flex items-start gap-2">
                <span className="text-gold font-bold mt-1">✓</span>
                <span><strong>Persoonlijk advies</strong> — elke reis wordt individueel samengesteld</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold font-bold mt-1">✓</span>
                <span><strong>Jarenlange ervaring</strong> — wij kennen elk land, elk seizoen</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold font-bold mt-1">✓</span>
                <span><strong>Duurzaam reizen</strong> — wij ondersteunen lokale initiatieven</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold font-bold mt-1">✓</span>
                <span><strong>24/7 bereikbaar</strong> — ook tijdens uw reis staan wij klaar</span>
              </li>
            </ul>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/safari-reizen">Bekijk onze reizen</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Neem contact op</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
