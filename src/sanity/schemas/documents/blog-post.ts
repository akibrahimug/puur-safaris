import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'blogPost',
  title: 'Blog Messageen',
  type: 'document',
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { value: 'submitted', title: 'Ingediend' },
          { value: 'pending_review', title: 'Pending Review' },
          { value: 'published', title: 'Published' },
          { value: 'rejected', title: 'Rejected' },
        ],
      },
      initialValue: 'published',
    }),
    defineField({
      name: 'submitterEmail',
      title: 'Email inzender',
      type: 'string',
      description: 'Emailadres van de persoon die het reisverslag heeft ingediend.',
      readOnly: true,
    }),
    defineField({
      name: 'submitterBooking',
      title: 'Gekoppelde boeking',
      type: 'reference',
      to: [{ type: 'booking' }],
      description: 'De boeking waarmee dit reisverslag is geverifieerd.',
      readOnly: true,
    }),
    defineField({
      name: 'title',
      title: 'Title',
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
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
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
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publication Date',
      type: 'date',
      options: { dateFormat: 'DD-MM-YYYY' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { value: 'stories', title: 'Tripverhalen' },
          { value: 'tips', title: 'Tips & Advies' },
          { value: 'wildlife', title: 'Wildlife' },
          { value: 'culture', title: 'Cultuur' },
          { value: 'guides', title: 'Destinationsgidsen' },
          { value: 'news', title: 'Nieuws' },
        ],
      },
    }),
    defineField({
      name: 'summary',
      title: 'Summary (teaser)',
      type: 'text',
      rows: 3,
      description: 'Korte intro die getoond wordt op de bloglijst. Max. 300 tekens.',
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'content',
      title: 'Content',
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
            { name: 'alt', type: 'string', title: 'Alt text' },
            { name: 'caption', type: 'string', title: 'Caption' },
          ],
        },
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            {
              name: 'placement',
              title: 'Placeing',
              type: 'string',
              options: {
                list: [
                  { value: 'hero', title: 'Hero (bovenaan bij afbeelding)' },
                  { value: 'sidebar', title: 'Zijbalk / onder meta' },
                  { value: 'bottom', title: 'Onderaan artikel' },
                ],
                layout: 'radio',
              },
              initialValue: 'hero',
            },
            {
              name: 'color',
              title: 'Kleur',
              type: 'string',
              options: {
                list: [
                  { value: 'gold', title: 'Goud' },
                  { value: 'green', title: 'Groen' },
                  { value: 'blue', title: 'Blauw' },
                  { value: 'red', title: 'Rood' },
                  { value: 'neutral', title: 'Neutraal' },
                ],
              },
              initialValue: 'gold',
            },
          ],
          preview: {
            select: { title: 'label', subtitle: 'placement' },
            prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
              const placements: Record<string, string> = {
                hero: 'Hero',
                sidebar: 'Zijbalk',
                bottom: 'Onderaan',
              }
              return {
                title: title ?? 'Tag',
                subtitle: subtitle ? placements[subtitle] ?? subtitle : '',
              }
            },
          },
        },
      ],
      description: 'Voeg tags toe en kies waar ze op de pagina verschijnen.',
    }),
    defineField({
      name: 'relatedTrips',
      title: 'Related Trips',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'trip' }] }],
      description: 'Optional: koppel relevante safari reizen aan dit artikel.',
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
      publishedAt: 'publishedAt',
      status: 'status',
      media: 'featuredImage',
    },
    prepare({ title, publishedAt, status, media }) {
      const statusLabels: Record<string, string> = {
        submitted: 'Ingediend',
        pending_review: 'Wacht op beoordeling',
        published: 'Gepubliceerd',
        rejected: 'Afgewezen',
      }
      const statusText = status ? ` [${statusLabels[status] ?? status}]` : ''
      return {
        title,
        subtitle: `${publishedAt ?? ''}${statusText}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Publication Date (newest first)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
})
