import type { Metadata } from 'next'
import { hasLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getSiteSettings, getContactPage } from '@/lib/data'
import { buildMetadata, getBaseUrl } from '@/lib/seo'
import { PageHero } from '@/components/shared/page-hero'
import { ContactForm } from '@/components/shared/contact-form'
import { stegaClean } from '@sanity/client/stega'
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react'

interface Props {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang as Locale : 'nl'
  const [settings, contactPage] = await Promise.all([getSiteSettings(lang), getContactPage(lang)])
  return buildMetadata(
    {
      title: contactPage?.heroTitle,
      description: contactPage?.heroSubtitle,
      canonical: `/${lang}/contact`,
      locale,
      alternates: { nl: '/nl/contact', en: '/en/contact' },
    },
    settings
  )
}

const defaultOpeningHours = [
  { label: 'Ma – Vr', hours: '09:00 – 17:30' },
  { label: 'Za', hours: '10:00 – 14:00' },
]

export default async function ContactPage({ params }: Props) {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang as Locale : 'nl'
  const dict = await getDictionary(locale)

  const [siteSettings, contactPage] = await Promise.all([getSiteSettings(lang), getContactPage(lang)])
  const baseUrl = getBaseUrl()
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: `${baseUrl}/${lang}/contact`,
    name: `${contactPage?.heroTitle ?? ''} - ${siteSettings.siteName ?? dict.seo.defaultSiteName}`,
    ...(siteSettings.contactEmail && { email: stegaClean(siteSettings.contactEmail) }),
    ...(siteSettings.phone && { telephone: stegaClean(siteSettings.phone) }),
  }

  const openingHours = siteSettings.openingHours?.length ? siteSettings.openingHours : defaultOpeningHours

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <PageHero
        title={contactPage?.heroTitle}
        subtitle={contactPage?.heroSubtitle}
        image={contactPage?.heroImage}
      />
      <section className="py-16 section-page">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <div
                className="rounded-2xl p-6 sm:p-8"
                style={{ background: 'var(--card-strip-bg)', border: '1px solid rgba(42,125,88,0.18)' }}
              >
                <ContactForm dict={dict} />
              </div>
            </div>

            {/* Contact info sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="font-serif text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {contactPage?.sidebarHeading}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {contactPage?.sidebarDescription}
              </p>

              <div className="space-y-4">
                {siteSettings.phone && (
                  <div
                    className="flex items-start gap-4 rounded-xl p-4"
                    style={{ background: 'rgba(42,125,88,0.05)', border: '1px solid rgba(42,125,88,0.12)' }}
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                      style={{ background: 'rgba(42,125,88,0.12)' }}
                    >
                      <Phone className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                        {contactPage?.phoneLabel}
                      </p>
                      <a
                        href={`tel:${stegaClean(siteSettings.phone)}`}
                        className="text-sm font-medium text-gold hover:underline transition-colors"
                      >
                        {siteSettings.phone}
                      </a>
                    </div>
                  </div>
                )}

                {siteSettings.contactEmail && (
                  <div
                    className="flex items-start gap-4 rounded-xl p-4"
                    style={{ background: 'rgba(42,125,88,0.05)', border: '1px solid rgba(42,125,88,0.12)' }}
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                      style={{ background: 'rgba(42,125,88,0.12)' }}
                    >
                      <Mail className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                        {contactPage?.emailLabel}
                      </p>
                      <a
                        href={`mailto:${stegaClean(siteSettings.contactEmail)}`}
                        className="text-sm font-medium text-gold hover:underline transition-colors break-all"
                      >
                        {siteSettings.contactEmail}
                      </a>
                    </div>
                  </div>
                )}

                {siteSettings.address && (
                  <div
                    className="flex items-start gap-4 rounded-xl p-4"
                    style={{ background: 'rgba(42,125,88,0.05)', border: '1px solid rgba(42,125,88,0.12)' }}
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                      style={{ background: 'rgba(42,125,88,0.12)' }}
                    >
                      <MapPin className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                        {contactPage?.addressLabel}
                      </p>
                      <p className="text-sm whitespace-pre-line" style={{ color: 'var(--text-muted)' }}>
                        {siteSettings.address}
                      </p>
                    </div>
                  </div>
                )}

                <div
                  className="flex items-start gap-4 rounded-xl p-4"
                  style={{ background: 'rgba(42,125,88,0.05)', border: '1px solid rgba(42,125,88,0.12)' }}
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                    style={{ background: 'rgba(42,125,88,0.12)' }}
                  >
                    <Clock className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                      {contactPage?.openingHoursLabel}
                    </p>
                    {openingHours.map((entry) => (
                      <p key={entry.label} className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{entry.label}:</span>{' '}
                        {entry.hours}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {siteSettings.socialMedia?.whatsapp && (
                <a
                  href={`https://wa.me/${stegaClean(siteSettings.socialMedia.whatsapp)?.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-200"
                  style={{ background: '#25D366' }}
                >
                  <MessageCircle className="h-4 w-4" />
                  {contactPage?.whatsappCtaLabel}
                </a>
              )}

              <div
                className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(42,125,88,0.07)', border: '1px solid rgba(42,125,88,0.15)' }}
              >
                <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  {contactPage?.responseTimeText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
