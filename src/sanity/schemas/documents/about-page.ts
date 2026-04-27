import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'About Us Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'content', title: 'Content' },
    { name: 'team', title: 'Team' },
    { name: 'uniquePoints', title: 'Unique Points' },
    { name: 'community', title: 'Gemeenschap' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ─── HERO ──────────────────────────────────────────────────────
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      group: 'hero',
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      group: 'hero',
    }),

    // ─── CONTENT ───────────────────────────────────────────────────
    defineField({
      name: 'backgroundTitle',
      title: 'Background Title',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'backgroundText',
      title: 'Background Text',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'content',
    }),
    defineField({
      name: 'missionTitle',
      title: 'Mission Title',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'missionText',
      title: 'Mission Text',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'content',
    }),

    // ─── TEAM ──────────────────────────────────────────────────────
    defineField({
      name: 'teamTitle',
      title: 'Team Title',
      type: 'string',
      group: 'team',
    }),
    defineField({
      name: 'teamMembers',
      title: 'Team Members',
      type: 'array',
      group: 'team',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'role', title: 'Rol', type: 'string' }),
            defineField({
              name: 'image',
              title: 'Photo',
              type: 'image',
              options: { hotspot: true },
              fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
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
      title: 'Unique Points Title',
      type: 'string',
      group: 'uniquePoints',
    }),
    defineField({
      name: 'uniquePoints',
      title: 'Unique Points',
      type: 'array',
      group: 'uniquePoints',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'text', title: 'Text', type: 'text', rows: 2 }),
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
      title: 'Gemeenschap Title',
      type: 'string',
      group: 'community',
    }),
    defineField({
      name: 'communityText',
      title: 'Gemeenschap Text',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'community',
    }),
    defineField({
      name: 'communityCtaText',
      title: 'CTA Button Text',
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
    prepare: () => ({ title: 'About Us Page' }),
  },
})
