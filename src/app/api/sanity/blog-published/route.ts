import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { BlogPublishedEmail } from '@/emails/blog-published'

const resend = new Resend(process.env.RESEND_API_KEY)

interface WebhookBody {
  _type: string
  status: string
  submitterEmail?: string
  title?: string
  slug?: string
}

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-webhook-secret')
    if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: WebhookBody = await req.json()

    if (
      body._type !== 'blogPost' ||
      body.status !== 'published' ||
      !body.submitterEmail
    ) {
      return NextResponse.json({ skipped: true })
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://www.puurugandareizen.nl'
    const blogUrl = `${siteUrl}/blog/${body.slug}`

    const fromEmail = process.env.EMAIL_FROM || 'Puur Uganda Reizen <noreply@puurugandareizen.nl>'
    await resend.emails.send({
      from: fromEmail,
      to: body.submitterEmail,
      subject: 'Je reisverslag is gepubliceerd!',
      react: BlogPublishedEmail({
        title: body.title || 'Je reisverslag',
        blogUrl,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Blog published webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 },
    )
  }
}
