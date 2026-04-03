import type { Metadata } from 'next'
import { getSiteSettings, getTrips, getSafariListingPage } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { stegaClean } from '@sanity/client/stega'
import { PageHero } from '@/components/shared/page-hero'
import { SafariGrid } from '@/components/safari/safari-grid'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata(
    {
      title: 'Safari Reizen',
      description: 'Bekijk ons complete aanbod van handgepickte safari reizen. Van wildlife safaris in Kenya tot bergklimmen in Tanzania.',
      canonical: '/safari-reizen',
    },
    settings
  )
}

export default async function SafariReizenPage() {
  const [trips, safariListingPage] = await Promise.all([getTrips(), getSafariListingPage()])

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Safari Reizen',
    numberOfItems: trips.length,
    itemListElement: trips.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: stegaClean(t.title),
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/safari-reizen/${stegaClean(t.slug)}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <PageHero
        title={safariListingPage?.heroTitle ?? 'Safari Reizen'}
        subtitle={safariListingPage?.heroSubtitle ?? `Ontdek ${trips.length > 0 ? `${trips.length} ` : ''}handgepickte safari reizen op maat.`}
        image={trips[1]?.heroImage}
      />
      <section className="section-page py-16">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <SafariGrid trips={trips} />
        </div>
      </section>
    </>
  )
}
