import { draftMode } from 'next/headers'
import { stegaClean } from '@sanity/client/stega'
import { hasLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getSiteSettings } from '@/lib/data'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { LanguageMismatchBanner } from '@/components/shared/language-mismatch-banner'

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang as Locale : 'nl'
  const dm = await draftMode()
  const [rawSettings, dict] = await Promise.all([
    getSiteSettings(locale),
    getDictionary(locale),
  ])
  // Keep stega encoding for visual editing in Presentation Tool; strip it for normal browsing
  const settings = dm.isEnabled ? rawSettings : stegaClean(rawSettings)

  return (
    <>
      <Header settings={settings} locale={locale} labels={dict.header} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} locale={locale} dict={dict} />
      <LanguageMismatchBanner currentLocale={locale} />
    </>
  )
}
