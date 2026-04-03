import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'trustStrip', title: 'Trust Strip' },
    { name: 'features', title: 'Waarom Puur Safaris' },
    { name: 'sections', title: 'Secties & CTA' },
    { name: 'testimonials', title: 'Beoordelingen' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ─── HERO ──────────────────────────────────────────────────────
    defineField({
      name: 'heroEyebrow',
      title: 'Hero Eyebrow',
      type: 'string',
      group: 'hero',
      description: 'Kleine tekst boven de titel, bijv. "Authentieke Safari Ervaringen".',
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Hero Titel',
      type: 'string',
      group: 'hero',
      description: 'Hoofdtitel, bijv. "Ontdek Afrika".',
    }),
    defineField({
      name: 'heroHeadlineAccent',
      title: 'Hero Titel Accent',
      type: 'string',
      group: 'hero',
      description: 'Geaccentueerd deel van de titel (in goud), bijv. "op zijn puurste".',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Ondertitel',
      type: 'text',
      rows: 2,
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Afbeelding',
      type: 'image',
      options: { hotspot: true },
      group: 'hero',
      fields: [defineField({ name: 'alt', title: 'Alt tekst', type: 'string' })],
    }),
    defineField({
      name: 'heroCta1Text',
      title: 'CTA 1 Tekst',
      type: 'string',
      group: 'hero',
      description: 'Primaire knoptekst, bijv. "Bekijk onze reizen".',
    }),
    defineField({
      name: 'heroCta1Link',
      title: 'CTA 1 Link',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroCta2Text',
      title: 'CTA 2 Tekst',
      type: 'string',
      group: 'hero',
      description: 'Secundaire knoptekst, bijv. "Eigen Reisschema".',
    }),
    defineField({
      name: 'heroCta2Link',
      title: 'CTA 2 Link',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroSocialProofText',
      title: 'Social Proof Tekst',
      type: 'string',
      group: 'hero',
      description: 'Bijv. "500+ tevreden reizigers".',
    }),

    // ─── TRUST STRIP ───────────────────────────────────────────────
    defineField({
      name: 'trustItems',
      title: 'Trust Items',
      type: 'array',
      group: 'trustStrip',
      description: 'Maximaal 4 statistieken voor de vertrouwensstrook.',
      validation: (Rule) => Rule.max(4),
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Waarde', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'phrase', title: 'Omschrijving', type: 'string', validation: (Rule) => Rule.required() }),
          ],
          preview: {
            select: { title: 'value', subtitle: 'phrase' },
          },
        },
      ],
    }),

    // ─── FEATURES (WHY CHOOSE US) ──────────────────────────────────
    defineField({
      name: 'featuresEyebrow',
      title: 'Features Eyebrow',
      type: 'string',
      group: 'features',
      description: 'Bijv. "Waarom Puur Safaris".',
    }),
    defineField({
      name: 'featuresTitle',
      title: 'Features Titel',
      type: 'string',
      group: 'features',
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      group: 'features',
      description: 'Maximaal 6 USP kaarten.',
      validation: (Rule) => Rule.max(6),
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'iconName',
              title: 'Icoon',
              type: 'string',
              options: {
                list: [
                  { title: 'Heart', value: 'Heart' },
                  { title: 'Shield', value: 'Shield' },
                  { title: 'Users', value: 'Users' },
                  { title: 'Star', value: 'Star' },
                  { title: 'Globe', value: 'Globe' },
                  { title: 'Headphones', value: 'Headphones' },
                  { title: 'Map', value: 'Map' },
                  { title: 'Compass', value: 'Compass' },
                  { title: 'Sun', value: 'Sun' },
                  { title: 'Camera', value: 'Camera' },
                ],
              },
            }),
            defineField({ name: 'title', title: 'Titel', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', title: 'Omschrijving', type: 'text', rows: 2 }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'iconName' },
          },
        },
      ],
    }),

    // ─── SECTIONS & CTA ────────────────────────────────────────────
    defineField({
      name: 'featuredTripsEyebrow',
      title: 'Uitgelichte Reizen Eyebrow',
      type: 'string',
      group: 'sections',
    }),
    defineField({
      name: 'featuredTripsTitle',
      title: 'Uitgelichte Reizen Titel',
      type: 'string',
      group: 'sections',
    }),
    defineField({
      name: 'featuredTripsSubtitle',
      title: 'Uitgelichte Reizen Ondertitel',
      type: 'string',
      group: 'sections',
    }),
    defineField({
      name: 'destinationsEyebrow',
      title: 'Bestemmingen Eyebrow',
      type: 'string',
      group: 'sections',
    }),
    defineField({
      name: 'destinationsTitle',
      title: 'Bestemmingen Titel',
      type: 'string',
      group: 'sections',
    }),
    defineField({
      name: 'destinationsSubtitle',
      title: 'Bestemmingen Ondertitel',
      type: 'string',
      group: 'sections',
    }),
    defineField({
      name: 'ctaEyebrow',
      title: 'CTA Eyebrow',
      type: 'string',
      group: 'sections',
    }),
    defineField({
      name: 'ctaTitle',
      title: 'CTA Titel',
      type: 'string',
      group: 'sections',
    }),
    defineField({
      name: 'ctaSubtitle',
      title: 'CTA Ondertitel',
      type: 'text',
      rows: 2,
      group: 'sections',
    }),

    // ─── SECTION CTA BUTTONS ──────────────────────────────────────
    defineField({
      name: 'featuredTripsCtaLabel',
      title: 'Alle Reizen Knoptekst',
      type: 'string',
      group: 'sections',
      description: 'Bijv. "Alle reizen".',
    }),
    defineField({
      name: 'destinationsCtaLabel',
      title: 'Alle Bestemmingen Knoptekst',
      type: 'string',
      group: 'sections',
      description: 'Bijv. "Alle bestemmingen".',
    }),
    defineField({
      name: 'ctaButton1Label',
      title: 'CTA Knop 1 Tekst',
      type: 'string',
      group: 'sections',
      description: 'Bijv. "Eigen Reisschema".',
    }),
    defineField({
      name: 'ctaButton1Link',
      title: 'CTA Knop 1 Link',
      type: 'string',
      group: 'sections',
    }),
    defineField({
      name: 'ctaButton2Label',
      title: 'CTA Knop 2 Tekst',
      type: 'string',
      group: 'sections',
      description: 'Bijv. "Bekijk alle reizen".',
    }),
    defineField({
      name: 'ctaButton2Link',
      title: 'CTA Knop 2 Link',
      type: 'string',
      group: 'sections',
    }),

    // ─── TESTIMONIALS ──────────────────────────────────────────────
    defineField({
      name: 'testimonialsEyebrow',
      title: 'Beoordelingen Eyebrow',
      type: 'string',
      group: 'testimonials',
      description: 'Bijv. "Reizigersverhalen".',
    }),
    defineField({
      name: 'testimonialsTitle',
      title: 'Beoordelingen Titel',
      type: 'string',
      group: 'testimonials',
      description: 'Bijv. "Wat onze reizigers zeggen".',
    }),
    defineField({
      name: 'testimonialsSubtitle',
      title: 'Beoordelingen Ondertitel',
      type: 'string',
      group: 'testimonials',
    }),
    defineField({
      name: 'testimonialsVerifiedLabel',
      title: 'Geverifieerd Label',
      type: 'string',
      group: 'testimonials',
      description: 'Bijv. "Geverifieerd".',
    }),
    defineField({
      name: 'testimonialsMoreLabel',
      title: 'Meer Verhalen Knoptekst',
      type: 'string',
      group: 'testimonials',
      description: 'Bijv. "Meer verhalen".',
    }),
    defineField({
      name: 'testimonialsBeginLabel',
      title: 'Begin Knoptekst',
      type: 'string',
      group: 'testimonials',
      description: 'Bijv. "Begin" (na laatste pagina).',
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
    prepare: () => ({ title: 'Homepage' }),
  },
})
