import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schemas'

export default defineConfig({
  name: 'puur-safaris',
  title: 'Puur Safaris Studio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  basePath: '/studio',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Inhoud Beheer')
          .items([
            S.documentTypeListItem('trip').title('Safari Reizen'),
            S.documentTypeListItem('destination').title('Bestemmingen'),
            S.documentTypeListItem('blogPost').title('Blog Berichten'),
            S.documentTypeListItem('testimonial').title('Getuigenissen'),
            S.documentTypeListItem('faqItem').title('Veelgestelde Vragen'),
            S.divider(),
            S.listItem()
              .title('Site Instellingen')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
