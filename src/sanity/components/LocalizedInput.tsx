/**
 * Form input wrapper that swaps a field's `schemaType.title` and
 * `schemaType.description` to English when editing a `language: "en"`
 * document — the input-level counterpart to `LocalizedField`.
 *
 * Why both? Sanity v5 has two override hooks:
 *   - `form.components.field` → wraps the FormField that renders the label
 *     for most field types. `LocalizedField` overrides `props.title` here.
 *   - `form.components.input` → wraps the actual input component. Some
 *     input types (booleans, some objects) render their own label inline
 *     and read it from `schemaType.title` directly, bypassing the
 *     FormField wrapper. For those, the `field` override doesn't help —
 *     the label was already chosen at the input level. This component
 *     covers that gap by also overriding `schemaType.title` on the way in.
 *
 * Same lookup table (`englishLabels`) and same memoization pattern as
 * `LocalizedField`. Both hooks must be wired in `sanity.config.ts` for
 * full coverage.
 */

import { useMemo } from 'react'
import { useFormValue, type InputProps } from 'sanity'
import { englishLabels } from '../i18n/english-labels'

interface DocumentValue {
  language?: unknown
}

function readLanguage(doc: DocumentValue | undefined, direct: unknown): string | undefined {
  if (doc && typeof doc.language === 'string') return doc.language
  if (typeof direct === 'string') return direct
  return undefined
}

function lookup(text: string | undefined): string | undefined {
  if (!text) return undefined
  const en = englishLabels[text]
  return en && en !== text ? en : undefined
}

export function LocalizedInput(props: InputProps) {
  const document = useFormValue([]) as DocumentValue | undefined
  const directLanguage = useFormValue(['language'])
  const language = readLanguage(document, directLanguage)

  const currentTitle = props.schemaType.title
  const currentDescription = props.schemaType.description
  const newTitle = language === 'en' ? lookup(currentTitle) : undefined
  const newDescription = language === 'en' ? lookup(currentDescription) : undefined
  const shouldLocalize = !!(newTitle || newDescription)

  const localizedSchemaType = useMemo(() => {
    if (!shouldLocalize) return props.schemaType
    return {
      ...props.schemaType,
      title: newTitle ?? props.schemaType.title,
      description: newDescription ?? props.schemaType.description,
    }
  }, [shouldLocalize, props.schemaType, newTitle, newDescription])

  if (localizedSchemaType === props.schemaType) {
    return props.renderDefault(props)
  }
  return props.renderDefault({ ...props, schemaType: localizedSchemaType } as InputProps)
}
