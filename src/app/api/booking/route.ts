import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

const schema = z.object({
  // Required fields
  voornaam: z.string().min(1),
  achternaam: z.string().min(1),
  email: z.string().email(),
  telefoon: z.string().min(1),
  geboortedatum: z.string().min(1),
  vertrekdatum: z.string().min(1),
  aantalVolwassenen: z.number().int().min(1).max(20),
  aantalKinderen: z.number().int().min(0).max(10),
  tripTitle: z.string().min(1),
  tripSlug: z.string().min(1),
  // Optional fields
  retourdatum: z.string().optional(),
  nationaliteit: z.string().optional(),
  paspoortnummer: z.string().optional(),
  dieetwensen: z.string().optional(),
  medischeBijzonderheden: z.string().optional(),
  speciale_verzoeken: z.string().optional(),
  gevonden: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const toEmail = process.env.CONTACT_FORM_TO_EMAIL
    if (!toEmail) {
      return NextResponse.json({ error: 'Server niet geconfigureerd' }, { status: 500 })
    }

    const adminText = [
      '=== NIEUWE BOEKINGSAANVRAAG — PUUR SAFARIS ===',
      '',
      '── REIS ──────────────────────────────────────',
      `Reis:              ${data.tripTitle}`,
      `Slug:              ${data.tripSlug}`,
      `Vertrekdatum:      ${data.vertrekdatum}`,
      data.retourdatum ? `Retourdatum:       ${data.retourdatum}` : 'Retourdatum:       Flexibel / n.v.t.',
      `Volwassenen:       ${data.aantalVolwassenen}`,
      `Kinderen:          ${data.aantalKinderen}`,
      '',
      '── REIZIGERSINFORMATIE ───────────────────────',
      `Naam:              ${data.voornaam} ${data.achternaam}`,
      `E-mail:            ${data.email}`,
      `Telefoon:          ${data.telefoon}`,
      `Geboortedatum:     ${data.geboortedatum}`,
      data.nationaliteit ? `Nationaliteit:     ${data.nationaliteit}` : null,
      data.paspoortnummer ? `Paspoortnummer:    ${data.paspoortnummer}` : null,
      '',
      '── BIJZONDERHEDEN ────────────────────────────',
      data.dieetwensen ? `Dieetwensen:\n${data.dieetwensen}` : 'Dieetwensen:       —',
      '',
      data.medischeBijzonderheden
        ? `Medische bijzonderheden (vertrouwelijk):\n${data.medischeBijzonderheden}`
        : 'Medische bijzonderheden: —',
      '',
      data.speciale_verzoeken
        ? `Speciale verzoeken:\n${data.speciale_verzoeken}`
        : 'Speciale verzoeken: —',
      '',
      data.gevonden ? `Gevonden via:      ${data.gevonden}` : null,
    ]
      .filter((line) => line !== null)
      .join('\n')

    // Email 1: to admin
    await resend.emails.send({
      from: 'Puur Safaris <noreply@puursafaris.nl>',
      to: toEmail,
      replyTo: data.email,
      subject: `Nieuwe boeking: ${data.tripTitle} — ${data.voornaam} ${data.achternaam}`,
      text: adminText,
      html: `
<h2>Nieuwe boekingsaanvraag — Puur Safaris</h2>

<h3>Reis</h3>
<table cellpadding="4">
  <tr><td><strong>Reis:</strong></td><td>${data.tripTitle}</td></tr>
  <tr><td><strong>Vertrekdatum:</strong></td><td>${data.vertrekdatum}</td></tr>
  <tr><td><strong>Retourdatum:</strong></td><td>${data.retourdatum ?? 'Flexibel / n.v.t.'}</td></tr>
  <tr><td><strong>Volwassenen:</strong></td><td>${data.aantalVolwassenen}</td></tr>
  <tr><td><strong>Kinderen:</strong></td><td>${data.aantalKinderen}</td></tr>
</table>

<h3>Reizigersinformatie</h3>
<table cellpadding="4">
  <tr><td><strong>Naam:</strong></td><td>${data.voornaam} ${data.achternaam}</td></tr>
  <tr><td><strong>E-mail:</strong></td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
  <tr><td><strong>Telefoon:</strong></td><td>${data.telefoon}</td></tr>
  <tr><td><strong>Geboortedatum:</strong></td><td>${data.geboortedatum}</td></tr>
  ${data.nationaliteit ? `<tr><td><strong>Nationaliteit:</strong></td><td>${data.nationaliteit}</td></tr>` : ''}
  ${data.paspoortnummer ? `<tr><td><strong>Paspoortnummer:</strong></td><td>${data.paspoortnummer}</td></tr>` : ''}
</table>

<h3>Bijzonderheden</h3>
<p><strong>Dieetwensen:</strong><br>${data.dieetwensen ? data.dieetwensen.replace(/\n/g, '<br>') : '—'}</p>
<p><strong>Medische bijzonderheden (vertrouwelijk):</strong><br>${data.medischeBijzonderheden ? data.medischeBijzonderheden.replace(/\n/g, '<br>') : '—'}</p>
<p><strong>Speciale verzoeken:</strong><br>${data.speciale_verzoeken ? data.speciale_verzoeken.replace(/\n/g, '<br>') : '—'}</p>
${data.gevonden ? `<p><strong>Gevonden via:</strong> ${data.gevonden}</p>` : ''}
      `.trim(),
    })

    // Email 2: confirmation to customer
    await resend.emails.send({
      from: 'Puur Safaris <noreply@puursafaris.nl>',
      to: data.email,
      subject: `Bevestiging boekingsaanvraag: ${data.tripTitle}`,
      text: `Bedankt voor uw boeking, ${data.voornaam}. We nemen binnen 2 werkdagen contact met u op om uw boeking van ${data.tripTitle} te bevestigen.

Met vriendelijke groet,
Puur Safaris`,
      html: `
<p>Beste ${data.voornaam},</p>
<p>Bedankt voor uw boeking. We nemen binnen 2 werkdagen contact met u op om uw boeking van <strong>${data.tripTitle}</strong> te bevestigen.</p>
<p>Met vriendelijke groet,<br><strong>Puur Safaris</strong></p>
      `.trim(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ongeldige invoer', details: error.issues }, { status: 400 })
    }
    console.error('Booking form error:', error)
    return NextResponse.json({ error: 'Versturen mislukt' }, { status: 500 })
  }
}
