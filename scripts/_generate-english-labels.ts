/**
 * Walks every schema file under `src/sanity/schemas/` and extracts every
 * single-line string literal used as a `title:` or `description:` value.
 * Translates the Dutch text to English (via the same Google + glossary
 * pipeline the public site uses) and writes the lookup to
 * `src/sanity/i18n/english-labels.ts`.
 *
 * The map is keyed by the **Dutch source string** itself, not by field
 * name. This is robust: every occurrence of "Hero Afbeelding" anywhere in
 * any schema becomes "Hero Image", regardless of how the field was named
 * or which schema it lives in.
 *
 * To regenerate after schema edits:
 *   npx tsx scripts/_generate-english-labels.ts
 *
 * The script preserves any existing entry it finds in the labels file, so
 * manual translation tweaks are safe — to force a re-translation of one
 * entry, delete it before re-running.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import translate from 'google-translate-api-x'
import { applyGlossary, restoreGlossary } from '../src/lib/translation/glossary'

const SCHEMA_ROOT = join(process.cwd(), 'src/sanity/schemas')
const LABELS_FILE = join(process.cwd(), 'src/sanity/i18n/english-labels.ts')

// ─── Step 1: collect every distinct Dutch title/description string ──

function walk(dir: string, files: string[] = []): string[] {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) walk(p, files)
    else if (p.endsWith('.ts') && !p.endsWith('with-language.ts')) files.push(p)
  }
  return files
}

function extractStrings(file: string): Set<string> {
  const text = readFileSync(file, 'utf8')
  const out = new Set<string>()

  // Single-quoted, double-quoted, or template-literal `title: '…'` and
  // `description: '…'`. We deliberately ignore multi-line/template strings
  // with interpolation — those are rare for static labels.
  const re = /(?:title|description):\s*(['"`])((?:\\.|(?!\1).)+)\1/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    const value = m[2].replace(/\\'/g, "'").replace(/\\"/g, '"')
    if (!value || !value.trim()) continue
    if (value === 'string' || value === 'number' || value === 'boolean') continue
    out.add(value)
  }
  return out
}

function looksEnglishOrBrand(s: string): boolean {
  // Skip terms that don't need translating: pure ASCII single words that
  // look English already (Hero, SEO, CTA, Wildlife, Heart, Map, etc.) or
  // technical/brand markers we don't want to translate.
  const trimmed = s.trim()
  if (/^(SEO|CTA|URL|FAQ|WhatsApp|Instagram|Facebook|YouTube|Google|Hero|Wildlife|Trust Strip|Open Graph|Tagline|Bio|Logo|H2|H3|Quote|Italic|Bold|Underline|Bullet|EUR|YYYY|MM|DD|Map|Heart|Shield|Users|Star|Globe|Compass|Award|Camera|Plane|Coffee|Mountain|Sun|Calendar|Clock|Phone|Mail|Home|Tag|Book|Eye|Heart|TrendingUp|Briefcase|Smile|HandHeart|Leaf|Sparkles|Tree|TreePine|Trees|Anchor|Tent|Bus|Car|Motor|Bike|Backpack|Headphones|Music|Image|Video)$/.test(trimmed)) {
    return true
  }
  return false
}

// ─── Step 2: translate batch ──────────────────────────────────────────

async function translateOne(text: string): Promise<string> {
  if (!text.trim()) return text
  const { text: prepped, restorations } = applyGlossary(text)
  try {
    const res = await translate(prepped, { from: 'nl', to: 'en' })
    const translated = Array.isArray(res) ? res[0]?.text : res?.text
    return restoreGlossary(translated ?? prepped, restorations)
  } catch (err) {
    console.error(`  ! translation failed for "${text}":`, (err as Error).message)
    return text
  }
}

// ─── Step 3: read existing labels file (preserve manual overrides) ────

function readExistingMap(): Map<string, string> {
  try {
    const raw = readFileSync(LABELS_FILE, 'utf8')
    const map = new Map<string, string>()
    // Match `'dutch text': 'english text',`
    const re = /['"`]((?:\\.|[^'"`])+?)['"`]:\s*['"`]((?:\\.|[^'"`])+?)['"`]\s*,?/g
    let m: RegExpExecArray | null
    while ((m = re.exec(raw)) !== null) {
      const k = m[1].replace(/\\'/g, "'").replace(/\\"/g, '"')
      const v = m[2].replace(/\\'/g, "'").replace(/\\"/g, '"')
      map.set(k, v)
    }
    return map
  } catch {
    return new Map()
  }
}

function escape(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

async function main() {
  console.log(`Scanning ${SCHEMA_ROOT}…`)
  const files = walk(SCHEMA_ROOT)
  const allStrings = new Set<string>()
  for (const f of files) {
    for (const s of extractStrings(f)) allStrings.add(s)
  }
  console.log(`Found ${allStrings.size} distinct Dutch title/description strings.`)

  const existing = readExistingMap()
  console.log(`Existing labels file has ${existing.size} entries.`)

  const result = new Map<string, string>()
  let translated = 0
  let kept = 0
  let skipped = 0

  for (const dutch of allStrings) {
    if (looksEnglishOrBrand(dutch)) {
      // No translation needed; pass-through is identity.
      result.set(dutch, dutch)
      skipped++
      continue
    }
    const had = existing.get(dutch)
    if (had) {
      result.set(dutch, had)
      kept++
      continue
    }
    const en = await translateOne(dutch)
    result.set(dutch, en)
    translated++
    if (translated % 25 === 0) console.log(`  …${translated} translated`)
    await new Promise((r) => setTimeout(r, 80))
  }

  console.log(`Result — translated ${translated}, kept ${kept}, skipped ${skipped}.`)

  // ─── Step 4: write file ────────────────────────────────────────────

  const banner = `/**
 * English overrides for schema field titles and descriptions.
 *
 * Auto-generated by \`scripts/_generate-english-labels.ts\`. Keys are the
 * **Dutch source strings** as they appear in the schemas; values are the
 * English translations. Used by \`src/sanity/components/LocalizedField.tsx\`,
 * which looks up each field's current title/description in this map and
 * swaps them when the editor opens a \`language: "en"\` document.
 *
 * To regenerate after schema edits:
 *   npx tsx scripts/_generate-english-labels.ts
 *
 * The generator preserves any existing entry it finds in this file, so manual
 * tweaks survive regeneration. Delete an entry before regenerating to force
 * a re-translation.
 */

export const englishLabels: Record<string, string> = {
`

  const lines: string[] = []
  for (const [dutch, english] of [...result.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    lines.push(`  '${escape(dutch)}': '${escape(english)}',`)
  }

  writeFileSync(LABELS_FILE, banner + lines.join('\n') + '\n}\n', 'utf8')
  console.log(`Wrote ${result.size} entries to ${LABELS_FILE}.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
