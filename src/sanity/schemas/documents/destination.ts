import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'destination',
  title: 'Bestemmingen',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Naam',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Land',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'continent',
      title: 'Continent',
      type: 'string',
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
      title: 'Korte Omschrijving',
      type: 'text',
      rows: 3,
      description: 'Max. 200 tekens. Wordt gebruikt op kaarten.',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'description',
      title: 'Volledige Beschrijving',
      type: 'array',
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
      name: 'heroImage',
      title: 'Hero Afbeelding',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt tekst',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'climate',
      title: 'Klimaat',
      type: 'text',
      rows: 2,
      description: 'Korte beschrijving van het klimaat en weerpatronen.',
    }),
    defineField({
      name: 'bestTimeToVisit',
      title: 'Beste Tijd om te Bezoeken',
      type: 'string',
      description: 'Bijv. "Juni t/m oktober (droge seizoen)"',
    }),
    defineField({
      name: 'displayOrder',
      title: 'Weergavevolgorde',
      type: 'number',
      description: 'Lagere nummers worden eerder getoond.',
      initialValue: 99,
    }),
    defineField({
      name: 'seo',
      title: 'SEO Instellingen',
      type: 'seoFields',
    }),
  ],
  orderings: [
    {
      title: 'Weergavevolgorde',
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
