import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'destination',
  title: 'Destinations',
  type: 'document',
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'gallery', title: 'Gallery' },
    { name: 'community', title: 'Gemeenschap' },
    { name: 'wildlife', title: 'Wildlife' },
    { name: 'accommodations', title: 'Accommodations' },
    { name: 'location', title: 'Location' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ─── GENERAL ──────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'general',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'general',
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
      name: 'country',
      title: 'Country',
      type: 'string',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'continent',
      title: 'Continent',
      type: 'string',
      group: 'general',
      options: {
        list: [
          { value: 'Africa', title: 'Afrika' },
          { value: 'Asia', title: 'Azië' },
          { value: 'Americas', title: 'Amerika' },
          { value: 'Europe', title: 'Europa' },
        ],
        layout: 'radio',
      },
      initialValue: 'Africa',
    }),
    defineField({
      name: 'excerpt',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      group: 'general',
      description: 'Max. 200 characters. Used on cards.',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'array',
      group: 'general',
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
      name: 'climate',
      title: 'Climate',
      type: 'text',
      rows: 2,
      group: 'general',
      description: 'Short description of the climate and weather patterns.',
    }),
    defineField({
      name: 'bestTimeToVisit',
      title: 'Best Time to Visit',
      type: 'string',
      group: 'general',
      description: 'E.g. "June through October (dry season)"',
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      group: 'general',
      description: 'Lower numbers are shown earlier.',
      initialValue: 99,
    }),

    // ─── GALLERY ──────────────────────────────────────────────
    defineField({
      name: 'gallery',
      title: 'Photo Gallery',
      type: 'array',
      group: 'gallery',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
            defineField({ name: 'caption', title: 'Caption', type: 'string' }),
          ],
        },
      ],
      description: 'Images for the photo gallery on the destination page.',
    }),

    // ─── WILDLIFE ─────────────────────────────────────────────
    defineField({
      name: 'wildlifeHeading',
      title: 'Wildlife Heading',
      type: 'string',
      group: 'wildlife',
      description: 'E.g. "Wildlife & Nature"',
    }),
    defineField({
      name: 'wildlifeDescription',
      title: 'Wildlife Description',
      type: 'text',
      rows: 4,
      group: 'wildlife',
    }),
    defineField({
      name: 'wildlifeHighlights',
      title: 'Diersoorten Highlights',
      type: 'array',
      group: 'wildlife',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'string' }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
              ],
            }),
          ],
          preview: {
            select: { title: 'name', media: 'image' },
          },
        },
      ],
    }),

    // ─── COMMUNITY ────────────────────────────────────────────
    defineField({
      name: 'communityHeading',
      title: 'Gemeenschap Heading',
      type: 'string',
      group: 'community',
      description: 'E.g. "Local Community & Culture"',
    }),
    defineField({
      name: 'communityDescription',
      title: 'Gemeenschap Description',
      type: 'array',
      group: 'community',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normaal', value: 'normal' },
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
      name: 'communityImage',
      title: 'Gemeenschap Image',
      type: 'image',
      group: 'community',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
      ],
    }),

    // ─── ACCOMMODATIONS ───────────────────────────────────────
    defineField({
      name: 'accommodationsHeading',
      title: 'Accommodations Heading',
      type: 'string',
      group: 'accommodations',
      description: 'E.g. "Verblijf & Accommodaties"',
    }),
    defineField({
      name: 'accommodations',
      title: 'Accommodations',
      type: 'array',
      group: 'accommodations',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'type', title: 'Type', type: 'string', options: {
              list: [
                { value: 'lodge', title: 'Lodge' },
                { value: 'camp', title: 'Camp' },
                { value: 'hotel', title: 'Hotel' },
                { value: 'guesthouse', title: 'Gasthuis' },
                { value: 'luxury', title: 'Luxe Lodge' },
              ],
            }}),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
              ],
            }),
            defineField({
              name: 'coordinates',
              title: 'Coordinates',
              type: 'geopoint',
              description: 'Location of the accommodation on the map.',
            }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'type', media: 'image' },
          },
        },
      ],
    }),

    // ─── LOCATION ─────────────────────────────────────────────
    defineField({
      name: 'coordinates',
      title: 'Coordinates',
      type: 'geopoint',
      group: 'location',
      description: 'Central location of the destination for the map.',
    }),
    defineField({
      name: 'mapZoom',
      title: 'Kaartzoom',
      type: 'number',
      group: 'location',
      description: 'Zoomniveau for the kaart (8-14). Default: 10.',
      initialValue: 10,
      validation: (Rule) => Rule.min(1).max(20),
    }),

    // ─── SEO ──────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO Instellingen',
      type: 'seoFields',
      group: 'seo',
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrder',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'country',
      media: 'heroImage',
    },
  },
})
