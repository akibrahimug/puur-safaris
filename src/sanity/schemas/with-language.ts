/**
 * Wraps a document schema by appending a hidden, read-only `language` field
 * (consumed by `@sanity/document-internationalization`).
 *
 * The plugin reads/writes the field automatically when the editor creates a
 * translation; the schema declaration here is just so the studio doesn't
 * flag it as an "Unknown field". Hidden because the Translations panel
 * already shows the language clearly; read-only so editors can't change
 * it accidentally.
 */

import { defineField } from 'sanity'

const LANGUAGE_FIELD = defineField({
  name: 'language',
  title: 'Language',
  type: 'string',
  readOnly: true,
  hidden: true,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withLanguage<T extends { fields?: any[] }>(schema: T): T {
  return {
    ...schema,
    fields: [...(schema.fields ?? []), LANGUAGE_FIELD],
  }
}
