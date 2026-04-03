import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { presentationTool } from "sanity/presentation";
import { resolve } from "./src/sanity/presentation/resolve";
import { schemaTypes } from "./src/sanity/schemas";

export default defineConfig({
  name: "puur-safaris",
  title: "Puur Safaris Studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Inhoud Beheer")
          .items([
            S.documentTypeListItem("trip").title("Safari Reizen"),
            S.documentTypeListItem("destination").title("Bestemmingen"),
            S.documentTypeListItem("blogPost").title("Blog Berichten"),
            S.documentTypeListItem("testimonial").title("Getuigenissen"),
            S.documentTypeListItem("faqItem").title("Veelgestelde Vragen"),
            S.divider(),
            S.listItem()
              .title("Homepage")
              .id("homePage")
              .child(
                S.documentTypeList("homePage").title("Homepage"),
              ),
            S.listItem()
              .title("Over Ons Pagina")
              .id("aboutPage")
              .child(
                S.documentTypeList("aboutPage").title("Over Ons Pagina"),
              ),
            S.listItem()
              .title("Site Instellingen")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings"),
              ),
          ]),
    }),
    presentationTool({
      resolve,
      previewUrl: {
        previewMode: {
          enable: "/api/draft-mode/enable",
          disable: "/api/draft-mode/disable",
        },
      },
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
