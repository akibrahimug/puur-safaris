import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'blogSubmissionPage',
  title: 'Blog Submission Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'instructions', title: 'Instructions' },
    { name: 'form', title: 'Form' },
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
      description: 'E.g. "Write Your Safari Journal".',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
      group: 'hero',
    }),

    // ─── INSTRUCTIONS ──────────────────────────────────────────────
    defineField({
      name: 'instructionsHeading',
      title: 'Instructions Heading',
      type: 'string',
      group: 'instructions',
      description: 'E.g. "How does publishing work?".',
    }),
    defineField({
      name: 'step1Text',
      title: 'Step 1 Text',
      type: 'text',
      rows: 2,
      group: 'instructions',
    }),
    defineField({
      name: 'step2Text',
      title: 'Step 2 Text',
      type: 'text',
      rows: 2,
      group: 'instructions',
    }),
    defineField({
      name: 'step3Text',
      title: 'Step 3 Text',
      type: 'text',
      rows: 3,
      group: 'instructions',
    }),

    // ─── FORM ──────────────────────────────────────────────────────
    defineField({
      name: 'successHeading',
      title: 'Success Heading',
      type: 'string',
      group: 'form',
      description: 'E.g. "Thanks for sharing!".',
    }),
    defineField({
      name: 'successBody',
      title: 'Success Text',
      type: 'text',
      rows: 3,
      group: 'form',
    }),
    defineField({
      name: 'successResetLabel',
      title: 'Success Reset Button Text',
      type: 'string',
      group: 'form',
      description: 'E.g. "Submit another story".',
    }),
    defineField({
      name: 'submitLabel',
      title: 'Send Button Text',
      type: 'string',
      group: 'form',
      description: 'E.g. "Send Your Story".',
    }),
    defineField({
      name: 'submitLoadingLabel',
      title: 'Send Loading Text',
      type: 'string',
      group: 'form',
      description: 'E.g. "Uploading...".',
    }),
    defineField({
      name: 'verificationLabel',
      title: 'Verification Label',
      type: 'string',
      group: 'form',
      description: 'E.g. "Confirm your booking to continue".',
    }),
    defineField({
      name: 'writtenByPrefix',
      title: '"Written by" Prefix',
      type: 'string',
      group: 'form',
      description: 'E.g. "Written by".',
    }),
    defineField({
      name: 'gallerySidebarHeading',
      title: 'Gallery Sidebar Heading',
      type: 'string',
      group: 'form',
      description: 'E.g. "Favourite Moments".',
    }),
    defineField({
      name: 'gallerySidebarDescription',
      title: 'Gallery Sidebar Description',
      type: 'string',
      group: 'form',
    }),
    defineField({
      name: 'galleryAddLabel',
      title: 'Gallery Add Label',
      type: 'string',
      group: 'form',
      description: 'E.g. "Add".',
    }),
    defineField({
      name: 'galleryOverflowLabel',
      title: 'Gallery Overflow Label',
      type: 'string',
      group: 'form',
      description: 'E.g. "more photos uploaded" (preceded by the count).',
    }),
    defineField({
      name: 'legalConsent1',
      title: 'Legal Consent 1',
      type: 'text',
      rows: 2,
      group: 'form',
    }),
    defineField({
      name: 'legalConsent2',
      title: 'Legal Consent 2',
      type: 'text',
      rows: 2,
      group: 'form',
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
    prepare: () => ({ title: 'Blog Submission Page' }),
  },
})
