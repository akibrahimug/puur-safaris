import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'legalPage',
  title: 'Legal Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Inhoud' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ─── CONTENT ───────────────────────────────────────────────────
    defineField({
      name: 'heroImage',
      title: 'Hero Afbeelding',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt tekst', type: 'string' })],
    }),
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      group: 'content',
      description: 'Bijv. "Privacybeleid" of "Algemene Voorwaarden".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Inhoud',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Underline', value: 'underline' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({ name: 'href', type: 'url', title: 'URL' }),
                  defineField({ name: 'openInNewTab', type: 'boolean', title: 'Open in nieuw tabblad' }),
                ],
              },
            ],
          },
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt tekst' }),
            defineField({ name: 'caption', type: 'string', title: 'Bijschrift' }),
          ],
        },
      ],
    }),

    // ─── SEO ───────────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
      group: 'seo',
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({ title: title ?? 'Legal Page' }),
  },
})
