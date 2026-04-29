/**
 * Pure validation for the blog-submission form.
 *
 * Extracted from `blog-submission-form.tsx` so it can be unit-tested
 * without rendering the React component. The component still owns the
 * impure side-effects (`setFieldErrors`, `scrollIntoView`).
 */

export const BOOKING_NUMBER_RE = /^PS-\d{4}-[A-Z0-9]{4}$/
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PHONE_RE = /^[+]?[\d\s\-().]{7,20}$/

export type FieldErrors = Record<string, string>

export type ImageLayout = 'none' | 'single' | 'grid'

export interface BlogSection {
  title: string
  body: string
  imageLayout: ImageLayout
  images: { preview?: string; file?: File }[]
}

export interface BlogSubmissionInput {
  bookingNumber: string
  email: string
  telefoon: string
  title: string
  authorName: string
  authorBio: string
  intro: string
  heroImage: unknown // truthy when present
  authorPhoto: unknown
  gallery: unknown[]
  sections: BlogSection[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BlogSubmitDict = Record<string, any> | undefined

export interface BlogSubmissionResult {
  errors: FieldErrors
  valid: boolean
}

export function validateBlogSubmission(
  input: BlogSubmissionInput,
  d?: BlogSubmitDict,
): BlogSubmissionResult {
  const errors: FieldErrors = {}

  // ── Verification fields ────────────────────────────────────────────
  if (!input.bookingNumber.trim()) {
    errors.bookingNumber = d?.validationBookingRequired ?? 'Boekingsnummer is verplicht'
  } else if (!BOOKING_NUMBER_RE.test(input.bookingNumber.trim())) {
    errors.bookingNumber = d?.validationBookingFormat ?? 'Ongeldig formaat (bijv. PS-2024-AB12)'
  }

  if (!input.email.trim()) {
    errors.email = d?.validationEmailRequired ?? 'E-mailadres is verplicht'
  } else if (!EMAIL_RE.test(input.email.trim())) {
    errors.email = d?.validationEmailInvalid ?? 'Ongeldig e-mailadres'
  }

  if (input.telefoon && !PHONE_RE.test(input.telefoon)) {
    errors.telefoon = d?.validationPhoneInvalid ?? 'Ongeldig telefoonnummer'
  }

  // ── Blog content ───────────────────────────────────────────────────
  if (!input.heroImage) {
    errors.heroImage = d?.validationHeroImageRequired ?? 'Upload een omslagfoto'
  }
  if (!input.title.trim()) {
    errors.title = d?.validationTitleRequired ?? 'Titel is verplicht'
  }
  if (!input.authorName.trim()) {
    errors.authorName = d?.validationAuthorNameRequired ?? 'Auteur naam is verplicht'
  }
  if (!input.authorBio.trim()) {
    errors.authorBio = d?.validationAuthorBioRequired ?? 'Een korte bio is verplicht'
  }
  if (!input.authorPhoto) {
    errors.authorPhoto = d?.validationAuthorPhotoRequired ?? 'Upload een profielfoto'
  }
  if (!input.intro.trim()) {
    errors.intro = d?.validationIntroRequired ?? 'Introductie is verplicht'
  }
  if (input.gallery.length === 0) {
    errors.gallery = d?.validationGalleryRequired ?? 'Upload minimaal één foto voor de galerij'
  }

  // ── Sections — at least 3 must be filled ───────────────────────────
  let filledCount = 0
  input.sections.forEach((s, i) => {
    if (!s.title.trim() && !s.body.trim()) return // empty section, skip
    if (!s.title.trim()) errors[`section_${i}_title`] = d?.validationSectionTitleRequired ?? 'Sectie titel is verplicht'
    if (!s.body.trim()) errors[`section_${i}_body`] = d?.validationSectionBodyRequired ?? 'Sectie tekst is verplicht'
    if (s.imageLayout !== 'none' && s.images.length === 0) {
      errors[`section_${i}_images`] = d?.validationSectionImagesRequired ?? 'Upload minimaal één foto of kies "Geen"'
    }
    if (s.title.trim() && s.body.trim()) filledCount++
  })
  if (filledCount < 3) {
    errors.sections = d?.validationSectionsRequired ?? 'Je verhaal moet minimaal 3 volledige secties bevatten (titel + tekst)'
  }

  return { errors, valid: Object.keys(errors).length === 0 }
}
