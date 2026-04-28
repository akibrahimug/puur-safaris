import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'blogPost',
  title: 'Blog Posts',
  type: 'document',
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { value: 'submitted', title: 'Submitted' },
          { value: 'pending_review', title: 'Pending Review' },
          { value: 'published', title: 'Published' },
          { value: 'rejected', title: 'Rejected' },
        ],
      },
      initialValue: 'published',
    }),
    defineField({
      name: 'submitterEmail',
      title: 'Submitter Email',
      type: 'string',
      description: 'Email address of the person who submitted the trip story.',
      readOnly: true,
    }),
    defineField({
      name: 'submitterBooking',
      title: 'Linked Booking',
      type: 'reference',
      to: [{ type: 'booking' }],
      description: 'The booking that was used to verify this trip story.',
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
          { value: 'stories', title: 'Trip Stories' },
          { value: 'tips', title: 'Tips & Advice' },
          { value: 'wildlife', title: 'Wildlife' },
          { value: 'culture', title: 'Culture' },
          { value: 'guides', title: 'Destination Guides' },
          { value: 'news', title: 'News' },
        ],
      },
    }),
    defineField({
      name: 'summary',
      title: 'Summary (teaser)',
      type: 'text',
      rows: 3,
      description: 'Short intro shown on the blog list. Max. 300 characters.',
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
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
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
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) =>
                      Rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto'] }),
                  },
                  {
                    name: 'openInNewTab',
                    title: 'Open in new tab',
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
              title: 'Placement',
              type: 'string',
              options: {
                list: [
                  { value: 'hero', title: 'Hero (top, near image)' },
                  { value: 'sidebar', title: 'Sidebar / below meta' },
                  { value: 'bottom', title: 'Bottom of article' },
                ],
                layout: 'radio',
              },
              initialValue: 'hero',
            },
            {
              name: 'color',
              title: 'Colour',
              type: 'string',
              options: {
                list: [
                  { value: 'gold', title: 'Gold' },
                  { value: 'green', title: 'Green' },
                  { value: 'blue', title: 'Blue' },
                  { value: 'red', title: 'Red' },
                  { value: 'neutral', title: 'Neutral' },
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
                sidebar: 'Sidebar',
                bottom: 'Bottom',
              }
              return {
                title: title ?? 'Tag',
                subtitle: subtitle ? placements[subtitle] ?? subtitle : '',
              }
            },
          },
        },
      ],
      description: 'Add tags and choose where they appear on the page.',
    }),
    defineField({
      name: 'relatedTrips',
      title: 'Related Trips',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'trip' }] }],
      description: 'Optional: link relevant safari trips to this article.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
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
        submitted: 'Submitted',
        pending_review: 'Pending Review',
        published: 'Published',
        rejected: 'Rejected',
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
