import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'blogPage',
  title: 'Blog Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'stories', title: 'Stories Section' },
    { name: 'wildlife', title: 'Wildlife Section' },
    { name: 'guides', title: 'Guides Section' },
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
      description: 'Background image for the hero section of the blog page.',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      group: 'hero',
      description: 'E.g. "Safari Stories & Guides".',
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
      description: 'E.g. "Stories from the Bush".',
    }),
    defineField({
      name: 'featuredBadgeText',
      title: 'Featured Badge Text',
      type: 'string',
      group: 'stories',
      description: 'E.g. "Featured Story".',
    }),
    defineField({
      name: 'readArticleLabel',
      title: '"Read Article" Label',
      type: 'string',
      group: 'stories',
      description: 'Link text on the featured card.',
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
      description: 'E.g. "Wildlife Discoveries".',
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
      title: 'Guides Section Title',
      type: 'string',
      group: 'guides',
      description: 'E.g. "Pure & Practical".',
    }),
    defineField({
      name: 'guidesDescription',
      title: 'Guides Description',
      type: 'text',
      rows: 3,
      group: 'guides',
    }),
    defineField({
      name: 'guidesCtaLabel',
      title: 'Guides CTA Label',
      type: 'string',
      group: 'guides',
      description: 'E.g. "Ask Expert Advice".',
    }),
    defineField({
      name: 'guidesCtaLink',
      title: 'Guides CTA Link',
      type: 'string',
      group: 'guides',
    }),

    // ─── READER CTA ────────────────────────────────────────────────
    defineField({
      name: 'readerCtaBadge',
      title: 'Reader CTA Badge',
      type: 'string',
      group: 'readerCta',
      description: 'E.g. "For Our Travellers".',
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
      description: 'E.g. "Write Your Travel Journal".',
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
