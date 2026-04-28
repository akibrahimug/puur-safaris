# Changelog

Notable changes to the Puur Uganda Reizen / Pure Uganda Safaris site. Newest entries first.

## 2026-04-28 — Routing no longer sticks visitors on the wrong locale, studio UI English-ised, EN docs published, repair tooling

### Locale routing: dropped sticky cookie

**Symptom**: a UK visitor landing on `/` was being redirected to `/nl` despite an `Accept-Language: en-GB` header that should have routed them to `/en`.

**Cause**: the proxy used to set a 1-year sticky `NEXT_LOCALE` cookie on every locale-prefixed visit. Anyone who ever touched a `/nl/...` URL (a shared link, an old bookmark, a test during development) had their browser-language preference silently overridden for a year. The cookie was added so locale "remembered itself" without a UI switcher, but in practice it just latched onto accidental URLs.

**Fix** (`src/proxy.ts`):
- `getPreferredLocale` now uses Accept-Language only. Cookie is gone from the priority list.
- Both the locale-prefixed branch and the redirect branch actively `cookies.delete(LOCALE_COOKIE)` so old visitors get unstuck on their next visit instead of waiting out the cookie's expiry.
- NL is still shown only when the browser explicitly prefers Dutch (e.g. `nl,en;q=0.5`); everyone else (English, German, French, anything else) lands on `/en`.

If you still see `/nl` after this change, you have a stale cookie — clear it once via DevTools → Application → Cookies, or wait for one more page load (the proxy will delete it automatically the next time it sees you).



### Studio editor UI translated to English

Every editor-facing label across the schemas and the studio config is now English. This includes:

- **Schemas** (`src/sanity/schemas/**`): every `title:` / `description:` / group label / dropdown option title / `prepare()` status label across all 19 documents (`home-page`, `about-page`, `safari`, `destination`, `blog-post`, `site-settings`, `contact-page`, `legal-page`, all `*-page` singletons, `booking`, `testimonial`, `google-review`, `faq`) plus the three objects (`itinerary-day`, `gallery-image`, `seo-fields`).
- **Studio config** (`sanity.config.ts`): structure list titles ("Content Management", "Safari Trips", "Destinations", "Bookings", etc.), singleton page list entries ("Contact Page", "FAQ Page", etc.), the studio title ("Pure Uganda Safaris Studio"), and the custom delete action's confirmation dialog ("Delete safari trip" / "Are you sure you want to permanently delete this…").

This is editor-facing only — it does not affect the public-facing copy on `/nl` or `/en`, which comes from CMS document content (still in NL on `/nl`, translated/CMS-authored on `/en`). The change makes the studio editing UI consistent for the English-speaking editorial team.

The hidden `language: "Taal"` field added by `withLanguage()` keeps its Dutch label since the field is hidden + readOnly anyway. The plugin's own dropdown labels ("Nederlands" / "English") are also unchanged because the supported-languages array uses native-language names by convention.

### EN docs are now published

Ran `scripts/publish-en-drafts.ts --run` — promoted all 56 EN drafts to published. The data layer now hits step 1 of `fetchAndTranslate` (`fetch where language == "en"`) and returns the EN doc directly. The auto-translate fallback path is reserved for future docs that haven't been authored in EN yet. Click-to-edit on `/en` works end-to-end because the EN doc strings carry stega encoding.

### Silent translation failure repaired

The first `seed-en-translations` run silently caught a Google Translate rate-limit on the homePage doc and wrote NL strings into the EN doc (the homePage was the only casualty). `scripts/retranslate-en-docs.ts --run` walks every published EN doc, looks up its NL sibling, and patches only fields that come back changed from a fresh translate. Documented in CLAUDE.md as the standard step after any bulk seed.

### Sanity client perspective gotcha

`@sanity/client` defaults to `perspective: 'published'`, which silently filters out every `drafts.*` doc from `client.fetch`. The first version of `publish-en-drafts.ts` reported "0 drafts" with 56 actually present. Scripts that need to see drafts must opt in with `perspective: 'raw'`. Documented in CLAUDE.md.

## 2026-04-27 — Bilingual content shipped end-to-end

The full NL/EN parallel-document migration is complete. `/en` now serves real CMS content, identical layout to `/nl`, with the auto-translate path reserved as a fallback for newly-authored NL docs that don't have an EN sibling yet.

### What changed in this batch

- **All 56 translatable docs** (trip, destination, blogPost, faqItem, all `*Page` singletons, `siteSettings`, `legalPage`) now have a published EN sibling linked to the NL source via `translation.metadata`.
- **`/en` serves CMS content directly.** The data layer's auto-translate fallback path no longer fires for these docs — `fetchAndTranslate` returns the EN sibling on the first hit. Stega encoding works on `/en`, so visual-editor click-to-edit is functional.
- **Style parity.** Because `/en` and `/nl` now share the same render path (no fallback shape mismatch), layout is byte-identical apart from the translated strings.

### New migration scripts

