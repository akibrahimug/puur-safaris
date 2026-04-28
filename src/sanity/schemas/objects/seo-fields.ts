import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'seoFields',
  title: 'SEO Velden',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'SEO Titel (overschrijft paginatitel)',
      type: 'string',
      description: 'Maximaal 70 tekens aanbevolen.',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'description',
      title: 'Meta Omschrijving',
      type: 'text',
      rows: 2,
      description: 'Maximaal 160 tekens aanbevolen.',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Media Afbeelding (Open Graph)',
      type: 'image',
      description: 'Afbeelding voor social media. Aanbevolen: 1200x630 pixels.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'noIndex',
      title: 'Verberg van zoekmachines (no-index)',
      type: 'boolean',
      description: 'Vink aan om deze pagina te verbergen van Google en andere zoekmachines.',
      initialValue: false,
    }),
  ],
})
