import { describe, it, expect } from 'vitest'
import {
  validateBlogSubmission,
  BOOKING_NUMBER_RE,
  EMAIL_RE,
  PHONE_RE,
  type BlogSubmissionInput,
  type BlogSection,
} from './blog-submission-form.validation'

function section(overrides: Partial<BlogSection> = {}): BlogSection {
  return {
    title: 'Een titel',
    body: 'Een verhaal van enige lengte.',
    imageLayout: 'none',
    images: [],
    ...overrides,
  }
}

function validInput(overrides: Partial<BlogSubmissionInput> = {}): BlogSubmissionInput {
  return {
    bookingNumber: 'PS-2024-AB12',
    email: 'jan@example.com',
    telefoon: '+31612345678',
    title: 'Mijn reisverslag',
    authorName: 'Jan de Vries',
    authorBio: 'Reisliefhebber.',
    intro: 'Een korte introductie van het verhaal.',
    heroImage: { preview: 'blob:hero', file: new Blob() },
    authorPhoto: { preview: 'blob:author', file: new Blob() },
    gallery: [{ name: 'p.jpg', url: 'blob:1', file: new Blob() }],
    sections: [section(), section(), section()],
    ...overrides,
  }
}

describe('validateBlogSubmission — happy path', () => {
  it('returns valid: true and no errors when every field is filled correctly', () => {
    const result = validateBlogSubmission(validInput())
    expect(result.valid).toBe(true)
    expect(result.errors).toEqual({})
  })

  it('accepts an empty telefoon (it is optional)', () => {
    const result = validateBlogSubmission(validInput({ telefoon: '' }))
    expect(result.valid).toBe(true)
  })
})

describe('validateBlogSubmission — verification fields', () => {
  it('errors when booking number is empty', () => {
    const result = validateBlogSubmission(validInput({ bookingNumber: '' }))
    expect(result.valid).toBe(false)
    expect(result.errors).toHaveProperty('bookingNumber')
  })

  it('errors when booking number has bad format', () => {
    const result = validateBlogSubmission(validInput({ bookingNumber: 'not-a-code' }))
    expect(result.valid).toBe(false)
    expect(result.errors).toHaveProperty('bookingNumber')
  })

  it('accepts the documented PS-YYYY-XXXX format', () => {
    const result = validateBlogSubmission(validInput({ bookingNumber: 'PS-2025-Z9X1' }))
    expect(result.valid).toBe(true)
  })

  it('errors when email is missing', () => {
    const result = validateBlogSubmission(validInput({ email: '' }))
    expect(result.valid).toBe(false)
    expect(result.errors).toHaveProperty('email')
  })

  it('errors when email is malformed', () => {
    const result = validateBlogSubmission(validInput({ email: 'not-an-email' }))
    expect(result.valid).toBe(false)
    expect(result.errors).toHaveProperty('email')
  })

  it('errors when telefoon is provided but malformed', () => {
    const result = validateBlogSubmission(validInput({ telefoon: 'abc' }))
    expect(result.valid).toBe(false)
    expect(result.errors).toHaveProperty('telefoon')
  })
})

describe('validateBlogSubmission — content fields', () => {
  it('errors when hero image is missing', () => {
    const result = validateBlogSubmission(validInput({ heroImage: null }))
    expect(result.valid).toBe(false)
    expect(result.errors).toHaveProperty('heroImage')
  })

  it('errors when intro is empty', () => {
    const result = validateBlogSubmission(validInput({ intro: '   ' }))
    expect(result.valid).toBe(false)
    expect(result.errors).toHaveProperty('intro')
  })

  it('errors when gallery is empty', () => {
    const result = validateBlogSubmission(validInput({ gallery: [] }))
    expect(result.valid).toBe(false)
    expect(result.errors).toHaveProperty('gallery')
  })

  it('errors when title is missing', () => {
    const result = validateBlogSubmission(validInput({ title: '' }))
    expect(result.valid).toBe(false)
    expect(result.errors).toHaveProperty('title')
  })

  it('errors when author name or bio is missing', () => {
    const r1 = validateBlogSubmission(validInput({ authorName: '' }))
    expect(r1.errors).toHaveProperty('authorName')
    const r2 = validateBlogSubmission(validInput({ authorBio: '' }))
    expect(r2.errors).toHaveProperty('authorBio')
  })

  it('errors when author photo is missing', () => {
    const result = validateBlogSubmission(validInput({ authorPhoto: null }))
    expect(result.valid).toBe(false)
    expect(result.errors).toHaveProperty('authorPhoto')
  })
})

