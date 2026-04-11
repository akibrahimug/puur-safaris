import type { Metadata } from 'next'
import Link from 'next/link'
import { hasLocale, type Locale, cmsText } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { localePath } from '@/i18n/routes'
import { getSiteSettings, getTrips, getSafariListingPage } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { stegaClean } from '@sanity/client/stega'
import { PageHero } from '@/components/shared/page-hero'
import { SafariGrid } from '@/components/safari/safari-grid'

interface Props {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ category?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang as Locale : 'nl'
  const dict = await getDictionary(locale)
  const settings = await getSiteSettings(lang)
  return buildMetadata(
    {
      title: dict.safari.heroTitle,
      description: dict.safari.heroSubtitle,
      canonical: `/${lang}/safaris`,
      locale,
      alternates: { nl: '/nl/safari-reizen', en: '/en/safaris' },
    },
    settings
  )
}

const CATEGORIES = ['wildlife', 'hiking', 'culture', 'beach', 'combined'] as const

export default async function SafariReizenPage({ params, searchParams }: Props) {
  const { lang } = await params
  const { category } = await searchParams
  const locale = hasLocale(lang) ? lang as Locale : 'nl'
  const dict = await getDictionary(locale)

  const [allTrips, safariListingPage, settings] = await Promise.all([getTrips(lang), getSafariListingPage(lang), getSiteSettings(lang)])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cms = <T,>(v: T | null | undefined) => cmsText(v, (safariListingPage as any)?.language, locale)

  const activeCategory = category && CATEGORIES.includes(category as typeof CATEGORIES[number]) ? category : null
  const trips = activeCategory
    ? allTrips.filter((t) => stegaClean(t.category) === activeCategory)
    : allTrips

  const safariPath = localePath(locale, 'safaris')

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: dict.safari.heroTitle,
    numberOfItems: trips.length,
    itemListElement: trips.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: stegaClean(t.title),
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${lang}/safaris/${stegaClean(t.slug)}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <PageHero
        title={cms(safariListingPage?.heroTitle) ?? dict.safari.heroTitle}
        subtitle={cms(safariListingPage?.heroSubtitle) ?? dict.safari.heroSubtitle}
        image={safariListingPage?.heroImage ?? allTrips[1]?.heroImage}
      />
      <section className="section-page py-16">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          {/* Category filter tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            <Link
              href={safariPath}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                !activeCategory
                  ? 'bg-gold text-white shadow-md'
                  : 'border border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-gold/40 hover:text-[var(--text-primary)]'
              }`}
            >
              {dict.faq?.viewAll ?? 'All'}
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`${safariPath}?category=${cat}`}
                className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-gold text-white shadow-md'
                    : 'border border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-gold/40 hover:text-[var(--text-primary)]'
                }`}
              >
                {dict.categories?.[cat] ?? cat}
              </Link>
            ))}
          </div>

          <SafariGrid trips={trips} locale={locale} emptyMessage={dict.cards.noSafarisFound} labels={{
            featuredBadge: settings?.cardLabels?.featuredBadge ?? dict.cards.featuredBadge,
            priceFromLabel: settings?.cardLabels?.priceFromLabel ?? dict.cards.priceFrom,
            pricePerGroup: settings?.cardLabels?.pricePerGroup ?? dict.cards.pricePerGroup,
            pricePerPerson: settings?.cardLabels?.pricePerPerson ?? dict.cards.pricePerPerson,
            viewLabel: settings?.cardLabels?.viewLabel ?? dict.cards.viewLabel,
          }} />
        </div>
      </section>
    </>
  )
}
