import { describe, it, expect } from 'vitest'
import { resolveRangeSelection } from './date-range-logic'

const d = (s: string) => new Date(s + 'T00:00:00')

describe('resolveRangeSelection', () => {
  it('first click sets start date, no end', () => {
    const result = resolveRangeSelection(d('2026-06-10'), undefined, undefined)
    expect(result.from).toEqual(d('2026-06-10'))
    expect(result.to).toBeUndefined()
  })

  it('second click after start sets end date', () => {
    const result = resolveRangeSelection(d('2026-06-15'), d('2026-06-10'), undefined)
    expect(result.from).toEqual(d('2026-06-10'))
    expect(result.to).toEqual(d('2026-06-15'))
  })

  it('second click before start resets to new start', () => {
    const result = resolveRangeSelection(d('2026-06-05'), d('2026-06-10'), undefined)
    expect(result.from).toEqual(d('2026-06-05'))
    expect(result.to).toBeUndefined()
  })

  it('clicking same day as start resets (no end)', () => {
    const result = resolveRangeSelection(d('2026-06-10'), d('2026-06-10'), undefined)
    expect(result.from).toEqual(d('2026-06-10'))
    expect(result.to).toBeUndefined()
  })

  it('third click after complete range resets to new start (THE KEY BEHAVIOR)', () => {
    // Range: Jun 10 – Jun 15. User clicks Jun 20.
    // Expected: start = Jun 20, end = undefined
    const result = resolveRangeSelection(d('2026-06-20'), d('2026-06-10'), d('2026-06-15'))
    expect(result.from).toEqual(d('2026-06-20'))
    expect(result.to).toBeUndefined()
  })

  it('third click before complete range resets to new start', () => {
    // Range: Jun 10 – Jun 15. User clicks Jun 5.
    // Expected: start = Jun 5, end = undefined
    const result = resolveRangeSelection(d('2026-06-05'), d('2026-06-10'), d('2026-06-15'))
    expect(result.from).toEqual(d('2026-06-05'))
    expect(result.to).toBeUndefined()
  })

  it('third click inside complete range resets to new start', () => {
    // Range: Jun 10 – Jun 15. User clicks Jun 12.
    // Expected: start = Jun 12, end = undefined
    const result = resolveRangeSelection(d('2026-06-12'), d('2026-06-10'), d('2026-06-15'))
    expect(result.from).toEqual(d('2026-06-12'))
    expect(result.to).toBeUndefined()
  })

  it('third click on start date of complete range resets', () => {
    const result = resolveRangeSelection(d('2026-06-10'), d('2026-06-10'), d('2026-06-15'))
    expect(result.from).toEqual(d('2026-06-10'))
    expect(result.to).toBeUndefined()
  })

  it('third click on end date of complete range resets', () => {
    const result = resolveRangeSelection(d('2026-06-15'), d('2026-06-10'), d('2026-06-15'))
    expect(result.from).toEqual(d('2026-06-15'))
    expect(result.to).toBeUndefined()
  })
})
