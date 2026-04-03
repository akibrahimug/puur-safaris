import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contactPage',
  title: 'Contactpagina',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'content', title: 'Inhoud' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ─── HERO ──────────────────────────────────────────────────────
    defineField({
      name: 'heroTitle',
      title: 'Hero Titel',
      type: 'string',
      group: 'hero',
      description: 'Bijv. "Contact".',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Ondertitel',
      type: 'string',
      group: 'hero',
    }),

    // ─── CONTENT ───────────────────────────────────────────────────
    defineField({
      name: 'sidebarHeading',
      title: 'Zijbalk Koptekst',
      type: 'string',
      group: 'content',
      description: 'Bijv. "Onze gegevens".',
    }),
    defineField({
      name: 'sidebarDescription',
      title: 'Zijbalk Beschrijving',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    defineField({
      name: 'phoneLabel',
      title: 'Telefoon Label',
      type: 'string',
      group: 'content',
      description: 'Bijv. "Telefoon".',
    }),
    defineField({
      name: 'emailLabel',
      title: 'E-mail Label',
      type: 'string',
      group: 'content',
      description: 'Bijv. "E-mail".',
    }),
    defineField({
      name: 'addressLabel',
      title: 'Adres Label',
      type: 'string',
      group: 'content',
      description: 'Bijv. "Adres".',
    }),
    defineField({
      name: 'openingHoursLabel',
      title: 'Bereikbaarheid Label',
      type: 'string',
      group: 'content',
      description: 'Bijv. "Bereikbaarheid".',
    }),
    defineField({
      name: 'whatsappCtaLabel',
      title: 'WhatsApp CTA Tekst',
      type: 'string',
      group: 'content',
      description: 'Bijv. "Chat via WhatsApp".',
    }),
    defineField({
      name: 'responseTimeText',
      title: 'Reactietijd Tekst',
      type: 'string',
      group: 'content',
      description: 'Bijv. "Gemiddelde reactietijd: binnen 24 uur".',
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
