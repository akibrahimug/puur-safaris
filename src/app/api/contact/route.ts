import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

const schema = z.object({
  naam: z.string().min(2),
  email: z.string().email(),
  telefoon: z.string().optional(),
  onderwerp: z.string().min(1),
  bericht: z.string().min(20),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const toEmail = process.env.CONTACT_FORM_TO_EMAIL
    if (!toEmail) {
      return NextResponse.json({ error: 'Server niet geconfigureerd' }, { status: 500 })
    }

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

Bericht:
${data.bericht}
      `.trim(),
      html: `
<h2>Nieuw contactformulier bericht</h2>
<table>
  <tr><td><strong>Naam:</strong></td><td>${data.naam}</td></tr>
  <tr><td><strong>E-mail:</strong></td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
  ${data.telefoon ? `<tr><td><strong>Telefoon:</strong></td><td>${data.telefoon}</td></tr>` : ''}
  <tr><td><strong>Onderwerp:</strong></td><td>${data.onderwerp}</td></tr>
</table>
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
