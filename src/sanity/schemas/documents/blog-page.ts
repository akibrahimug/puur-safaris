import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'blogPage',
  title: 'Blog Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'stories', title: 'Stories Section' },
    { name: 'wildlife', title: 'Wildlife Section' },
    { name: 'guides', title: 'Gidsen Section' },
    { name: 'readerCta', title: 'Reader CTA' },
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
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
      description: 'Backgroundafbeelding voor de hero sectie van de blog pagina.',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      group: 'hero',
      description: 'E.g. "Safari Verhalen & Gidsen".',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
      group: 'hero',
    }),

    // ─── STORIES SECTION ───────────────────────────────────────────
    defineField({
      name: 'storiesSectionHeading',
      title: 'Stories Section Heading',
      type: 'string',
      group: 'stories',
      description: 'E.g. "Verhalen uit de Bush".',
    }),
    defineField({
      name: 'featuredBadgeText',
      title: 'Featured Badge Text',
      type: 'string',
      group: 'stories',
      description: 'E.g. "Uitgelicht Verhaal".',
    }),
    defineField({
      name: 'readArticleLabel',
      title: '"Lees Artikel" Label',
      type: 'string',
      group: 'stories',
      description: 'Link tekst op de uitgelichte kaart.',
    }),

    // ─── WILDLIFE SECTION ──────────────────────────────────────────
    defineField({
      name: 'wildlifeEyebrow',
      title: 'Wildlife Eyebrow',
      type: 'string',
      group: 'wildlife',
      description: 'E.g. "Flora & Fauna".',
    }),
    defineField({
      name: 'wildlifeTitle',
      title: 'Wildlife Title',
      type: 'string',
      group: 'wildlife',
      description: 'E.g. "Wildlife Ontdekkingen".',
    }),
    defineField({
      name: 'wildlifeSubtitle',
      title: 'Wildlife Subtitle',
      type: 'text',
      rows: 2,
      group: 'wildlife',
    }),

    // ─── GUIDES SECTION ────────────────────────────────────────────
    defineField({
      name: 'guidesSectionTitle',
      title: 'Gidsen Section Title',
      type: 'string',
      group: 'guides',
      description: 'E.g. "Puur Praktisch".',
    }),
    defineField({
      name: 'guidesDescription',
      title: 'Gidsen Description',
      type: 'text',
      rows: 3,
      group: 'guides',
    }),
    defineField({
      name: 'guidesCtaLabel',
      title: 'Gidsen CTA Label',
      type: 'string',
      group: 'guides',
      description: 'E.g. "Vraag Advies Aan Expert".',
    }),
    defineField({
      name: 'guidesCtaLink',
      title: 'Gidsen CTA Link',
      type: 'string',
      group: 'guides',
    }),

    // ─── READER CTA ────────────────────────────────────────────────
    defineField({
      name: 'readerCtaBadge',
      title: 'Reader CTA Badge',
      type: 'string',
      group: 'readerCta',
      description: 'E.g. "Voor Onze Reizigers".',
    }),
    defineField({
      name: 'readerCtaHeading',
      title: 'Reader CTA Heading',
      type: 'string',
      group: 'readerCta',
    }),
    defineField({
      name: 'readerCtaBody',
      title: 'Reader CTA Text',
      type: 'text',
      rows: 3,
      group: 'readerCta',
    }),
    defineField({
      name: 'readerCtaButton',
      title: 'Reader CTA Button Text',
      type: 'string',
      group: 'readerCta',
      description: 'E.g. "Schrijf Jouw Reisdagboek".',
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
    prepare: () => ({ title: 'Blog Page' }),
  },
})
