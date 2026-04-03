'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Check, ChevronRight, ChevronLeft, Minus, Plus, Send, PartyPopper, AlertCircle } from 'lucide-react'
import type { DestinationCard } from '@/lib/types'

interface TripBuilderProps {
  destinations: DestinationCard[]
}

// ── Validation helpers ─────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[+]?[\d\s\-().]{7,20}$/

type FieldErrors = Record<string, string>

function validateStep1(selectedDests: string[]): FieldErrors {
  if (selectedDests.length === 0) return { destinations: 'Selecteer minstens één bestemming' }
  return {}
}

function validateStep2(period: string, groupSize: string, accommodation: string): FieldErrors {
  const errs: FieldErrors = {}
  if (!period) errs.period = 'Kies een reisperiode'
  if (!groupSize) errs.groupSize = 'Kies een groepsgrootte'
  if (!accommodation) errs.accommodation = 'Kies een accommodatie voorkeur'
  return errs
}

function validateStep3(naam: string, email: string, telefoon: string): FieldErrors {
  const errs: FieldErrors = {}
  if (naam.trim().length < 2) errs.naam = 'Vul uw naam in (minimaal 2 tekens)'
  if (!EMAIL_RE.test(email)) errs.email = 'Vul een geldig e-mailadres in'
  if (telefoon && !PHONE_RE.test(telefoon)) errs.telefoon = 'Vul een geldig telefoonnummer in'
  return errs
}

// ── Step 2 option sets ─────────────────────────────────────────────────────

const PERIODS = [
  'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
  'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December', 'Flexibel',
]

const GROUP_SIZES = [
  { label: 'Solo', value: '1' },
  { label: '2 personen', value: '2' },
  { label: '3–5', value: '3-5' },
  { label: '6–10', value: '6-10' },
  { label: '10+', value: '10+' },
]

const STYLES = ['Avontuur', 'Luxe', 'Familie', 'Huwelijksreis', 'Fotosafari', 'Cultureel', 'Walking Safari']

const ACCOMMODATIONS = ['Budget', 'Middenklasse', 'Luxe', 'Ultra-luxe', 'Geen voorkeur']

// ── Pill toggle helper ─────────────────────────────────────────────────────

