import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { ContactAdminEmail } from '@/emails/contact-admin'
import { ContactConfirmEmail } from '@/emails/contact-confirm'
import { getClientIp, rateLimit } from '@/lib/rate-limit'
import { getEmailFrom } from '@/lib/email'

const resend = new Resend(process.env.RESEND_API_KEY)

const schema = z.object({
  naam: z.string().min(2),
  email: z.string().email(),
  telefoon: z.string().optional(),
  voorkeursContact: z.string().optional(),
  aantalReizigers: z.string().optional(),
  voorkeursPeriode: z.string().optional(),
  budgetIndicatie: z.string().optional(),
  onderwerp: z.string().min(1),
  bericht: z.string().min(20).max(2000),
  // Honeypot: a hidden input the client form leaves empty. Bots that auto-
  // fill every field will populate it; anything non-empty is silently
  // rejected as 200 so the spammer doesn't learn we're filtering them.
  // Named neutrally (NOT "website") so browser autofill / password managers
  // don't fill it and silently drop real submissions — see contact-form.tsx.
  referralSource: z.string().optional(),
})

const BUDGET_LABELS: Record<string, string> = {
  'tot-2000': 'Tot €2.000 p.p.',
  '2000-4000': '€2.000 – €4.000 p.p.',
  '4000-6000': '€4.000 – €6.000 p.p.',
  '6000-plus': '€6.000+ p.p.',
  'onbekend': 'Weet ik nog niet',
}

export async function POST(req: NextRequest) {
  try {
    // 5 submissions per IP per minute is generous for legitimate users
    // (contact form fills aren't quick) and stops trivial scripted abuse.
    const limit = rateLimit({ endpoint: 'contact', ip: getClientIp(req), limit: 5, windowMs: 60_000 })
    if (!limit.ok) {
      return NextResponse.json(
        { error: 'Te veel verzoeken. Probeer het later opnieuw.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
      )
    }

    const body = await req.json()
    const data = schema.parse(body)

    // Honeypot tripped — pretend success so the bot moves on without learning
    // why. Also short-circuits before we waste an email send.
    if (data.referralSource && data.referralSource.trim() !== '') {
      return NextResponse.json({ success: true })
    }

    const toEmail = process.env.ADMIN_EMAIL
    const fromEmail = getEmailFrom()
    if (!toEmail || !fromEmail) {
      return NextResponse.json({ error: 'Server niet geconfigureerd' }, { status: 500 })
    }

    const isEigenReisschema = data.onderwerp === 'Eigen Reisschema Aanvraag'
    const reiscontext: { label: string; value: string }[] = []
    if (data.voorkeursContact) reiscontext.push({ label: isEigenReisschema ? 'Bestemmingen' : 'Voorkeur contact', value: data.voorkeursContact })
    if (data.aantalReizigers) reiscontext.push({ label: isEigenReisschema ? 'Groepsgrootte' : 'Aantal reizigers', value: data.aantalReizigers })
    if (data.voorkeursPeriode) reiscontext.push({ label: isEigenReisschema ? 'Periode & duur' : 'Reisperiode', value: data.voorkeursPeriode })
    if (data.budgetIndicatie) reiscontext.push({ label: isEigenReisschema ? 'Stijl & accommodatie' : 'Budget', value: BUDGET_LABELS[data.budgetIndicatie] ?? data.budgetIndicatie })

    // Send sender confirmation FIRST. If this fails, the user sees an error
    // and can retry — better than the admin getting a lead the user thinks
    // didn't go through. The admin email is sent after; if THAT fails we log
    // it but still return success to the sender (their copy went out, and we
    // can recover the lead from server logs).
    await resend.emails.send({
      from: fromEmail,
      to: data.email,
      subject: isEigenReisschema
        ? `Bevestiging: ${data.onderwerp}`
        : `Bedankt voor uw bericht — ${data.onderwerp}`,
      react: ContactConfirmEmail({
        naam: data.naam,
        onderwerp: data.onderwerp,
        bericht: data.bericht,
        isEigenReisschema,
      }),
    })

    try {
      await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        replyTo: data.email,
        subject: `Nieuw bericht: ${data.onderwerp}`,
        react: ContactAdminEmail({
          naam: data.naam,
          email: data.email,
          telefoon: data.telefoon,
          onderwerp: data.onderwerp,
          bericht: data.bericht,
          reiscontext: reiscontext.length > 0 ? reiscontext : undefined,
          reiscontextTitle: isEigenReisschema ? 'Reisdetails' : undefined,
          berichtTitle: isEigenReisschema ? 'Extra wensen' : undefined,
        }),
      })
    } catch (adminMailError) {
      // Lead is captured in the sender confirmation (user has proof) and in
      // logs. Don't fail the request — surfacing an error here would cause
      // the user to retry and produce duplicate confirmation emails.
      console.error('Contact form: admin notification failed', { onderwerp: data.onderwerp, email: data.email, error: adminMailError })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ongeldige invoer', details: error.issues }, { status: 400 })
    }
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Versturen mislukt' }, { status: 500 })
  }
}
