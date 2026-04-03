'use client'

import { useState } from 'react'
import { Check, ChevronLeft, ChevronRight, Minus, Plus, PartyPopper, AlertCircle, Shield } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { DateRangePicker, SingleDatePicker } from '@/components/ui/date-picker'
import { validateStep1, validateStep2, validateStep3, type FieldErrors } from './booking-form.validation'

// ── Props ──────────────────────────────────────────────────────────────────────

interface BookingFormProps {
  tripTitle: string
  tripSlug: string
  tripPrice: number
  tripPriceType: 'per_person' | 'per_group'
  tripDuration: string
  tripDestination?: { name: string; country: string } | null
}

// ── Step bar ───────────────────────────────────────────────────────────────────

const STEPS = ['Reis & Data', 'Reiziger', 'Bevestiging']

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-12">
      {STEPS.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all duration-300"
                style={{
                  background: done ? '#2a7d58' : active ? 'rgba(42,125,88,0.15)' : 'rgba(255,255,255,0.05)',
                  border: `2px solid ${done || active ? '#2a7d58' : 'rgba(255,255,255,0.12)'}`,
                  color: done ? '#fff' : active ? '#2a7d58' : 'var(--text-subtle)',
                }}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className="text-[10px] font-semibold uppercase tracking-wider hidden sm:block"
                style={{ color: active ? '#2a7d58' : 'var(--text-subtle)' }}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="w-16 sm:w-24 h-px mx-2 mb-5 transition-all duration-500"
                style={{ background: i < current ? '#2a7d58' : 'rgba(255,255,255,0.1)' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Pill toggle ────────────────────────────────────────────────────────────────

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 border"
      style={{
        background: active ? '#2a7d58' : 'rgba(42,125,88,0.06)',
        borderColor: active ? '#2a7d58' : 'rgba(42,125,88,0.25)',
        color: active ? '#ffffff' : 'var(--text-muted)',
      }}
    >
      {children}
    </button>
  )
}

// ── Stepper ────────────────────────────────────────────────────────────────────

function Stepper({
  value,
  min,
  max,
  onChange,
  label,
}: {
  value: number
  min: number
  max: number
  onChange: (v: number) => void
  label: string
}) {
  return (
    <div>
      <label
        className="block text-xs font-semibold uppercase tracking-wider mb-3"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </label>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200"
          style={{ border: '1px solid rgba(42,125,88,0.3)', color: 'var(--text-muted)' }}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span
          className="font-serif text-4xl font-bold w-16 text-center"
          style={{ color: 'var(--text-primary)' }}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200"
          style={{ border: '1px solid rgba(42,125,88,0.3)', color: 'var(--text-muted)' }}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// ── Input style constants ──────────────────────────────────────────────────────

const inputClass = 'w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200'
const inputStyle = {
  background: 'rgba(42,125,88,0.05)',
  border: '1px solid rgba(42,125,88,0.2)',
  color: 'var(--text-primary)',
}
const inputErrorStyle = {
  ...inputStyle,
  border: '1px solid rgba(220,38,38,0.5)',
  background: 'rgba(220,38,38,0.04)',
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1.5 text-xs text-red-400">{message}</p>
}

const FOUND_OPTIONS = ['Google', 'Social Media', 'Vrienden/Familie', 'Blog/Artikel', 'Anders']

// ── Main component ─────────────────────────────────────────────────────────────

export function BookingForm({
  tripTitle,
  tripSlug,
  tripPrice,
  tripPriceType,
  tripDuration,
  tripDestination,
}: BookingFormProps) {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  // Step 1
  const [flexibel, setFlexibel] = useState(false)
  const [vertrekdatum, setVertrekdatum] = useState('')
  const [retourdatum, setRetourdatum] = useState('')
  const [aantalVolwassenen, setAantalVolwassenen] = useState(1)
  const [aantalKinderen, setAantalKinderen] = useState(0)

  // Step 2
  const [voornaam, setVoornaam] = useState('')
  const [achternaam, setAchternaam] = useState('')
  const [email, setEmail] = useState('')
  const [telefoon, setTelefoon] = useState('')
  const [geboortedatum, setGeboortedatum] = useState('')
  const [nationaliteit, setNationaliteit] = useState('')
  const [paspoortnummer, setPaspoortnummer] = useState('')

  // Step 3
  const [dieetwensen, setDieetwensen] = useState('')
  const [medischeBijzonderheden, setMedischeBijzonderheden] = useState('')
  const [specialeVerzoeken, setSpecialeVerzoeken] = useState('')
  const [gevonden, setGevonden] = useState('')
  const [terms, setTerms] = useState(false)

  function tryNext() {
    let errs: FieldErrors = {}
    if (step === 0) errs = validateStep1(flexibel, vertrekdatum, retourdatum)
    if (step === 1) errs = validateStep2({ voornaam, achternaam, email, telefoon, geboortedatum })
    if (step === 2) errs = validateStep3(terms)

    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) return

    if (step < 2) {
      setStep((s) => s + 1)
    } else {
      handleSubmit()
    }
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voornaam,
          achternaam,
          email,
          telefoon,
          geboortedatum,
          vertrekdatum: flexibel ? 'Flexibel' : vertrekdatum,
          retourdatum: flexibel ? undefined : retourdatum || undefined,
          aantalVolwassenen,
          aantalKinderen,
          tripTitle,
          tripSlug,
          nationaliteit: nationaliteit || undefined,
          paspoortnummer: paspoortnummer || undefined,
          dieetwensen: dieetwensen || undefined,
          medischeBijzonderheden: medischeBijzonderheden || undefined,
          speciale_verzoeken: specialeVerzoeken || undefined,
          gevonden: gevonden || undefined,
        }),
      })
      if (!res.ok) throw new Error('Versturen mislukt')
      setSubmitted(true)
    } catch {
      setError('Er is iets misgegaan. Probeer het opnieuw of neem contact met ons op.')
    } finally {
      setSubmitting(false)
    }
  }

  // Clear specific field error on input change
  function clearError(field: string) {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  // ── Success screen ────────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-24 text-center">
        <div
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full"
          style={{ background: 'rgba(42,125,88,0.15)', border: '2px solid rgba(42,125,88,0.4)' }}
        >
          <PartyPopper className="h-9 w-9 text-gold" />
        </div>
        <h2 className="font-serif text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          Boeking aangevraagd!
        </h2>
        <p className="text-base max-w-md leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Bedankt {voornaam}. We hebben uw boekingsaanvraag voor{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{tripTitle}</strong> ontvangen en sturen
          u een bevestiging per e-mail.
        </p>
      </div>
    )
  }

  // ── Step 1: Reis & Data ────────────────────────────────────────────────────────

  const step1 = (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Reis & Data
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Controleer de reisgegevens en kies uw gewenste reisdata.
        </p>
      </div>

      {/* Trip summary card */}
      <div
        className="rounded-xl p-5"
        style={{
          background: 'rgba(42,125,88,0.07)',
          border: '1px solid rgba(42,125,88,0.22)',
        }}
      >
        <p
          className="text-[10px] font-semibold uppercase tracking-widest mb-2"
          style={{ color: '#2a7d58' }}
        >
          Geselecteerde reis
        </p>
        <p className="font-serif text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          {tripTitle}
        </p>
        {tripDestination && (
          <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
            {tripDestination.name}, {tripDestination.country}
          </p>
        )}
        <div className="flex flex-wrap gap-4 text-sm">
          <span style={{ color: 'var(--text-muted)' }}>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              Duur:{' '}
            </span>
            {tripDuration}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>
            <span className="font-semibold" style={{ color: '#2a7d58' }}>
              Vanaf{' '}
            </span>
            <span className="font-bold text-base" style={{ color: '#2a7d58' }}>
              {formatPrice(tripPrice)}
            </span>
            <span className="text-xs"> {tripPriceType === 'per_group' ? 'p.gr.' : 'p.p.'}</span>
          </span>
        </div>
      </div>

      {/* Flexibele datum */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="checkbox"
          aria-checked={flexibel}
          onClick={() => {
            setFlexibel((v) => !v)
            clearError('vertrekdatum')
          }}
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded transition-all duration-200"
          style={{
            background: flexibel ? '#2a7d58' : 'rgba(42,125,88,0.05)',
            border: `2px solid ${flexibel ? '#2a7d58' : 'rgba(42,125,88,0.3)'}`,
          }}
        >
          {flexibel && <Check className="h-3 w-3 text-white" />}
        </button>
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Flexibele datum
        </span>
      </div>

      {flexibel ? (
        <p
          className="rounded-xl px-4 py-3 text-sm"
          style={{
            background: 'rgba(42,125,88,0.07)',
            border: '1px solid rgba(42,125,88,0.2)',
            color: 'var(--text-muted)',
          }}
        >
          We nemen contact op om de datum af te stemmen
        </p>
      ) : (
        <DateRangePicker
          startDate={vertrekdatum}
          endDate={retourdatum}
          onStartChange={(v) => { setVertrekdatum(v); clearError('vertrekdatum') }}
          onEndChange={(v) => { setRetourdatum(v); clearError('retourdatum') }}
          label="Reisdata"
          required
          minDate={new Date()}
          error={fieldErrors.vertrekdatum || fieldErrors.retourdatum}
        />
      )}

      {/* Steppers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <Stepper
          value={aantalVolwassenen}
          min={1}
          max={20}
          onChange={setAantalVolwassenen}
          label="Aantal volwassenen *"
        />
        <Stepper
          value={aantalKinderen}
          min={0}
          max={10}
          onChange={setAantalKinderen}
          label="Aantal kinderen"
        />
      </div>
    </div>
  )

  // ── Step 2: Reizigersinformatie ────────────────────────────────────────────────

  const step2 = (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Reizigersinformatie
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Vul uw persoonlijke gegevens in. Wij behandelen deze vertrouwelijk.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            className="block text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: 'var(--text-muted)' }}
          >
            Voornaam <span style={{ color: '#2a7d58' }}>*</span>
          </label>
          <input
            type="text"
            value={voornaam}
            onChange={(e) => {
              setVoornaam(e.target.value)
              clearError('voornaam')
            }}
            placeholder="Jan"
            className={inputClass}
            style={fieldErrors.voornaam ? inputErrorStyle : inputStyle}
          />
          <FieldError message={fieldErrors.voornaam} />
        </div>
        <div>
          <label
            className="block text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: 'var(--text-muted)' }}
          >
            Achternaam <span style={{ color: '#2a7d58' }}>*</span>
          </label>
          <input
            type="text"
            value={achternaam}
            onChange={(e) => {
              setAchternaam(e.target.value)
              clearError('achternaam')
            }}
            placeholder="de Vries"
            className={inputClass}
            style={fieldErrors.achternaam ? inputErrorStyle : inputStyle}
          />
          <FieldError message={fieldErrors.achternaam} />
        </div>
      </div>

      <div>
        <label
          className="block text-xs font-semibold uppercase tracking-wider mb-2"
          style={{ color: 'var(--text-muted)' }}
        >
          E-mail <span style={{ color: '#2a7d58' }}>*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            clearError('email')
          }}
          placeholder="jan@voorbeeld.nl"
          className={inputClass}
          style={fieldErrors.email ? inputErrorStyle : inputStyle}
        />
        <FieldError message={fieldErrors.email} />
      </div>

      <div>
        <label
          className="block text-xs font-semibold uppercase tracking-wider mb-2"
          style={{ color: 'var(--text-muted)' }}
        >
          Telefoon <span style={{ color: '#2a7d58' }}>*</span>
        </label>
        <input
          type="tel"
          value={telefoon}
          onChange={(e) => {
            setTelefoon(e.target.value)
            clearError('telefoon')
          }}
          placeholder="+31 6 12 34 56 78"
          className={inputClass}
          style={fieldErrors.telefoon ? inputErrorStyle : inputStyle}
        />
        <FieldError message={fieldErrors.telefoon} />
      </div>

      <SingleDatePicker
        value={geboortedatum}
        onChange={(v) => { setGeboortedatum(v); clearError('geboortedatum') }}
        label="Geboortedatum"
        required
        placeholder="Selecteer geboortedatum"
        maxDate={new Date()}
        error={fieldErrors.geboortedatum}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            className="block text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: 'var(--text-muted)' }}
          >
            Nationaliteit{' '}
            <span className="text-[10px] normal-case" style={{ color: 'var(--text-subtle)' }}>
              (optioneel)
            </span>
          </label>
          <input
            type="text"
            value={nationaliteit}
            onChange={(e) => setNationaliteit(e.target.value)}
            placeholder="Nederlandse"
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label
            className="block text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: 'var(--text-muted)' }}
          >
            Paspoortnummer{' '}
            <span className="text-[10px] normal-case" style={{ color: 'var(--text-subtle)' }}>
              (optioneel)
            </span>
          </label>
          <input
            type="text"
            value={paspoortnummer}
            onChange={(e) => setPaspoortnummer(e.target.value)}
            placeholder="AB1234567"
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Privacy note */}
      <div
        className="flex items-start gap-3 rounded-xl px-4 py-3"
        style={{ background: 'rgba(42,125,88,0.05)', border: '1px solid rgba(42,125,88,0.12)' }}
      >
        <Shield className="h-4 w-4 shrink-0 mt-0.5 text-gold" />
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-subtle)' }}>
          Uw gegevens worden uitsluitend gebruikt voor het verwerken van deze boekingsaanvraag en worden niet gedeeld met derden.
        </p>
      </div>
    </div>
  )

  // ── Step 3: Bijzonderheden & Bevestiging ───────────────────────────────────────

  const step3 = (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Bijzonderheden & Bevestiging
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Optionele informatie die ons helpt uw reis optimaal voor te bereiden.
        </p>
      </div>

      <div>
        <label
          className="block text-xs font-semibold uppercase tracking-wider mb-2"
          style={{ color: 'var(--text-muted)' }}
        >
          Dieetwensen{' '}
          <span className="text-[10px] normal-case" style={{ color: 'var(--text-subtle)' }}>
            (optioneel)
          </span>
        </label>
        <textarea
          value={dieetwensen}
          onChange={(e) => setDieetwensen(e.target.value)}
          rows={3}
          placeholder="Vegetarisch, glutenvrij, allergieën…"
          className={`${inputClass} resize-none`}
          style={inputStyle}
        />
      </div>

      <div>
        <label
          className="block text-xs font-semibold uppercase tracking-wider mb-2"
          style={{ color: 'var(--text-muted)' }}
        >
          Medische bijzonderheden{' '}
          <span className="text-[10px] normal-case" style={{ color: 'var(--text-subtle)' }}>
            (vertrouwelijk, optioneel)
          </span>
        </label>
        <textarea
          value={medischeBijzonderheden}
          onChange={(e) => setMedischeBijzonderheden(e.target.value)}
          rows={3}
          placeholder="Relevante medische informatie die wij moeten weten…"
          className={`${inputClass} resize-none`}
          style={inputStyle}
        />
      </div>

      <div>
        <label
          className="block text-xs font-semibold uppercase tracking-wider mb-2"
          style={{ color: 'var(--text-muted)' }}
        >
          Speciale verzoeken{' '}
          <span className="text-[10px] normal-case" style={{ color: 'var(--text-subtle)' }}>
            (optioneel)
          </span>
        </label>
        <textarea
          value={specialeVerzoeken}
          onChange={(e) => setSpecialeVerzoeken(e.target.value)}
          rows={3}
          placeholder="Speciale gelegenheden, kamerindeling, overige wensen…"
          className={`${inputClass} resize-none`}
          style={inputStyle}
        />
      </div>

      <div>
        <label
          className="block text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: 'var(--text-muted)' }}
        >
          Hoe heeft u ons gevonden?{' '}
          <span className="text-[10px] normal-case" style={{ color: 'var(--text-subtle)' }}>
            (optioneel)
          </span>
        </label>
        <div className="flex flex-wrap gap-2">
          {FOUND_OPTIONS.map((opt) => (
            <Pill
              key={opt}
              active={gevonden === opt}
              onClick={() => setGevonden((prev) => (prev === opt ? '' : opt))}
            >
              {opt}
            </Pill>
          ))}
        </div>
      </div>

      {/* Booking summary */}
      <div
        className="rounded-xl p-4 space-y-2"
        style={{ background: 'rgba(42,125,88,0.05)', border: '1px solid rgba(42,125,88,0.15)' }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#2a7d58' }}>
          Samenvatting
        </p>
        <div className="grid grid-cols-2 gap-1 text-sm">
          <span style={{ color: 'var(--text-subtle)' }}>Reis:</span>
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{tripTitle}</span>
          <span style={{ color: 'var(--text-subtle)' }}>Datum:</span>
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
            {flexibel ? 'Flexibel' : vertrekdatum || '—'}
          </span>
          <span style={{ color: 'var(--text-subtle)' }}>Reizigers:</span>
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
            {aantalVolwassenen} volw.{aantalKinderen > 0 ? `, ${aantalKinderen} kind.` : ''}
          </span>
          <span style={{ color: 'var(--text-subtle)' }}>Naam:</span>
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
            {voornaam} {achternaam}
          </span>
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-start gap-3 pt-2">
        <button
          type="button"
          role="checkbox"
          aria-checked={terms}
          onClick={() => {
            setTerms((v) => !v)
            clearError('terms')
          }}
          className="flex h-5 w-5 shrink-0 mt-0.5 items-center justify-center rounded transition-all duration-200"
          style={{
            background: terms ? '#2a7d58' : 'rgba(42,125,88,0.05)',
            border: `2px solid ${fieldErrors.terms ? 'rgba(220,38,38,0.5)' : terms ? '#2a7d58' : 'rgba(42,125,88,0.3)'}`,
          }}
        >
          {terms && <Check className="h-3 w-3 text-white" />}
        </button>
        <div>
          <span className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Ik ga akkoord met de reisvoorwaarden en het privacybeleid van Puur Safaris{' '}
            <span style={{ color: '#2a7d58' }}>*</span>
          </span>
          <FieldError message={fieldErrors.terms} />
        </div>
      </div>

      {error && (
        <div
          className="flex items-center gap-3 text-sm rounded-xl px-4 py-3"
          style={{
            background: 'rgba(139,28,44,0.12)',
            color: '#e07080',
            border: '1px solid rgba(139,28,44,0.25)',
          }}
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  )

  const steps = [step1, step2, step3]

  return (
    <div className="max-w-2xl mx-auto">
      <StepBar current={step} />

      <div
        className="rounded-2xl p-6 sm:p-8"
        style={{ background: 'var(--card-strip-bg)', border: '1px solid rgba(42,125,88,0.18)' }}
      >
        {steps[step]}

        {/* Validation error summary */}
        {Object.keys(fieldErrors).length > 0 && (
          <div
            className="flex items-center gap-3 mt-6 rounded-xl px-4 py-3 text-sm"
            style={{
              background: 'rgba(139,28,44,0.08)',
              color: '#e07080',
              border: '1px solid rgba(139,28,44,0.2)',
            }}
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            Controleer de gemarkeerde velden hierboven
          </div>
        )}

        {/* Navigation */}
        <div
          className="flex items-center justify-between mt-10 pt-6"
          style={{ borderTop: '1px solid rgba(42,125,88,0.12)' }}
        >
          <button
            type="button"
            onClick={() => {
              setFieldErrors({})
              setStep((s) => s - 1)
            }}
            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200"
            style={{
              opacity: step === 0 ? 0 : 1,
              pointerEvents: step === 0 ? 'none' : 'auto',
              color: 'var(--text-muted)',
              border: '1px solid rgba(42,125,88,0.2)',
            }}
          >
            <ChevronLeft className="h-4 w-4" /> Terug
          </button>

          <button
            type="button"
            onClick={tryNext}
            disabled={submitting}
            className="flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200"
            style={{
              background: submitting ? 'rgba(42,125,88,0.4)' : '#2a7d58',
              color: '#ffffff',
              cursor: submitting ? 'not-allowed' : 'pointer',
            }}
          >
            {step < 2 ? (
              <>
                Volgende <ChevronRight className="h-4 w-4" />
              </>
            ) : submitting ? (
              'Verzenden…'
            ) : (
              'Boeking bevestigen'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
