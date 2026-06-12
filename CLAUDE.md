@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Next.js dev server (includes `/studio` Sanity embed at `/studio`). **Triggers `predev` first** (`vitest run && tsc --noEmit`); won't start if either fails.
- `npm run build` / `npm run start` — production build / serve. **Triggers `prebuild` first** (`vitest run && tsc --noEmit`); a broken unit test or type error blocks the build. E2E runs in GitHub Actions (`.github/workflows/e2e.yml`) on every PR and push to `master`, not in the build, so Vercel deploys aren't gated on browser binaries.
- `npm run lint` — ESLint (`eslint-config-next` v16, flat config in `eslint.config.mjs`)
- `npm run tsc:check` — `tsc --noEmit`. Other `tsc:*` aliases all resolve to the same thing.
- `npm run test` — Vitest (jsdom env, `src/**/*.test.{ts,tsx}`)
  - Single file: `npx vitest run src/lib/utils.test.ts`
  - `test:watch`, `test:ui`, `test:coverage` also available
- `npm run test:e2e` — Playwright (`e2e/**/*.spec.ts`). Auto-starts a dev server on port 3000 (`reuseExistingServer` locally). Use `test:e2e:ui` for the inspector.
- `npm run verify:fast` — vitest + tsc. Used by `predev` and the pre-commit hook.
- `npm run verify:all` — vitest + tsc + e2e. Local-only full gate (mirrors what GitHub Actions runs); `prebuild` only runs `verify:fast` since e2e moved to CI.

### Pre-commit hook (husky)

`.husky/pre-commit` runs `verify:fast` (vitest + tsc) before every commit. Husky is installed via the `prepare` npm script so the hook is portable — fresh `npm install` on a new machine wires it up automatically. **Do not bypass with `--no-verify`** (per the project memory rule); fix the failure instead. E2E is intentionally NOT in pre-commit because the ~20s overhead would punish every commit; it runs in GitHub Actions on every PR and push to `master` (`.github/workflows/e2e.yml`).

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

- **`src/proxy.ts`** is Next.js 16's renamed middleware (exported as `proxy`, not `middleware`). For an unprefixed request it picks a locale by priority **saved choice cookie → country (geo) → Accept-Language → EN**, then redirects `/foo` → `/{locale}/foo`. **Geo is mostly authoritative**: anyone physically in a Dutch-dominant country (NL, SR, AW, CW, SX, BQ — the `DUTCH_SPEAKING_COUNTRIES` set) gets `/nl` *even if their browser/OS is set to English* (very common in NL). **Belgium (BE) is deliberately excluded** — it's bilingual (Flemish Dutch + French Wallonia), so it falls back to Accept-Language (Flemish browser → `/nl`, French/English → `/en`) via the `BROWSER_LANGUAGE_COUNTRIES` set. Every other identified country gets `/en`. The country comes from Vercel's `x-vercel-ip-country` header (the same value `@vercel/functions`' `geolocation()` reads; `request.geo` was removed in Next 15). When that header is absent — local dev, non-Vercel host — the proxy degrades to ranked Accept-Language (NL only when explicitly preferred), then EN. **`puur_locale` choice cookie** (set by `<CountryBanner>`, 1-year) records an explicit user decision and **wins over geo** on these redirects so a visitor is never auto-routed away from the locale they picked. The legacy sticky `NEXT_LOCALE` cookie is gone (it latched onto whatever URL the visitor accidentally landed on); the proxy actively clears any it still sees. `defaultLocale` in `src/i18n/config.ts` stays `nl` because it's the editorial source of truth used by data/SEO.
  - **Header forwarding gotcha**: the proxy passes `x-locale` (→ root layout `<html lang>`) and `x-locale-banner` (→ `<CountryBanner>` decision) to Server Components. These **must** be set on the *request* via `NextResponse.next({ request: { headers } })`, not `response.headers.set(...)` — RSC `headers()` only sees request headers. (An earlier version set `x-locale` on the response, so `<html lang>` silently always fell back to `defaultLocale`.)
