import type { Metadata } from 'next'
import { siteSettings } from '@/data/site-settings'
import { faqItems } from '@/data/faq'
import { trips } from '@/data/trips'
import { buildMetadata } from '@/lib/seo'
import { PageHero } from '@/components/shared/page-hero'
import { FaqClient } from '@/components/faq/faq-client'
import { faqCategoryLabel } from '@/lib/utils'
import type { FaqItem } from '@/lib/types'

export const revalidate = 3600

export function generateMetadata(): Metadata {
  return buildMetadata(
    {
      title: 'Veelgestelde Vragen',
      description: 'Antwoorden op de meest gestelde vragen over safari reizen, boekingen, visa en voorbereiding.',
      canonical: '/faq',
    },
    siteSettings
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

export default function FaqPage() {
  const grouped = faqItems.reduce<Record<string, FaqItem[]>>((acc, faq) => {
    const cat = faq.category ?? 'general'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(faq)
    return acc
  }, {})

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: portableTextToString(faq.answer),
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
        title="Veelgestelde Vragen"
        subtitle="Alles wat u wilt weten over uw safari reis."
        image={trips[3]?.heroImage}
      />
      <FaqClient groupedFaqs={grouped} />
    </>
  )
}
