import { defineConfig, useClient, useDocumentOperation, type DocumentActionComponent } from "sanity";
import { useEffect, useState } from "react";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { media } from "sanity-plugin-media";
import { presentationTool } from "sanity/presentation";
import { documentInternationalization } from "@sanity/document-internationalization";
import { TrashIcon } from "@sanity/icons";
import { resolve } from "./src/sanity/presentation/resolve";
import { schemaTypes } from "./src/sanity/schemas";
import { TranslateFromNlAction } from "./src/sanity/actions/translate-from-nl";

/* ── Translatable document types ──────────────────────────────────── *
 * Every doc here gets a `language` field plus a Translations panel    *
 * that lets editors create / switch to sibling docs in other locales. *
 * testimonial, googleReview, and booking are excluded — they're       *
 * source-language artefacts (user quotes, third-party reviews, form   *
 * submissions) and don't need translation.                            */
const TRANSLATABLE_TYPES = [
  "trip",
  "destination",
  "blogPost",
  "faqItem",
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
  "siteSettings",
  "legalPage",
];

/* ── Singleton page type IDs ───────────────────────────────────────── */
// Pages with existing random-ID documents — show as document list
const listPages = [
  { type: "homePage", title: "Homepage" },
  { type: "aboutPage", title: "About Page" },
];

// Pages with fixed-ID documents — strict singletons
const singletonPages = [
  { type: "contactPage", title: "Contact Page" },
  { type: "safariListingPage", title: "Safari Listing Page" },
  { type: "destinationListingPage", title: "Destinations Page" },
  { type: "faqPage", title: "FAQ Page" },
  { type: "blogPage", title: "Blog Page" },
  { type: "eigenReisschemaPage", title: "Custom Itinerary Page" },
  { type: "blogSubmissionPage", title: "Blog Submission Page" },
  { type: "bookingPage", title: "Booking Page" },
];

const singletonTypeNames = new Set<string>([
  ...singletonPages.map((p) => p.type),
  ...listPages.map((p) => p.type),
]);

/* ── Visible delete action for content types ───────────────────────── *
 * Replaces the default Sanity delete with a prominent, critical-toned  *
 * action using a transaction-based delete that handles draft+published *
 * versions atomically (Content Lake rejects deleting a published doc   *
 * while a draft still exists, so we delete both in one transaction).   */
function createDeleteAction(typeLabel: string): DocumentActionComponent {
  const DeleteAction: DocumentActionComponent = (props) => {
    const client = useClient({ apiVersion: "2024-10-01" });
    const [showDialog, setShowDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const runDelete = async () => {
      setIsDeleting(true);
      try {
        const publishedId = props.id.replace(/^drafts\./, "");
        const draftId = `drafts.${publishedId}`;
        await client
          .transaction()
          .delete(draftId)
          .delete(publishedId)
          .commit({ visibility: "async" });
      } catch (err) {
        console.error("Delete failed:", err);
      } finally {
        setIsDeleting(false);
        setShowDialog(false);
        props.onComplete();
      }
    };

    return {
      label: `Delete ${typeLabel.toLowerCase()}`,
      icon: TrashIcon,
      tone: "critical",
      group: ["default", "paneActions"],
      disabled: isDeleting,
      onHandle: () => setShowDialog(true),
      dialog: showDialog && {
        type: "confirm",
        color: "danger",
        onCancel: () => {
          setShowDialog(false);
          props.onComplete();
        },
        onConfirm: () => {
          void runDelete();
        },
        message: `Are you sure you want to permanently delete this ${typeLabel.toLowerCase()}? This action cannot be undone.`,
      },
    };
  };
  return DeleteAction;
}

/* ── Auto-publish action for blogPost ──────────────────────────────── *
 * When the admin sets status to "published" and saves, automatically   *
 * publish the document (remove the draft) so it goes live immediately. */
function createAutoPublishAction(
  originalPublishAction: DocumentActionComponent,
): DocumentActionComponent {
  const AutoPublishAction: DocumentActionComponent = (props) => {
    const { publish } = useDocumentOperation(props.id, props.type);
    const result = originalPublishAction(props);

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
  title: "Pure Uganda Safaris Studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content Management")
          .items([
            S.documentTypeListItem("trip").title("Safari Trips"),
            S.documentTypeListItem("destination").title("Destinations"),
            S.documentTypeListItem("blogPost").title("Blog Posts"),
            S.documentTypeListItem("testimonial").title("Testimonials"),
            S.documentTypeListItem("googleReview").title("Google Reviews"),
            S.documentTypeListItem("faqItem").title("FAQ"),
            S.documentTypeListItem("booking").title("Bookings"),
            S.divider(),
            // ── Pages — list view per type so editors see both NL and EN ──
            //
            // With the i18n plugin enabled each "singleton" is actually two
            // documents (one per locale). documentTypeList shows them side
            // by side; documents with `language` set get a flag badge in
            // the list. Click through to edit either one. New translations
            // are created via the Translations panel inside the document
            // editor.
            ...[...listPages, ...singletonPages].map((page) =>
              S.listItem()
                .title(page.title)
                .id(page.type)
                .child(
                  S.documentTypeList(page.type).title(page.title),
                ),
            ),
            S.divider(),
            S.documentTypeListItem("legalPage").title("Legal Pages"),
            S.listItem()
              .title("Site Settings")
              .id("siteSettings")
              .child(
                S.documentTypeList("siteSettings").title("Site Settings"),
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
    documentInternationalization({
      supportedLanguages: [
        { id: "nl", title: "Nederlands" },
        { id: "en", title: "English" },
      ],
      schemaTypes: TRANSLATABLE_TYPES,
      // Allow references to non-translated docs (e.g. testimonials, reviews)
      // without forcing them to be language-specific.
      weakReferences: true,
    }),
    visionTool(),
    media(),
  ],
  schema: {
    types: schemaTypes,
    // Prevent creating new singleton documents via the "New document" button
    templates: (templates) =>
      templates.filter(
        (t) =>
          !singletonTypeNames.has(t.schemaType) &&
          t.schemaType !== "siteSettings",
      ),
  },
  document: {
    actions: (prev, context) => {
      // Add "Vertaal van Nederlands" to every translatable type (the action
      // self-hides when the current doc isn't `language: "en"`).
      const isTranslatable = TRANSLATABLE_TYPES.includes(context.schemaType);
      const withTranslate = isTranslatable ? [...prev, TranslateFromNlAction] : prev;

      // Singletons: only allow publish + discard + (translate, if EN sibling)
      if (
        singletonTypeNames.has(context.schemaType) ||
        context.schemaType === "siteSettings"
      ) {
        return withTranslate.filter(
          (action) =>
            action.action === "publish" ||
            action.action === "discardChanges" ||
            action.action === "restore" ||
            action === TranslateFromNlAction,
        );
      }

      // Content types with an explicit, visible delete button (English label + trash icon).
      const deleteLabels: Record<string, string> = {
        blogPost: "Blog post",
        trip: "Safari trip",
        destination: "Destination",
        googleReview: "Google review",
      };
      const typeLabel = deleteLabels[context.schemaType];
      if (typeLabel) {
        const actions = withTranslate
          .filter((action) => action.action !== "delete")
          .map((action) => {
            if (context.schemaType === "blogPost" && action.action === "publish") {
              return createAutoPublishAction(action);
            }
            return action;
          });
        return [...actions, createDeleteAction(typeLabel)];
      }

      return withTranslate;
    },
  },
});
