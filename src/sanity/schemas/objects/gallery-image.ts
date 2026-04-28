import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'galleryImage',
  title: 'Galerij Afbeelding',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Afbeelding',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt tekst',
      type: 'string',
      description: 'Beschrijving voor zoekmachines en bezoekers met visuele beperkingen.',
    }),
    defineField({
      name: 'caption',
      title: 'Bijschrift',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'alt', media: 'image' },
    prepare({ title, media }) {
      return { title: title || 'Afbeelding', media }
    },
  },
})
