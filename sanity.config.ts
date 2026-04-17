import { defineConfig, useDocumentOperation, type DocumentActionComponent } from "sanity";
import { useEffect } from "react";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { media } from "sanity-plugin-media";
import { presentationTool } from "sanity/presentation";
import { documentInternationalization } from "@sanity/document-internationalization";
import { resolve } from "./src/sanity/presentation/resolve";
import { schemaTypes } from "./src/sanity/schemas";

/* ── Singleton page type IDs ───────────────────────────────────────── */
// Pages with existing random-ID documents — show as document list
const listPages = [
  { type: "homePage", title: "Homepage" },
  { type: "aboutPage", title: "Over Ons Pagina" },
];

// Pages with fixed-ID documents — strict singletons
const singletonPages = [
  { type: "contactPage", title: "Contact Pagina" },
  { type: "safariListingPage", title: "Safari Overzicht Pagina" },
  { type: "destinationListingPage", title: "Bestemmingen Pagina" },
  { type: "faqPage", title: "FAQ Pagina" },
  { type: "blogPage", title: "Blog Pagina" },
  { type: "eigenReisschemaPage", title: "Eigen Reisschema Pagina" },
  { type: "blogSubmissionPage", title: "Blog Inzenden Pagina" },
  { type: "bookingPage", title: "Boekingen Pagina" },
];

const singletonTypeNames = new Set<string>([
  ...singletonPages.map((p) => p.type),
  ...listPages.map((p) => p.type),
]);

/* ── Auto-publish action for blogPost ──────────────────────────────── *
 * When the admin sets status to "published" and saves, automatically   *
 * publish the document (remove the draft) so it goes live immediately. */
function createAutoPublishAction(
  originalPublishAction: DocumentActionComponent,
): DocumentActionComponent {
  const AutoPublishAction: DocumentActionComponent = (props) => {
    const { publish } = useDocumentOperation(props.id, props.type);
    const result = originalPublishAction(props);

    // Auto-trigger publish when draft status is "published"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const draftStatus = (props.draft as any)?.status;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const publishedStatus = (props.published as any)?.status;

    useEffect(() => {
      if (
        draftStatus === "published" &&
        publishedStatus !== "published" &&
        !publish.disabled
      ) {
        publish.execute();
      }
    }, [draftStatus, publishedStatus, publish]);

    return result;
  };
  return AutoPublishAction;
}

export default defineConfig({
  name: "puur-uganda-reizen",
  title: "Puur Uganda Reizen Studio",
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
            S.documentTypeListItem("booking").title("Boekingen"),
            S.divider(),
            // ── Pages with existing documents (random IDs) ──
            ...listPages.map((page) =>
              S.listItem()
                .title(page.title)
                .id(page.type)
                .child(
                  S.documentTypeList(page.type).title(page.title),
                ),
            ),
            // ── Strict singleton pages (fixed IDs) ──
            ...singletonPages.map((page) =>
              S.listItem()
                .title(page.title)
                .id(page.type)
                .child(
                  S.document()
                    .schemaType(page.type)
                    .documentId(page.type),
                ),
            ),
            S.divider(),
            S.documentTypeListItem("legalPage").title("Juridische Pagina's"),
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
    media(),
    documentInternationalization({
      supportedLanguages: [
        { id: "nl", title: "Nederlands" },
        { id: "en", title: "English" },
      ],
      schemaTypes: [
        "trip",
        "destination",
        "blogPost",
        "testimonial",
        "faqItem",
        "siteSettings",
        "homePage",
        "aboutPage",
        "contactPage",
        "safariListingPage",
        "destinationListingPage",
        "faqPage",
        "blogPage",
        "eigenReisschemaPage",
        "blogSubmissionPage",
        "bookingPage",
        "legalPage",
      ],
    }),
  ],
  schema: {
    types: schemaTypes,
    // Prevent creating new singleton documents via the "New document" button
    templates: (templates) =>
      templates.filter(
        (t) =>
          !singletonTypeNames.has(t.schemaType) &&
          t.schemaType !== "siteSettings" &&
          t.schemaType !== "translation.metadata",
      ),
  },
  document: {
    // For singletons: remove delete/duplicate actions
    // For blogPost: auto-publish when status is set to "published"
    actions: (prev, context) => {
      // Singletons: only allow publish + discard
      if (
        singletonTypeNames.has(context.schemaType) ||
        context.schemaType === "siteSettings"
      ) {
        return prev.filter(
          (action) =>
            action.action === "publish" ||
            action.action === "discardChanges" ||
            action.action === "restore",
        );
      }

      // Blog posts: wrap the publish action to auto-publish when status = "published"
      if (context.schemaType === "blogPost") {
        return prev.map((action) => {
          if (action.action === "publish") {
            return createAutoPublishAction(action);
          }
          return action;
        });
      }

      return prev;
    },
  },
});
