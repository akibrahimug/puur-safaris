import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, cmsText, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getSiteSettings, getLegalPage } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { PageHero } from '@/components/shared/page-hero'
import { PortableTextRenderer } from '@/components/shared/portable-text-renderer'

const SLUGS = ['privacybeleid', 'privacy-policy']

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
      title: page?.seo?.title ?? page?.title ?? dict.footer.privacyLabel,
      description: page?.seo?.description,
      canonical: `/${lang}/privacy`,
      locale,
      alternates: { nl: '/nl/privacybeleid', en: '/en/privacy' },
    },
    settings,
  )
}

export default async function PrivacybeleidPage({ params }: Props) {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang as Locale : 'nl'
  const dict = await getDictionary(locale)

  const page = await getLegalPage(SLUGS, lang)
  if (!page) return notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cms = <T,>(v: T | null | undefined) => cmsText(v, (page as any)?.language, locale)

  return (
    <>
      <PageHero
        title={cms(page.title) ?? dict.footer.privacyLabel}
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
