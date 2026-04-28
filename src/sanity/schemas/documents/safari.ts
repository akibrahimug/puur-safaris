import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'trip',
  title: 'Safari Trips',
  type: 'document',
  groups: [
    { name: 'basics', title: 'Basics', default: true },
    { name: 'details', title: 'Details & Pricing' },
    { name: 'content', title: 'Content' },
    { name: 'media', title: 'Media' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ─── BASICS ──────────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'basics',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'basics',
      options: { source: 'title', maxLength: 96 },
      description: 'Generated automatically from the title.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: ['basics', 'media'],
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      group: 'basics',
      description: 'Max. 200 characters. Used on cards and for SEO.',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'destination',
      title: 'Destination',
      type: 'reference',
      to: [{ type: 'destination' }],
      group: 'basics',
    }),
    defineField({
      name: 'featured',
      title: 'Featured on homepage?',
      type: 'boolean',
      group: 'basics',
      initialValue: false,
      description: 'Tick to show this trip on the homepage.',
    }),
    defineField({
      name: 'active',
      title: 'Published?',
      type: 'boolean',
      group: 'basics',
      initialValue: true,
    }),

    // ─── DETAILS ─────────────────────────────────────────────────────
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      group: 'details',
      description: 'E.g. "8 days / 7 nights"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'daysCount',
      title: 'Number of Days',
      type: 'number',
      group: 'details',
    }),
    defineField({
      name: 'price',
      title: 'Price From (EUR)',
      type: 'number',
      group: 'details',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'priceType',
      title: 'Price Type',
      type: 'string',
      group: 'details',
      options: {
        list: [
          { value: 'per_person', title: 'Per Person' },
          { value: 'per_group', title: 'Per Group' },
        ],
        layout: 'radio',
      },
      initialValue: 'per_person',
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty',
      type: 'string',
      group: 'details',
      options: {
        list: [
          { value: 'easy', title: 'Easy' },
          { value: 'moderate', title: 'Moderate' },
          { value: 'challenging', title: 'Challenging' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'minPersons',
      title: 'Minimum Persons',
      type: 'number',
      group: 'details',
      initialValue: 1,
    }),
    defineField({
      name: 'maxPersons',
      title: 'Maximum Persons',
      type: 'number',
      group: 'details',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'details',
      options: {
        list: [
          { value: 'wildlife', title: 'Wildlife Safari' },
          { value: 'hiking', title: 'Mountain & Trekking' },
          { value: 'culture', title: 'Culture & Community' },
          { value: 'beach', title: 'Beach & Relaxation' },
          { value: 'combined', title: 'Combined Trips' },
        ],
      },
    }),

    // ─── CONTENT ─────────────────────────────────────────────────────
    defineField({
      name: 'fullDescription',
      title: 'Full Description',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      description: 'The main highlights of this trip.',
    }),
    defineField({
      name: 'included',
      title: 'Included in the price',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'excluded',
      title: 'Not included in the price',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'itinerary',
      title: 'Day-by-day Itinerary',
      type: 'array',
      group: 'content',
      of: [{ type: 'itineraryDay' }],
    }),

    // ─── MEDIA ───────────────────────────────────────────────────────
    defineField({
      name: 'gallery',
      title: 'Photo Gallery',
      type: 'array',
      group: 'media',
      of: [{ type: 'galleryImage' }],
    }),

    // ─── SEO ─────────────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seoFields',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'duration',
      media: 'heroImage',
    },
  },
  orderings: [
    {
      title: 'Featured first',
      name: 'featuredDesc',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'title', direction: 'asc' },
      ],
    },
  ],
})
