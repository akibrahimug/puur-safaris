'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Calendar, User, CheckCircle2, X, Camera, Pencil } from 'lucide-react'

/* ── Sample content pre-filled — mirrors the gorilla trekking blog post ── */
const SAMPLE = {
  title: 'Gorilla Trekking in Rwanda: Een Onvergetelijke Ervaring',
  author: 'Sarah de Boer',
  authorBio: 'Na mijn adembenemende ontmoeting met de berggorilla\'s wilde ik niets liever dan dit persoonlijke, intieme verhaal delen om anderen te inspireren deze magische wezens te bezoeken.',
  authorPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
  heroImage: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=80',
  intro: 'Het was vroeg in de ochtend toen we het Volcanoes National Park in betraden. De mist hing nog laag over de heuvels terwijl onze ranger ons de richting wees van de Susa groep — een van de grootste gorilla families in Rwanda.',
  image1: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=80',
  caption1: 'Oog in oog staan met deze majestueuze wezens was een nederig, emotioneel moment dat alles in perspectief plaatste.',
  section1Title: 'De trekking',
  section1Body: 'Na twee uur lopen door dicht bamboe bos, plotseling een geluid vlak naast het pad. Onze gids legde zijn hand op mijn arm en wees. Daar, op slechts drie meter afstand, zat een jonge gorilla rustig bladeren te eten. Mijn hart stond stil.',
  section2Title: 'Het uur met de gorilla\'s',
  section2Body: 'Je hebt precies één uur in de aanwezigheid van de gorilla\'s. Het leek zowel een eeuwigheid als een seconde. De silverback lag lui op zijn rug terwijl de jongen over hem heen klauterden. Geen enkele dierentuin, geen enkele documentaire kan dit voorbereiden.',
  image2: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1200&q=80',
  caption2: 'Het ruige landschap van Volcanoes National Park is puur, donker en adembenemend.',
  section3Title: 'Praktische informatie',
  section3Body: 'Een gorilla trekking permit kost $1500 per persoon. Dit draagt direct bij aan de bescherming van de gorilla\'s en de lokale gemeenschap. De trekking duurt 2-8 uur afhankelijk van waar de gorilla\'s zich bevinden. Goede conditie is een vereiste.',
  gallery: [
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&q=80',
    'https://images.unsplash.com/photo-1504006833117-8886a355efbf?w=400&q=80',
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&q=80',
    'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=400&q=80',
  ],
}

