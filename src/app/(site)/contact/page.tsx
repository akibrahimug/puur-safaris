import type { Metadata } from 'next'
import { siteSettings } from '@/data/site-settings'
import { trips } from '@/data/trips'
import { buildMetadata, getBaseUrl } from '@/lib/seo'
import { PageHero } from '@/components/shared/page-hero'
import { ContactForm } from '@/components/shared/contact-form'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export const revalidate = 3600

export function generateMetadata(): Metadata {
  return buildMetadata(
    {
      title: 'Contact',
      description: 'Neem contact op met Puur Safaris voor een vrijblijvende offerte of vragen over uw droomsafari.',
      canonical: '/contact',
    },
    siteSettings
  )
}

export default function ContactPage() {
  const baseUrl = getBaseUrl()
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: `${baseUrl}/contact`,
    name: 'Contact - Puur Safaris',
    ...(siteSettings.contactEmail && { email: siteSettings.contactEmail }),
    ...(siteSettings.phone && { telephone: siteSettings.phone }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <PageHero
        title="Contact"
        subtitle="Neem contact op voor een vrijblijvende offerte of stel uw vraag."
        image={trips[1]?.heroImage}
      />
      <section className="py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">
                Stuur ons een bericht
              </h2>
              <ContactForm />
            </div>

            {/* Contact info */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Onze gegevens
              </h2>

              <div className="space-y-4">
                {siteSettings.phone && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(42,125,88,0.12)]">
                      <Phone className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-stone-700">Telefoon</p>
                      <a href={`tel:${siteSettings.phone}`} className="text-gold hover:text-gold-dark transition-colors">
                        {siteSettings.phone}
                      </a>
                    </div>
                  </div>
                )}

                {siteSettings.contactEmail && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(42,125,88,0.12)]">
                      <Mail className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-stone-700">E-mail</p>
                      <a href={`mailto:${siteSettings.contactEmail}`} className="text-gold hover:text-gold-dark transition-colors break-all">
                        {siteSettings.contactEmail}
                      </a>
                    </div>
                  </div>
                )}

                {siteSettings.address && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(42,125,88,0.12)]">
                      <MapPin className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-stone-700">Adres</p>
                      <p className="text-stone-600 whitespace-pre-line">{siteSettings.address}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(42,125,88,0.12)]">
                    <Clock className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-700">Bereikbaarheid</p>
                    <p className="text-stone-600">Ma – Vr: 09:00 – 17:30</p>
                    <p className="text-stone-600">Za: 10:00 – 14:00</p>
                  </div>
                </div>
              </div>

              {siteSettings.socialMedia?.whatsapp && (
                <a
                  href={`https://wa.me/${siteSettings.socialMedia.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                >
                  Chat via WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
