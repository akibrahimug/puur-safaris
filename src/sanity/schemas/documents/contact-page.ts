import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contactPage',
  title: 'Contact Page',
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
      description: 'Background image for the hero section.',
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
      title: 'Sidebar Heading',
      type: 'string',
      group: 'content',
      description: 'E.g. "Our details".',
    }),
    defineField({
      name: 'sidebarDescription',
      title: 'Sidebar Description',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    defineField({
      name: 'phoneLabel',
      title: 'Phone Label',
      type: 'string',
      group: 'content',
      description: 'E.g. "Phone".',
    }),
    defineField({
      name: 'emailLabel',
      title: 'Email Label',
      type: 'string',
      group: 'content',
      description: 'E.g. "Email".',
    }),
    defineField({
      name: 'addressLabel',
      title: 'Address Label',
      type: 'string',
      group: 'content',
      description: 'E.g. "Address".',
    }),
    defineField({
      name: 'openingHoursLabel',
      title: 'Availability Label',
      type: 'string',
      group: 'content',
      description: 'E.g. "Availability".',
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
      title: 'Response Time Text',
      type: 'string',
      group: 'content',
      description: 'E.g. "Average response time: within 24 hours".',
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
