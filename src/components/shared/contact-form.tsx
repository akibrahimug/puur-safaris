'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { CheckCircle2, AlertCircle } from 'lucide-react'

const schema = z.object({
  naam: z.string().min(2, 'Vul uw naam in'),
  email: z.string().email('Vul een geldig e-mailadres in'),
  telefoon: z.string().optional(),
  onderwerp: z.string().min(1, 'Kies een onderwerp'),
  bericht: z.string().min(20, 'Uw bericht moet minimaal 20 tekens zijn'),
})

type FormData = z.infer<typeof schema>

interface ContactFormProps {
  prefilledSafari?: string
}

export function ContactForm({ prefilledSafari }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      onderwerp: prefilledSafari ? `Offerte aanvraag: ${prefilledSafari}` : '',
    },
  })

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

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl bg-green-50 p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
        <div>
          <p className="font-semibold text-stone-900 text-lg">Bericht ontvangen!</p>
          <p className="mt-1 text-stone-600">
            Bedankt voor uw bericht. We nemen binnen 24 uur contact met u op.
          </p>
        </div>
        <Button variant="outline" onClick={() => setStatus('idle')}>
          Nieuw bericht sturen
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="naam">Naam *</Label>
          <Input id="naam" placeholder="Jan de Vries" {...register('naam')} />
          {errors.naam && <p className="text-xs text-red-600">{errors.naam.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">E-mailadres *</Label>
          <Input id="email" type="email" placeholder="jan@email.nl" {...register('email')} />
          {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="telefoon">Telefoonnummer</Label>
        <Input id="telefoon" type="tel" placeholder="+31 6 12 34 56 78" {...register('telefoon')} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="onderwerp">Onderwerp *</Label>
        <Select id="onderwerp" {...register('onderwerp')}>
          <option value="">Kies een onderwerp</option>
          <option value="Offerte aanvraag">Offerte aanvraag</option>
          <option value="Informatie over safari">Informatie over een safari</option>
          <option value="Bestaande boeking">Vraag over bestaande boeking</option>
          <option value="Overig">Overig</option>
        </Select>
        {errors.onderwerp && <p className="text-xs text-red-600">{errors.onderwerp.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bericht">Uw bericht *</Label>
        <Textarea
          id="bericht"
          rows={5}
          placeholder="Vertel ons over uw droomsafari..."
          {...register('bericht')}
        />
        {errors.bericht && <p className="text-xs text-red-600">{errors.bericht.message}</p>}
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Er is iets misgegaan. Probeer het opnieuw of stuur een e-mail.
        </div>
      )}

      <Button type="submit" size="lg" disabled={status === 'loading'} className="w-full sm:w-auto">
        {status === 'loading' ? 'Versturen…' : 'Bericht versturen'}
      </Button>
    </form>
  )
}
