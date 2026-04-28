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
      description: 'Background image for the hero section.',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      group: 'hero',
      description: 'E.g. "Frequently Asked Questions".',
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
      title: 'Search Placeholder',
      type: 'string',
      group: 'content',
      description: 'E.g. "Search a question...".',
    }),
    defineField({
      name: 'categoriesHeading',
      title: 'Categories Heading',
      type: 'string',
      group: 'content',
      description: 'E.g. "Categories".',
    }),
    defineField({
      name: 'viewAllLabel',
      title: 'View All Label',
      type: 'string',
      group: 'content',
      description: 'E.g. "View All".',
    }),
    defineField({
      name: 'noResultsText',
      title: 'No Results Text',
      type: 'string',
      group: 'content',
      description: 'E.g. "No results found for".',
    }),
    defineField({
      name: 'resetSearchLabel',
      title: 'Reset Search Label',
      type: 'string',
      group: 'content',
      description: 'E.g. "Reset search".',
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
