import type { Metadata } from 'next'
import { getSiteSettings, getFaqItems, getTrips, getFaqPage } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { stegaClean } from '@sanity/client/stega'
import { PageHero } from '@/components/shared/page-hero'
import { FaqClient } from '@/components/faq/faq-client'
import type { FaqItem } from '@/lib/types'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata(
    {
      title: 'Veelgestelde Vragen',
      description: 'Antwoorden op de meest gestelde vragen over safari reizen, boekingen, visa en voorbereiding.',
      canonical: '/faq',
    },
    settings
  )
}

function portableTextToString(blocks: unknown[]): string {
  if (!Array.isArray(blocks)) return ''
  return blocks
    .filter((b: unknown) => b && typeof b === 'object' && (b as { _type?: string })._type === 'block')
    .map((b: unknown) => {
      const block = b as { children?: Array<{ text?: string }> }
      return (block.children ?? []).map((c) => c.text ?? '').join('')
    })
    .join(' ')
}

export default async function FaqPage() {
  const [faqItems, trips, faqPage] = await Promise.all([getFaqItems(), getTrips(), getFaqPage()])

  const grouped = faqItems.reduce<Record<string, FaqItem[]>>((acc, faq) => {
    const cat = stegaClean(faq.category) ?? 'general'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(faq)
    return acc
  }, {})

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((faq) => ({
      '@type': 'Question',
      name: stegaClean(faq.question),
      acceptedAnswer: {
        '@type': 'Answer',
        text: stegaClean(portableTextToString(faq.answer)),
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PageHero
        title={faqPage?.heroTitle ?? 'Veelgestelde Vragen'}
        subtitle={faqPage?.heroSubtitle ?? 'Alles wat u wilt weten over uw safari reis.'}
        image={trips[3]?.heroImage}
      />
      <FaqClient
        groupedFaqs={grouped}
        searchPlaceholder={faqPage?.searchPlaceholder}
        categoriesHeading={faqPage?.categoriesHeading}
        viewAllLabel={faqPage?.viewAllLabel}
        noResultsText={faqPage?.noResultsText}
        resetSearchLabel={faqPage?.resetSearchLabel}
      />
    </>
  )
}
