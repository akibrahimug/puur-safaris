# Puur Uganda Reizen / Pure Uganda Safaris

Bilingual safari travel agency site (Dutch + English) built on Next.js 16 + Sanity v5. NL is the editorial source of truth; EN is a parallel translation served from CMS with a Google-Translate fallback when an EN sibling hasn't been authored yet.

- Production: https://www.puurugandareizen.nl
- Sanity studio: `/studio` (embedded under the Next app)

## Stack

- **Next.js 16** (App Router, React 19, Tailwind 4) — `src/proxy.ts` is the renamed middleware
- **Sanity v5** with `@sanity/document-internationalization` v6
- **`google-translate-api-x`** (no API key) for the translate fallback path
- **Resend** for transactional email
- TypeScript, Vitest (jsdom), ESLint flat config

## Commands

```bash
npm run dev          # Next dev server, includes /studio
npm run build        # production build
npm run start        # serve production build
npm run lint         # ESLint
npm run tsc:check    # tsc --noEmit
npm run test         # Vitest
```

Single test file: `npx vitest run src/lib/utils.test.ts`. Watch mode: `npm run test:watch`.

## Architecture

Three things to know before changing anything:

1. **Server-first.** All content fetched via Server Components → `src/lib/data.ts` → `sanityFetch`. No client-side `useEffect + fetch`.
2. **CMS is the only source for visible copy.** No `cms ?? dict ?? "literal"` cascades — they cause NL/EN drift. Dictionaries (`src/i18n/dictionaries/{nl,en}.json`) exist only for non-CMS UI strings (form validation, generic labels).
3. **Locale routing is automatic.** `src/proxy.ts` decides locale from sticky cookie → ranked `Accept-Language` → EN fallback. NL is shown only when the browser explicitly prefers Dutch. There is no UI language switcher by design.

For the deep tour — translation pipeline, glossary, schema wrappers, studio actions, presentation-tool wiring, and migration scripts — see [`CLAUDE.md`](./CLAUDE.md).

## Required env vars

| Var | Used by |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity client (build + runtime) |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity client (build + runtime) |
| `SANITY_API_READ_TOKEN` | Server-side Sanity fetch (`defineLive`) |
| `SANITY_API_WRITE_TOKEN` | Migration scripts in `scripts/` |
| `SANITY_REVALIDATE_SECRET` | `/api/revalidate` webhook secret |
| `RESEND_API_KEY` etc. | `src/emails/` + form API routes |

## Migration scripts

One-off scripts under `scripts/`. All run with `npx tsx scripts/<file>` and read `.env.local`.

| Script | Purpose |
| --- | --- |
| `backfill-language-nl.ts` | Tag every existing translatable doc with `language: "nl"` (idempotent, uses `setIfMissing`). |
| `seed-en-translations.ts --run` | Create an EN draft sibling for every NL doc; populate it via the auto-translate pipeline; link the pair in `translation.metadata`. |
| `publish-en-drafts.ts --run` | Promote every EN draft to a published doc. Uses `perspective: 'raw'` so the client can see drafts. |
| `retranslate-en-docs.ts --run` | Walk every published EN doc, re-translate from its NL sibling, patch only changed fields. Use `--all` to re-check every doc; default mode uses a Dutch-content heuristic. Run this after any bulk seed to repair docs that Google rate-limited mid-run (silent failures are otherwise invisible). |

Typical bulk-translation workflow on a fresh dataset:

```bash
npx tsx scripts/backfill-language-nl.ts
npx tsx scripts/seed-en-translations.ts --run
npx tsx scripts/publish-en-drafts.ts --run
npx tsx scripts/retranslate-en-docs.ts --run     # repair silent translation failures
```

## Project layout

```
src/
  app/[lang]/...        # locale-prefixed App Router pages
  app/studio/...        # embedded Sanity studio
  app/api/...           # form endpoints, draft-mode handshake, revalidate webhook
  components/           # presentational + client-interactive components
  lib/
    data.ts             # data layer (Sanity fetch + auto-translate fallback)
    translation/        # translate engine: config, service, glossary, cache
    seo.ts              # metadata + JSON-LD builders
  sanity/
    schemas/            # document + object schemas (wrapped via withLanguage)
    queries.ts          # GROQ queries (all take $lang)
    actions/            # studio document actions (e.g. Vertaal van Nederlands)
    presentation/       # presentationTool resolve config
  i18n/
    config.ts           # locales, default, hasLocale
    routes.ts           # NL↔EN segment map (next.config.ts derives rewrites from this)
    dictionaries/       # non-CMS UI strings only
  proxy.ts              # locale-detection middleware (Next 16's renamed middleware export)
scripts/                # one-off migrations (above)
.translations/          # translation cache (gitignored)
```

## Changes

See [`CHANGELOG.md`](./CHANGELOG.md) for the i18n migration history and other notable changes.
