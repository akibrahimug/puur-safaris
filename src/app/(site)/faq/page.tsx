import type { Metadata } from 'next'
import { siteSettings } from '@/data/site-settings'
import { faqItems } from '@/data/faq'
import { buildMetadata } from '@/lib/seo'
import { PageHero } from '@/components/shared/page-hero'
import { PortableTextRenderer } from '@/components/shared/portable-text-renderer'
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
      />
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="mb-12">
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">
                {faqCategoryLabel(category)}
              </h2>
              <div className="space-y-3">
                {items.map((faq) => (
                  <details
                    key={faq._id}
                    className="group rounded-xl border border-stone-200 bg-white overflow-hidden"
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 font-medium text-stone-900 hover:bg-stone-50 transition-colors select-none list-none">
                      {faq.question}
                      <svg
                        className="h-4 w-4 text-stone-400 shrink-0 transition-transform group-open:rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-5 pb-5 pt-2 border-t border-stone-100">
                      <PortableTextRenderer value={faq.answer} />
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
