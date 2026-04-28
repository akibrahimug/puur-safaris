/**
 * Form field wrapper that swaps a field's `title` and `description` to English
 * when editing a `language: "en"` document.
 *
 * Wired in `sanity.config.ts` via `form.components.field`. Schemas are
 * authored in Dutch (the source of truth). When an EN-tagged document is
 * opened, this component looks up each field's *current Dutch title and
 * description text* in `src/sanity/i18n/english-labels.ts` and swaps them.
 * The map is keyed by the Dutch source string itself, so coverage is
 * universal: every Dutch label that exists in the labels file gets
 * translated, regardless of which schema the field belongs to.
 *
 * **Critical detail.** Sanity v5's `BaseFieldProps` exposes `title` and
 * `description` as **top-level props on FieldProps** — NOT inside
 * `schemaType`. The renderer reads `props.title` directly. Earlier versions
 * of this component overrode `props.schemaType.title` and silently did
 * nothing because the renderer never looked there. This version overrides
 * the top-level props (where the render reads from) and clones `schemaType`
 * for any downstream code that reads it.
 *
 * **Language detection** uses both `useFormValue([])` (whole document) and
 * `useFormValue(['language'])` (the field directly). Either one returning
 * `"en"` is enough to apply the override — belt and suspenders against
 * Sanity's form context behaving differently for nested fields.
 *
 * **Memoization is load-bearing.** Sanity reads schemaType identity inside
 * effects elsewhere; if we hand it a fresh object on every render those
 * effects fire forever ("Maximum update depth exceeded"). `useMemo` keeps
 * the override stable across renders unless the inputs change.
 */

import { useMemo } from 'react'
import { useFormValue, type FieldProps } from 'sanity'
import { englishLabels } from '../i18n/english-labels'

const DEBUG = process.env.NEXT_PUBLIC_DEBUG_LOCALIZED_FIELDS === '1'

interface DocumentValue {
  language?: unknown
  _type?: unknown
  _id?: unknown
}

function readLanguage(doc: DocumentValue | undefined, direct: unknown): string | undefined {
  // 1. Document.language (preferred — works for any depth of nesting)
  if (doc && typeof doc.language === 'string') return doc.language
  // 2. The language field itself read via path (top-level fields only)
  if (typeof direct === 'string') return direct
  return undefined
}

function lookup(text: string | undefined): string | undefined {
  if (!text) return undefined
  const en = englishLabels[text]
  return en && en !== text ? en : undefined
}

export function LocalizedField(props: FieldProps) {
  // Try multiple ways to read the document's language. If any returns "en",
  // we localize. Belt-and-suspenders for cases where the form context's
  // root might not be the document (e.g. inside deeply nested arrays).
  const document = useFormValue([]) as DocumentValue | undefined
  const directLanguage = useFormValue(['language'])
  const language = readLanguage(document, directLanguage)

  const newTitle = language === 'en' ? lookup(props.title) : undefined
  const newDescription = language === 'en' ? lookup(props.description) : undefined
  const shouldLocalize = !!(newTitle || newDescription)

  // Memoize the schemaType clone so its identity is stable across renders —
  // Sanity's downstream effects compare schemaType references and will loop
  // forever if a fresh object lands every render.
  const localizedSchemaType = useMemo(() => {
    if (!shouldLocalize) return props.schemaType
    return {
      ...props.schemaType,
      title: newTitle ?? props.schemaType.title,
      description: newDescription ?? props.schemaType.description,
    }
  }, [shouldLocalize, props.schemaType, newTitle, newDescription])

  if (DEBUG) {
    console.debug('[LocalizedField]', {
      fieldName: props.schemaType.name,
      docType: document?._type,
      docId: document?._id,
      language,
      currentTitle: props.title,
      newTitle,
      applied: shouldLocalize,
    })
  }

  if (!shouldLocalize) {
    return props.renderDefault(props)
  }

  return props.renderDefault({
    ...props,
    title: newTitle ?? props.title,
    description: newDescription ?? props.description,
    schemaType: localizedSchemaType,
  } as FieldProps)
}
