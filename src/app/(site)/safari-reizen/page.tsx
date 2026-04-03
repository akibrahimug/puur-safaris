import type { Metadata } from 'next'
import { siteSettings } from '@/data/site-settings'
import { trips } from '@/data/trips'
import { buildMetadata } from '@/lib/seo'
import { PageHero } from '@/components/shared/page-hero'
import { SafariGrid } from '@/components/safari/safari-grid'

export const revalidate = 3600

export function generateMetadata(): Metadata {
  return buildMetadata(
    {
      title: 'Safari Reizen',
      description: 'Bekijk ons complete aanbod van handgepickte safari reizen. Van wildlife safaris in Kenya tot bergklimmen in Tanzania.',
      canonical: '/safari-reizen',
    },
    siteSettings
  )
}

export default function SafariReizenPage() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Safari Reizen',
    numberOfItems: trips.length,
    itemListElement: trips.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.title,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/safari-reizen/${t.slug}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <PageHero
        title="Safari Reizen"
        subtitle={`Ontdek ${trips.length > 0 ? `${trips.length} ` : ''}handgepickte safari reizen op maat.`}
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
