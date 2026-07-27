import type { Metadata } from 'next'
import { hasLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { localePath } from '@/i18n/routes'
import { PageHero } from '@/components/shared/page-hero'
import { BlogSubmissionForm } from '@/components/blog/blog-submission-form'
import { getSiteSettings, getBlogSubmissionPage } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'

interface Props {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang as Locale : 'nl'
  const [settings, page] = await Promise.all([getSiteSettings(lang), getBlogSubmissionPage(lang)])
  return buildMetadata(
    {
      title: page?.seo?.title ?? page?.heroTitle,
      description: page?.seo?.description ?? page?.heroSubtitle,
      canonical: localePath(locale, 'blogSubmit'),
      locale,
      alternates: { nl: '/nl/blog/inzenden', en: '/en/blog/submit' },
    },
    settings
  )
}

export default async function BlogSubmissionRoute({ params }: Props) {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang as Locale : 'nl'
  const dict = await getDictionary(locale)

  const page = await getBlogSubmissionPage(lang)

  return (
    <>
      <PageHero
        title={page?.heroTitle}
        subtitle={page?.heroSubtitle}
        image={page?.heroImage}
      />

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Form Instructions Box */}
        <div className="mb-12 p-8 rounded-3xl border border-gold/30 bg-gold/5 flex flex-col sm:flex-row gap-6 relative overflow-hidden">
          <div className="flex-1">
            <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-4">
              {page?.instructionsHeading}
            </h2>
            <ul className="space-y-4 text-[var(--text-muted)] text-sm sm:text-base leading-relaxed">
               <li className="flex gap-3">
                 <span className="shrink-0 text-gold font-bold">1.</span>
                 <span>{page?.step1Text}</span>
               </li>
               <li className="flex gap-3">
                 <span className="shrink-0 text-gold font-bold">2.</span>
                 <span>{page?.step2Text}</span>
               </li>
               <li className="flex gap-3">
                 <span className="shrink-0 text-gold font-bold">3.</span>
                 <span>{page?.step3Text}</span>
               </li>
            </ul>
          </div>
        </div>

        {/* Client side interactive submission machinery */}
        <BlogSubmissionForm labels={page ? {
          successHeading: page.successHeading,
          successBody: page.successBody,
          successResetLabel: page.successResetLabel,
          submitLabel: page.submitLabel,
          submitLoadingLabel: page.submitLoadingLabel,
          verificationLabel: page.verificationLabel,
          writtenByPrefix: page.writtenByPrefix,
          gallerySidebarHeading: page.gallerySidebarHeading,
          gallerySidebarDescription: page.gallerySidebarDescription,
          galleryAddLabel: page.galleryAddLabel,
          galleryOverflowLabel: page.galleryOverflowLabel,
          legalConsent1: page.legalConsent1,
          legalConsent2: page.legalConsent2,
        } : undefined} dict={dict} />
      </div>
    </>
  )
}
