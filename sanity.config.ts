import { defineConfig, useClient, useDocumentOperation, type DocumentActionComponent } from "sanity";
import { useEffect, useState } from "react";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { media } from "sanity-plugin-media";
import { presentationTool } from "sanity/presentation";
import { TrashIcon } from "@sanity/icons";
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
        console.error("Verwijderen mislukt:", err);
      } finally {
        setIsDeleting(false);
        setShowDialog(false);
        props.onComplete();
      }
    };

    return {
      label: `${typeLabel} verwijderen`,
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
        message: `Weet je zeker dat je deze ${typeLabel.toLowerCase()} permanent wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.`,
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
            S.documentTypeListItem("googleReview").title("Google Reviews"),
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

      // Content types with an explicit, visible delete button (Dutch label + trash icon).
      const deleteLabels: Record<string, string> = {
        blogPost: "Blog bericht",
        trip: "Safari reis",
        destination: "Bestemming",
        googleReview: "Google review",
      };
      const typeLabel = deleteLabels[context.schemaType];
      if (typeLabel) {
        const actions = prev
          .filter((action) => action.action !== "delete")
          .map((action) => {
            if (context.schemaType === "blogPost" && action.action === "publish") {
              return createAutoPublishAction(action);
            }
            return action;
          });
        return [...actions, createDeleteAction(typeLabel)];
      }

      return prev;
    },
  },
});
