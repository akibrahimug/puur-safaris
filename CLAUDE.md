@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Next.js dev server (includes `/studio` Sanity embed at `/studio`)
- `npm run build` / `npm run start` — production build / serve
- `npm run lint` — ESLint (`eslint-config-next` v16, flat config in `eslint.config.mjs`)
- `npm run tsc:check` — `tsc --noEmit`. Other `tsc:*` aliases all resolve to the same thing.
- `npm run test` — Vitest (jsdom env, `src/**/*.test.{ts,tsx}`)
  - Single file: `npx vitest run src/lib/utils.test.ts`
  - `test:watch`, `test:ui`, `test:coverage` also available

## Stack

- **Next.js 16** (App Router) + **React 19** + **Tailwind 4** (`@tailwindcss/postcss`). Per `AGENTS.md`, confirm API shapes against `node_modules/next/dist/docs/` before writing — several conventions changed.
- **Sanity v5** studio embedded at `/studio` (`src/app/studio/[[...tool]]`). Config in `sanity.config.ts`. Project ID and dataset come from `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET`.
- **`@sanity/document-internationalization` v6** for parallel NL/EN documents (see Translation system below).
- Path alias: `@/*` → `src/*`.

## Architecture

### Server-first data flow (non-negotiable)

All content comes from Sanity via Server Components. The flow is:

```
Server Component → src/lib/data.ts → sanityFetch (src/sanity/live.ts)
                                   → maybeTranslate fallback (src/lib/translation/)
                                   → typed result (src/lib/types.ts)
```

No client-side `useEffect + fetch`. Client components (`'use client'`) are reserved for interaction (Framer Motion, forms, event handlers).

### Locale routing

Two locales: `nl` (default, source of truth) and `en`, defined in `src/i18n/config.ts`.

- **`src/proxy.ts`** is Next.js 16's renamed middleware (exported as `proxy`, not `middleware`). It detects locale from sticky cookie → ranked Accept-Language → **EN fallback**, then redirects `/foo` → `/{locale}/foo` and sets an `x-locale` response header consumed by the root layout. NL is shown only when the visitor's browser explicitly prefers Dutch (`Accept-Language: nl…`); everyone else (English, German, French, anything not matching) lands on `/en`. **Sticky cookie**: when the visitor lands on a locale-prefixed URL, the cookie is updated to that locale, so future unprefixed visits stay on it. Means there's no need for a UI language switcher. Note: `defaultLocale` in `src/i18n/config.ts` stays `nl` because it's the editorial source of truth used by data/SEO; only the routing fallback is EN.
- **`<html translate="no">`** + `notranslate` class + `<meta name="google" content="notranslate">` in `src/app/layout.tsx` opt out of Chrome/Edge/Safari auto-translation. Without this, browsers running Google Translate over a `/nl` page mutate the DOM and cause hydration mismatches.
- URL slugs differ per locale. **`src/i18n/routes.ts`** is the single source of truth — it holds the canonical NL↔EN segment map and exports `getNlRewrites()`, which `next.config.ts` consumes to produce its `rewrites()` array. **Adding a new localized route is a one-place change** (the `routeMap` in routes.ts); rewrites regenerate automatically.
- `cmsPathToLocale(nlPath, locale)` preserves query strings and hash fragments — `?category=wildlife` round-trips correctly across locales.

### Translation system — parallel NL/EN docs with auto-translate fallback

Translation is **plugin-driven**, with **auto-translate as a graceful fallback**.

#### Authoring side (CMS / studio)

