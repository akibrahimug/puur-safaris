import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Instellingen',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Sitenaam',
      type: 'string',
      initialValue: 'Puur Safaris',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Korte slogan onder de sitenaam.',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: false },
      fields: [defineField({ name: 'alt', title: 'Alt tekst', type: 'string' })],
    }),

    // ─── CONTACT ─────────────────────────────────────────────────────
    defineField({
      name: 'contactEmail',
      title: 'Contacte-mailadres',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Telefoonnummer',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Adres',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'chamberOfCommerceNumber',
      title: 'KvK Nummer',
      type: 'string',
    }),

    // ─── SOCIAL MEDIA ─────────────────────────────────────────────────
    defineField({
      name: 'socialMedia',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
        defineField({ name: 'facebook', title: 'Facebook URL', type: 'url' }),
        defineField({
          name: 'whatsapp',
          title: 'WhatsApp Nummer',
          type: 'string',
          description: 'Bijv. +31612345678 (inclusief landcode)',
        }),
        defineField({ name: 'youtube', title: 'YouTube URL', type: 'url' }),
      ],
    }),

    // ─── SEO DEFAULTS ─────────────────────────────────────────────────
    defineField({
      name: 'defaultSeoTitle',
      title: 'Standaard SEO Titel',
      type: 'string',
      description: 'Wordt gebruikt als er geen specifieke SEO titel is ingesteld.',
    }),
    defineField({
      name: 'defaultSeoDescription',
      title: 'Standaard SEO Omschrijving',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'defaultOgImage',
      title: 'Standaard Social Media Afbeelding',
      type: 'image',
      options: { hotspot: true },
    }),

    // ─── FOOTER ───────────────────────────────────────────────────────
    defineField({
      name: 'footerText',
      title: 'Footer Tekst',
      type: 'text',
      rows: 2,
      description: 'Korte tekst onderaan de pagina.',
    }),
  ],
  preview: {
    select: { title: 'siteName', media: 'logo' },
  },
})
