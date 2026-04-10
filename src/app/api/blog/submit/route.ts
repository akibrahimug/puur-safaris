import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { writeClient } from '@/sanity/write-client'
import { BlogSubmittedEmail } from '@/emails/blog-submitted'
import { BlogReviewAdminEmail } from '@/emails/blog-review-admin'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

const sectionSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  imageLayout: z.enum(['none', 'single', 'grid']),
  caption: z.string().optional(),
})

const schema = z.object({
  bookingNumber: z
    .string()
    .regex(/^PS-\d{4}-[A-Z0-9]{4}$/, 'Ongeldig boekingsnummer'),
  email: z.string().email('Ongeldig e-mailadres'),
  telefoon: z.string().optional(),
  title: z.string().min(1, 'Titel is verplicht'),
  authorName: z.string().min(1, 'Auteur is verplicht'),
  authorBio: z.string().optional(),
  intro: z.string().min(1, 'Intro is verplicht'),
  sections: z.string().transform((val) => {
    const parsed = JSON.parse(val)
    return z.array(sectionSchema).min(3, 'Minimaal 3 secties vereist').parse(parsed)
  }),
})

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 96)
}

function generateKey(): string {
  return crypto.randomBytes(6).toString('hex')
}

function textToPortableText(
  intro: string,
  sections: { title: string; body: string; imageLayout: string; caption?: string }[],
  sectionImageRefs: (string[] | null)[],
) {
  const blocks: Record<string, unknown>[] = []

  // Intro paragraph
  blocks.push({
    _type: 'block',
    _key: generateKey(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: generateKey(), text: intro, marks: [] }],
  })

  sections.forEach((section, i) => {
    // Section heading
    blocks.push({
      _type: 'block',
      _key: generateKey(),
      style: 'h2',
      markDefs: [],
      children: [
        { _type: 'span', _key: generateKey(), text: section.title, marks: [] },
      ],
    })

    // Section body
    blocks.push({
      _type: 'block',
      _key: generateKey(),
      style: 'normal',
      markDefs: [],
      children: [
        { _type: 'span', _key: generateKey(), text: section.body, marks: [] },
      ],
    })

    // Section images
    const refs = sectionImageRefs[i]
    if (refs && refs.length > 0) {
      for (const ref of refs) {
        blocks.push({
          _type: 'image',
          _key: generateKey(),
          asset: { _type: 'reference', _ref: ref },
          alt: section.caption || section.title,
          caption: section.caption || '',
        })
      }
    }
  })

  return blocks
}

async function uploadImage(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const asset = await writeClient.assets.upload('image', buffer, {
    filename: file.name,
    contentType: file.type,
  })
  return asset._id
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    // Extract text fields
    const textFields: Record<string, string> = {}
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        textFields[key] = value
      }
    }

    const data = schema.parse(textFields)

    // Verify booking
    const booking = await writeClient.fetch(
      `*[_type == "booking" && bookingNumber == $bookingNumber && email == $email][0]{ _id, status }`,
      { bookingNumber: data.bookingNumber, email: data.email },
    )

    if (!booking) {
      return NextResponse.json(
        {
          error:
            'Boekingsnummer en e-mailadres komen niet overeen. Controleer uw gegevens en probeer het opnieuw.',
        },
        { status: 403 },
      )
    }

    if (booking.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Deze boeking is geannuleerd.' },
        { status: 403 },
      )
    }

    // Upload hero image
    const heroImageFile = formData.get('heroImage') as File | null
    const heroImageRef = heroImageFile ? await uploadImage(heroImageFile) : null

    // Upload author photo
    const authorPhotoFile = formData.get('authorPhoto') as File | null
    const authorPhotoRef = authorPhotoFile ? await uploadImage(authorPhotoFile) : null

    // Upload section images: section_0_image_0, section_0_image_1, etc.
    const sectionImageRefs: (string[] | null)[] = []
    for (let si = 0; si < data.sections.length; si++) {
      const section = data.sections[si]
      if (section.imageLayout === 'none') {
        sectionImageRefs.push(null)
        continue
      }
      const refs: string[] = []
      let ii = 0
      while (formData.has(`section_${si}_image_${ii}`)) {
        const file = formData.get(`section_${si}_image_${ii}`) as File | null
        if (file) {
          const ref = await uploadImage(file)
          refs.push(ref)
        }
        ii++
      }
      sectionImageRefs.push(refs.length > 0 ? refs : null)
    }

    // Upload gallery images
    const galleryRefs: string[] = []
    let galleryIndex = 0
    while (formData.has(`gallery_${galleryIndex}`)) {
      const file = formData.get(`gallery_${galleryIndex}`) as File | null
      if (file) {
        const ref = await uploadImage(file)
        galleryRefs.push(ref)
      }
      galleryIndex++
    }

    // Build Portable Text content
    const content = textToPortableText(data.intro, data.sections, sectionImageRefs)

    // Create blog post in Sanity
    const slug = slugify(data.title)
    const today = new Date().toISOString().split('T')[0]

    const doc = await writeClient.create({
      _type: 'blogPost',
      title: data.title,
      slug: { _type: 'slug', current: slug },
      author: data.authorName,
      publishedAt: today,
      category: 'stories',
      status: 'pending_review',
      submitterEmail: data.email,
      submitterBooking: { _type: 'reference', _ref: booking._id },
      summary: data.intro.slice(0, 300),
      featuredImage: heroImageRef
        ? {
            _type: 'image',
            asset: { _type: 'reference', _ref: heroImageRef },
            alt: data.title,
          }
        : undefined,
      content,
    })

    // Send emails
    const fromEmail = process.env.EMAIL_FROM || 'Puur Safaris <noreply@puursafaris.nl>'
    const adminEmail = process.env.ADMIN_EMAIL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.puursafaris.nl'

    // 1. Confirmation to submitter
    await resend.emails.send({
      from: fromEmail,
      to: data.email,
      subject: `Reisverslag ontvangen: ${data.title}`,
      react: BlogSubmittedEmail({
        authorName: data.authorName,
        title: data.title,
      }),
    })

    // 2. Notification to admin with preview & studio links
    if (adminEmail) {
      await resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        subject: `Nieuw reisverslag ter beoordeling: ${data.title}`,
        react: BlogReviewAdminEmail({
          authorName: data.authorName,
          authorEmail: data.email,
          title: data.title,
          bookingNumber: data.bookingNumber,
          previewUrl: `${siteUrl}/blog/preview/${slug}`,
          studioUrl: `${siteUrl}/studio/structure/blogPost;${doc._id}`,
        }),
      })
    }

    return NextResponse.json({ success: true, id: doc._id })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ongeldige invoer', details: error.issues },
        { status: 400 },
      )
    }
    console.error('Blog submission error:', error)
    return NextResponse.json(
      { error: 'Er is iets misgegaan. Probeer het later opnieuw.' },
      { status: 500 },
    )
  }
}
