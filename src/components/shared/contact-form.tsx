'use client'

import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, AlertCircle, Send, ChevronDown } from 'lucide-react'

// ── Schema ────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createSchema(f?: Record<string, any>) {
  return z.object({
    naam: z.string().min(2, f?.validationNameRequired ?? 'Vul uw volledige naam in (minimaal 2 tekens)'),
    email: z.string().email(f?.validationEmailInvalid ?? 'Vul een geldig e-mailadres in'),
    telefoon: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[+]?[\d\s\-().]{7,20}$/.test(val),
        f?.validationPhoneInvalid ?? 'Vul een geldig telefoonnummer in'
      ),
    voorkeursContact: z.string().optional(),
    aantalReizigers: z.string().optional(),
    voorkeursPeriode: z.string().optional(),
    budgetIndicatie: z.string().optional(),
    onderwerp: z.string().min(1, f?.validationSubjectRequired ?? 'Kies een onderwerp'),
    bericht: z
      .string()
      .min(20, f?.validationMessageMin ?? 'Uw bericht moet minimaal 20 tekens zijn')
      .max(2000, f?.validationMessageMax ?? 'Uw bericht mag maximaal 2000 tekens zijn'),
  })
}

type FormData = z.infer<ReturnType<typeof createSchema>>

// ── Option builders ──────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getOnderwerpOptions(f?: Record<string, any>) {
  return [
    { value: '', label: f?.subjectPlaceholder ?? 'Kies een onderwerp' },
    { value: 'Offerte aanvraag', label: f?.subjectQuote ?? 'Offerte aanvraag' },
    { value: 'Informatie over safari', label: f?.subjectInfo ?? 'Informatie over een safari' },
    { value: 'Bestaande boeking', label: f?.subjectBooking ?? 'Vraag over bestaande boeking' },
    { value: 'Samenwerking', label: f?.subjectPartnership ?? 'Samenwerking / Zakelijk' },
    { value: 'Overig', label: f?.subjectOther ?? 'Overig' },
  ]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getContactMethods(f?: Record<string, any>) {
  return [
    { value: '', label: f?.methodNoPreference ?? 'Geen voorkeur' },
    { value: 'email', label: f?.methodEmail ?? 'E-mail' },
    { value: 'telefoon', label: f?.methodPhone ?? 'Telefoon' },
    { value: 'whatsapp', label: f?.methodWhatsApp ?? 'WhatsApp' },
  ]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getReizigersOptions(f?: Record<string, any>) {
  return [
    { value: '', label: f?.travelersSelect ?? 'Selecteer' },
    { value: '1', label: f?.travelers1 ?? '1 persoon' },
    { value: '2', label: f?.travelers2 ?? '2 personen' },
    { value: '3-5', label: f?.travelers3to5 ?? '3–5 personen' },
    { value: '6-10', label: f?.travelers6to10 ?? '6–10 personen' },
    { value: '10+', label: f?.travelers10plus ?? '10+ personen' },
  ]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getPeriodeOptions(f?: Record<string, any>, months?: string[]) {
  const m = months ?? [
    'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
    'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December',
  ]
  return [
    { value: '', label: f?.periodSelect ?? 'Selecteer' },
    ...m.map((month) => ({ value: month, label: month })),
    { value: 'Flexibel', label: f?.periodFlexible ?? 'Flexibel / Weet ik nog niet' },
  ]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getBudgetOptions(f?: Record<string, any>) {
  return [
    { value: '', label: f?.budgetSelect ?? 'Selecteer' },
    { value: 'tot-2000', label: f?.budgetTo2000 ?? 'Tot €2.000 p.p.' },
    { value: '2000-4000', label: f?.budget2000to4000 ?? '€2.000 – €4.000 p.p.' },
    { value: '4000-6000', label: f?.budget4000to6000 ?? '€4.000 – €6.000 p.p.' },
    { value: '6000-plus', label: f?.budget6000plus ?? '€6.000+ p.p.' },
    { value: 'onbekend', label: f?.budgetUnknown ?? 'Weet ik nog niet' },
  ]
}

const MESSAGE_MAX = 2000

// ── Styling ───────────────────────────────────────────────────────────────────

const inputClass =
  'w-full min-h-[44px] rounded-xl px-4 py-3 text-base sm:text-sm outline-none transition-all duration-200'
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict?: Record<string, any>
}

export function ContactForm({ prefilledSafari, dict }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const f = dict?.contact?.form
  const months = dict?.common?.months

  const schema = useMemo(() => createSchema(f), [f])
  const onderwerpOptions = useMemo(() => getOnderwerpOptions(f), [f])
  const contactMethods = useMemo(() => getContactMethods(f), [f])
  const reizigersOptions = useMemo(() => getReizigersOptions(f), [f])
  const periodeOptions = useMemo(() => getPeriodeOptions(f, months), [f, months])
  const budgetOptions = useMemo(() => getBudgetOptions(f), [f])

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
      if (!res.ok) throw new Error(f?.errorSend ?? 'Fout bij versturen')
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  // ── Success ───────────────────────────────────────────────────────────────

  if (status === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center py-10 sm:py-16 text-center"
      >
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
          {f?.successHeading ?? 'Bericht ontvangen!'}
        </h3>
        <p className="text-base sm:text-sm max-w-md leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
          {f?.successMessage ?? 'Bedankt voor uw bericht. We nemen binnen 24 uur contact met u op.'}
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="min-h-[44px] rounded-full px-6 py-2.5 text-base sm:text-sm font-medium transition-all duration-200"
          style={{ color: 'var(--text-muted)', border: '1px solid rgba(42,125,88,0.25)' }}
        >
          {f?.successNewButton ?? 'Nieuw bericht sturen'}
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
          {f?.sectionPersonal ?? 'Uw gegevens'}
        </h3>
        <p className="text-xs mb-5" style={{ color: 'var(--text-subtle)' }}>
          {f?.sectionPersonalDesc ?? 'Zodat we u persoonlijk kunnen bereiken.'}
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Naam */}
            <div>
              <label className={labelClass} style={labelStyle}>
                {f?.fieldName ?? 'Naam'} <span style={{ color: '#2a7d58' }}>*</span>
              </label>
              <input
                type="text"
                inputMode="text"
                autoComplete="name"
                autoCapitalize="words"
                placeholder={f?.placeholderName ?? 'Jan de Vries'}
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
                {f?.fieldEmail ?? 'E-mailadres'} <span style={{ color: '#2a7d58' }}>*</span>
              </label>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder={f?.placeholderEmail ?? 'jan@voorbeeld.nl'}
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
                {f?.fieldPhone ?? 'Telefoonnummer'}{' '}
                <span className="text-[10px] normal-case" style={{ color: 'var(--text-subtle)' }}>
                  (optioneel)
                </span>
              </label>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder={f?.placeholderPhone ?? '+31 6 12 34 56 78'}
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
                {f?.fieldPreference ?? 'Voorkeur contact'}{' '}
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
                  {contactMethods.map((opt) => (
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
          {f?.sectionTrip ?? 'Over uw reis'}
        </h3>
        <p className="text-xs mb-5" style={{ color: 'var(--text-subtle)' }}>
          {f?.sectionTripDesc ?? 'Optioneel, maar helpt ons u sneller een passend antwoord te geven.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Aantal reizigers */}
          <div>
            <label className={labelClass} style={labelStyle}>
              {f?.fieldTravelers ?? 'Aantal reizigers'}
            </label>
            <div className="relative">
              <select
                className={`${inputClass} appearance-none pr-10`}
                style={inputStyle}
                {...register('aantalReizigers')}
              >
                {reizigersOptions.map((opt) => (
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
              {f?.fieldPeriod ?? 'Reisperiode'}
            </label>
            <div className="relative">
              <select
                className={`${inputClass} appearance-none pr-10`}
                style={inputStyle}
                {...register('voorkeursPeriode')}
              >
                {periodeOptions.map((opt) => (
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
              {f?.fieldBudget ?? 'Budget indicatie'}
            </label>
            <div className="relative">
              <select
                className={`${inputClass} appearance-none pr-10`}
                style={inputStyle}
                {...register('budgetIndicatie')}
              >
                {budgetOptions.map((opt) => (
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
          {f?.sectionMessage ?? 'Uw bericht'}
        </h3>
        <p className="text-xs mb-5" style={{ color: 'var(--text-subtle)' }}>
          {f?.sectionMessageDesc ?? 'Vertel ons hoe we u kunnen helpen.'}
        </p>

        <div className="space-y-4">
          {/* Onderwerp */}
          <div>
            <label className={labelClass} style={labelStyle}>
              {f?.fieldSubject ?? 'Onderwerp'} <span style={{ color: '#2a7d58' }}>*</span>
            </label>
            <div className="relative">
              <select
                className={`${inputClass} appearance-none pr-10`}
                style={errors.onderwerp ? inputErrorStyle : inputStyle}
                {...register('onderwerp')}
              >
                {onderwerpOptions.map((opt) => (
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
              {f?.fieldMessage ?? 'Bericht'} <span style={{ color: '#2a7d58' }}>*</span>
            </label>
            <textarea
              rows={6}
              placeholder={f?.placeholderMessage ?? 'Vertel ons over uw droomsafari, vragen, of hoe we u kunnen helpen...'}
              className={`${inputClass} min-h-[140px] resize-y`}
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
      <div aria-live="polite" role="status">
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
            {f?.errorMessage ?? 'Er is iets misgegaan. Probeer het opnieuw of stuur ons direct een e-mail.'}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="flex w-full sm:w-auto min-h-[44px] items-center justify-center gap-2 rounded-full px-8 py-3 text-base sm:text-sm font-semibold transition-all duration-200"
        style={{
          background: status === 'loading' ? 'rgba(42,125,88,0.4)' : '#2a7d58',
          color: '#ffffff',
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
        }}
      >
        {status === 'loading' ? (f?.submitLoading ?? 'Versturen…') : (f?.submitButton ?? 'Bericht versturen')}
        {status !== 'loading' && <Send className="h-4 w-4" />}
      </button>
    </form>
  )
}
