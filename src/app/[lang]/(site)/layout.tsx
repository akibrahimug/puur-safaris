import { draftMode, headers } from 'next/headers'
import { stegaClean } from '@sanity/client/stega'
import { hasLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getSiteSettings } from '@/lib/data'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CountryBanner } from '@/components/shared/country-banner'

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
  const [rawSettings, dict, hdrs] = await Promise.all([
    getSiteSettings(locale),
    getDictionary(locale),
    headers(),
  ])
  // Keep stega encoding for visual editing in Presentation Tool; strip it for normal browsing
  const settings = dm.isEnabled ? rawSettings : stegaClean(rawSettings)

  // The proxy decides (geo + the `puur_locale` choice cookie) whether to suggest
  // the other locale, and forwards the target via `x-locale-banner` (empty = no
  // banner). Validate it before rendering so a stray header can't show garbage.
  const bannerTarget = hdrs.get('x-locale-banner') ?? ''
  const showBanner = hasLocale(bannerTarget) && bannerTarget !== locale

  return (
    <>
      <Header settings={settings} locale={locale} labels={dict.header} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} locale={locale} dict={dict} />
      {showBanner && <CountryBanner currentLocale={locale} targetLocale={bannerTarget} />}
    </>
  )
}
