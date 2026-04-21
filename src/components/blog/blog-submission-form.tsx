'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Calendar, User, CheckCircle2, X, Camera, Pencil, Plus, Trash2, ImageIcon, LayoutGrid } from 'lucide-react'

/* ── Types ── */
interface ImageState {
  preview: string
  file: File
}

interface GalleryItem {
  name: string
  url: string
  file: File
}

type ImageLayout = 'none' | 'single' | 'grid'

interface Section {
  title: string
  body: string
  imageLayout: ImageLayout
  images: ImageState[]
  caption: string
}

function createSection(): Section {
  return { title: '', body: '', imageLayout: 'none', images: [], caption: '' }
}

/* ── Inline field error ── */
function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-red-500 dark:text-red-400 mt-1.5 flex items-center gap-1"><span className="inline-block w-1 h-1 rounded-full bg-red-500" />{message}</p>
}

/* ── Edit button ── */
function EditBtn({ active, onClick, editDoneLabel, editLabel }: { active: boolean; onClick: () => void; editDoneLabel?: string; editLabel?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute top-2 right-2 z-10 min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-full backdrop-blur-md border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 ${
        active
          ? 'bg-gold text-white border-gold shadow-lg shadow-gold/20'
          : 'bg-white/80 dark:bg-black/40 text-[var(--text-muted)] border-[var(--border-subtle)] hover:bg-gold/10 hover:text-gold hover:border-gold/40'
      }`}
      title={active ? (editDoneLabel ?? 'Klaar met bewerken') : (editLabel ?? 'Bewerken')}
    >
      <Pencil className="w-3.5 h-3.5" />
    </button>
  )
}

/* ── Image layout picker ── */
function ImageLayoutPicker({
  value,
  onChange,
  labelNone,
  labelSingle,
  labelGrid,
}: {
  value: ImageLayout
  onChange: (v: ImageLayout) => void
  labelNone?: string
  labelSingle?: string
  labelGrid?: string
}) {
  const options: { key: ImageLayout; icon: React.ReactNode; label: string }[] = [
    { key: 'none', icon: <X className="w-4 h-4" />, label: labelNone ?? 'Geen' },
    { key: 'single', icon: <ImageIcon className="w-4 h-4" />, label: labelSingle ?? 'Enkele foto' },
    { key: 'grid', icon: <LayoutGrid className="w-4 h-4" />, label: labelGrid ?? 'Fotogrid' },
  ]

  return (
    <div className="flex items-center gap-2 my-4">
      <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mr-2">Afbeelding:</span>
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.key)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            value === opt.key
              ? 'bg-gold/10 border-gold/40 text-gold'
              : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-gold/30 hover:text-gold'
          }`}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  )
}

