import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'faqPage',
  title: 'FAQ Pagina',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'content', title: 'Inhoud' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ─── HERO ──────────────────────────────────────────────────────
    defineField({
      name: 'heroTitle',
      title: 'Hero Titel',
      type: 'string',
      group: 'hero',
      description: 'Bijv. "Veelgestelde Vragen".',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Ondertitel',
      type: 'string',
      group: 'hero',
    }),

    // ─── CONTENT ───────────────────────────────────────────────────
    defineField({
      name: 'searchPlaceholder',
      title: 'Zoek Placeholder',
      type: 'string',
      group: 'content',
      description: 'Bijv. "Zoek een vraag...".',
    }),
    defineField({
      name: 'categoriesHeading',
      title: 'Categorieën Koptekst',
      type: 'string',
      group: 'content',
      description: 'Bijv. "Categorieën".',
    }),
    defineField({
      name: 'viewAllLabel',
      title: 'Alles Bekijken Label',
      type: 'string',
      group: 'content',
      description: 'Bijv. "Alles Bekijken".',
    }),
    defineField({
      name: 'noResultsText',
      title: 'Geen Resultaten Tekst',
      type: 'string',
      group: 'content',
      description: 'Bijv. "Geen resultaten gevonden voor".',
    }),
    defineField({
      name: 'resetSearchLabel',
      title: 'Reset Zoekopdracht Label',
      type: 'string',
      group: 'content',
      description: 'Bijv. "Reset zoekopdracht".',
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
    prepare: () => ({ title: 'FAQ Pagina' }),
  },
})
