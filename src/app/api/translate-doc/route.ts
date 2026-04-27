/**
 * POST /api/translate-doc
 *
 * Body: { docType: string, fields: Record<string, unknown>, targetLang?: string }
 *
 * Runs the doc's content through the existing auto-translate pipeline
 * (`src/lib/translation/service.ts`, with glossary protection) and returns
 * only the fields that changed. Does NOT write to Sanity — the studio
 * action that calls this endpoint applies the patch using the editor's
 * own session, so this route stays a pure translation utility.
 *
 * Same-origin POST only; no auth header required because no mutations
 * happen here. The Google Translate backend is free and rate-limited;
 * worst-case abuse is throttling, not data loss.
 */

import { NextResponse } from 'next/server'
import { translatableFields } from '@/lib/translation/config'
import { translateDocument } from '@/lib/translation/service'

const DEFAULT_TARGET = 'en'

export async function POST(req: Request) {
  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const body = payload as {
    docType?: string
    fields?: Record<string, unknown>
    targetLang?: string
  }

  const docType = typeof body.docType === 'string' ? body.docType : null
  const fields = body.fields && typeof body.fields === 'object' ? body.fields : null
  const targetLang = typeof body.targetLang === 'string' ? body.targetLang : DEFAULT_TARGET

  if (!docType) return NextResponse.json({ error: 'docType is required' }, { status: 400 })
  if (!fields) return NextResponse.json({ error: 'fields object is required' }, { status: 400 })

  const fieldConfig = translatableFields[docType]
  if (!fieldConfig) {
    return NextResponse.json({ error: `Unknown docType: ${docType}` }, { status: 400 })
  }

  if (targetLang === 'nl') {
    // No-op: NL is the source. Don't pretend we translated anything.
    return NextResponse.json({ ok: true, fields: {} })
  }

  try {
    const translated = await translateDocument(fields, fieldConfig, targetLang)

    // Return only fields that actually changed. Primitives compare by value;
    // nested objects/arrays that translateDocument touched will have new
    // references. Untranslated fields land on the same reference and are
    // skipped, so the studio patch doesn't clobber editor edits in fields
    // we didn't translate.
    const changed: Record<string, unknown> = {}
    for (const key of Object.keys(translated)) {
      if (translated[key] !== fields[key]) {
        changed[key] = translated[key]
      }
    }

    return NextResponse.json({ ok: true, fields: changed })
  } catch (err) {
    console.error('[translate-doc] failed:', err)
    return NextResponse.json(
      { error: 'Translation failed', detail: (err as Error).message },
      { status: 500 },
    )
  }
}
