import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'blogPost',
  title: 'Blog Berichten',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Auteur',
      type: 'string',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publicatiedatum',
      type: 'date',
      options: { dateFormat: 'DD-MM-YYYY' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Categorie',
      type: 'string',
      options: {
        list: [
          { value: 'stories', title: 'Reisverhalen' },
          { value: 'tips', title: 'Tips & Advies' },
          { value: 'wildlife', title: 'Wildlife' },
          { value: 'culture', title: 'Cultuur' },
          { value: 'guides', title: 'Bestemmingsgidsen' },
          { value: 'news', title: 'Nieuws' },
        ],
      },
    }),
    defineField({
      name: 'featuredImage',
      title: 'Uitgelichte Afbeelding',
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
      name: 'summary',
      title: 'Samenvatting (teaser)',
      type: 'text',
      rows: 3,
      description: 'Korte intro die getoond wordt op de bloglijst. Max. 300 tekens.',
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'content',
      title: 'Inhoud',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normaal', value: 'normal' },
            { title: 'Kop 2', value: 'h2' },
            { title: 'Kop 3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Vet', value: 'strong' },
              { title: 'Cursief', value: 'em' },
              { title: 'Onderstrepen', value: 'underline' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) =>
                      Rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto'] }),
                  },
                  {
                    name: 'openInNewTab',
                    title: 'Openen in nieuw tabblad',
                    type: 'boolean',
                    initialValue: false,
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alt tekst' },
            { name: 'caption', type: 'string', title: 'Bijschrift' },
          ],
        },
      ],
    }),
    defineField({
      name: 'relatedTrips',
      title: 'Gerelateerde Reizen',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'trip' }] }],
      description: 'Optioneel: koppel relevante safari reizen aan dit artikel.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO Instellingen',
      type: 'seoFields',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedAt',
      media: 'featuredImage',
    },
  },
  orderings: [
    {
      title: 'Publicatiedatum (nieuwste eerst)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
})