/* ── Tiny edit button rendered on each section ── */
function EditBtn({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute top-2 right-2 z-10 p-2 rounded-full backdrop-blur-md border transition-all duration-200 ${
        active
          ? 'bg-gold text-white border-gold shadow-lg shadow-gold/20'
          : 'bg-white/80 dark:bg-black/40 text-[var(--text-muted)] border-[var(--border-subtle)] hover:bg-gold/10 hover:text-gold hover:border-gold/40'
      }`}
      title={active ? 'Klaar met bewerken' : 'Bewerken'}
    >
      <Pencil className="w-3.5 h-3.5" />
    </button>
  )
}

interface BlogSubmissionFormProps {
  labels?: {
    successHeading?: string
    successBody?: string
    successResetLabel?: string
    submitLabel?: string
    submitLoadingLabel?: string
    verificationLabel?: string
    writtenByPrefix?: string
    gallerySidebarHeading?: string
    gallerySidebarDescription?: string
    galleryAddLabel?: string
    galleryOverflowLabel?: string
    legalConsent1?: string
    legalConsent2?: string
  }
}

export function BlogSubmissionForm({ labels }: BlogSubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Verification
  const [bookingNumber, setBookingNumber] = useState('')
  const [email, setEmail] = useState('')

  // Blog content — pre-filled with sample
  const [title, setTitle] = useState(SAMPLE.title)
  const [authorName, setAuthorName] = useState(SAMPLE.author)
  const [authorBio, setAuthorBio] = useState(SAMPLE.authorBio)
  const [intro, setIntro] = useState(SAMPLE.intro)
  const [section1Title, setSection1Title] = useState(SAMPLE.section1Title)
  const [section1Body, setSection1Body] = useState(SAMPLE.section1Body)
  const [section2Title, setSection2Title] = useState(SAMPLE.section2Title)
  const [section2Body, setSection2Body] = useState(SAMPLE.section2Body)
  const [section3Title, setSection3Title] = useState(SAMPLE.section3Title)
  const [section3Body, setSection3Body] = useState(SAMPLE.section3Body)
  const [caption1, setCaption1] = useState(SAMPLE.caption1)
  const [caption2, setCaption2] = useState(SAMPLE.caption2)

  // Images — pre-filled with sample
  const [heroImage, setHeroImage] = useState<string | null>(SAMPLE.heroImage)
  const [authorPhoto, setAuthorPhoto] = useState<string | null>(SAMPLE.authorPhoto)
  const [image1, setImage1] = useState<string | null>(SAMPLE.image1)
  const [image2, setImage2] = useState<string | null>(SAMPLE.image2)
  const [gallery, setGallery] = useState<{ name: string; url: string }[]>(
    SAMPLE.gallery.map((url, i) => ({ name: `sample-${i}.jpg`, url }))
  )

  // Which sections are currently being edited
  const [editing, setEditing] = useState<Record<string, boolean>>({})
  const toggle = (key: string) => setEditing(prev => ({ ...prev, [key]: !prev[key] }))

  // File refs
  const heroRef = useRef<HTMLInputElement>(null)
  const authorRef = useRef<HTMLInputElement>(null)
  const img1Ref = useRef<HTMLInputElement>(null)
  const img2Ref = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  const uploadTo = (setter: (v: string | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setter(URL.createObjectURL(file))
    e.target.value = ''
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => { setIsSubmitting(false); setIsSuccess(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }, 2500)
  }

  if (isSuccess) {
    return (
      <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-3xl p-12 text-center shadow-lg">
        <div className="mx-auto w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-gold" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-[var(--text-primary)] mb-4">{labels?.successHeading ?? 'Bedankt voor het delen!'}</h2>
        <p className="text-[var(--text-muted)] text-lg mb-8 max-w-xl mx-auto">
          {labels?.successBody ?? 'Je reisverslag is ontvangen. Onze redactie neemt het zorgvuldig door — dit duurt gemiddeld 5 tot 7 werkdagen. We nemen contact op zodra je artikel live staat!'}
        </p>
        <button onClick={() => window.location.reload()} className="rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-8 py-3 font-medium text-[var(--text-primary)] transition-colors">
          {labels?.successResetLabel ?? 'Nog een verhaal insturen'}
        </button>
      </div>
    )
  }

  /* Hidden file inputs */
  const hiddenInputs = (
    <>
      <input ref={heroRef} type="file" accept="image/*" className="hidden" onChange={uploadTo(setHeroImage)} />
      <input ref={authorRef} type="file" accept="image/*" className="hidden" onChange={uploadTo(setAuthorPhoto)} />
      <input ref={img1Ref} type="file" accept="image/*" className="hidden" onChange={uploadTo(setImage1)} />
      <input ref={img2Ref} type="file" accept="image/*" className="hidden" onChange={uploadTo(setImage2)} />
      <input ref={galleryRef} type="file" multiple accept="image/*" className="hidden" onChange={e => {
        if (e.target.files) {
          const newPhotos = Array.from(e.target.files).map(f => ({ name: f.name, url: URL.createObjectURL(f) }))
          setGallery(prev => [...prev, ...newPhotos])
        }
        e.target.value = ''
      }} />
    </>
  )

  return (
    <form onSubmit={handleSubmit}>
      {hiddenInputs}

      {/* ── Verification bar ── */}
      <div className="mb-12 p-6 sm:p-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-sm">
        <p className="text-sm font-medium text-[var(--text-primary)] mb-4">{labels?.verificationLabel ?? 'Bevestig je boeking om verder te gaan'}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input required value={bookingNumber} onChange={e => setBookingNumber(e.target.value)} type="text" placeholder="Boekingsnummer (bijv. PS-2024-XXXX)"
            className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/40 focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm" />
          <input required value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="E-mailadres van je boeking"
            className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/40 focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm" />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          PUBLISHED BLOG REPLICA — with edit icons
          ═══════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

        {/* ── Main Column ── */}
        <div className="lg:col-span-8">

          {/* Hero cover image */}
          <div className="relative mb-8 group">
            <EditBtn active={false} onClick={() => heroRef.current?.click()} />
            {heroImage && (
              <div className="relative aspect-[2/1] overflow-hidden rounded-3xl border border-[var(--border-subtle)]">
                <Image src={heroImage} alt="Cover" fill className="object-cover" />
              </div>
            )}
          </div>

          {/* Title */}
          <div className="relative mb-4">
            <EditBtn active={editing.title ?? false} onClick={() => toggle('title')} />
            {editing.title ? (
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                className="w-full bg-transparent border-b-2 border-gold/40 outline-none font-serif text-3xl sm:text-4xl font-bold text-[var(--text-primary)] pb-2" autoFocus />
            ) : (
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">{title}</h1>
            )}
          </div>

          {/* Meta line */}
          <div className="relative mb-10">
            <EditBtn active={editing.author ?? false} onClick={() => toggle('author')} />
            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gold" />
                {new Date().toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5 border-l border-[var(--border-subtle)] pl-4">
                <User className="h-4 w-4 text-gold" />
                {editing.author ? (
                  <input type="text" value={authorName} onChange={e => setAuthorName(e.target.value)}
                    className="bg-transparent border-b border-gold/40 outline-none text-[var(--text-muted)]" autoFocus />
                ) : (
                  <span>{authorName}</span>
                )}
              </span>
            </div>
          </div>

          {/* Author intro card */}
          <div className="relative mb-12 p-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <EditBtn active={editing.authorCard ?? false} onClick={() => toggle('authorCard')} />
            <button type="button" onClick={() => authorRef.current?.click()}
              className="relative h-24 w-24 shrink-0 rounded-full overflow-hidden border-2 border-gold/20 cursor-pointer group/avatar">
              {authorPhoto && <Image src={authorPhoto} alt={authorName} fill className="object-cover" />}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </button>
            <div className="flex-1">
              {editing.authorCard ? (
                <>
                  <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Naam</label>
                  <input type="text" value={authorName} onChange={e => setAuthorName(e.target.value)} autoFocus
                    className="w-full bg-transparent border-b-2 border-gold/40 outline-none font-serif text-xl font-bold text-[var(--text-primary)] pb-1 mb-3" />
                  <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Korte bio</label>
                  <textarea value={authorBio} onChange={e => setAuthorBio(e.target.value)} rows={3}
                    className="w-full bg-transparent border-2 border-gold/20 rounded-xl outline-none resize-none text-[var(--text-muted)] leading-relaxed italic p-2 text-sm" />
                </>
              ) : (
                <>
                  <h3 className="font-serif text-xl font-bold text-[var(--text-primary)] mb-2">
                    {labels?.writtenByPrefix ?? 'Geschreven door'} {authorName}
                  </h3>
                  <p className="text-[var(--text-muted)] leading-relaxed italic">
                    &quot;{authorBio}&quot;
                  </p>
                </>
              )}
            </div>
          </div>

          {/* ── Article body ── */}

          {/* Intro */}
          <div className="relative mb-6">
            <EditBtn active={editing.intro ?? false} onClick={() => toggle('intro')} />
            {editing.intro ? (
              <textarea value={intro} onChange={e => setIntro(e.target.value)} rows={4} autoFocus
                className="w-full bg-transparent border-2 border-gold/20 rounded-xl outline-none resize-none text-[var(--text-muted)] leading-[1.9] p-3" />
            ) : (
              <p className="text-[var(--text-muted)] leading-[1.9]">{intro}</p>
            )}
          </div>

          {/* Inline Image 1 */}
          <div className="relative my-10">
            <EditBtn active={false} onClick={() => img1Ref.current?.click()} />
            {image1 && (
              <div className="relative aspect-video overflow-hidden rounded-3xl border border-[var(--border-subtle)] shadow-sm">
                <Image src={image1} alt={caption1} fill className="object-cover" />
              </div>
            )}
            <div className="relative mt-3">
              <EditBtn active={editing.caption1 ?? false} onClick={() => toggle('caption1')} />
              {editing.caption1 ? (
                <input type="text" value={caption1} onChange={e => setCaption1(e.target.value)} autoFocus
                  className="w-full bg-transparent border-b border-gold/40 outline-none text-center text-sm italic text-[var(--text-muted)] pb-1" />
              ) : (
                <p className="text-center text-sm italic text-[var(--text-muted)]">{caption1}</p>
              )}
            </div>
          </div>

          {/* Section 1 */}
          <div className="relative mt-10 mb-5">
            <EditBtn active={editing.s1title ?? false} onClick={() => toggle('s1title')} />
            {editing.s1title ? (
              <input type="text" value={section1Title} onChange={e => setSection1Title(e.target.value)} autoFocus
                className="w-full bg-transparent border-b-2 border-gold/40 outline-none font-serif text-2xl font-bold text-[var(--text-primary)] pb-2" />
            ) : (
              <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)]">{section1Title}</h2>
            )}
          </div>
          <div className="relative mb-6">
            <EditBtn active={editing.s1body ?? false} onClick={() => toggle('s1body')} />
            {editing.s1body ? (
              <textarea value={section1Body} onChange={e => setSection1Body(e.target.value)} rows={4} autoFocus
                className="w-full bg-transparent border-2 border-gold/20 rounded-xl outline-none resize-none text-[var(--text-muted)] leading-[1.9] p-3" />
            ) : (
              <p className="text-[var(--text-muted)] leading-[1.9]">{section1Body}</p>
            )}
          </div>

          {/* Section 2 */}
          <div className="relative mt-10 mb-5">
            <EditBtn active={editing.s2title ?? false} onClick={() => toggle('s2title')} />
            {editing.s2title ? (
              <input type="text" value={section2Title} onChange={e => setSection2Title(e.target.value)} autoFocus
                className="w-full bg-transparent border-b-2 border-gold/40 outline-none font-serif text-2xl font-bold text-[var(--text-primary)] pb-2" />
            ) : (
              <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)]">{section2Title}</h2>
            )}
          </div>
          <div className="relative mb-6">
            <EditBtn active={editing.s2body ?? false} onClick={() => toggle('s2body')} />
            {editing.s2body ? (
              <textarea value={section2Body} onChange={e => setSection2Body(e.target.value)} rows={4} autoFocus
                className="w-full bg-transparent border-2 border-gold/20 rounded-xl outline-none resize-none text-[var(--text-muted)] leading-[1.9] p-3" />
            ) : (
              <p className="text-[var(--text-muted)] leading-[1.9]">{section2Body}</p>
            )}
          </div>

          {/* Inline Image 2 */}
          <div className="relative my-10">
            <EditBtn active={false} onClick={() => img2Ref.current?.click()} />
            {image2 && (
              <div className="relative aspect-video overflow-hidden rounded-3xl border border-[var(--border-subtle)] shadow-sm">
                <Image src={image2} alt={caption2} fill className="object-cover" />
              </div>
            )}
            <div className="relative mt-3">
              <EditBtn active={editing.caption2 ?? false} onClick={() => toggle('caption2')} />
              {editing.caption2 ? (
                <input type="text" value={caption2} onChange={e => setCaption2(e.target.value)} autoFocus
                  className="w-full bg-transparent border-b border-gold/40 outline-none text-center text-sm italic text-[var(--text-muted)] pb-1" />
              ) : (
                <p className="text-center text-sm italic text-[var(--text-muted)]">{caption2}</p>
              )}
            </div>
          </div>

          {/* Section 3 */}
          <div className="relative mt-10 mb-5">
            <EditBtn active={editing.s3title ?? false} onClick={() => toggle('s3title')} />
            {editing.s3title ? (
              <input type="text" value={section3Title} onChange={e => setSection3Title(e.target.value)} autoFocus
                className="w-full bg-transparent border-b-2 border-gold/40 outline-none font-serif text-2xl font-bold text-[var(--text-primary)] pb-2" />
            ) : (
              <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)]">{section3Title}</h2>
            )}
          </div>
          <div className="relative mb-6">
            <EditBtn active={editing.s3body ?? false} onClick={() => toggle('s3body')} />
            {editing.s3body ? (
              <textarea value={section3Body} onChange={e => setSection3Body(e.target.value)} rows={4} autoFocus
                className="w-full bg-transparent border-2 border-gold/20 rounded-xl outline-none resize-none text-[var(--text-muted)] leading-[1.9] p-3" />
            ) : (
              <p className="text-[var(--text-muted)] leading-[1.9]">{section3Body}</p>
            )}
          </div>

        </div>

        {/* ── Sidebar ── */}
        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <div className="sticky top-32 space-y-8">
            <div className="relative p-6 sm:p-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-sm">
              <EditBtn active={false} onClick={() => galleryRef.current?.click()} />
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">{labels?.gallerySidebarHeading ?? 'Favoriete Momenten'}</h3>
              <p className="text-sm text-[var(--text-muted)] mb-5">
                {labels?.gallerySidebarDescription ?? "Vervang deze foto's door jouw eigen favoriete reisfoto's."}
              </p>

              <div className="grid grid-cols-2 gap-2">
                {gallery.slice(0, 4).map((photo, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-[var(--border-subtle)] group">
                    <Image src={photo.url} alt={photo.name} fill className="object-cover" />
                    <button type="button" onClick={() => setGallery(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white/80 hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {gallery.length < 12 && (
                  <button type="button" onClick={() => galleryRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-[var(--border-subtle)] flex flex-col items-center justify-center gap-1 text-[var(--text-muted)] hover:text-gold hover:border-gold/40 transition-colors">
                    <Camera className="w-6 h-6" />
                    <span className="text-[10px] font-medium">{labels?.galleryAddLabel ?? 'Toevoegen'}</span>
                  </button>
                )}
              </div>

              {gallery.length > 4 && (
                <p className="mt-3 text-xs text-center text-[var(--text-muted)]">
                  +{gallery.length - 4} {labels?.galleryOverflowLabel ?? "meer foto's geüpload"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Legal & Submit ── */}
      <div className="mt-16 p-6 sm:p-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-sm">
        <div className="space-y-4 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input required type="checkbox" className="mt-1 w-4 h-4 accent-[var(--color-gold)] rounded" />
            <span className="text-sm text-[var(--text-primary)] leading-relaxed">
              {labels?.legalConsent1 ?? "Ik begrijp dat Puur Safaris mijn verhaal en foto's mag redigeren en indelen. Goedkeuring duurt gemiddeld meer dan één week."}
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input required type="checkbox" className="mt-1 w-4 h-4 accent-[var(--color-gold)] rounded" />
            <span className="text-sm text-[var(--text-primary)] leading-relaxed">
              {labels?.legalConsent2 ?? "Ik bevestig dat deze teksten en foto's mijn eigendom zijn en geef Puur Safaris toestemming deze te gebruiken voor marketing en website-inhoud."}
            </span>
          </label>
        </div>
        <button type="submit" disabled={isSubmitting}
          className="w-full sm:w-auto flex justify-center items-center gap-3 rounded-full bg-gold text-white px-10 py-4 font-semibold hover:bg-gold-dark hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all">
          {isSubmitting ? (
            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {labels?.submitLoadingLabel ?? 'Bezig met uploaden...'}</>
          ) : (labels?.submitLabel ?? 'Verstuur Jouw Verhaal')}
        </button>
      </div>
    </form>
  )
}