describe('validateBlogSubmission — sections rule', () => {
  it('errors when fewer than 3 sections are filled', () => {
    const result = validateBlogSubmission(
      validInput({
        sections: [
          section(),
          section({ title: '', body: '' }),
          section({ title: '', body: '' }),
        ],
      }),
    )
    expect(result.valid).toBe(false)
    expect(result.errors).toHaveProperty('sections')
  })

  it('errors per-section when a section has only a title or only a body', () => {
    const result = validateBlogSubmission(
      validInput({
        sections: [
          section({ title: 'OK', body: '' }),
          section({ title: '', body: 'OK' }),
          section(),
        ],
      }),
    )
    expect(result.errors).toHaveProperty('section_0_body')
    expect(result.errors).toHaveProperty('section_1_title')
  })

  it('errors when imageLayout is set but no images uploaded', () => {
    const result = validateBlogSubmission(
      validInput({
        sections: [section({ imageLayout: 'single', images: [] }), section(), section()],
      }),
    )
    expect(result.errors).toHaveProperty('section_0_images')
  })

  it('skips fully-empty sections without flagging them', () => {
    const result = validateBlogSubmission(
      validInput({
        sections: [section(), section(), section(), section({ title: '', body: '' })],
      }),
    )
    // 3 filled sections is enough; the 4th empty one is silently ignored
    expect(result.valid).toBe(true)
  })
})

describe('validateBlogSubmission — dictionary overrides', () => {
  it('uses the provided dictionary string for the booking-number error', () => {
    const result = validateBlogSubmission(
      validInput({ bookingNumber: '' }),
      { validationBookingRequired: 'Booking number required' },
    )
    expect(result.errors.bookingNumber).toBe('Booking number required')
  })

  it('falls back to the Dutch literal when the dict is undefined', () => {
    const result = validateBlogSubmission(validInput({ bookingNumber: '' }))
    expect(result.errors.bookingNumber).toBe('Boekingsnummer is verplicht')
  })

  it('uses the provided dictionary string for the section-title error', () => {
    const result = validateBlogSubmission(
      validInput({
        sections: [
          section({ title: '', body: 'Body only' }),
          section(),
          section(),
        ],
      }),
      { validationSectionTitleRequired: 'Section title required' },
    )
    expect(result.errors.section_0_title).toBe('Section title required')
  })

  it('uses the provided dictionary string for the section-body error', () => {
    const result = validateBlogSubmission(
      validInput({
        sections: [
          section({ title: 'Title only', body: '' }),
          section(),
          section(),
        ],
      }),
      { validationSectionBodyRequired: 'Section body required' },
    )
    expect(result.errors.section_0_body).toBe('Section body required')
  })

  it('uses the provided dictionary string for the section-images error', () => {
    const result = validateBlogSubmission(
      validInput({
        sections: [
          section({ imageLayout: 'single', images: [] }),
          section(),
          section(),
        ],
      }),
      { validationSectionImagesRequired: 'Upload at least one photo' },
    )
    expect(result.errors.section_0_images).toBe('Upload at least one photo')
  })

  it('falls back to the Dutch literal for per-section errors when dict is undefined', () => {
    const result = validateBlogSubmission(
      validInput({
        sections: [
          section({ title: '', body: 'Body only' }),
          section(),
          section(),
        ],
      }),
    )
    expect(result.errors.section_0_title).toBe('Sectie titel is verplicht')
  })
})

describe('validation regexes', () => {
  it.each(['PS-2024-AB12', 'PS-2025-Z9X1', 'PS-1999-0000'])('booking number matches %s', (s) => {
    expect(BOOKING_NUMBER_RE.test(s)).toBe(true)
  })

  it.each(['ps-2024-AB12', 'PS-24-AB12', 'PS-2024-ab12', '', 'PS-2024-AB123'])(
    'booking number rejects %s',
    (s) => {
      expect(BOOKING_NUMBER_RE.test(s)).toBe(false)
    },
  )

  it('email regex matches a normal address', () => {
    expect(EMAIL_RE.test('a@b.co')).toBe(true)
  })

  it('phone regex matches an international number', () => {
    expect(PHONE_RE.test('+31 6 12345678')).toBe(true)
  })
})
