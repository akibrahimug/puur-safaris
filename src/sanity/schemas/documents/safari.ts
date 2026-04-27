import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'trip',
  title: 'Safari Trips',
  type: 'document',
  groups: [
    { name: 'basics', title: 'Basis Informatie', default: true },
    { name: 'details', title: 'Details & Prijzen' },
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
      title: 'Korte Omschrijving',
      type: 'text',
      rows: 3,
      group: 'basics',
      description: 'Max. 200 tekens. Wordt gebruikt op kaarten en voor SEO.',
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
      title: 'Featured op homepage?',
      type: 'boolean',
      group: 'basics',
      initialValue: false,
      description: 'Vink aan om deze reis op de homepage te tonen.',
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
      description: 'E.g. "8 dagen / 7 nachten"',
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
          { value: 'per_person', title: 'Per Persoon' },
          { value: 'per_group', title: 'Per Groep' },
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
          { value: 'easy', title: 'Makkelijk' },
          { value: 'moderate', title: 'Moderate' },
          { value: 'challenging', title: 'Challenging' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'minPersons',
      title: 'Minimum Personen',
      type: 'number',
      group: 'details',
      initialValue: 1,
    }),
    defineField({
      name: 'maxPersons',
      title: 'Maximum Personen',
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
          { value: 'hiking', title: 'Berg & Trekking' },
          { value: 'culture', title: 'Cultuur & Gemeenschap' },
          { value: 'beach', title: 'Strand & Ontspanning' },
          { value: 'combined', title: 'Combined Trips' },
        ],
      },
    }),

    // ─── CONTENT ─────────────────────────────────────────────────────
    defineField({
      name: 'fullDescription',
      title: 'Volledige Description',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normaal', value: 'normal' },
            { title: 'Kop 2', value: 'h2' },
            { title: 'Kop 3', value: 'h3' },
          ],
          marks: {
            decorators: [
              { title: 'Vet', value: 'strong' },
              { title: 'Cursief', value: 'em' },
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
      description: 'De belangrijkste highlights van deze reis.',
    }),
    defineField({
      name: 'included',
      title: 'Included in de prijs',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'excluded',
      title: 'Niet inbegrepen in de prijs',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'itinerary',
      title: 'Dag-tot-dag Itinerary',
      type: 'array',
      group: 'content',
      of: [{ type: 'itineraryDay' }],
    }),

    // ─── MEDIA ───────────────────────────────────────────────────────
    defineField({
      name: 'gallery',
      title: 'Photogalerij',
      type: 'array',
      group: 'media',
      of: [{ type: 'galleryImage' }],
    }),

    // ─── SEO ─────────────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO Instellingen',
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
      title: 'Featured eerst',
      name: 'featuredDesc',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'title', direction: 'asc' },
      ],
    },
  ],
})