- **Browser auto-translation is disabled** — `<html translate="no">` + `<meta name="google" content="notranslate">` in `src/app/layout.tsx`. We ship first-class authored translations for both locales, so the browser's "Translate this page?" only ever *degraded* the experience (e.g. an English-browser visitor on `/nl` getting a machine translation layered over authored Dutch). `<html lang={lang}>` (from the proxy's `x-locale` header) still declares the source language for accessibility/SEO. Cross-locale switching is offered by `<CountryBanner>` instead, so a visitor on the "wrong" locale is never trapped. `suppressHydrationWarning` on `<html>`/`<body>` plus `<SuppressHydrationWarnings />` (dev-only console filter) stay because Sanity stega + visual-editing still perturb the DOM during hydration. (If a future requirement needs machine translation back as a fallback, remove `translate="no"` and the meta — but then expect Dutch on `/nl` to be re-translated for non-Dutch browsers.)
- **`<CountryBanner />` (top-of-page, `src/components/shared/country-banner.tsx`)** suggests the other locale when a visitor is on the "wrong" one for their preference — a non-Dutch visitor who followed a link to `/nl`, a Dutch visitor on `/en`, or anyone who navigated back to the locale they didn't pick. **The proxy makes the decision** and forwards the target locale via the `x-locale-banner` request header (empty = no banner); the `(site)` layout reads it (`headers()`) and renders the banner with that `targetLocale`. The decision is `preferred !== pathLocale` where **`preferred = puur_locale cookie ?? geo/Accept-Language`** — so the banner also **re-appears when someone returns to the wrong locale after choosing**, instead of silently doing nothing. The banner records the decision: **Switch** saves the *target* locale and full-navigates to the authored alternate (same-origin path via `localeAlternatePath`); **Dismiss** saves the *current* locale ("I'll stay here"). Both write the year-long `puur_locale` cookie — which the proxy honors on `/` redirects and which stops the banner nagging *on the chosen locale* (the matching-locale case yields no banner). CTA + message are shown in the *target* language; the two-locale copy set is a constant in the component, not the dictionary.
- **`<LanguageToggle />` (next to `<ThemeToggle>` in the header, `src/components/ui/language-toggle.tsx`)** is an always-available manual locale switch (shows the *other* locale's code, e.g. "EN" on `/nl`). It navigates to the same-origin authored alternate via `localeAlternatePath` but **deliberately does NOT set the `puur_locale` cookie** — it's a "view the other market now" action, not a saved preference, so the `<CountryBanner>` still appears on the locale you switch to (offering to go back). Solid green (`bg-gold`) button; the theme toggle keeps its bordered transparent style (only the language toggle is green). **`localeAlternatePath` (`src/lib/locale-alternate.ts`)** is the shared helper both the banner and toggle use: it reads the `hreflang` alternate and keeps only path+query+hash so a switch can never bounce the visitor to the absolute host baked into the tag (`getBaseUrl()` falls back to `http://localhost:3000`).
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
- `POST /api/booking`, `/api/blog/submit`, `/api/contact` — public form endpoints. **Rate-limited via `rateLimit({ endpoint, ip, limit, windowMs })` from `src/lib/rate-limit.ts`** (in-memory token bucket keyed by IP from `x-forwarded-for`). Per-route limits live at the top of each handler — current values: contact 5/min, booking 3/min, blog-submit 3/min. Returns 429 + `Retry-After` header when exceeded. Buckets are in-process so they reset on deploy and don't coordinate across instances; if we ever scale horizontally swap the `Map` for an Upstash/Redis store with the same `RateLimitResult` shape. **`/api/contact` also has a honeypot field** (`referralSource` in the schema; `<input type="text" tabIndex={-1}>` hidden via off-screen positioning in the form): non-empty values silently return 200 without sending email so bots don't learn they've been filtered. **The field is deliberately NOT named `website`/`url` and carries the `data-1p-ignore` / `data-lpignore` / `data-form-type="other"` attributes** — browser address-autofill and password managers fill a `website`-named field by keyword even when it's off-screen, which silently dropped real visitors' submissions (success shown, no email sent). Keep any honeypot autofill-invisible: neutral name + those opt-out attrs.
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

- **Dutch is the user-visible source language for content**: API error strings and the public-facing copy on `/nl` are Dutch. NL content in CMS docs is the source of truth — don't translate it.
- **Studio field labels are Dutch by default and swap to English when the doc is `language: "en"`.** Schemas (`src/sanity/schemas/**`) keep their Dutch `title:` / `description:` strings — that's the source of truth. When an EN-tagged document is opened, `src/sanity/components/LocalizedField.tsx` (wired via `form.components.field` in `sanity.config.ts`) reads the document's `language` via `useFormValue([])` and looks up each field's *current Dutch title and description text* in `src/sanity/i18n/english-labels.ts`. The map is keyed by the **Dutch source string itself** (e.g. `'Hero Afbeelding': 'Hero Image'`), so coverage is universal — every Dutch label that exists in the labels file gets translated regardless of which schema or how deeply nested. **Critical detail**: Sanity v5's `BaseFieldProps` exposes `title` and `description` as top-level props on `FieldProps` — NOT inside `schemaType`. Earlier attempts overrode `props.schemaType.title` and silently did nothing because the form renderer reads `props.title` directly. `LocalizedField` overrides both the top-level props and clones `schemaType` for any downstream code that reads it. **To regenerate `englishLabels`** after schema edits, run `npx tsx scripts/_generate-english-labels.ts` — it scans every schema file, runs new strings through the translation pipeline (Google + glossary), and preserves any manual translation tweaks already in the file. Group/tab titles and dropdown option titles stay Dutch (Sanity v5 has no `components` hook for those). The studio chrome in `sanity.config.ts` (structure list titles, singleton entries, delete action labels) is Dutch only; that doesn't switch.
- **CMS is the source for visible copy**, not dictionaries. The dictionary is only for non-CMS UI (forms, validation, common labels). Don't reintroduce `cms ?? dict ?? 'literal'` cascades — they're the cause of EN/NL drift.
- `cmsText()` in `src/i18n/config.ts` is deprecated — the data layer does translation. Don't reach for it in new code.
- **Label helpers in `src/lib/utils.ts` are locale-aware.** `categoryLabel`, `difficultyLabel`, `blogCategoryLabel`, `faqCategoryLabel` take signature `(key, locale = 'nl', cats?)`. They look up `cats[key]` first (when a dict is passed), then fall back to a per-locale default map (`{ nl: {...}, en: {...} }`), then the raw key. Always pass `locale` at call sites — without it, EN pages render Dutch fallbacks (`Combinatiereis` instead of `Combination Trip`, `Uitdagend` instead of `Challenging`). Card components (`SafariCard`, `BlogCard`) already accept a `locale` prop and thread it through; new components should do the same. Same goes for `formatDate(date, locale)` and `formatPrice(price, locale)` — pass locale or the `nl-NL` formatter is used.
- **Breadcrumb labels for listing pages come from CMS, not the dictionary.** The `safari` / `destinations` / `blog` listing label was previously read from `dict.safari.heroTitle` (which doesn't exist — caused a 500 on the safari detail page). Fetch the listing-page document (e.g. `getSafariListingPage(lang)`) and use its `heroTitle` for the breadcrumb crumb. There is no `dict.safari` / `dict.destinations` / etc. namespace and there shouldn't be — those labels are CMS-owned per the no-dictionary-cascade rule.
- **Header chrome aria-labels are locale-aware** via `dict.header.{menuLabel, menuCloseLabel, themeToLightLabel, themeToDarkLabel}`. The `<Header>` accepts a `labels` prop (passed from `[lang]/(site)/layout.tsx` as `dict.header`) and forwards them to `<ThemeToggle labels={...}>` and the mobile-menu button. Don't reintroduce hardcoded Dutch aria-labels (`"Schakel naar donkere modus"`, `"Menu sluiten"`) directly in client components — they leak into the EN screen-reader experience.
- **Form helper labels (`(optioneel)` / `(optional)`) are dictionary-driven.** Forms that aren't fully CMS-backed (`contact-form.tsx`, `booking-form.tsx`) read `d?.optionalLabel` (and `d?.confidentialOptionalLabel` where applicable). The dict keys live under `contact.form` and `booking` in `src/i18n/dictionaries/{nl,en}.json`. Don't inline the literal `(optioneel)` — it'll show up untranslated on `/en`.
- **Mobile menu is a fixed full-viewport panel below the header**, not an auto-height dropdown. The panel uses a solid background (`bg-ink` dark / `bg-[#f7faf8]` light) — not the `glass-*` classes — because translucent + auto-height let the page content show through and looked broken. The backdrop dim is `bg-black/55 backdrop-blur-sm` (anything weaker doesn't visually separate the menu from the hero behind it). If you change the menu's height/positioning, keep both invariants: solid panel + strong dim.
- **Adding a new localized route**: edit `routeMap` in `src/i18n/routes.ts`. `next.config.ts` rewrites are derived automatically via `getNlRewrites()`. Don't hand-edit the rewrites array.
- **Adding a new translatable doc type**: (1) wrap the schema with `withLanguage(...)` in `src/sanity/schemas/index.ts`, (2) add the type name to `TRANSLATABLE_TYPES` in `sanity.config.ts` so the i18n plugin attaches the Translations panel, (3) add it to `translatableFields` in `src/lib/translation/config.ts` so the auto-translate fallback knows which fields to translate. Run `scripts/backfill-language-nl.ts` to tag any existing docs with `language: "nl"`. Optionally run `scripts/seed-en-translations.ts --run` to create EN draft siblings for every NL doc, then `scripts/publish-en-drafts.ts --run` to promote them, then `scripts/retranslate-en-docs.ts --run` to repair any docs Google rate-limited during the seed.
- **Sanity client perspective gotcha**: scripts that need to see drafts (publish, retranslate, etc.) must create the client with `perspective: 'raw'`. The default perspective is `published`, which silently hides every `drafts.*` doc from `client.fetch` — your script will report "0 drafts" and exit clean, while the studio still shows them all. If a script's count disagrees with what you see in studio, this is the first thing to check.
- **Don't auto-publish editor drafts**: the backfill script uses `setIfMissing` and patches existing drafts in place — content other than the language field is preserved exactly. If a doc has an active draft (in-progress editor work), patching adds the language field to that draft without publishing it.
- Scripts in `scripts/` (`migrate-images.ts`, `seed-scraped-data.ts`, `backfill-language-nl.ts`, `seed-en-translations.ts`, `publish-en-drafts.ts`, `retranslate-en-docs.ts`) are one-off migrations; run with `npx tsx scripts/<file>` as needed, not via a package script.
- **Sanity images via `sanityImageUrl()` only.** `next/Image` `src` props must use `sanityImageUrl(image, maxWidth)` from `src/sanity/image.ts`, never the raw `image.asset.url`. The raw URL points at the original upload (often 6000×4000+ PNGs, ~30 MB), and `next/Image`'s optimizer times out trying to download and resize them — `/_next/image?url=…` returns 500 with a `TimeoutError`. `sanityImageUrl` runs `urlFor(...).width(maxWidth).auto('format').url()`, which makes Sanity's CDN serve a pre-sized WebP/AVIF that Next can finish optimizing in milliseconds. Pick a `maxWidth` based on context: `2560` for full-bleed heroes, `1600`–`2000` for large gallery images, `1080` for cards, `600` for thumbnails, `200` for avatars. The OG-image path in `src/lib/seo.ts` keeps `asset.url` because metadata renderers read it directly without going through `next/Image`.
