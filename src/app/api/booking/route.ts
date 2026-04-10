import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { writeClient } from '@/sanity/write-client'
import { BookingAdminEmail } from '@/emails/booking-admin'
import { BookingConfirmEmail } from '@/emails/booking-confirm'

const resend = new Resend(process.env.RESEND_API_KEY)

function generateBookingNumber(): string {
  const year = new Date().getFullYear()
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return `PS-${year}-${code}`
}

const schema = z.object({
  // Required fields
  voornaam: z.string().min(1),
  achternaam: z.string().min(1),
  email: z.string().email(),
  telefoon: z.string().optional(),
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

    const toEmail = process.env.ADMIN_EMAIL
    const fromEmail = process.env.EMAIL_FROM
    if (!toEmail || !fromEmail) {
      return NextResponse.json({ error: 'Server niet geconfigureerd' }, { status: 500 })
    }

    // Generate booking number and save to Sanity
    const bookingNumber = generateBookingNumber()

    // Email 1: to admin
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: data.email,
      subject: `Nieuwe boeking: ${data.tripTitle} — ${data.voornaam} ${data.achternaam}`,
      react: BookingAdminEmail({
        bookingNumber,
        tripTitle: data.tripTitle,
        tripSlug: data.tripSlug,
        vertrekdatum: data.vertrekdatum,
        retourdatum: data.retourdatum,
        aantalVolwassenen: data.aantalVolwassenen,
        aantalKinderen: data.aantalKinderen,
        voornaam: data.voornaam,
        achternaam: data.achternaam,
        email: data.email,
        telefoon: data.telefoon,
        geboortedatum: data.geboortedatum,
        nationaliteit: data.nationaliteit,
        paspoortnummer: data.paspoortnummer,
        dieetwensen: data.dieetwensen,
        medischeBijzonderheden: data.medischeBijzonderheden,
        speciale_verzoeken: data.speciale_verzoeken,
        gevonden: data.gevonden,
      }),
    })

    await writeClient.create({
      _type: 'booking',
      bookingNumber,
      voornaam: data.voornaam,
      achternaam: data.achternaam,
      email: data.email,
      telefoon: data.telefoon,
      tripTitle: data.tripTitle,
      tripSlug: data.tripSlug,
      vertrekdatum: data.vertrekdatum,
      aantalVolwassenen: data.aantalVolwassenen,
      aantalKinderen: data.aantalKinderen,
      status: 'pending',
      createdAt: new Date().toISOString(),
    })

    // Email 2: confirmation to customer (includes booking number)
    await resend.emails.send({
      from: fromEmail,
      to: data.email,
      subject: `Bevestiging boekingsaanvraag: ${data.tripTitle}`,
      react: BookingConfirmEmail({
        voornaam: data.voornaam,
        tripTitle: data.tripTitle,
        bookingNumber,
      }),
    })

    return NextResponse.json({ success: true, bookingNumber })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ongeldige invoer', details: error.issues }, { status: 400 })
    }
    console.error('Booking form error:', error)
    return NextResponse.json({ error: 'Versturen mislukt' }, { status: 500 })
  }
}
