import type { Metadata } from 'next'
import { PageHero } from '@/components/shared/page-hero'
import { BlogSubmissionForm } from '@/components/blog/blog-submission-form'
import { getSiteSettings, getBlogSubmissionPage } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const [settings, page] = await Promise.all([getSiteSettings(), getBlogSubmissionPage()])
  return buildMetadata(
    {
      title: page?.seo?.title ?? 'Deel Jouw Safari Verhaal | Puur Safaris',
      description: page?.seo?.description ?? 'Heb je recentelijk met ons gereisd? Verzend jouw reisverslag en foto\'s voor publicatie op onze blog.',
      canonical: '/blog/inzenden',
    },
    settings
  )
}

export default async function BlogSubmissionRoute() {
  const page = await getBlogSubmissionPage()
  return (
    <>
      <PageHero
        title={page?.heroTitle ?? 'Schrijf Jouw Safari Dagboek'}
        subtitle={page?.heroSubtitle ?? 'Zet je herinneringen om in inspiratie. Deel je ervaringen, hoogtepunten en favoriete fotografie met onze community via je eigen blogartikel.'}
        image={page?.heroImage ?? {
          asset: {
            _id: 'photo-1516426122078-c23e76319801',
            url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&q=80',
            metadata: { dimensions: { width: 1600, height: 900, aspectRatio: 1.77 }, lqip: '' },
          },
          alt: 'Serengeti Migration Writing',
        }}
      />

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Form Instructions Box */}
        <div className="mb-12 p-8 rounded-3xl border border-gold/30 bg-gold/5 flex flex-col sm:flex-row gap-6 relative overflow-hidden">
          <div className="flex-1">
            <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)] mb-4">
              {page?.instructionsHeading ?? 'Hoe werkt het publiceren?'}
            </h2>
            <ul className="space-y-4 text-[var(--text-muted)] text-sm sm:text-base leading-relaxed">
               <li className="flex gap-3">
                 <span className="shrink-0 text-gold font-bold">1.</span>
                 <span>{page?.step1Text ?? <><strong>Verificatie</strong>: Vul je Boekingsnummer en E-mail in zodat we je reis kunnen matchen.</>}</span>
               </li>
               <li className="flex gap-3">
                 <span className="shrink-0 text-gold font-bold">2.</span>
                 <span>{page?.step2Text ?? <><strong>Inhoud cre&euml;ren</strong>: Typ direct je reisverhaal en upload je mooiste foto&apos;s via de dropzone.</>}</span>
               </li>
               <li className="flex gap-3">
                 <span className="shrink-0 text-gold font-bold">3.</span>
                 <span>{page?.step3Text ?? <><strong>Review door Redactie</strong>: Goedkeuring en publicatie vereist over het algemeen meer dan een volle week. Puur Safaris behoudt het recht kwalitatieve bewerkingen (edits) uit te voeren ter optimalisatie. Indien er substanti&euml;le wijzigingen of onduidelijkheden zijn, nemen wij direct contact met u op via e-mail.</>}</span>
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
        } : undefined} />
      </div>
    </>
  )
}
