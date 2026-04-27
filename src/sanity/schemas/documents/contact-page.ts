import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contactPage',
  title: 'Contactpagina',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'content', title: 'Content' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ─── HERO ──────────────────────────────────────────────────────
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      group: 'hero',
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
      ],
      description: 'Backgroundafbeelding voor de hero sectie.',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      group: 'hero',
      description: 'E.g. "Contact".',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      group: 'hero',
    }),

    // ─── CONTENT ───────────────────────────────────────────────────
    defineField({
      name: 'sidebarHeading',
      title: 'Zijbalk Heading',
      type: 'string',
      group: 'content',
      description: 'E.g. "Onze gegevens".',
    }),
    defineField({
      name: 'sidebarDescription',
      title: 'Zijbalk Description',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    defineField({
      name: 'phoneLabel',
      title: 'Phone Label',
      type: 'string',
      group: 'content',
      description: 'E.g. "Telefoon".',
    }),
    defineField({
      name: 'emailLabel',
      title: 'Email Label',
      type: 'string',
      group: 'content',
      description: 'E.g. "E-mail".',
    }),
    defineField({
      name: 'addressLabel',
      title: 'Address Label',
      type: 'string',
      group: 'content',
      description: 'E.g. "Adres".',
    }),
    defineField({
      name: 'openingHoursLabel',
      title: 'Bereikbaarheid Label',
      type: 'string',
      group: 'content',
      description: 'E.g. "Bereikbaarheid".',
    }),
    defineField({
      name: 'whatsappCtaLabel',
      title: 'WhatsApp CTA Text',
      type: 'string',
      group: 'content',
      description: 'E.g. "Chat via WhatsApp".',
    }),
    defineField({
      name: 'responseTimeText',
      title: 'Reactietijd Text',
      type: 'string',
      group: 'content',
      description: 'E.g. "Gemiddelde reactietijd: binnen 24 uur".',
    }),

    // ─── SEO ───────────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
      group: 'seo',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Contactpagina' }),
  },
})
