import { stegaClean } from '@sanity/client/stega'
import { hasLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getSiteSettings } from '@/lib/data'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang as Locale : 'nl'
  const [settings, dict] = await Promise.all([
    getSiteSettings(locale).then(stegaClean),
    getDictionary(locale),
  ])

  return (
    <>
      <Header settings={settings} locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} locale={locale} dict={dict} />
    </>
  )
}
