'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, AlertCircle, Send, ChevronDown } from 'lucide-react'

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = z.object({
  naam: z.string().min(2, 'Vul uw volledige naam in (minimaal 2 tekens)'),
  email: z.string().email('Vul een geldig e-mailadres in'),
  telefoon: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[+]?[\d\s\-().]{7,20}$/.test(val),
      'Vul een geldig telefoonnummer in'
    ),
  voorkeursContact: z.string().optional(),
  aantalReizigers: z.string().optional(),
  voorkeursPeriode: z.string().optional(),
  budgetIndicatie: z.string().optional(),
  onderwerp: z.string().min(1, 'Kies een onderwerp'),
  bericht: z
    .string()
    .min(20, 'Uw bericht moet minimaal 20 tekens zijn')
    .max(2000, 'Uw bericht mag maximaal 2000 tekens zijn'),
})

type FormData = z.infer<typeof schema>

// ── Constants ─────────────────────────────────────────────────────────────────

const ONDERWERP_OPTIONS = [
  { value: '', label: 'Kies een onderwerp' },
  { value: 'Offerte aanvraag', label: 'Offerte aanvraag' },
  { value: 'Informatie over safari', label: 'Informatie over een safari' },
  { value: 'Bestaande boeking', label: 'Vraag over bestaande boeking' },
  { value: 'Samenwerking', label: 'Samenwerking / Zakelijk' },
  { value: 'Overig', label: 'Overig' },
]

const CONTACT_METHODS = [
  { value: '', label: 'Geen voorkeur' },
  { value: 'email', label: 'E-mail' },
  { value: 'telefoon', label: 'Telefoon' },
  { value: 'whatsapp', label: 'WhatsApp' },
]

const REIZIGERS_OPTIONS = [
  { value: '', label: 'Selecteer' },
  { value: '1', label: '1 persoon' },
  { value: '2', label: '2 personen' },
  { value: '3-5', label: '3–5 personen' },
  { value: '6-10', label: '6–10 personen' },
  { value: '10+', label: '10+ personen' },
]

const PERIODE_OPTIONS = [
  { value: '', label: 'Selecteer' },
  { value: 'Januari', label: 'Januari' },
  { value: 'Februari', label: 'Februari' },
  { value: 'Maart', label: 'Maart' },
  { value: 'April', label: 'April' },
  { value: 'Mei', label: 'Mei' },
  { value: 'Juni', label: 'Juni' },
  { value: 'Juli', label: 'Juli' },
  { value: 'Augustus', label: 'Augustus' },
  { value: 'September', label: 'September' },
  { value: 'Oktober', label: 'Oktober' },
  { value: 'November', label: 'November' },
  { value: 'December', label: 'December' },
  { value: 'Flexibel', label: 'Flexibel / Weet ik nog niet' },
]

const BUDGET_OPTIONS = [
  { value: '', label: 'Selecteer' },
  { value: 'tot-2000', label: 'Tot €2.000 p.p.' },
  { value: '2000-4000', label: '€2.000 – €4.000 p.p.' },
  { value: '4000-6000', label: '€4.000 – €6.000 p.p.' },
  { value: '6000-plus', label: '€6.000+ p.p.' },
  { value: 'onbekend', label: 'Weet ik nog niet' },
]

const MESSAGE_MAX = 2000

// ── Styling ───────────────────────────────────────────────────────────────────

const inputClass =
  'w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200'
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
const labelClass = 'block text-xs font-semibold uppercase tracking-wider mb-2'
const labelStyle = { color: 'var(--text-muted)' }

// ── Component ─────────────────────────────────────────────────────────────────

interface ContactFormProps {
  prefilledSafari?: string
}

