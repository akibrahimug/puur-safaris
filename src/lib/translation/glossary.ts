/**
 * Translation glossary — applied around the free Google Translate call.
 *
 * Two layers:
 *  - PHRASE_GLOSSARY: forced NL → EN translations for brand terms, idioms,
 *    and travel-vocabulary that Google translates wrongly. The NL phrase is
 *    swapped with a placeholder before sending; after translation the EN
 *    string is substituted back in.
 *  - PROTECTED_TERMS: proper nouns (place names, brand) that must round-trip
 *    unchanged. Same placeholder mechanism, but restoration uses the original
 *    matched text (preserves casing).
 *
 * Bump TRANSLATOR_VERSION whenever this file or the translation pipeline
 * changes — the cache key includes it, so old cached translations are
 * automatically invalidated.
 */

export const TRANSLATOR_VERSION = 4

/**
 * Forced phrase mappings. Order matters: list longer/more specific phrases
 * before shorter ones so they match first.
 */
export const PHRASE_GLOSSARY: Array<{ nl: RegExp; en: string }> = [
  // ─── Brand / product names ────────────────────────────────────────
  { nl: /\bEigen Reisschema\b/gi, en: 'Custom Itinerary' },
  { nl: /\bUitgelichte Reizen\b/gi, en: 'Featured Trips' },

  // ─── Travel-vocab phrases (Google literal-translates these badly) ──
  { nl: /\bsafari reizen\b/gi, en: 'safari trips' },
  { nl: /\bsafari reis\b/gi, en: 'safari trip' },
  { nl: /\balle reizen\b/gi, en: 'all trips' },
  { nl: /\bonze reizen\b/gi, en: 'our trips' },
  { nl: /\buw reis\b/gi, en: 'your trip' },
  { nl: /\bjouw reis\b/gi, en: 'your trip' },
  { nl: /\bje reis\b/gi, en: 'your trip' },
  { nl: /\bonze reis\b/gi, en: 'our trip' },
  { nl: /\buw reizen\b/gi, en: 'your trips' },
  { nl: /\beigen reis\b/gi, en: 'own trip' },
  { nl: /\bzijn reizen\b/gi, en: 'his trips' },

  // CTAs / button copy
  { nl: /\bBekijk onze reizen\b/gi, en: 'View our trips' },
  { nl: /\bBekijk alle reizen\b/gi, en: 'View all trips' },
  { nl: /\bAlle bestemmingen\b/gi, en: 'All destinations' },
  { nl: /\bMeer verhalen\b/gi, en: 'More stories' },
  { nl: /\bBoek deze reis\b/gi, en: 'Book this trip' },

  // ─── Idioms / phrases Google handles literally ─────────────────────
  { nl: /\bop maat\b/gi, en: 'tailor-made' },
  { nl: /\bvoor het leven\b/gi, en: 'for life' },
  { nl: /\bop zijn puurste\b/gi, en: 'at its purest' },
  { nl: /\bin de meest pure vorm\b/gi, en: 'in its purest form' },
  { nl: /\bin zijn pure vorm\b/gi, en: 'in its pure form' },
  { nl: /\bVeiligheid voorop\b/gi, en: 'Safety first' },
  { nl: /\bgemiddeld beoordeeld door\b/gi, en: 'average rating from' },
  { nl: /\bWij geloven in\b/gi, en: 'We believe in' },
  { nl: /\bBegin uw avontuur\b/gi, en: 'Start your adventure' },
  { nl: /\bKlaar voor uw droomsafari\b/gi, en: 'Ready for your dream safari' },
  { nl: /\bgepersonaliseerde offerte\b/gi, en: 'personalised quote' },
  { nl: /\bdroomsafari\b/gi, en: 'dream safari' },
  { nl: /\bdroomreis\b/gi, en: 'dream trip' },
  { nl: /\btevreden reizigers\b/gi, en: 'happy travellers' },

  // ─── Single words that Google routinely picks the wrong sense for ─
  // (Listed AFTER multi-word phrases to avoid premature substitution.)
  { nl: /\breisschema\b/gi, en: 'itinerary' },
  { nl: /\breizigers\b/gi, en: 'travellers' },
  { nl: /\breiziger\b/gi, en: 'traveller' },
  { nl: /\bondersteuning\b/gi, en: 'support' },
]

