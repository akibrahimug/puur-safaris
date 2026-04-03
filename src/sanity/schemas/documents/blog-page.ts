import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'blogPage',
  title: 'Blog Pagina',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'stories', title: 'Verhalen Sectie' },
    { name: 'wildlife', title: 'Wildlife Sectie' },
    { name: 'guides', title: 'Gidsen Sectie' },
    { name: 'readerCta', title: 'Lezer CTA' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ─── HERO ──────────────────────────────────────────────────────
    defineField({
      name: 'heroTitle',
      title: 'Hero Titel',
      type: 'string',
      group: 'hero',
      description: 'Bijv. "Safari Verhalen & Gidsen".',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Ondertitel',
      type: 'text',
      rows: 2,
      group: 'hero',
    }),

    // ─── STORIES SECTION ───────────────────────────────────────────
    defineField({
      name: 'storiesSectionHeading',
      title: 'Verhalen Sectie Koptekst',
      type: 'string',
      group: 'stories',
      description: 'Bijv. "Verhalen uit de Bush".',
    }),
    defineField({
      name: 'featuredBadgeText',
      title: 'Uitgelicht Badge Tekst',
      type: 'string',
      group: 'stories',
      description: 'Bijv. "Uitgelicht Verhaal".',
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
      description: 'Bijv. "Flora & Fauna".',
    }),
    defineField({
      name: 'wildlifeTitle',
      title: 'Wildlife Titel',
      type: 'string',
      group: 'wildlife',
      description: 'Bijv. "Wildlife Ontdekkingen".',
    }),
    defineField({
      name: 'wildlifeSubtitle',
      title: 'Wildlife Ondertitel',
      type: 'text',
      rows: 2,
      group: 'wildlife',
    }),

    // ─── GUIDES SECTION ────────────────────────────────────────────
    defineField({
      name: 'guidesSectionTitle',
      title: 'Gidsen Sectie Titel',
      type: 'string',
      group: 'guides',
      description: 'Bijv. "Puur Praktisch".',
    }),
    defineField({
      name: 'guidesDescription',
      title: 'Gidsen Beschrijving',
      type: 'text',
      rows: 3,
      group: 'guides',
    }),
    defineField({
      name: 'guidesCtaLabel',
      title: 'Gidsen CTA Label',
      type: 'string',
      group: 'guides',
      description: 'Bijv. "Vraag Advies Aan Expert".',
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
      title: 'Lezer CTA Badge',
      type: 'string',
      group: 'readerCta',
      description: 'Bijv. "Voor Onze Reizigers".',
    }),
    defineField({
      name: 'readerCtaHeading',
      title: 'Lezer CTA Koptekst',
      type: 'string',
      group: 'readerCta',
    }),
    defineField({
      name: 'readerCtaBody',
      title: 'Lezer CTA Tekst',
      type: 'text',
      rows: 3,
      group: 'readerCta',
    }),
    defineField({
      name: 'readerCtaButton',
      title: 'Lezer CTA Knoptekst',
      type: 'string',
      group: 'readerCta',
      description: 'Bijv. "Schrijf Jouw Reisdagboek".',
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
    prepare: () => ({ title: 'Blog Pagina' }),
  },
})