export function ContactForm({ prefilledSafari }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      onderwerp: prefilledSafari ? `Offerte aanvraag` : '',
      bericht: prefilledSafari ? `Ik ben geïnteresseerd in: ${prefilledSafari}` : '',
    },
  })

  const berichtLength = watch('bericht')?.length ?? 0

  async function onSubmit(data: FormData) {
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Fout bij versturen')
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  // ── Success ───────────────────────────────────────────────────────────────

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full"
          style={{ background: 'rgba(42,125,88,0.15)', border: '2px solid rgba(42,125,88,0.4)' }}
        >
          <CheckCircle2 className="h-9 w-9 text-gold" />
        </div>
        <h3
          className="font-serif text-2xl font-bold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          Bericht ontvangen!
        </h3>
        <p className="text-sm max-w-md leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
          Bedankt voor uw bericht. We nemen binnen 24 uur contact met u op.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200"
          style={{ color: 'var(--text-muted)', border: '1px solid rgba(42,125,88,0.25)' }}
        >
          Nieuw bericht sturen
        </button>
      </div>
    )
  }

  // ── Form ──────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      {/* Section: Personal info */}
      <div>
        <h3 className="font-serif text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          Uw gegevens
        </h3>
        <p className="text-xs mb-5" style={{ color: 'var(--text-subtle)' }}>
          Zodat we u persoonlijk kunnen bereiken.
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Naam */}
            <div>
              <label className={labelClass} style={labelStyle}>
                Naam <span style={{ color: '#2a7d58' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Jan de Vries"
                className={inputClass}
                style={errors.naam ? inputErrorStyle : inputStyle}
                {...register('naam')}
              />
              {errors.naam && (
                <p className="mt-1.5 text-xs text-red-400">{errors.naam.message}</p>
              )}
            </div>

            {/* E-mail */}
            <div>
              <label className={labelClass} style={labelStyle}>
                E-mailadres <span style={{ color: '#2a7d58' }}>*</span>
              </label>
              <input
                type="email"
                placeholder="jan@voorbeeld.nl"
                className={inputClass}
                style={errors.email ? inputErrorStyle : inputStyle}
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Telefoon */}
            <div>
              <label className={labelClass} style={labelStyle}>
                Telefoonnummer{' '}
                <span className="text-[10px] normal-case" style={{ color: 'var(--text-subtle)' }}>
                  (optioneel)
                </span>
              </label>
              <input
                type="tel"
                placeholder="+31 6 12 34 56 78"
                className={inputClass}
                style={errors.telefoon ? inputErrorStyle : inputStyle}
                {...register('telefoon')}
              />
              {errors.telefoon && (
                <p className="mt-1.5 text-xs text-red-400">{errors.telefoon.message}</p>
              )}
            </div>

            {/* Voorkeur contact */}
            <div>
              <label className={labelClass} style={labelStyle}>
                Voorkeur contact{' '}
                <span className="text-[10px] normal-case" style={{ color: 'var(--text-subtle)' }}>
                  (optioneel)
                </span>
              </label>
              <div className="relative">
                <select
                  className={`${inputClass} appearance-none pr-10`}
                  style={inputStyle}
                  {...register('voorkeursContact')}
                >
                  {CONTACT_METHODS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4"
                  style={{ color: 'var(--text-subtle)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Trip context */}
      <div>
        <h3 className="font-serif text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          Over uw reis
        </h3>
        <p className="text-xs mb-5" style={{ color: 'var(--text-subtle)' }}>
          Optioneel, maar helpt ons u sneller een passend antwoord te geven.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Aantal reizigers */}
          <div>
            <label className={labelClass} style={labelStyle}>
              Aantal reizigers
            </label>
            <div className="relative">
              <select
                className={`${inputClass} appearance-none pr-10`}
                style={inputStyle}
                {...register('aantalReizigers')}
              >
                {REIZIGERS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4"
                style={{ color: 'var(--text-subtle)' }}
              />
            </div>
          </div>

          {/* Voorkeurs periode */}
          <div>
            <label className={labelClass} style={labelStyle}>
              Reisperiode
            </label>
            <div className="relative">
              <select
                className={`${inputClass} appearance-none pr-10`}
                style={inputStyle}
                {...register('voorkeursPeriode')}
              >
                {PERIODE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4"
                style={{ color: 'var(--text-subtle)' }}
              />
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className={labelClass} style={labelStyle}>
              Budget indicatie
            </label>
            <div className="relative">
              <select
                className={`${inputClass} appearance-none pr-10`}
                style={inputStyle}
                {...register('budgetIndicatie')}
              >
                {BUDGET_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4"
                style={{ color: 'var(--text-subtle)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section: Message */}
      <div>
        <h3 className="font-serif text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          Uw bericht
        </h3>
        <p className="text-xs mb-5" style={{ color: 'var(--text-subtle)' }}>
          Vertel ons hoe we u kunnen helpen.
        </p>

        <div className="space-y-4">
          {/* Onderwerp */}
          <div>
            <label className={labelClass} style={labelStyle}>
              Onderwerp <span style={{ color: '#2a7d58' }}>*</span>
            </label>
            <div className="relative">
              <select
                className={`${inputClass} appearance-none pr-10`}
                style={errors.onderwerp ? inputErrorStyle : inputStyle}
                {...register('onderwerp')}
              >
                {ONDERWERP_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4"
                style={{ color: 'var(--text-subtle)' }}
              />
            </div>
            {errors.onderwerp && (
              <p className="mt-1.5 text-xs text-red-400">{errors.onderwerp.message}</p>
            )}
          </div>

          {/* Bericht */}
          <div>
            <label className={labelClass} style={labelStyle}>
              Bericht <span style={{ color: '#2a7d58' }}>*</span>
            </label>
            <textarea
              rows={6}
              placeholder="Vertel ons over uw droomsafari, vragen, of hoe we u kunnen helpen..."
              className={`${inputClass} resize-none`}
              style={errors.bericht ? inputErrorStyle : inputStyle}
              {...register('bericht')}
            />
            <div className="flex items-center justify-between mt-1.5">
              {errors.bericht ? (
                <p className="text-xs text-red-400">{errors.bericht.message}</p>
              ) : (
                <span />
              )}
              <span
                className="text-[10px] tabular-nums"
                style={{
                  color: berichtLength > MESSAGE_MAX ? '#ef4444' : 'var(--text-subtle)',
                }}
              >
                {berichtLength} / {MESSAGE_MAX}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error banner */}
      {status === 'error' && (
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm"
          style={{
            background: 'rgba(139,28,44,0.12)',
            color: '#e07080',
            border: '1px solid rgba(139,28,44,0.25)',
          }}
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          Er is iets misgegaan. Probeer het opnieuw of stuur ons direct een e-mail.
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold transition-all duration-200"
        style={{
          background: status === 'loading' ? 'rgba(42,125,88,0.4)' : '#2a7d58',
          color: '#ffffff',
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
        }}
      >
        {status === 'loading' ? 'Versturen…' : 'Bericht versturen'}
        {status !== 'loading' && <Send className="h-4 w-4" />}
      </button>
    </form>
  )
}
