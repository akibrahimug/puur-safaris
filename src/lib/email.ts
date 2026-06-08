/**
 * Builds the RFC 5322 "From" header for transactional email.
 *
 * Two concerns are kept separate in config:
 *   - `EMAIL_FROM`      — the bare sending address (e.g. `info@puurugandareizen.nl`).
 *                         MUST be on a Resend-verified domain.
 *   - `EMAIL_FROM_NAME` — the human-readable display name recipients see in their
 *                         inbox (e.g. `Puur Uganda Reizen`).
 *
 * They're composed into `Name <address>` only at send time, so the address can be
 * rotated/verified independently of the label.
 *
 * Backward-compatible: if `EMAIL_FROM` already holds the legacy combined form
 * (`Name <address>`), it's used as-is and `EMAIL_FROM_NAME` is ignored — so a
 * not-yet-migrated environment keeps working.
 *
 * Returns `undefined` when no address is configured, so callers keep their
 * "server not configured" guard intact.
 */
export function getEmailFrom(): string | undefined {
  const raw = process.env.EMAIL_FROM?.trim()
  if (!raw) return undefined

  // Legacy single-var config already in "Name <address>" form — use as-is.
  if (raw.includes('<')) return raw

  const name = process.env.EMAIL_FROM_NAME?.trim()
  return name ? `${name} <${raw}>` : raw
}
