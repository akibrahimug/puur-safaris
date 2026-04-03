import { describe, it, expect } from 'vitest'
import {
  validateStep1,
  validateStep2,
  validateStep3,
  EMAIL_RE,
  PHONE_RE,
} from './booking-form.validation'

describe('validateStep1', () => {
  it('returns no errors when flexibel is true', () => {
    expect(validateStep1(true, '', '')).toEqual({})
  })

  it('returns no errors when flexibel is true regardless of dates', () => {
    expect(validateStep1(true, '2026-01-01', '2025-01-01')).toEqual({})
  })

  it('returns vertrekdatum error when not flexibel and no vertrekdatum', () => {
    const errs = validateStep1(false, '', '')
    expect(errs).toHaveProperty('vertrekdatum')
  })

  it('returns no errors when not flexibel with vertrekdatum but no retourdatum', () => {
    expect(validateStep1(false, '2026-06-01', '')).toEqual({})
  })

  it('returns retourdatum error when retourdatum is before vertrekdatum', () => {
    const errs = validateStep1(false, '2026-06-15', '2026-06-10')
    expect(errs).toHaveProperty('retourdatum')
  })

  it('returns no errors when dates are valid', () => {
    expect(validateStep1(false, '2026-06-01', '2026-06-15')).toEqual({})
  })
})

describe('validateStep2', () => {
  const validFields = {
    voornaam: 'Jan',
    achternaam: 'de Vries',
    email: 'jan@example.com',
    telefoon: '+31612345678',
    geboortedatum: '1990-01-01',
  }

  it('returns no errors for valid fields', () => {
    expect(validateStep2(validFields)).toEqual({})
  })

  it('returns error when voornaam is too short', () => {
    const errs = validateStep2({ ...validFields, voornaam: 'J' })
    expect(errs).toHaveProperty('voornaam')
  })

  it('returns error when achternaam is too short', () => {
    const errs = validateStep2({ ...validFields, achternaam: 'V' })
    expect(errs).toHaveProperty('achternaam')
  })

  it('returns error for invalid email', () => {
    const errs = validateStep2({ ...validFields, email: 'not-an-email' })
    expect(errs).toHaveProperty('email')
  })

  it('returns error for invalid phone', () => {
    const errs = validateStep2({ ...validFields, telefoon: '12' })
    expect(errs).toHaveProperty('telefoon')
  })

  it('returns error when geboortedatum is missing', () => {
    const errs = validateStep2({ ...validFields, geboortedatum: '' })
    expect(errs).toHaveProperty('geboortedatum')
  })
})

describe('validateStep3', () => {
  it('returns no errors when terms are accepted', () => {
    expect(validateStep3(true)).toEqual({})
  })

  it('returns error when terms are not accepted', () => {
    const errs = validateStep3(false)
    expect(errs).toHaveProperty('terms')
  })
})

describe('EMAIL_RE', () => {
  it.each([
    'user@example.com',
    'name+tag@sub.domain.org',
    'a@b.co',
  ])('matches valid email: %s', (email) => {
    expect(EMAIL_RE.test(email)).toBe(true)
  })

  it.each([
    '',
    'no-at-sign',
    '@missing-local.com',
    'missing@.com',
    'has space@example.com',
  ])('rejects invalid email: %s', (email) => {
    expect(EMAIL_RE.test(email)).toBe(false)
  })
})

describe('PHONE_RE', () => {
  it.each([
    '+31612345678',
    '06 12345678',
    '(020) 123-4567',
    '1234567',
  ])('matches valid phone: %s', (phone) => {
    expect(PHONE_RE.test(phone)).toBe(true)
  })

  it.each([
    '',
    '123',
    'abcdefghij',
  ])('rejects invalid phone: %s', (phone) => {
    expect(PHONE_RE.test(phone)).toBe(false)
  })
})
