import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'Over Ons Pagina',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'content', title: 'Inhoud' },
    { name: 'team', title: 'Team' },
    { name: 'uniquePoints', title: 'Unieke Punten' },
    { name: 'community', title: 'Gemeenschap' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ─── HERO ──────────────────────────────────────────────────────
    defineField({
      name: 'heroTitle',
      title: 'Hero Titel',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Ondertitel',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Afbeelding',
      type: 'image',
      options: { hotspot: true },
      group: 'hero',
      fields: [defineField({ name: 'alt', title: 'Alt tekst', type: 'string' })],
    }),

    // ─── CONTENT ───────────────────────────────────────────────────
    defineField({
      name: 'backgroundTitle',
      title: 'Achtergrond Titel',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'backgroundText',
      title: 'Achtergrond Tekst',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'content',
    }),
    defineField({
      name: 'missionTitle',
      title: 'Missie Titel',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'missionText',
      title: 'Missie Tekst',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'content',
    }),

    // ─── TEAM ──────────────────────────────────────────────────────
    defineField({
      name: 'teamTitle',
      title: 'Team Titel',
      type: 'string',
      group: 'team',
    }),
    defineField({
      name: 'teamMembers',
      title: 'Teamleden',
      type: 'array',
      group: 'team',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Naam', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'role', title: 'Rol', type: 'string' }),
            defineField({
              name: 'image',
              title: 'Foto',
              type: 'image',
              options: { hotspot: true },
              fields: [defineField({ name: 'alt', title: 'Alt tekst', type: 'string' })],
            }),
            defineField({ name: 'bio', title: 'Biografie', type: 'text', rows: 3 }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'role', media: 'image' },
          },
        },
      ],
    }),

    // ─── UNIQUE POINTS ─────────────────────────────────────────────
    defineField({
      name: 'uniquePointsTitle',
      title: 'Unieke Punten Titel',
      type: 'string',
      group: 'uniquePoints',
    }),
    defineField({
      name: 'uniquePoints',
      title: 'Unieke Punten',
      type: 'array',
      group: 'uniquePoints',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Titel', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'text', title: 'Tekst', type: 'text', rows: 2 }),
            defineField({
              name: 'iconName',
              title: 'Icoon',
              type: 'string',
              options: {
                list: [
                  { title: 'Heart', value: 'Heart' },
                  { title: 'Shield', value: 'Shield' },
                  { title: 'Users', value: 'Users' },
                  { title: 'Star', value: 'Star' },
                  { title: 'Globe', value: 'Globe' },
                  { title: 'Headphones', value: 'Headphones' },
                  { title: 'Map', value: 'Map' },
                  { title: 'Compass', value: 'Compass' },
                  { title: 'Sun', value: 'Sun' },
                  { title: 'Camera', value: 'Camera' },
                ],
              },
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'iconName' },
          },
        },
      ],
    }),

    // ─── COMMUNITY ─────────────────────────────────────────────────
    defineField({
      name: 'communityTitle',
      title: 'Gemeenschap Titel',
      type: 'string',
      group: 'community',
    }),
    defineField({
      name: 'communityText',
      title: 'Gemeenschap Tekst',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'community',
    }),
    defineField({
      name: 'communityCtaText',
      title: 'CTA Knoptekst',
      type: 'string',
      group: 'community',
    }),
    defineField({
      name: 'communityCtaLink',
      title: 'CTA Link',
      type: 'string',
      group: 'community',
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
    prepare: () => ({ title: 'Over Ons Pagina' }),
  },
})