- **`@sanity/document-internationalization`** is configured in `sanity.config.ts` for these doc types: `trip`, `destination`, `blogPost`, `faqItem`, all `*Page` singletons, `siteSettings`, `legalPage`. (Excluded: `testimonial`, `googleReview`, `booking` — source-language artefacts.)
- Each translatable doc carries a `language` field (`"nl"` or `"en"`). The plugin reads/writes the field but **does not** auto-declare it in the schema — `src/sanity/schemas/with-language.ts` exposes a `withLanguage()` wrapper that appends a hidden + readOnly `language` field, applied to every translatable schema in `src/sanity/schemas/index.ts`. Without this, the studio shows "Unknown field" warnings on every doc.
- The studio sidebar shows both NL and EN siblings via `documentTypeList`. Inside any doc the **Translations panel** lists existing siblings and offers "Create translation: English" — clicking duplicates the source doc into a new EN doc with `language: "en"`.
- A custom **"Vertaal van Nederlands"** document action (`src/sanity/actions/translate-from-nl.tsx`) is wired in `sanity.config.ts` for every translatable type. It self-hides on docs where `language !== "en"`. When the editor clicks it, the action POSTs the current doc fields to `/api/translate-doc` and patches the returned EN fields back as draft changes. Editor reviews + publishes when satisfied. The action only writes fields that the translator actually changed, so manual edits in untranslated fields aren't clobbered.
- Singleton page docs (`contactPage`, etc.) used to use fixed `documentId(...)` pinning. After the i18n migration they use `documentTypeList` so both NL and EN versions are reachable. Singleton-protection (templates filter, action restriction) still prevents accidental creation of more than two docs per type.
- One-off backfill: `scripts/backfill-language-nl.ts` tags every existing translatable doc with `language: "nl"` via `setIfMissing`. Idempotent — safe to re-run.
- Bulk EN seeding: `scripts/seed-en-translations.ts --run` creates an EN draft sibling for every NL doc, populated by the auto-translate pipeline, and links the pair via `translation.metadata`. Idempotent (skips docs that already have an EN sibling).
- Bulk publish: `scripts/publish-en-drafts.ts --run` promotes every EN draft to a published doc via a Sanity transaction (`createOrReplace` + `delete(draftId)`). The Sanity client must be created with `perspective: 'raw'` to see drafts at all — without it, `client.fetch` returns the published view (zero drafts) and the script silently no-ops.
- Repair: `scripts/retranslate-en-docs.ts --run` walks every published EN doc, looks up its NL sibling via `translation.metadata`, re-runs the translator, and patches only fields whose value differs. Default mode uses a Dutch-content heuristic to find broken docs; pass `--all` to re-check everything. Use this when Google Translate rate-limited mid-seed and silently wrote NL content into the EN doc — the failure is invisible because `translateTexts` catches errors and returns the originals.

#### Reading side (data layer)

`src/lib/data.ts` fetches the locale-matching doc first. If the EN sibling doesn't exist yet, it falls back to NL + on-the-fly auto-translation:

```
fetchAndTranslate(query, type, lang):
  1. fetch with $lang === locale  → return as-is if exists
  2. else if locale !== "nl":      fetch with $lang === "nl", run maybeTranslate
  3. else:                         null
```

This means editors can roll out EN translations gradually — untranslated docs still render cleanly on `/en` via the auto-translate fallback. Once the editor authors and publishes the EN sibling, that takes over.

GROQ queries (`src/sanity/queries.ts`) all take a `$lang` parameter and filter `language == $lang`. The slug-listing helpers (`getTripSlugs`, etc.) dedupe slugs across languages so `generateStaticParams` produces one entry per slug.

#### Auto-translate engine

When the fallback path fires, content is translated by `src/lib/translation/`:

