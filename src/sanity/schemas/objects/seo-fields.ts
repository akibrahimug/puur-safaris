import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'seoFields',
  title: 'SEO Fields',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'SEO Title (overrides page title)',
      type: 'string',
      description: 'Maximum 70 tekens aanbevolen.',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'description',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      description: 'Maximum 160 tekens aanbevolen.',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Media Image (Open Graph)',
      type: 'image',
      description: 'Image voor social media. Recommended: 1200x630 pixels.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines (no-index)',
      type: 'boolean',
      description: 'Vink aan om deze pagina te verbergen van Google en andere zoekmachines.',
      initialValue: false,
    }),
  ],
})
