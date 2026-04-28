import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'trustStrip', title: 'Trust Strip' },
    { name: 'features', title: 'Waarom Puur Uganda Trips' },
    { name: 'sections', title: 'Sections & CTA' },
    { name: 'testimonials', title: 'Reviews' },
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
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Hero Title',
      type: 'string',
      group: 'hero',
      description: 'Main Title, e.g. "Discover Africa".',
    }),
    defineField({
      name: 'heroHeadlineAccent',
      title: 'Hero Title Accent',
      type: 'string',
      group: 'hero',
      description: 'Accented part of the title (in gold), e.g. "in its purest form".',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
      group: 'hero',
    }),
    defineField({
      name: 'heroCta1Text',
      title: 'CTA 1 Text',
      type: 'string',
      group: 'hero',
      description: 'Primary button text, e.g. "View our trips".',
    }),
    defineField({
      name: 'heroCta1Link',
      title: 'CTA 1 Link',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroCta2Text',
      title: 'CTA 2 Text',
      type: 'string',
      group: 'hero',
      description: 'Secondary button text, e.g. "Custom Itinerary".',
    }),
    defineField({
      name: 'heroCta2Link',
      title: 'CTA 2 Link',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroSocialProofAvatars',
      title: 'Social Proof Avatars',
      type: 'array',
      group: 'hero',
      description: 'Profile photos of travellers (max. 4). Shown as small round photos next to the social proof text.',
      validation: (Rule) => Rule.max(4),
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
        },
      ],
    }),
    defineField({
      name: 'heroSocialProofText',
      title: 'Social Proof Text',
      type: 'string',
      group: 'hero',
      description: 'E.g. "500+ happy travellers".',
    }),

    // ─── TRUST STRIP ───────────────────────────────────────────────
    defineField({
      name: 'trustItems',
      title: 'Trust Items',
      type: 'array',
      group: 'trustStrip',
      description: 'Maximum 4 statistics for the trust strip.',
      validation: (Rule) => Rule.max(4),
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'phrase', title: 'Description', type: 'string', validation: (Rule) => Rule.required() }),
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
      description: 'E.g. "Why Pure Uganda Safaris".',
    }),
    defineField({
      name: 'featuresTitle',
      title: 'Features Title',
      type: 'string',
      group: 'features',
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      group: 'features',
      description: 'Maximum 6 USP cards.',
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
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
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
      title: 'Featured Trips Eyebrow',
      type: 'string',
      group: 'sections',
    }),
    defineField({
      name: 'featuredTripsTitle',
      title: 'Featured Trips Title',
      type: 'string',
      group: 'sections',
    }),
    defineField({
      name: 'featuredTripsSubtitle',
      title: 'Featured Trips Subtitle',
      type: 'string',
      group: 'sections',
    }),
    defineField({
      name: 'destinationsEyebrow',
      title: 'Destinations Eyebrow',
      type: 'string',
      group: 'sections',
    }),
    defineField({
      name: 'destinationsTitle',
      title: 'Destinations Title',
      type: 'string',
      group: 'sections',
    }),
    defineField({
      name: 'destinationsSubtitle',
      title: 'Destinations Subtitle',
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
      title: 'CTA Title',
      type: 'string',
      group: 'sections',
    }),
    defineField({
      name: 'ctaSubtitle',
      title: 'CTA Subtitle',
      type: 'text',
      rows: 2,
      group: 'sections',
    }),

    // ─── SECTION CTA BUTTONS ──────────────────────────────────────
    defineField({
      name: 'featuredTripsCtaLabel',
      title: 'All Trips Button Text',
      type: 'string',
      group: 'sections',
      description: 'E.g. "All trips".',
    }),
    defineField({
      name: 'destinationsCtaLabel',
      title: 'All Destinations Button Text',
      type: 'string',
      group: 'sections',
      description: 'E.g. "All destinations".',
    }),
    defineField({
      name: 'ctaButton1Label',
      title: 'CTA Button 1 Text',
      type: 'string',
      group: 'sections',
      description: 'E.g. "Custom Itinerary".',
    }),
    defineField({
      name: 'ctaButton1Link',
      title: 'CTA Button 1 Link',
      type: 'string',
      group: 'sections',
    }),
    defineField({
      name: 'ctaButton2Label',
      title: 'CTA Button 2 Text',
      type: 'string',
      group: 'sections',
      description: 'E.g. "View all trips".',
    }),
    defineField({
      name: 'ctaButton2Link',
      title: 'CTA Button 2 Link',
      type: 'string',
      group: 'sections',
    }),

    // ─── TESTIMONIALS ──────────────────────────────────────────────
    defineField({
      name: 'testimonialsEyebrow',
      title: 'Reviews Eyebrow',
      type: 'string',
      group: 'testimonials',
      description: 'E.g. "Traveller Stories".',
    }),
    defineField({
      name: 'testimonialsTitle',
      title: 'Reviews Title',
      type: 'string',
      group: 'testimonials',
      description: 'E.g. "What our travellers say".',
    }),
    defineField({
      name: 'testimonialsSubtitle',
      title: 'Reviews Subtitle',
      type: 'string',
      group: 'testimonials',
    }),
    defineField({
      name: 'testimonialsVerifiedLabel',
      title: 'Verified Label',
      type: 'string',
      group: 'testimonials',
      description: 'E.g. "Geverifieerd".',
    }),
    defineField({
      name: 'testimonialsMoreLabel',
      title: 'More Stories Button Text',
      type: 'string',
      group: 'testimonials',
      description: 'E.g. "Meer verhalen".',
    }),
    defineField({
      name: 'testimonialsBeginLabel',
      title: 'Start Button Text',
      type: 'string',
      group: 'testimonials',
      description: 'E.g. "Begin" (after last page).',
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
