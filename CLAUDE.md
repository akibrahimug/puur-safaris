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
- `postinstall` runs `patch-package` — there's a patch for `@sanity/document-internationalization` in `patches/`. Do not skip it.

## Stack

- **Next.js 16** (App Router) + **React 19** + **Tailwind 4** (`@tailwindcss/postcss`). Per `AGENTS.md`, confirm API shapes against `node_modules/next/dist/docs/` before writing — several conventions changed.
- **Sanity v5** studio embedded at `/studio` (`src/app/studio/[[...tool]]`). Config in `sanity.config.ts`. Project ID and dataset come from `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET`.
- Path alias: `@/*` → `src/*`.

## Architecture

### Server-first data flow (non-negotiable)

All content comes from Sanity via Server Components. The flow is:

```
Server Component → src/lib/data.ts → sanityFetch (src/sanity/live.ts)
                                   → maybeTranslate (src/lib/translation/)
                                   → typed result (src/lib/types.ts)
```

No client-side `useEffect + fetch`. Client components (`'use client'`) are reserved for interaction (Framer Motion, forms, event handlers).

### Locale routing — NL is the source of truth

- Two locales: `nl` (default) and `en`, defined in `src/i18n/config.ts`.
- **`src/proxy.ts`** is Next.js 16's renamed middleware (exported as `proxy`, not `middleware`). It detects locale from cookie → `Accept-Language` → default, then redirects `/foo` → `/{locale}/foo` and sets an `x-locale` response header consumed by the root layout.
- URL slugs differ per locale. `src/i18n/routes.ts` holds the canonical NL↔EN segment map (e.g. `/safari-reizen` ↔ `/safaris`, `/bestemmingen` ↔ `/destinations`). `next.config.ts` mirrors these as Dutch-path rewrites that point at the English-named page files under `src/app/[lang]/(site)/`.
- Adding a new localized route means updating **both** `routeMap` in `src/i18n/routes.ts` **and** the `rewrites()` array in `next.config.ts`.

### Translation system (NL → EN)

CMS content is authored in Dutch. English is generated on read:

- `src/lib/translation/config.ts` lists translatable fields per document type (`text`, `textArray`, `portableText`, `nested`). Non-listed fields (slugs, images, refs, numbers) pass through.
- `src/lib/translation/service.ts` uses `google-translate-api-x` (no key) and batches every string in a doc into one request.
- `src/lib/translation/cache.ts` writes a JSON cache per `{docId, lang}` to `.translations/` (gitignored). Cache key includes Sanity `_rev`; when source revision changes, the entry is invalidated automatically.
- `maybeTranslate` is a no-op when `targetLang === 'nl'` and falls back to the untranslated doc on failure.

When adding new translatable document types or fields, extend `translatableFields` in `src/lib/translation/config.ts` — otherwise EN will silently serve NL text.

### Sanity Studio

- Structure in `sanity.config.ts` splits content into list-type docs (trips, destinations, blogs, testimonials, FAQs, bookings) and **singletons** (page documents with fixed IDs: `contactPage`, `safariListingPage`, etc.). Singletons have their delete/duplicate actions removed and cannot be created via "New document".
- `blogPost` has an **auto-publish action**: setting `status === "published"` in a draft triggers publish automatically (see `createAutoPublishAction`).
- Document internationalization via `@sanity/document-internationalization` maintains parallel NL/EN documents for types in the `schemaTypes` list inside `sanity.config.ts` — but our data layer fetches NL and auto-translates, so EN documents exist but aren't required for most rendering paths.
- Visual editing is wired through `presentationTool` + `VisualEditing` in `src/app/layout.tsx`, guarded by draft mode (`/api/draft-mode/enable|disable`). Stega is enabled on the client (`src/sanity/client.ts`) — use `stegaClean()` when a value hits metadata/SEO fields.

### Cache revalidation

`POST /api/revalidate` is called by a Sanity webhook with an `x-revalidate-secret` header (env: `SANITY_REVALIDATE_SECRET`). It maps `_type` → `revalidatePath` calls. When adding a new document type that backs a route, add the corresponding case in `src/app/api/revalidate/route.ts`.

### SEO

`src/lib/seo.ts` builds `Metadata` and JSON-LD (`organizationJsonLd`, `websiteJsonLd`) from `siteSettings` + page `seo` fields. `[lang]/layout.tsx` injects both JSON-LD blocks. The base URL comes from `getBaseUrl()` — check that before hardcoding domains.

### Env vars

- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` — required at build and runtime
- `SANITY_API_READ_TOKEN` — server-side Sanity fetch (used by `defineLive`)
- `SANITY_REVALIDATE_SECRET` — shared secret for the revalidate webhook
- Resend / email env vars consumed by `src/emails/` templates and `src/app/api/blog|booking|contact/`

## Conventions worth knowing

- Dutch is the user-visible source language: API error strings, CMS labels, and studio titles are Dutch. Don't "fix" them to English.
- `cmsText()` in `src/i18n/config.ts` is deprecated — the data layer does translation. Don't reach for it in new code.
- Scripts in `scripts/` (`migrate-images.ts`, `seed-scraped-data.ts`) are one-off; run with `tsx` / `ts-node` as needed, not via a package script.