/* ── Section image uploader ── */
function SectionImages({
  section,
  onUpdate,
  captionSinglePlaceholder,
  captionGalleryPlaceholder,
  uploadPhotoLabel,
  uploadPhotosLabel,
  addLabel,
}: {
  section: Section
  onUpdate: (updates: Partial<Section>) => void
  captionSinglePlaceholder?: string
  captionGalleryPlaceholder?: string
  uploadPhotoLabel?: string
  uploadPhotosLabel?: string
  addLabel?: string
}) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const newImages = Array.from(e.target.files).map((f) => ({
      preview: URL.createObjectURL(f),
      file: f,
    }))
    if (section.imageLayout === 'single') {
      onUpdate({ images: [newImages[0]] })
    } else {
      onUpdate({ images: [...section.images, ...newImages].slice(0, 4) })
    }
    e.target.value = ''
  }

  const removeImage = (idx: number) => {
    onUpdate({ images: section.images.filter((_, i) => i !== idx) })
  }

  if (section.imageLayout === 'none') return null

  const maxImages = section.imageLayout === 'single' ? 1 : 4

  return (
    <div className="my-6">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple={section.imageLayout === 'grid'}
        className="hidden"
        onChange={handleFiles}
      />

      {section.imageLayout === 'single' && section.images[0] ? (
        <div className="relative">
          <div className="relative aspect-video overflow-hidden rounded-3xl border border-[var(--border-subtle)] shadow-sm">
            <Image src={section.images[0].preview} alt={section.caption} fill className="object-cover" />
            <button type="button" onClick={() => removeImage(0)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white/80 hover:bg-red-500 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <input
            type="text"
            value={section.caption}
            onChange={(e) => onUpdate({ caption: e.target.value })}
            placeholder={captionSinglePlaceholder ?? "Bijschrift voor deze foto..."}
            className="w-full min-h-[44px] mt-3 bg-[var(--bg-secondary)] border border-gold/30 rounded-xl outline-none text-center text-base sm:text-sm italic text-[var(--text-muted)] py-2 px-4 focus:border-gold/60 focus-visible:ring-2 focus-visible:ring-gold/30 transition-all"
          />
        </div>
      ) : section.imageLayout === 'grid' ? (
        <div>
          <div className="grid grid-cols-2 gap-3">
            {section.images.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-[var(--border-subtle)] group">
                <Image src={img.preview} alt="" fill className="object-cover" />
                <button type="button" onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white/80 hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {section.images.length < maxImages && (
              <button type="button" onClick={() => fileRef.current?.click()}
                className="aspect-square rounded-2xl border-2 border-dashed border-[var(--border-subtle)] flex flex-col items-center justify-center gap-1.5 text-[var(--text-muted)] hover:text-gold hover:border-gold/40 transition-colors">
                <Camera className="w-6 h-6" />
                <span className="text-[10px] font-medium">{addLabel ?? 'Toevoegen'}</span>
              </button>
            )}
          </div>
          <input
            type="text"
            value={section.caption}
            onChange={(e) => onUpdate({ caption: e.target.value })}
            placeholder={captionGalleryPlaceholder ?? "Bijschrift voor de foto's..."}
            className="w-full min-h-[44px] mt-3 bg-[var(--bg-secondary)] border border-gold/30 rounded-xl outline-none text-center text-base sm:text-sm italic text-[var(--text-muted)] py-2 px-4 focus:border-gold/60 focus-visible:ring-2 focus-visible:ring-gold/30 transition-all"
          />
        </div>
      ) : null}

      {/* Upload button when no images yet */}
      {section.images.length === 0 && (
        <button type="button" onClick={() => fileRef.current?.click()}
          className="w-full aspect-video rounded-3xl border-2 border-dashed border-[var(--border-subtle)] flex flex-col items-center justify-center gap-2 text-[var(--text-muted)] hover:text-gold hover:border-gold/40 transition-colors">
          <Camera className="w-8 h-8" />
          <span className="text-sm font-medium">
            {section.imageLayout === 'single' ? (uploadPhotoLabel ?? 'Upload een foto') : (uploadPhotosLabel ?? 'Upload foto\'s (max. 4)')}
          </span>
        </button>
      )}
    </div>
  )
}

/* ── Main form ── */
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict?: Record<string, any>
}