- `src/lib/translation/config.ts` lists translatable fields per document type (`text`, `textArray`, `portableText`, `nested`). Non-listed fields (slugs, images, refs, numbers) pass through.
- `src/lib/translation/service.ts` uses `google-translate-api-x` (no key) and batches every string in a doc into one request. **Silent-failure caveat**: `translateTexts` wraps the API call in `try/catch` and returns the originals on error. This keeps the public site rendering when Google flakes, but during bulk seeding it means a rate-limited doc lands in CMS with NL content. Always run `scripts/retranslate-en-docs.ts --run` after a bulk seed to repair any silent failures.
- **`src/lib/translation/glossary.ts`** — forced phrase mappings (`Eigen Reisschema → Custom Itinerary`) and protected proper nouns (`Bwindi`, `Queen Elizabeth`, etc.) that round-trip unchanged. Each NL string passes through `applyGlossary` (placeholder-substitute matched terms), then Google Translate, then `restoreGlossary`. Case is mirrored: `Safari Reizen` → `Safari Trips`, `safari reizen` → `safari trips`. **Bump `TRANSLATOR_VERSION` whenever the glossary or pipeline changes** — the cache filename includes it, so prior translations auto-invalidate.
- `src/lib/translation/cache.ts` writes a JSON cache per `{docId, lang, translatorVersion}` to `.translations/` (gitignored). Cache key includes Sanity `_rev`; when source revision changes, the entry is invalidated automatically.
- `maybeTranslate` is a no-op when `targetLang === "nl"` and falls back to the untranslated doc on failure.

When adding new translatable fields, extend `translatableFields` in `src/lib/translation/config.ts` — otherwise EN visitors will silently see untranslated NL text in the auto-translate fallback path. When adding new bad-translation cases (compound nouns, idioms, place names), extend `PHRASE_GLOSSARY` or `PROTECTED_TERMS` in `glossary.ts` and bump `TRANSLATOR_VERSION`.

#### CMS-only content stream (no dictionary cascade)

CMS-backed copy is **never fallback-cascaded through dictionary or hardcoded literals**. The render path is `homePage?.heroHeadline`, period — if CMS is empty, that field renders empty (a deliberate signal to fill the CMS).

`src/i18n/dictionaries/{nl,en}.json` exists only for non-CMS UI strings: form fields and validation messages, footer/nav links, generic UI labels (`Scroll`, `previous`, `next`), categories, the email templates. Page-level CMS content (hero copy, section headings, button labels, CTA text) lives entirely in CMS. Don't reintroduce `homePage?.x ?? d?.y ?? 'literal'` cascade patterns — they cause NL/EN drift.

### Sanity Studio

- Structure in `sanity.config.ts` shows list-type docs (trips, destinations, blogs, testimonials, FAQs, bookings) and page docs (homePage, aboutPage, all `*Page` singletons). Page docs are surfaced via `documentTypeList` so both NL and EN siblings are visible.
- `blogPost` has an **auto-publish action**: setting `status === "published"` in a draft triggers publish automatically (see `createAutoPublishAction`).
- Custom delete actions (Dutch label + trash icon) exist for `blogPost`, `trip`, `destination`, `googleReview`. Singletons (page types + `siteSettings`) only allow publish/discardChanges/restore.
- **Stega encoding caveat**: navigation labels (header nav, footer column headings, footer link labels, header CTA, footer privacy/terms labels) are run through `stegaClean()` before render. Without this, clicking a nav link in the visual editor preview triggers "open source document" instead of navigating. The rest of the page (hero copy, body text) keeps stega so click-to-edit still works there.
- Visual editing is wired through `presentationTool` + `VisualEditing` in `src/app/layout.tsx`, guarded by draft mode (`/api/draft-mode/enable|disable`). Stega is enabled on the client (`src/sanity/client.ts`) — use `stegaClean()` when a value hits metadata/SEO fields, navigation, or any URL-like attribute.
- `src/sanity/presentation/resolve.ts` reads each doc's `language` field and routes the preview iframe to the locale-matching public URL.

### Cache revalidation

`POST /api/revalidate` is called by a Sanity webhook with an `x-revalidate-secret` header (env: `SANITY_REVALIDATE_SECRET`). It maps `_type` → `revalidatePath` calls. When adding a new document type that backs a route, add the corresponding case in `src/app/api/revalidate/route.ts`.

