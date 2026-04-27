/**
 * Studio document action: "Vertaal van Nederlands".
 *
 * Visible only on documents where `language === "en"`. When clicked it
 * sends the current doc's content (which the i18n plugin pre-fills from
 * the NL source on creation, so it's still NL text) to the
 * `/api/translate-doc` route, then patches the returned EN fields back
 * into the doc as draft changes. The editor reviews and publishes when
 * happy.
 *
 * Used by `sanity.config.ts` — added to translatable doc types via the
 * `document.actions` callback.
 */

import { useState } from 'react'
import { TranslateIcon } from '@sanity/icons'
import { type DocumentActionComponent, type DocumentActionProps, useDocumentOperation } from 'sanity'

export const TranslateFromNlAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const { patch } = useDocumentOperation(props.id, props.type)
  const [running, setRunning] = useState(false)

  const draft = props.draft as Record<string, unknown> | null
  const published = props.published as Record<string, unknown> | null
  const lang = (draft?.language ?? published?.language) as string | undefined

  // Only surface this action on EN-tagged docs.
  if (lang !== 'en') return null

  return {
    label: running ? 'Aan het vertalen…' : 'Vertaal van Nederlands',
    icon: TranslateIcon,
    tone: 'primary',
    group: ['paneActions'],
    disabled: running,
    onHandle: async () => {
      setRunning(true)
      try {
        const fields = (draft ?? published) ?? {}
        const res = await fetch('/api/translate-doc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ docType: props.type, fields, targetLang: 'en' }),
        })

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}))
          throw new Error(errBody?.error ?? `HTTP ${res.status}`)
        }

        const data = (await res.json()) as { fields?: Record<string, unknown> }
        const translatedFields = data.fields ?? {}

        if (Object.keys(translatedFields).length === 0) {
          // Nothing to write — Google didn't change anything (could happen
          // if doc only had non-translatable content like images/refs).
          return
        }

        patch.execute([{ set: translatedFields }])
      } catch (err) {
        console.error('[translateFromNl] failed:', err)
        // Surface a hint via the browser so the editor knows.
        alert(`Vertaling mislukt: ${(err as Error).message}`)
      } finally {
        setRunning(false)
        props.onComplete()
      }
    },
  }
}