| Script | What it does | When to run |
| --- | --- | --- |
| `scripts/seed-en-translations.ts --run` | Creates EN draft siblings for every NL doc, populates via auto-translate, links the pair in `translation.metadata`. Idempotent. | Once, when introducing a new translatable doc type or onboarding fresh content. |
| `scripts/publish-en-drafts.ts --run` | Promotes every EN draft to published in a single `transaction.createOrReplace + delete(draftId)` per doc. Uses `perspective: 'raw'` so the client can see drafts. | After `seed-en-translations`, once you're satisfied with the auto-translations. |
| `scripts/retranslate-en-docs.ts --run` | Walks every published EN doc, re-runs translation from its NL sibling, patches only fields whose value differs. Default mode uses a Dutch-content heuristic; `--all` re-checks every doc. | After any bulk seed (silent translation failures land in CMS as NL content), or any time NL is edited and the EN sibling needs to follow. |

### Bug fixed during this batch — homePage was Dutch on `/en`

The first run of `seed-en-translations.ts` left the homePage with all-Dutch content (`heroHeadline: "Ontdek Uganda"`, `featuredTripsTitle: "Safari Reizen"`, etc.) despite every other doc translating cleanly. Root cause: Google Translate rate-limited that one document mid-run; `translateTexts` catches the error and returns the originals, so the failure was invisible until a visitor noticed `/en` looked Dutch. Fixed by `retranslate-en-docs.ts`. The silent-failure caveat is now documented in CLAUDE.md and is the reason `retranslate` is part of the standard bulk workflow.

### Sanity client perspective gotcha

The first version of `publish-en-drafts.ts` reported "0 drafts" and exited clean even though 56 EN drafts existed. Root cause: `@sanity/client` defaults to `perspective: 'published'`, which silently filters out every `drafts.*` doc. Scripts that need to see drafts must opt in with `perspective: 'raw'`. Documented in CLAUDE.md.

---

## 2026-04 — i18n architecture rewrite

The lead-up to today: rebuilding translation from a 3-level cascade (`cms ?? dict ?? "literal"`) to a single CMS-driven stream with auto-translate as a graceful fallback.

### Routing

- `src/proxy.ts` (Next 16's renamed middleware) now decides locale from sticky cookie → ranked `Accept-Language` → **EN fallback**. NL is shown only when the browser explicitly prefers Dutch. No UI language switcher.
- Sticky cookie: visiting any locale-prefixed URL writes that locale to `NEXT_LOCALE`, so the choice persists across sessions.
- `<html translate="no">` + `notranslate` class + `<meta name="google" content="notranslate">` opts the page out of Chrome/Edge/Safari auto-translation, which was rewriting `/nl` DOM nodes and breaking hydration.
- `src/i18n/routes.ts` is the single source of truth for the NL↔EN segment map; `next.config.ts` derives its `rewrites()` array from `getNlRewrites()`. Adding a localized route is a one-place edit.
- `cmsPathToLocale` preserves query strings and hash fragments so filter URLs round-trip correctly.

### Translation system

- Adopted `@sanity/document-internationalization` v6 — every translatable type (16 in total) has a `language` field and a Translations panel in studio.
- `src/sanity/schemas/with-language.ts` exposes a `withLanguage()` wrapper that appends a hidden + readOnly `language` field to a schema. Without this, the studio shows "Unknown field" warnings on every translatable doc.
- Custom `Vertaal van Nederlands` document action (`src/sanity/actions/translate-from-nl.tsx`) — visible only on EN docs; POSTs the doc body to `/api/translate-doc` and patches the returned EN fields back as draft changes. Editor reviews and publishes when satisfied.
- Auto-translate engine (`src/lib/translation/`) uses `google-translate-api-x` with no API key. Forced phrase mappings + protected proper nouns live in `glossary.ts`; case is mirrored on restore. Bump `TRANSLATOR_VERSION` whenever the glossary or pipeline changes — the cache filename includes it, so prior translations auto-invalidate.
- Cache (`.translations/`, gitignored) is keyed by `{docId, lang, translatorVersion}` and includes the source `_rev`, so editor patches invalidate the entry automatically.

### CMS-only content stream

- Removed every `homePage?.x ?? d?.y ?? "literal"` cascade across pages and components. CMS is now the only source for page-visible copy. Empty CMS field → empty render (a deliberate signal to fill the CMS).
- Trimmed ~140 orphan dictionary keys that were duplicating CMS content in the cascade.
- `cmsText()` in `src/i18n/config.ts` is deprecated.

### Studio polish

- Singleton page docs use `documentTypeList` so both NL and EN siblings are visible side by side; templates filter and document-action filter still prevent accidental third-doc creation.
- Stega-clean nav labels (header nav, footer columns, header CTA, footer privacy/terms) — without this, clicking a nav link in the visual-editor preview opened the source document instead of navigating.
- `presentationTool` resolve reads each doc's `language` field and routes the preview iframe to the locale-matching public URL.

### SEO

- `src/lib/seo.ts` builds `Metadata` and JSON-LD blocks from `siteSettings` + page `seo` fields. `BuildMetadataOptions.title` is optional; falls back to `siteSettings.defaultSeoTitle` then to `siteName`.

### Deprecated and removed

- Removed the "Authentic Safari Experiences" hero eyebrow component (CMS field, type, and dataset references all gone).
- Removed `cmsText()` callsites — the data layer does translation now.
- Removed unused `getDictionary` imports from blog/destination/safari pages after the cascade collapse.