### API routes worth knowing

- `POST /api/revalidate` — Sanity webhook trigger.
- `POST /api/translate-doc` — pure translation utility. Body: `{ docType, fields, targetLang }`. Returns only the fields that changed. Does not mutate Sanity. Called by the **Vertaal van Nederlands** studio action; same-origin only.
- `POST /api/booking`, `/api/blog/submit`, `/api/contact` — public form endpoints (rate-limited inside the route).
- `GET /api/draft-mode/enable|disable` — used by the visual editing handshake.

### SEO

`src/lib/seo.ts` builds `Metadata` and JSON-LD (`organizationJsonLd`, `websiteJsonLd`) from `siteSettings` + page `seo` fields. `[lang]/layout.tsx` injects both JSON-LD blocks. The base URL comes from `getBaseUrl()` — check that before hardcoding domains. `buildMetadata` accepts `title?: string | undefined`; when omitted it falls back to `siteSettings.defaultSeoTitle` then to `siteName`.

### Env vars

- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` — required at build and runtime
- `SANITY_API_READ_TOKEN` — server-side Sanity fetch (used by `defineLive`)
- `SANITY_API_WRITE_TOKEN` — used by `scripts/backfill-language-nl.ts` (and any future migration scripts) to mutate documents directly. Not used at runtime.
- `SANITY_REVALIDATE_SECRET` — shared secret for the revalidate webhook
- Resend / email env vars consumed by `src/emails/` templates and `src/app/api/blog|booking|contact/`

## Conventions worth knowing

- **Dutch is the user-visible source language**: API error strings, CMS labels, and studio titles are Dutch. Don't "fix" them to English.
- **CMS is the source for visible copy**, not dictionaries. The dictionary is only for non-CMS UI (forms, validation, common labels). Don't reintroduce `cms ?? dict ?? 'literal'` cascades — they're the cause of EN/NL drift.
- `cmsText()` in `src/i18n/config.ts` is deprecated — the data layer does translation. Don't reach for it in new code.
- **Adding a new localized route**: edit `routeMap` in `src/i18n/routes.ts`. `next.config.ts` rewrites are derived automatically via `getNlRewrites()`. Don't hand-edit the rewrites array.
- **Adding a new translatable doc type**: (1) wrap the schema with `withLanguage(...)` in `src/sanity/schemas/index.ts`, (2) add the type name to `TRANSLATABLE_TYPES` in `sanity.config.ts` so the i18n plugin attaches the Translations panel, (3) add it to `translatableFields` in `src/lib/translation/config.ts` so the auto-translate fallback knows which fields to translate. Run `scripts/backfill-language-nl.ts` to tag any existing docs with `language: "nl"`. Optionally run `scripts/seed-en-translations.ts --run` to create EN draft siblings for every NL doc, then `scripts/publish-en-drafts.ts --run` to promote them, then `scripts/retranslate-en-docs.ts --run` to repair any docs Google rate-limited during the seed.
- **Sanity client perspective gotcha**: scripts that need to see drafts (publish, retranslate, etc.) must create the client with `perspective: 'raw'`. The default perspective is `published`, which silently hides every `drafts.*` doc from `client.fetch` — your script will report "0 drafts" and exit clean, while the studio still shows them all. If a script's count disagrees with what you see in studio, this is the first thing to check.
- **Don't auto-publish editor drafts**: the backfill script uses `setIfMissing` and patches existing drafts in place — content other than the language field is preserved exactly. If a doc has an active draft (in-progress editor work), patching adds the language field to that draft without publishing it.
- Scripts in `scripts/` (`migrate-images.ts`, `seed-scraped-data.ts`, `backfill-language-nl.ts`, `seed-en-translations.ts`, `publish-en-drafts.ts`, `retranslate-en-docs.ts`) are one-off migrations; run with `npx tsx scripts/<file>` as needed, not via a package script.
