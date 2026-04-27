import type { Metadata } from 'next'
import { hasLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getSiteSettings, getFaqItems, getTrips, getFaqPage } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { stegaClean } from '@sanity/client/stega'
import { PageHero } from '@/components/shared/page-hero'
import { FaqClient } from '@/components/faq/faq-client'
import type { FaqItem } from '@/lib/types'

interface Props {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang as Locale : 'nl'
  const [settings, faqPage] = await Promise.all([getSiteSettings(lang), getFaqPage(lang)])
  return buildMetadata(
    {
      title: faqPage?.heroTitle,
      description: faqPage?.heroSubtitle,
      canonical: `/${lang}/faq`,
      locale,
      alternates: { nl: '/nl/faq', en: '/en/faq' },
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

export default async function FaqPage({ params }: Props) {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang as Locale : 'nl'
  const dict = await getDictionary(locale)

  const [faqItems, trips, faqPage] = await Promise.all([getFaqItems(lang), getTrips(lang), getFaqPage(lang)])


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
        title={faqPage?.heroTitle}
        subtitle={faqPage?.heroSubtitle}
        image={faqPage?.heroImage ?? trips[3]?.heroImage}
      />
      <FaqClient
        groupedFaqs={grouped}
        searchPlaceholder={faqPage?.searchPlaceholder}
        categoriesHeading={faqPage?.categoriesHeading}
        viewAllLabel={faqPage?.viewAllLabel}
        noResultsText={faqPage?.noResultsText}
        resetSearchLabel={faqPage?.resetSearchLabel}
        dict={dict}
      />
    </>
  )
}
