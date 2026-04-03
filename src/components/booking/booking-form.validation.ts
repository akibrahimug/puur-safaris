export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PHONE_RE = /^[+]?[\d\s\-().]{7,20}$/

export type FieldErrors = Record<string, string>

export function validateStep1(
  flexibel: boolean,
  vertrekdatum: string,
  retourdatum: string,
): FieldErrors {
  const errs: FieldErrors = {}
  if (!flexibel && !vertrekdatum) errs.vertrekdatum = 'Kies een vertrekdatum of vink "Flexibele datum" aan'
  if (!flexibel && vertrekdatum && retourdatum && retourdatum < vertrekdatum) {
    errs.retourdatum = 'Retourdatum moet na de vertrekdatum liggen'
  }
  return errs
}

export function validateStep2(fields: {
  voornaam: string
  achternaam: string
  email: string
  telefoon: string
  geboortedatum: string
}): FieldErrors {
  const errs: FieldErrors = {}
  if (fields.voornaam.trim().length < 2) errs.voornaam = 'Voornaam is verplicht (minimaal 2 tekens)'
  if (fields.achternaam.trim().length < 2) errs.achternaam = 'Achternaam is verplicht (minimaal 2 tekens)'
  if (!EMAIL_RE.test(fields.email)) errs.email = 'Vul een geldig e-mailadres in'
  if (!PHONE_RE.test(fields.telefoon)) errs.telefoon = 'Vul een geldig telefoonnummer in'
  if (!fields.geboortedatum) errs.geboortedatum = 'Geboortedatum is verplicht'
  return errs
}

export function validateStep3(terms: boolean): FieldErrors {
  const errs: FieldErrors = {}
  if (!terms) errs.terms = 'U dient akkoord te gaan met de reisvoorwaarden'
  return errs
}
