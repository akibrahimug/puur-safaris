import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { ContactAdminEmail } from '@/emails/contact-admin'

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
    const body = await req.json()
    const data = schema.parse(body)

    const toEmail = process.env.ADMIN_EMAIL
    const fromEmail = process.env.EMAIL_FROM
    if (!toEmail || !fromEmail) {
      return NextResponse.json({ error: 'Server niet geconfigureerd' }, { status: 500 })
    }

    const isEigenReisschema = data.onderwerp === 'Eigen Reisschema Aanvraag'
    const reiscontext: { label: string; value: string }[] = []
    if (data.voorkeursContact) reiscontext.push({ label: isEigenReisschema ? 'Bestemmingen' : 'Voorkeur contact', value: data.voorkeursContact })
    if (data.aantalReizigers) reiscontext.push({ label: isEigenReisschema ? 'Groepsgrootte' : 'Aantal reizigers', value: data.aantalReizigers })
    if (data.voorkeursPeriode) reiscontext.push({ label: isEigenReisschema ? 'Periode & duur' : 'Reisperiode', value: data.voorkeursPeriode })
    if (data.budgetIndicatie) reiscontext.push({ label: isEigenReisschema ? 'Stijl & accommodatie' : 'Budget', value: BUDGET_LABELS[data.budgetIndicatie] ?? data.budgetIndicatie })

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

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ongeldige invoer', details: error.issues }, { status: 400 })
    }
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Versturen mislukt' }, { status: 500 })
  }
}
