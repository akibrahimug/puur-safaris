import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'faqPage',
  title: 'FAQ Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'content', title: 'Content' },
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
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
      ],
      description: 'Backgroundafbeelding voor de hero sectie.',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      group: 'hero',
      description: 'E.g. "Veelgestelde Vragen".',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      group: 'hero',
    }),

    // ─── CONTENT ───────────────────────────────────────────────────
    defineField({
      name: 'searchPlaceholder',
      title: 'Zoek Placeholder',
      type: 'string',
      group: 'content',
      description: 'E.g. "Zoek een vraag...".',
    }),
    defineField({
      name: 'categoriesHeading',
      title: 'Categorys Heading',
      type: 'string',
      group: 'content',
      description: 'E.g. "Categorieën".',
    }),
    defineField({
      name: 'viewAllLabel',
      title: 'Alls Viewen Label',
      type: 'string',
      group: 'content',
      description: 'E.g. "Alles Bekijken".',
    }),
    defineField({
      name: 'noResultsText',
      title: 'Geen Resultaten Text',
      type: 'string',
      group: 'content',
      description: 'E.g. "Geen resultaten gevonden voor".',
    }),
    defineField({
      name: 'resetSearchLabel',
      title: 'Reset Zoekopdracht Label',
      type: 'string',
      group: 'content',
      description: 'E.g. "Reset zoekopdracht".',
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
    prepare: () => ({ title: 'FAQ Page' }),
  },
})