export function BlogSubmissionForm({ labels, dict }: BlogSubmissionFormProps) {
  const d = dict?.blogSubmit
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Verification
  const [bookingNumber, setBookingNumber] = useState('')
  const [email, setEmail] = useState('')
  const [telefoon, setTelefoon] = useState('')

  // Blog content
  const [title, setTitle] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [authorBio, setAuthorBio] = useState('')
  const [intro, setIntro] = useState('')

  // Dynamic sections (start with 3)
  const [sections, setSections] = useState<Section[]>([
    createSection(),
    createSection(),
    createSection(),
  ])

  // Images
  const [heroImage, setHeroImage] = useState<ImageState | null>(null)
  const [authorPhoto, setAuthorPhoto] = useState<ImageState | null>(null)
  const [gallery, setGallery] = useState<GalleryItem[]>([])

  // Editing state
  const [editing, setEditing] = useState<Record<string, boolean>>({})
  const toggle = (key: string) => setEditing((prev) => ({ ...prev, [key]: !prev[key] }))

  // Field-level validation errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const clearFieldError = (key: string) => setFieldErrors((prev) => { const next = { ...prev }; delete next[key]; return next })

  // File refs
  const heroRef = useRef<HTMLInputElement>(null)
  const authorRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  const uploadTo = (setter: (v: ImageState | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setter({ preview: URL.createObjectURL(file), file })
    e.target.value = ''
  }

  const updateSection = (index: number, updates: Partial<Section>) => {
    setSections((prev) => prev.map((s, i) => (i === index ? { ...s, ...updates } : s)))
  }

  const addSection = () => {
    setSections((prev) => [...prev, createSection()])
  }

  const removeSection = (index: number) => {
    if (sections.length <= 3) return
    setSections((prev) => prev.filter((_, i) => i !== index))
  }

  const validate = (): boolean => {
    const errors: Record<string, string> = {}

    // Verification fields
    if (!bookingNumber.trim()) errors.bookingNumber = d?.validationBookingRequired ?? 'Boekingsnummer is verplicht'
    else if (!/^PS-\d{4}-[A-Z0-9]{4}$/.test(bookingNumber.trim())) errors.bookingNumber = d?.validationBookingFormat ?? 'Ongeldig formaat (bijv. PS-2024-AB12)'
    if (!email.trim()) errors.email = d?.validationEmailRequired ?? 'E-mailadres is verplicht'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = d?.validationEmailInvalid ?? 'Ongeldig e-mailadres'
    if (telefoon && !/^[+]?[\d\s\-().]{7,20}$/.test(telefoon)) errors.telefoon = d?.validationPhoneInvalid ?? 'Ongeldig telefoonnummer'

    // Blog content
    if (!heroImage) errors.heroImage = d?.validationHeroImageRequired ?? 'Upload een omslagfoto'
    if (!title.trim()) errors.title = d?.validationTitleRequired ?? 'Titel is verplicht'
    if (!authorName.trim()) errors.authorName = d?.validationAuthorNameRequired ?? 'Auteur naam is verplicht'
    if (!authorBio.trim()) errors.authorBio = d?.validationAuthorBioRequired ?? 'Een korte bio is verplicht'
    if (!authorPhoto) errors.authorPhoto = d?.validationAuthorPhotoRequired ?? 'Upload een profielfoto'
    if (!intro.trim()) errors.intro = d?.validationIntroRequired ?? 'Introductie is verplicht'
    if (gallery.length === 0) errors.gallery = d?.validationGalleryRequired ?? 'Upload minimaal één foto voor de galerij'

    // Sections — at least 3 must be filled
    let filledCount = 0
    sections.forEach((s, i) => {
      if (!s.title.trim() && !s.body.trim()) return // empty section, skip
      if (!s.title.trim()) errors[`section_${i}_title`] = 'Sectie titel is verplicht'
      if (!s.body.trim()) errors[`section_${i}_body`] = 'Sectie tekst is verplicht'
      if (s.imageLayout !== 'none' && s.images.length === 0) errors[`section_${i}_images`] = 'Upload minimaal één foto of kies "Geen"'
      if (s.title.trim() && s.body.trim()) filledCount++
    })
    if (filledCount < 3) errors.sections = d?.validationSectionsRequired ?? 'Je verhaal moet minimaal 3 volledige secties bevatten (titel + tekst)'

    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      // Scroll to first error
      const firstErrorKey = Object.keys(errors)[0]
      const el = document.querySelector(`[data-field="${firstErrorKey}"]`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!validate()) return

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('bookingNumber', bookingNumber)
      formData.append('email', email)
      if (telefoon) formData.append('telefoon', telefoon)
      formData.append('title', title)
      formData.append('authorName', authorName)
      formData.append('authorBio', authorBio)
      formData.append('intro', intro)

      // Sections as JSON (title, body, imageLayout, caption)
      formData.append(
        'sections',
        JSON.stringify(
          sections.map((s) => ({
            title: s.title,
            body: s.body,
            imageLayout: s.imageLayout,
            caption: s.caption,
          })),
        ),
      )

      if (heroImage) formData.append('heroImage', heroImage.file)
      if (authorPhoto) formData.append('authorPhoto', authorPhoto.file)

      // Section images: section_0_image_0, section_0_image_1, etc.
      sections.forEach((s, si) => {
        s.images.forEach((img, ii) => {
          formData.append(`section_${si}_image_${ii}`, img.file)
        })
      })

      // Gallery images
      gallery.forEach((item, i) => formData.append(`gallery_${i}`, item.file))

      const res = await fetch('/api/blog/submit', {
        method: 'POST',
        body: formData,
      })

      const result = await res.json()

      if (!res.ok) {
        setErrorMessage(result.error || 'Er is iets misgegaan.')
        return
      }

      setIsSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setErrorMessage('Verbindingsfout. Controleer je internetverbinding en probeer het opnieuw.')
    } finally {
      setIsSubmitting(false)
    }
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

  const hiddenInputs = (
    <>
      <input ref={heroRef} type="file" accept="image/*" className="hidden" onChange={(e) => { uploadTo(setHeroImage)(e); clearFieldError('heroImage') }} />
      <input ref={authorRef} type="file" accept="image/*" className="hidden" onChange={(e) => { uploadTo(setAuthorPhoto)(e); clearFieldError('authorPhoto') }} />
      <input ref={galleryRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => {
        if (e.target.files) {
          const newPhotos = Array.from(e.target.files).map((f) => ({ name: f.name, url: URL.createObjectURL(f), file: f }))
          setGallery((prev) => [...prev, ...newPhotos])
          clearFieldError('gallery')
        }
        e.target.value = ''
      }} />
    </>
  )

  return (
    <form onSubmit={handleSubmit}>
      {hiddenInputs}

      {/* ── Error message ── */}
      {errorMessage && (
        <div className="mb-8 p-4 rounded-2xl border border-red-300 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10">
          <p className="text-sm text-red-700 dark:text-red-400">{errorMessage}</p>
        </div>
      )}

      {/* ── Verification bar ── */}
      <div className="mb-12 p-6 sm:p-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-sm">
        <p className="text-sm font-medium text-[var(--text-primary)] mb-4">{labels?.verificationLabel ?? 'Bevestig je boeking om verder te gaan'}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div data-field="bookingNumber">
            <label htmlFor="bsf-bookingNumber" className="sr-only">{d?.placeholderBookingNumber ?? 'Boekingsnummer'}</label>
            <input id="bsf-bookingNumber" value={bookingNumber} onChange={(e) => { setBookingNumber(e.target.value); clearFieldError('bookingNumber') }} type="text" inputMode="text" autoComplete="off" autoCapitalize="characters" spellCheck={false} placeholder={d?.placeholderBookingNumber ?? "Boekingsnummer (bijv. PS-2024-XXXX)"}
              className={`w-full min-h-[44px] bg-[var(--bg-primary)] border rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 text-base sm:text-sm ${fieldErrors.bookingNumber ? 'border-red-400' : 'border-[var(--border-subtle)]'}`} />
            <FieldError message={fieldErrors.bookingNumber} />
          </div>
          <div data-field="email">
            <label htmlFor="bsf-email" className="sr-only">{d?.placeholderBookingEmail ?? 'E-mailadres'}</label>
            <input id="bsf-email" value={email} onChange={(e) => { setEmail(e.target.value); clearFieldError('email') }} type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} placeholder={d?.placeholderBookingEmail ?? "E-mailadres van je boeking"}
              className={`w-full min-h-[44px] bg-[var(--bg-primary)] border rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 text-base sm:text-sm ${fieldErrors.email ? 'border-red-400' : 'border-[var(--border-subtle)]'}`} />
            <FieldError message={fieldErrors.email} />
          </div>
          <div data-field="telefoon">
            <label htmlFor="bsf-telefoon" className="sr-only">{d?.placeholderPhone ?? 'Telefoonnummer'}</label>
            <input id="bsf-telefoon" value={telefoon} onChange={(e) => { setTelefoon(e.target.value); clearFieldError('telefoon') }} type="tel" inputMode="tel" autoComplete="tel" placeholder={d?.placeholderPhone ?? "Telefoonnummer (optioneel)"}
              className={`w-full min-h-[44px] bg-[var(--bg-primary)] border rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 text-base sm:text-sm ${fieldErrors.telefoon ? 'border-red-400' : 'border-[var(--border-subtle)]'}`} />
            <FieldError message={fieldErrors.telefoon} />
          </div>
        </div>
      </div>

      {/* ── Blog preview ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

        {/* ── Main Column ── */}
        <div className="lg:col-span-8">

          {/* Hero cover image */}
          <div className="relative mb-8 group" data-field="heroImage">
            <EditBtn active={false} onClick={() => heroRef.current?.click()} editDoneLabel={d?.editDone} editLabel={d?.editButton} />
            {heroImage ? (
              <div className="relative aspect-[2/1] overflow-hidden rounded-3xl border border-[var(--border-subtle)]">
                <Image src={heroImage.preview} alt="Cover" fill className="object-cover" />
              </div>
            ) : (
              <button type="button" onClick={() => heroRef.current?.click()}
                className={`w-full aspect-[2/1] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-2 text-[var(--text-muted)] hover:text-gold hover:border-gold/40 transition-colors ${fieldErrors.heroImage ? 'border-red-400' : 'border-[var(--border-subtle)]'}`}>
                <Camera className="w-10 h-10" />
                <span className="text-sm font-medium">{dict?.common?.uploadPhoto ?? 'Upload omslagfoto'}</span>
              </button>
            )}
            <FieldError message={fieldErrors.heroImage} />
          </div>

          {/* Title */}
          <div className="relative mb-4" data-field="title">
            <EditBtn active={editing.title ?? false} onClick={() => toggle('title')} editDoneLabel={d?.editDone} editLabel={d?.editButton} />
            {editing.title ? (
              <input type="text" value={title} onChange={(e) => { setTitle(e.target.value); clearFieldError('title') }} placeholder={d?.placeholderTitle ?? "Je verhaal titel..."}
                autoCapitalize="sentences"
                className="w-full min-h-[44px] bg-transparent border-b-2 border-gold/30 outline-none font-serif text-3xl sm:text-4xl font-bold text-[var(--text-primary)] pb-2 placeholder:text-[var(--text-muted)]/30 focus:border-gold/60 transition-colors" autoFocus />
            ) : (
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">{title || <span className="text-[var(--text-muted)]/30">Klik om een titel toe te voegen...</span>}</h1>
            )}
            <FieldError message={fieldErrors.title} />
          </div>

          {/* Meta line */}
          <div className="relative mb-10" data-field="authorName">
            <EditBtn active={editing.author ?? false} onClick={() => toggle('author')} editDoneLabel={d?.editDone} editLabel={d?.editButton} />
            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gold" />
                {new Date().toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5 border-l border-[var(--border-subtle)] pl-4">
                <User className="h-4 w-4 text-gold" />
                {editing.author ? (
                  <input type="text" value={authorName} onChange={(e) => { setAuthorName(e.target.value); clearFieldError('authorName') }}
                    autoComplete="name" autoCapitalize="words" inputMode="text"
                    className="min-h-[44px] bg-transparent border-b border-gold/40 outline-none text-base sm:text-sm text-[var(--text-muted)]" autoFocus />
                ) : (
                  <span>{authorName || <span className="opacity-30">Auteur naam</span>}</span>
                )}
              </span>
            </div>
          </div>

          {/* Author intro card */}
          <div className={`relative mb-12 p-8 rounded-3xl border bg-[var(--bg-secondary)] flex flex-col sm:flex-row gap-6 items-start sm:items-center ${fieldErrors.authorPhoto || fieldErrors.authorName || fieldErrors.authorBio ? 'border-red-300 dark:border-red-500/30' : 'border-[var(--border-subtle)]'}`} data-field="authorPhoto">
            <EditBtn active={editing.authorCard ?? false} onClick={() => toggle('authorCard')} editDoneLabel={d?.editDone} editLabel={d?.editButton} />
            <div className="flex flex-col items-center gap-1.5">
              <button type="button" onClick={() => authorRef.current?.click()}
                className={`relative h-24 w-24 shrink-0 rounded-full overflow-hidden border-2 cursor-pointer group/avatar ${fieldErrors.authorPhoto ? 'border-red-400' : 'border-gold/20'}`}>
                {authorPhoto && <Image src={authorPhoto.preview} alt={authorName} fill className="object-cover" />}
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${authorPhoto ? 'bg-black/30 opacity-0 group-hover/avatar:opacity-100' : 'bg-[var(--bg-primary)]'}`}>
                  <Camera className={`w-6 h-6 ${authorPhoto ? 'text-white' : 'text-[var(--text-muted)]'}`} />
                </div>
              </button>
              <FieldError message={fieldErrors.authorPhoto} />
            </div>
            <div className="flex-1">
              {editing.authorCard ? (
                <>
                  <label className="text-xs font-medium text-[var(--text-muted)] mb-1.5 block uppercase tracking-wider">Naam</label>
                  <input type="text" value={authorName} onChange={(e) => { setAuthorName(e.target.value); clearFieldError('authorName') }} autoFocus placeholder={d?.placeholderAuthorName ?? "Je volledige naam"}
                    autoComplete="name" autoCapitalize="words" inputMode="text"
                    className={`w-full min-h-[44px] bg-transparent border-b-2 outline-none font-serif text-xl font-bold text-[var(--text-primary)] pb-1 mb-1 focus:border-gold/60 transition-colors ${fieldErrors.authorName ? 'border-red-400' : 'border-gold/30'}`} />
                  <FieldError message={fieldErrors.authorName} />
                  <div className="mb-3" />
                  <label className="text-xs font-medium text-[var(--text-muted)] mb-1.5 block uppercase tracking-wider">Korte bio</label>
                  <textarea value={authorBio} onChange={(e) => { setAuthorBio(e.target.value); clearFieldError('authorBio') }} rows={4} placeholder={d?.placeholderAuthorBio ?? "Vertel iets over jezelf en waarom je dit verhaal deelt..."}
                    className={`w-full bg-[var(--bg-primary)] border rounded-xl outline-none resize-y min-h-[120px] text-[var(--text-muted)] leading-relaxed italic p-3 text-base sm:text-sm focus:border-gold/60 focus-visible:ring-2 focus-visible:ring-gold/30 transition-all ${fieldErrors.authorBio ? 'border-red-400' : 'border-gold/30'}`} />
                  <FieldError message={fieldErrors.authorBio} />
                </>
              ) : (
                <>
                  <h3 className="font-serif text-xl font-bold text-[var(--text-primary)] mb-2">
                    {labels?.writtenByPrefix ?? 'Geschreven door'} {authorName || '...'}
                  </h3>
                  <p className="text-[var(--text-muted)] leading-relaxed italic">
                    &quot;{authorBio || 'Klik op het potlood om je bio toe te voegen...'}&quot;
                  </p>
                  {(fieldErrors.authorName || fieldErrors.authorBio) && !editing.authorCard && (
                    <p className="text-xs text-red-500 mt-2">Klik op het potlood om je gegevens in te vullen</p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ── Intro ── */}
          <div className="relative mb-6" data-field="intro">
            <EditBtn active={editing.intro ?? false} onClick={() => toggle('intro')} editDoneLabel={d?.editDone} editLabel={d?.editButton} />
            {editing.intro ? (
              <textarea value={intro} onChange={(e) => { setIntro(e.target.value); clearFieldError('intro') }} rows={6} autoFocus
                className="w-full bg-[var(--bg-secondary)] border border-gold/30 rounded-2xl outline-none resize-y min-h-[160px] text-[var(--text-muted)] leading-[1.9] p-5 text-base focus:border-gold/60 focus-visible:ring-2 focus-visible:ring-gold/30 transition-all"
                placeholder={d?.placeholderIntro ?? "Begin je verhaal met een pakkende introductie..."} />
            ) : (
              <p className="text-[var(--text-muted)] leading-[1.9]">{intro || <span className="opacity-30">Klik om je introductie te schrijven...</span>}</p>
            )}
            <FieldError message={fieldErrors.intro} />
          </div>

          {/* Sections minimum error */}
          {fieldErrors.sections && (
            <div className="mb-6 p-3 rounded-xl border border-red-300 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10" data-field="sections">
              <p className="text-xs text-red-500 dark:text-red-400">{fieldErrors.sections}</p>
            </div>
          )}

          {/* ── Dynamic Sections ── */}
          {sections.map((section, idx) => {
            const titleKey = `s${idx}_title`
            const bodyKey = `s${idx}_body`

            const hasTitleErr = !!fieldErrors[`section_${idx}_title`]
            const hasBodyErr = !!fieldErrors[`section_${idx}_body`]
            const hasImgErr = !!fieldErrors[`section_${idx}_images`]

            return (
              <div key={idx} className="relative mt-10 mb-6" data-field={`section_${idx}_title`}>
                {/* Section number badge & delete button */}
                <div className="flex items-center gap-3 mb-4">
                  <span className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border ${hasTitleErr || hasBodyErr ? 'bg-red-50 text-red-500 border-red-200 dark:bg-red-500/10 dark:border-red-500/30' : 'bg-gold/10 text-gold border-gold/20'}`}>
                    {idx + 1}
                  </span>
                  <div className="flex-1 h-px bg-[var(--border-subtle)]" />
                  {sections.length > 3 && (
                    <button type="button" onClick={() => removeSection(idx)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-red-500 border border-red-200 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                      <Trash2 className="w-3 h-3" />
                      Verwijder
                    </button>
                  )}
                </div>

                {/* Title */}
                <div className="relative mb-5">
                  <EditBtn active={editing[titleKey] ?? false} onClick={() => toggle(titleKey)} editDoneLabel={d?.editDone} editLabel={d?.editButton} />
                  {editing[titleKey] ? (
                    <input type="text" value={section.title} onChange={(e) => { updateSection(idx, { title: e.target.value }); clearFieldError(`section_${idx}_title`) }} autoFocus
                      placeholder={d?.placeholderSectionTitle ?? "Sectie titel..."}
                      autoCapitalize="sentences"
                      className={`w-full min-h-[44px] bg-transparent border-b-2 outline-none font-serif text-2xl font-bold text-[var(--text-primary)] pb-2 placeholder:text-[var(--text-muted)]/30 focus:border-gold/60 transition-colors ${hasTitleErr ? 'border-red-400' : 'border-gold/30'}`} />
                  ) : (
                    <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)]">
                      {section.title || <span className="opacity-30">Sectie titel...</span>}
                    </h2>
                  )}
                  <FieldError message={fieldErrors[`section_${idx}_title`]} />
                </div>

                {/* Body */}
                <div className="relative mb-4">
                  <EditBtn active={editing[bodyKey] ?? false} onClick={() => toggle(bodyKey)} editDoneLabel={d?.editDone} editLabel={d?.editButton} />
                  {editing[bodyKey] ? (
                    <textarea value={section.body} onChange={(e) => { updateSection(idx, { body: e.target.value }); clearFieldError(`section_${idx}_body`) }} rows={6} autoFocus
                      placeholder={d?.placeholderSectionBody ?? "Schrijf hier je verhaal..."}
                      className={`w-full bg-[var(--bg-secondary)] border rounded-2xl outline-none resize-y min-h-[160px] text-[var(--text-muted)] leading-[1.9] p-5 text-base focus:border-gold/60 focus-visible:ring-2 focus-visible:ring-gold/30 transition-all ${hasBodyErr ? 'border-red-400' : 'border-gold/30'}`} />
                  ) : (
                    <p className="text-[var(--text-muted)] leading-[1.9]">
                      {section.body || <span className="opacity-30">Klik om deze sectie te schrijven...</span>}
                    </p>
                  )}
                  <FieldError message={fieldErrors[`section_${idx}_body`]} />
                </div>

                {/* Image layout picker */}
                <ImageLayoutPicker
                  value={section.imageLayout}
                  onChange={(layout) => { updateSection(idx, { imageLayout: layout, images: layout === 'none' ? [] : section.images }); clearFieldError(`section_${idx}_images`) }}
                  labelNone={d?.layoutNone}
                  labelSingle={d?.layoutSingle}
                  labelGrid={d?.layoutGrid}
                />
                <FieldError message={hasImgErr ? fieldErrors[`section_${idx}_images`] : undefined} />

                {/* Section images */}
                <SectionImages
                  section={section}
                  onUpdate={(updates) => updateSection(idx, updates)}
                  captionSinglePlaceholder={d?.captionSingle}
                  captionGalleryPlaceholder={d?.captionGallery}
                  uploadPhotoLabel={dict?.common?.uploadPhoto}
                  uploadPhotosLabel={dict?.common?.uploadPhotos}
                  addLabel={dict?.common?.addPhoto}
                />
              </div>
            )
          })}

          {/* Add section button */}
          <button type="button" onClick={addSection}
            className="w-full mt-8 mb-4 py-4 rounded-2xl border-2 border-dashed border-[var(--border-subtle)] flex items-center justify-center gap-2 text-[var(--text-muted)] hover:text-gold hover:border-gold/40 transition-colors">
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">Sectie toevoegen</span>
          </button>

        </div>

        {/* ── Sidebar ── */}
        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <div className="sticky top-32 space-y-8">
            <div className={`relative p-6 sm:p-8 rounded-3xl border bg-[var(--bg-secondary)] shadow-sm ${fieldErrors.gallery ? 'border-red-300 dark:border-red-500/30' : 'border-[var(--border-subtle)]'}`} data-field="gallery">
              <EditBtn active={false} onClick={() => galleryRef.current?.click()} editDoneLabel={d?.editDone} editLabel={d?.editButton} />
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">{labels?.gallerySidebarHeading ?? 'Favoriete Momenten'}</h3>
              <p className="text-sm text-[var(--text-muted)] mb-5">
                {labels?.gallerySidebarDescription ?? "Upload jouw favoriete reisfoto's."}
              </p>

              <div className="grid grid-cols-2 gap-2">
                {gallery.slice(0, 4).map((photo, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-[var(--border-subtle)] group">
                    <Image src={photo.url} alt={photo.name} fill className="object-cover" />
                    <button type="button" onClick={() => setGallery((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white/80 hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {gallery.length < 12 && (
                  <button type="button" onClick={() => galleryRef.current?.click()}
                    className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 text-[var(--text-muted)] hover:text-gold hover:border-gold/40 transition-colors ${fieldErrors.gallery ? 'border-red-400' : 'border-[var(--border-subtle)]'}`}>
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
              <FieldError message={fieldErrors.gallery} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Legal & Submit ── */}
      <div className="mt-16 p-6 sm:p-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-sm">
        <div className="space-y-4 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input required type="checkbox" className="mt-1 w-5 h-5 shrink-0 accent-[var(--color-gold)] rounded focus-visible:ring-2 focus-visible:ring-gold/50" />
            <span className="text-sm text-[var(--text-primary)] leading-relaxed">
              {labels?.legalConsent1 ?? "Ik begrijp dat Puur Uganda Reizen mijn verhaal en foto's mag redigeren en indelen. Goedkeuring duurt gemiddeld meer dan één week."}
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input required type="checkbox" className="mt-1 w-5 h-5 shrink-0 accent-[var(--color-gold)] rounded focus-visible:ring-2 focus-visible:ring-gold/50" />
            <span className="text-sm text-[var(--text-primary)] leading-relaxed">
              {labels?.legalConsent2 ?? "Ik bevestig dat deze teksten en foto's mijn eigendom zijn en geef Puur Uganda Reizen toestemming deze te gebruiken voor marketing en website-inhoud."}
            </span>
          </label>
        </div>
        <button type="submit" disabled={isSubmitting}
          className="w-full sm:w-auto min-h-[48px] flex justify-center items-center gap-3 rounded-full bg-gold text-white px-10 py-4 text-base font-semibold hover:bg-gold-dark hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all">
          {isSubmitting ? (
            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {labels?.submitLoadingLabel ?? 'Bezig met uploaden...'}</>
          ) : (labels?.submitLabel ?? 'Verstuur Jouw Verhaal')}
        </button>
      </div>
    </form>
  )
}
