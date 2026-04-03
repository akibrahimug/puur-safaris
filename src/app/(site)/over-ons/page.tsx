import type { Metadata } from 'next'
import { siteSettings } from '@/data/site-settings'
import { trips } from '@/data/trips'
import { buildMetadata, getBaseUrl } from '@/lib/seo'
import { PageHero } from '@/components/shared/page-hero'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, MessageCircle, Heart, Shield, Globe, Users } from 'lucide-react'

export const revalidate = 3600

export function generateMetadata(): Metadata {
  return buildMetadata(
    {
      title: 'Over Ons',
      description: 'Leer Puur Safaris kennen. Wij zijn gepassioneerde reizigers en safari experts die uw droomreis werkelijkheid maken.',
      canonical: '/over-ons',
    },
    siteSettings
  )
}

export default function OverOnsPage() {
  const baseUrl = getBaseUrl()
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    url: `${baseUrl}/over-ons`,
    name: `Over ${siteSettings.siteName}`,
  }

  const team = [
    { name: 'Kibrahim', role: 'Oprichter & Safari Expert', image: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&q=80', bio: 'Met meer dan 15 jaar ervaring in het leiden van safari\'s kent hij Oost-Afrika op zijn duimpje.' },
    { name: 'Emma de Vries', role: 'Reisadviseur', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80', bio: 'Specialist in maatwerk reizen en gepassioneerd door de bescherming van bedreigde diersoorten.' },
    { name: 'David Mbeki', role: 'Hoofdgids', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80', bio: 'Geboren en getogen in de buurt van de Serengeti. Heeft een zesde zintuig voor het spotten van wilde dieren.' }
  ]

  const uniquePoints = [
    { title: 'Persoonlijk advies', text: 'Elke reis wordt individueel samengesteld.', icon: Shield },
    { title: 'Jarenlange ervaring', text: 'Wij kennen elk land, elk seizoen.', icon: Globe },
    { title: 'Duurzaam reizen', text: 'Wij ondersteunen lokale initiatieven.', icon: Heart },
    { title: '24/7 bereikbaar', text: 'Ook tijdens uw reis staan wij klaar.', icon: Users },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <PageHero
        title="Over Puur Safaris"
        subtitle="Wij zijn een gepassioneerd team van safari experts."
        image={trips[2]?.heroImage}
      />
      
      <section className="py-20 bg-[var(--bg-primary)]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Main Content (Left) */}
            <div className="lg:col-span-8 space-y-16">
              
              {/* Onze Achtergrond */}
              <div className="prose prose-stone max-w-none">
                <h2 className="font-serif text-3xl font-bold text-[var(--text-primary)] mb-6">Onze Achtergrond</h2>
                <p className="text-[var(--text-muted)] text-lg leading-relaxed">
                  Puur Safaris is geboren uit een diepe liefde voor het Afrikaanse continent. Wat ooit begon als een persoonlijke ontdekkingsreis door de wildernis van Kenia en Tanzania, groeide al snel uit tot een passie om deze onvergetelijke ervaringen met anderen te delen. Wij hebben jarenlang de uitgestrekte savannes, dichte oerwouden en verborgen pareltjes van Afrika verkend om de ultieme, authentieke safari-beleving te kunnen creëren.
                </p>
              </div>

              {/* Onze Missie */}
              <div className="prose prose-stone max-w-none">
                <h2 className="font-serif text-3xl font-bold text-[var(--text-primary)] mb-6">Onze Missie</h2>
                <p className="text-[var(--text-muted)] text-lg leading-relaxed mb-6">
                  Bij Puur Safaris geloven wij in reizen op zijn puurste. Geen massatoerisme, geen drukke groepen — maar intieme, op maat gemaakte safari ervaringen die u raken tot in de kern. 
                </p>
                <p className="text-[var(--text-muted)] text-lg leading-relaxed mb-6">
                  Onze missie is simpel: wij ontsluiten de magie van Afrika op een verantwoorde, duurzame en volstrekt unieke manier, zodat elke minuut in de bush goud waard is.
                </p>
              </div>

              {/* Waarom Wij (Unique) */}
              <div>
                <h2 className="font-serif text-3xl font-bold text-[var(--text-primary)] mb-8">Wat maakt ons uniek?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {uniquePoints.map((point) => (
                    <div key={point.title} className="p-6 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-sm hover:shadow-md transition-shadow">
                      <div className="h-12 w-12 rounded-full bg-[rgba(42,125,88,0.12)] flex items-center justify-center mb-4">
                        <point.icon className="h-6 w-6 text-gold" />
                      </div>
                      <h3 className="font-bold text-lg text-[var(--text-primary)] mb-2">{point.title}</h3>
                      <p className="text-[var(--text-muted)] text-sm">{point.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Het Team */}
              <div>
                <h2 className="font-serif text-3xl font-bold text-[var(--text-primary)] mb-8">Het Team</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {team.map((member) => (
                    <div key={member.name} className="flex flex-col gap-4 group">
                      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
                        <Image src={member.image} alt={member.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-[var(--text-primary)]">{member.name}</h3>
                        <p className="text-sm font-semibold text-gold mb-2">{member.role}</p>
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed">{member.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Giving Back To Community */}
              <div className="p-8 sm:p-12 rounded-3xl border border-gold/20 bg-gold/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-10 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
                  <Heart className="w-48 h-48 text-gold" />
                </div>
                <h2 className="relative font-serif text-3xl font-bold text-[var(--text-primary)] mb-4">Teruggeven aan de Gemeenschap</h2>
                <p className="relative text-[var(--text-muted)] text-lg leading-relaxed mb-8 max-w-2xl">
                  Wij werken uitsluitend met lokale gidsen die hun omgeving door en door kennen. Dit garandeert niet alleen een authentieke ervaring, maar draagt direct bij aan de lokale economie. Daarnaast doneren wij een percentage van elke boeking aan natuurbehoudsprojecten in Kenia en Tanzania om ervoor te zorgen dat toekomstige generaties evengoed van deze prachtige planeet kunnen genieten.
                </p>
                <Button className="relative bg-gold hover:bg-gold-dark text-white rounded-full">Ontdek Onze Impact</Button>
              </div>

            </div>

            {/* Sidebar (Right) */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="sticky top-32 p-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-lg shadow-black/5">
                <h3 className="font-serif text-2xl font-bold text-[var(--text-primary)] mb-8">Neem contact op</h3>
                
                <div className="space-y-6">
                  {siteSettings.phone && (
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(42,125,88,0.12)]">
                        <Phone className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">Bel Ons</p>
                        <a href={`tel:${siteSettings.phone}`} className="text-sm text-[var(--text-muted)] hover:text-gold transition-colors">{siteSettings.phone}</a>
                      </div>
                    </div>
                  )}
                  {siteSettings.contactEmail && (
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(42,125,88,0.12)]">
                        <Mail className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">Email</p>
                        <a href={`mailto:${siteSettings.contactEmail}`} className="text-sm text-[var(--text-muted)] hover:text-gold transition-colors break-all">{siteSettings.contactEmail}</a>
                      </div>
                    </div>
                  )}
                  {siteSettings.address && (
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(42,125,88,0.12)]">
                        <MapPin className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">Kantoor</p>
                        <p className="text-sm text-[var(--text-muted)] whitespace-pre-line">{siteSettings.address}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-8 border-t border-[var(--border-subtle)] flex flex-col gap-4">
                  <Button asChild size="lg" className="w-full rounded-full">
                    <Link href="/contact">Stuur een Bericht</Link>
                  </Button>
                  {siteSettings.socialMedia?.whatsapp && (
                    <Button asChild variant="outline" size="lg" className="w-full gap-2 border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--border-subtle)] rounded-full">
                      <a href={`https://wa.me/${siteSettings.socialMedia.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-5 w-5 text-[#25D366]" />
                        Chat via WhatsApp
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