function Pill({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
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

// ── Step indicators ────────────────────────────────────────────────────────

const STEPS = ['Bestemmingen', 'Reisdetails', 'Uw Gegevens']

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

// ── Field error display ────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1.5 text-xs text-red-400">{message}</p>
}

// ── Input styles ───────────────────────────────────────────────────────────

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

// ── Main component ─────────────────────────────────────────────────────────

export function TripBuilder({ destinations }: TripBuilderProps) {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  // Step 1
  const [selectedDests, setSelectedDests] = useState<string[]>([])

  // Step 2
  const [days, setDays] = useState(10)
  const [period, setPeriod] = useState('')
  const [groupSize, setGroupSize] = useState('')
  const [travelStyles, setTravelStyles] = useState<string[]>([])
  const [accommodation, setAccommodation] = useState('')

  // Step 3
  const [naam, setNaam] = useState('')
  const [email, setEmail] = useState('')
  const [telefoon, setTelefoon] = useState('')
  const [wensen, setWensen] = useState('')

  function toggleDest(id: string) {
    setSelectedDests(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    )
    clearError('destinations')
  }

  function toggleStyle(s: string) {
    setTravelStyles(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )
  }

  function clearError(field: string) {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  function tryNext() {
    let errs: FieldErrors = {}
    if (step === 0) errs = validateStep1(selectedDests)
    if (step === 1) errs = validateStep2(period, groupSize, accommodation)
    if (step === 2) errs = validateStep3(naam, email, telefoon)

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
    const destNames = destinations
      .filter(d => selectedDests.includes(d._id))
      .map(d => d.name)
      .join(', ')

    const bericht = [
      '=== EIGEN REISSCHEMA AANVRAAG ===',
      '',
      `BESTEMMINGEN: ${destNames}`,
      '',
      'REISDETAILS:',
      `• Aantal dagen: ${days}`,
      `• Reisperiode: ${period}`,
      `• Groepsgrootte: ${groupSize}`,
      `• Reisstijl: ${travelStyles.length ? travelStyles.join(', ') : 'Geen voorkeur'}`,
      `• Accommodatie: ${accommodation}`,
      '',
      ...(wensen.trim() ? [`EXTRA WENSEN:\n${wensen.trim()}`] : []),
    ].join('\n')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          naam,
          email,
          telefoon: telefoon || undefined,
          onderwerp: 'Eigen Reisschema Aanvraag',
          bericht,
        }),
      })
      if (!res.ok) throw new Error('Versturen mislukt')
      setSubmitted(true)
    } catch {
      setError('Er is iets misgegaan. Probeer het opnieuw of stuur ons een e-mail.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success screen ────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full"
          style={{ background: 'rgba(42,125,88,0.15)', border: '2px solid rgba(42,125,88,0.4)' }}
        >
          <PartyPopper className="h-9 w-9 text-gold" />
        </div>
        <h2 className="font-serif text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          Aanvraag ontvangen!
        </h2>
        <p className="text-base max-w-md leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Dank je wel, {naam}. We hebben je reisschema aanvraag ontvangen en nemen binnen 2 werkdagen contact met je op.
        </p>
      </div>
    )
  }

  // ── Step 1: Destinations ──────────────────────────────────────────────────

  const step1 = (
    <div>
      <h2 className="font-serif text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
        Waar wil je naartoe?
      </h2>
      <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
        Selecteer één of meerdere bestemmingen. We combineren ze tot de perfecte route.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {destinations.map(dest => {
          const selected = selectedDests.includes(dest._id)
          const imageUrl = dest.heroImage?.asset?.url || null
          return (
            <button
              key={dest._id}
              type="button"
              onClick={() => toggleDest(dest._id)}
              className="relative aspect-4/3 rounded-xl overflow-hidden transition-all duration-300 focus:outline-none"
              style={{
                border: `2px solid ${selected ? '#2a7d58' : fieldErrors.destinations ? 'rgba(220,38,38,0.4)' : 'rgba(42,125,88,0.15)'}`,
                boxShadow: selected ? '0 0 0 3px rgba(42,125,88,0.25)' : 'none',
              }}
            >
              {imageUrl ? (
                <Image src={imageUrl} alt={dest.name} fill className="object-cover" sizes="(max-width: 640px) 50vw, 33vw" />
              ) : (
                <div className="absolute inset-0" style={{ background: '#030d07' }} />
              )}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)' }} />
              {selected && (
                <div className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full" style={{ background: '#2a7d58' }}>
                  <Check className="h-3.5 w-3.5 text-white" />
                </div>
              )}
              <span className="absolute bottom-2.5 left-3 text-sm font-bold text-white">{dest.name}</span>
            </button>
          )
        })}
      </div>
      <FieldError message={fieldErrors.destinations} />
    </div>
  )

  // ── Step 2: Trip details ──────────────────────────────────────────────────

  const step2 = (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Vertel ons over je reis
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Hoe meer we weten, hoe beter we je reisschema kunnen samenstellen.
        </p>
      </div>

      {/* Days */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
          Aantal dagen
        </label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setDays(d => Math.max(3, d - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-200"
            style={{ borderColor: 'rgba(42,125,88,0.3)', color: 'var(--text-muted)' }}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="font-serif text-4xl font-bold w-16 text-center" style={{ color: 'var(--text-primary)' }}>
            {days}
          </span>
          <button
            type="button"
            onClick={() => setDays(d => Math.min(30, d + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-200"
            style={{ borderColor: 'rgba(42,125,88,0.3)', color: 'var(--text-muted)' }}
          >
            <Plus className="h-4 w-4" />
          </button>
          <span className="text-sm" style={{ color: 'var(--text-subtle)' }}>dagen (3–30)</span>
        </div>
      </div>

      {/* Period */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
          Wanneer wil je reizen? <span style={{ color: '#2a7d58' }}>*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {PERIODS.map(p => (
            <Pill key={p} active={period === p} onClick={() => { setPeriod(p); clearError('period') }}>{p}</Pill>
          ))}
        </div>
        <FieldError message={fieldErrors.period} />
      </div>

      {/* Group size */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
          Groepsgrootte <span style={{ color: '#2a7d58' }}>*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {GROUP_SIZES.map(g => (
            <Pill key={g.value} active={groupSize === g.value} onClick={() => { setGroupSize(g.value); clearError('groupSize') }}>{g.label}</Pill>
          ))}
        </div>
        <FieldError message={fieldErrors.groupSize} />
      </div>

      {/* Travel style */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
          Reisstijl <span className="text-[10px] normal-case" style={{ color: 'var(--text-subtle)' }}>(meerdere mogelijk)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {STYLES.map(s => (
            <Pill key={s} active={travelStyles.includes(s)} onClick={() => toggleStyle(s)}>{s}</Pill>
          ))}
        </div>
      </div>

      {/* Accommodation */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
          Accommodatie voorkeur <span style={{ color: '#2a7d58' }}>*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {ACCOMMODATIONS.map(a => (
            <Pill key={a} active={accommodation === a} onClick={() => { setAccommodation(a); clearError('accommodation') }}>{a}</Pill>
          ))}
        </div>
        <FieldError message={fieldErrors.accommodation} />
      </div>
    </div>
  )

  // ── Step 3: Contact info ──────────────────────────────────────────────────

  const step3 = (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Uw gegevens
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          We gebruiken deze gegevens alleen om contact met u op te nemen over uw reisschema.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
            Naam <span style={{ color: '#2a7d58' }}>*</span>
          </label>
          <input
            type="text"
            value={naam}
            onChange={e => { setNaam(e.target.value); clearError('naam') }}
            placeholder="Jan de Vries"
            className={inputClass}
            style={fieldErrors.naam ? inputErrorStyle : inputStyle}
          />
          <FieldError message={fieldErrors.naam} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
            E-mail <span style={{ color: '#2a7d58' }}>*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); clearError('email') }}
            placeholder="jan@voorbeeld.nl"
            className={inputClass}
            style={fieldErrors.email ? inputErrorStyle : inputStyle}
          />
          <FieldError message={fieldErrors.email} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
          Telefoon <span className="text-[10px] normal-case" style={{ color: 'var(--text-subtle)' }}>(optioneel)</span>
        </label>
        <input
          type="tel"
          value={telefoon}
          onChange={e => { setTelefoon(e.target.value); clearError('telefoon') }}
          placeholder="+31 6 12 34 56 78"
          className={inputClass}
          style={fieldErrors.telefoon ? inputErrorStyle : inputStyle}
        />
        <FieldError message={fieldErrors.telefoon} />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
          Extra wensen <span className="text-[10px] normal-case" style={{ color: 'var(--text-subtle)' }}>(optioneel)</span>
        </label>
        <textarea
          value={wensen}
          onChange={e => setWensen(e.target.value)}
          rows={4}
          placeholder="Zijn er specifieke dieren die u wilt zien, bijzondere gelegenheden, of andere wensen die we moeten weten?"
          className={`${inputClass} resize-none`}
          style={inputStyle}
        />
      </div>

      {error && (
        <div
          className="flex items-center gap-3 text-sm rounded-xl px-4 py-3"
          style={{ background: 'rgba(139,28,44,0.12)', color: '#e07080', border: '1px solid rgba(139,28,44,0.25)' }}
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

      <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'var(--card-strip-bg)', border: '1px solid rgba(42,125,88,0.18)' }}>
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
        <div className="flex items-center justify-between mt-10 pt-6" style={{ borderTop: '1px solid rgba(42,125,88,0.12)' }}>
          <button
            type="button"
            onClick={() => { setFieldErrors({}); setStep(s => s - 1) }}
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
              <>Volgende <ChevronRight className="h-4 w-4" /></>
            ) : submitting ? (
              'Verzenden…'
            ) : (
              <>Verstuur aanvraag <Send className="h-4 w-4" /></>
            )}
          </button>
        </div>
      </div>

      {/* Summary pills when on step 2+ */}
      {step >= 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {destinations.filter(d => selectedDests.includes(d._id)).map(d => (
            <span key={d._id} className="rounded-full px-3 py-1 text-xs font-medium"
              style={{ background: 'rgba(42,125,88,0.12)', color: '#2a7d58', border: '1px solid rgba(42,125,88,0.25)' }}>
              {d.name}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
