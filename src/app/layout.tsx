import type { Metadata } from 'next'
import { Fredoka } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { getSiteSettings } from '@/lib/data'
import { buildMetadata, organizationJsonLd, websiteJsonLd, getBaseUrl } from '@/lib/seo'
import { ThemeProvider } from '@/providers/theme-provider'
import './globals.css'

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const baseUrl = getBaseUrl()

  return {
    ...buildMetadata(
      {
        title: settings.defaultSeoTitle ?? settings.siteName,
        description: settings.defaultSeoDescription,
      },
      settings
    ),
    metadataBase: new URL(baseUrl),
    applicationName: settings.siteName,
    icons: settings.logo?.asset?.url
      ? { icon: settings.logo.asset.url, apple: settings.logo.asset.url }
      : undefined,
    keywords: ['safari', 'Afrika reizen', 'safari reizen', 'wildlife safari', 'Tanzania safari', 'Kenya safari', 'reisorganisatie'],
    authors: [{ name: settings.siteName }],
    creator: settings.siteName,
    publisher: settings.siteName,
    formatDetection: { email: false, telephone: false },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  const orgSchema = organizationJsonLd(settings)
  const webSchema = websiteJsonLd(settings)

  return (
    <html lang="nl" className={`${fredoka.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