/**
 * Proper nouns / place names. Round-trip unchanged. Match is case-insensitive
 * but the original casing is preserved.
 *
 * Don't put words like "Oeganda" or "Afrika" here — those *should* translate
 * (→ Uganda, Africa).
 */
export const PROTECTED_TERMS: string[] = [
  // ─── Uganda parks, regions, cities ────────────────────────────────
  'Bwindi',
  'Mgahinga',
  'Queen Elizabeth',
  'Murchison Falls',
  'Lake Mburo',
  'Kibale',
  'Semuliki',
  'Kidepo',
  'Rwenzori',
  'Mount Elgon',
  'Karamoja',
  'Jinja',
  'Entebbe',
  'Kampala',
  'Ssese',
  'Lake Victoria',
  'Lake Bunyonyi',
  'Sipi Falls',
  'Bigodi',
  'Ishasha',

  // ─── Neighbouring safari destinations ─────────────────────────────
  'Serengeti',
  'Ngorongoro',
  'Tarangire',
  'Lake Manyara',
  'Zanzibar',
  'Kilimanjaro',
  'Maasai Mara',
  'Amboseli',
  'Tsavo',

  // ─── Brand ────────────────────────────────────────────────────────
  'Puur Uganda Reizen',
  'Pure Uganda Safaris',
]

/**
 * Mirror the case style of `source` onto `target`.
 *
 * - "ALL CAPS"      → uppercase target
 * - "Title Case"    → capitalize each word of target
 * - "Sentence case" → capitalize first letter of target
 * - lowercase       → leave target unchanged
 *
 * Word boundary is whitespace; punctuation stays attached to the preceding word.
 */
function matchCase(source: string, target: string): string {
  if (!source || !target) return target

  const isLetter = (ch: string) => ch !== '' && ch.toUpperCase() !== ch.toLowerCase()

  if (source === source.toUpperCase() && /[A-Za-zÀ-ÿ]/.test(source)) {
    return target.toUpperCase()
  }

  const sourceWords = source.split(/\s+/).filter(Boolean)
  const titleCase = sourceWords.length > 1 && sourceWords.every((w) => isLetter(w[0]) && w[0] === w[0].toUpperCase())
  if (titleCase) {
    return target
      .split(/\s+/)
      .map((w) => (isLetter(w[0]) ? w[0].toUpperCase() + w.slice(1) : w))
      .join(' ')
  }

  const first = source.charAt(0)
  if (isLetter(first) && first === first.toUpperCase()) {
    const tFirst = target.charAt(0)
    if (isLetter(tFirst)) {
      return tFirst.toUpperCase() + target.slice(1)
    }
  }

  return target
}

/**
 * Apply forced phrase swaps + protect terms with placeholders.
 * Returns the placeholder-laced text plus the restoration map.
 *
 * Placeholders use a `Zg<index>Zg` pattern — alphanumeric so Google won't
 * butcher them, uppercase Z prefix so they stand out as opaque tokens, and
 * `g` for "gloss" so collisions with real content are vanishingly unlikely.
 */
export function applyGlossary(text: string): { text: string; restorations: Map<string, string> } {
  if (!text) return { text, restorations: new Map() }

  const restorations = new Map<string, string>()
  let counter = 0
  const placeholder = () => `Zg${counter++}Zg`
  let result = text

  // 1. Forced phrase translations — replace with placeholder mapped to EN.
  // Preserve case from the NL match: ALL CAPS, Title Case, or sentence-case
  // each propagate to the EN replacement.
  for (const { nl, en } of PHRASE_GLOSSARY) {
    result = result.replace(nl, (match) => {
      const ph = placeholder()
      restorations.set(ph, matchCase(match, en))
      return ph
    })
  }

  // 2. Protected proper nouns — replace with placeholder mapped to original.
  for (const term of PROTECTED_TERMS) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi')
    result = result.replace(regex, (match) => {
      const ph = placeholder()
      restorations.set(ph, match)
      return ph
    })
  }

  return { text: result, restorations }
}

/**
 * Restore placeholders to their EN values after Google translation.
 * Tolerates Google adding/removing whitespace around the placeholder.
 */
export function restoreGlossary(translated: string, restorations: Map<string, string>): string {
  if (!translated || restorations.size === 0) return translated
  let result = translated
  for (const [placeholder, original] of restorations) {
    // Match the placeholder with any case (Google sometimes lowercases)
    const regex = new RegExp(placeholder, 'gi')
    result = result.replace(regex, original)
  }
  return result
}
