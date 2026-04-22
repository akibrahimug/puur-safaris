import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getSiteSettings, getLegalPage } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { PageHero } from '@/components/shared/page-hero'
import { PortableTextRenderer } from '@/components/shared/portable-text-renderer'

const SLUGS = ['algemene-voorwaarden', 'terms-and-conditions']

interface Props {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang as Locale : 'nl'
  const dict = await getDictionary(locale)
  const [settings, page] = await Promise.all([getSiteSettings(lang), getLegalPage(SLUGS, lang)])
  return buildMetadata(
    {
      title: page?.seo?.title ?? page?.title ?? dict.footer.termsLabel,
      description: page?.seo?.description,
      canonical: `/${lang}/terms`,
      locale,
      alternates: { nl: '/nl/algemene-voorwaarden', en: '/en/terms' },
    },
    settings,
  )
}

export default async function AlgemeneVoorwaardenPage({ params }: Props) {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang as Locale : 'nl'
  const dict = await getDictionary(locale)

  const page = await getLegalPage(SLUGS, lang)
  if (!page) return notFound()


  return (
    <>
      <PageHero
        title={page.title ?? dict.footer.termsLabel}
        image={page.heroImage}
      />
      {page.body && (
        <section className="py-16 bg-[var(--bg-primary)]">
          <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <PortableTextRenderer value={page.body} />
          </div>
        </section>
      )}
    </>
  )
}
