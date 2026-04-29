import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { writeClient } from '@/sanity/write-client'
import { BookingAdminEmail } from '@/emails/booking-admin'
import { BookingConfirmEmail } from '@/emails/booking-confirm'
import { getClientIp, rateLimit } from '@/lib/rate-limit'

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
    // Booking submissions are higher-stakes (writes to Sanity, sends real
    // confirmations) — keep the per-IP limit tighter. A real human takes
    // minutes to fill the multi-step form so 3/min is plenty.
    const limit = rateLimit({ endpoint: 'booking', ip: getClientIp(req), limit: 3, windowMs: 60_000 })
    if (!limit.ok) {
      return NextResponse.json(
        { error: 'Te veel verzoeken. Probeer het later opnieuw.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
      )
    }

    const body = await req.json()
    const data = schema.parse(body)

    const toEmail = process.env.ADMIN_EMAIL
    const fromEmail = process.env.EMAIL_FROM
    if (!toEmail || !fromEmail) {
      return NextResponse.json({ error: 'Server niet geconfigureerd' }, { status: 500 })
    }

    const bookingNumber = generateBookingNumber()

    // Order matters: persist the booking FIRST so the lead is captured in the
    // CMS even if downstream email sending flakes. Then send the customer
    // confirmation (most critical — gives the user proof of submission with
    // their booking number). The admin notification is wrapped in try/catch
    // because by that point we already have the booking saved AND the
    // customer has been confirmed; failing the request would just cause the
    // user to retry and create a duplicate booking.
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

    try {
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
    } catch (adminMailError) {
      // Booking is in Sanity, customer has confirmation. Admin can recover
      // the lead from the CMS (filter by createdAt) or these logs.
      console.error('Booking form: admin notification failed', { bookingNumber, email: data.email, error: adminMailError })
    }

    return NextResponse.json({ success: true, bookingNumber })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ongeldige invoer', details: error.issues }, { status: 400 })
    }
    console.error('Booking form error:', error)
    return NextResponse.json({ error: 'Versturen mislukt' }, { status: 500 })
  }
}
