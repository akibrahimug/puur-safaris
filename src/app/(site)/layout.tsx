import { stegaClean } from '@sanity/client/stega'
import { getSiteSettings } from '@/lib/data'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = stegaClean(await getSiteSettings())

  return (
    <>
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </>
  )
}
