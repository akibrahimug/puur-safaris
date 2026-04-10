export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PHONE_RE = /^[+]?[\d\s\-().]{7,20}$/

export type FieldErrors = Record<string, string>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BookingDict = Record<string, any> | undefined

export function validateStep1(
  flexibel: boolean,
  vertrekdatum: string,
  retourdatum: string,
  dict?: BookingDict,
): FieldErrors {
  const errs: FieldErrors = {}
  if (!flexibel && !vertrekdatum) errs.vertrekdatum = dict?.validationDateRequired ?? 'Kies een vertrekdatum of vink "Flexibele datum" aan'
  if (!flexibel && vertrekdatum && retourdatum && retourdatum < vertrekdatum) {
    errs.retourdatum = dict?.validationReturnAfterStart ?? 'Retourdatum moet na de vertrekdatum liggen'
  }
  return errs
}

export function validateStep2(fields: {
  voornaam: string
  achternaam: string
  email: string
  telefoon: string
  geboortedatum: string
}, dict?: BookingDict): FieldErrors {
  const errs: FieldErrors = {}
  if (fields.voornaam.trim().length < 2) errs.voornaam = dict?.validationFirstnameRequired ?? 'Voornaam is verplicht (minimaal 2 tekens)'
  if (fields.achternaam.trim().length < 2) errs.achternaam = dict?.validationLastnameRequired ?? 'Achternaam is verplicht (minimaal 2 tekens)'
  if (!EMAIL_RE.test(fields.email)) errs.email = dict?.validationEmailInvalid ?? 'Vul een geldig e-mailadres in'
  if (fields.telefoon && !PHONE_RE.test(fields.telefoon)) errs.telefoon = dict?.validationPhoneInvalid ?? 'Vul een geldig telefoonnummer in'
  if (!fields.geboortedatum) errs.geboortedatum = dict?.validationBirthdateRequired ?? 'Geboortedatum is verplicht'
  return errs
}

export function validateStep3(terms: boolean, dict?: BookingDict): FieldErrors {
  const errs: FieldErrors = {}
  if (!terms) errs.terms = dict?.validationTermsRequired ?? 'U dient akkoord te gaan met de reisvoorwaarden'
  return errs
}
