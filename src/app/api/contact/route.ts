import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

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

    const toEmail = process.env.CONTACT_FORM_TO_EMAIL
    if (!toEmail) {
      return NextResponse.json({ error: 'Server niet geconfigureerd' }, { status: 500 })
    }

    const contextLines: string[] = []
    if (data.voorkeursContact) contextLines.push(`Voorkeur contact: ${data.voorkeursContact}`)
    if (data.aantalReizigers) contextLines.push(`Aantal reizigers: ${data.aantalReizigers}`)
    if (data.voorkeursPeriode) contextLines.push(`Reisperiode: ${data.voorkeursPeriode}`)
    if (data.budgetIndicatie) contextLines.push(`Budget: ${BUDGET_LABELS[data.budgetIndicatie] ?? data.budgetIndicatie}`)

    const contextBlock = contextLines.length > 0
      ? `\nReiscontext:\n${contextLines.map((l) => `  ${l}`).join('\n')}\n`
      : ''

    const contextHtml = contextLines.length > 0
      ? `<h3>Reiscontext</h3><table cellpadding="4">${contextLines
          .map((l) => {
            const [label, ...rest] = l.split(': ')
            return `<tr><td><strong>${label}:</strong></td><td>${rest.join(': ')}</td></tr>`
          })
          .join('')}</table>`
      : ''

    await resend.emails.send({
      from: 'Puur Safaris Website <noreply@puursafaris.nl>',
      to: toEmail,
      replyTo: data.email,
      subject: `Nieuw bericht: ${data.onderwerp}`,
      text: `
Nieuw contactformulier bericht ontvangen via puursafaris.nl

Naam: ${data.naam}
E-mail: ${data.email}
${data.telefoon ? `Telefoon: ${data.telefoon}` : ''}
Onderwerp: ${data.onderwerp}
${contextBlock}
Bericht:
${data.bericht}
      `.trim(),
      html: `
<h2>Nieuw contactformulier bericht</h2>
<table cellpadding="4">
  <tr><td><strong>Naam:</strong></td><td>${data.naam}</td></tr>
  <tr><td><strong>E-mail:</strong></td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
  ${data.telefoon ? `<tr><td><strong>Telefoon:</strong></td><td>${data.telefoon}</td></tr>` : ''}
  <tr><td><strong>Onderwerp:</strong></td><td>${data.onderwerp}</td></tr>
</table>
${contextHtml}
<h3>Bericht:</h3>
<p>${data.bericht.replace(/\n/g, '<br>')}</p>
      `,
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
