import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'eigenReisschemaPage',
  title: 'Eigen Reisschema Pagina',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'heroEyebrow',
      title: 'Hero Eyebrow',
      type: 'string',
      group: 'hero',
      description: 'Bijv. "Op maat gemaakt".',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Titel',
      type: 'string',
      group: 'hero',
      description: 'Bijv. "Eigen Reisschema".',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Afbeelding',
      type: 'image',
      options: { hotspot: true },
      group: 'hero',
      fields: [
        defineField({ name: 'alt', title: 'Alt tekst', type: 'string' }),
      ],
      description: 'Achtergrondafbeelding voor de hero sectie.',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Ondertitel',
      type: 'text',
      rows: 2,
      group: 'hero',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
      group: 'seo',
    }),
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Eigen Reisschema Pagina' }),
  },
})
