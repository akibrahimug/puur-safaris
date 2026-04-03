import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { StarRating } from './star-rating'

describe('StarRating', () => {
  it('renders 5 stars by default', () => {
    const { container } = render(<StarRating rating={3} />)
    const stars = container.querySelectorAll('svg')
    expect(stars.length).toBe(5)
  })

  it('renders custom max stars', () => {
    const { container } = render(<StarRating rating={2} max={10} />)
    const stars = container.querySelectorAll('svg')
    expect(stars.length).toBe(10)
  })

  it('applies text-gold to filled stars and text-stone-300 to unfilled', () => {
    const { container } = render(<StarRating rating={3} max={5} />)
    const stars = container.querySelectorAll('svg')
    const filled = Array.from(stars).filter((s) => s.classList.contains('text-gold'))
    const unfilled = Array.from(stars).filter((s) => s.classList.contains('text-stone-300'))
    expect(filled.length).toBe(3)
    expect(unfilled.length).toBe(2)
  })

  it('uses h-3.5 for sm size', () => {
    const { container } = render(<StarRating rating={1} size="sm" />)
    const star = container.querySelector('svg')
    expect(star?.classList.contains('h-3.5')).toBe(true)
    expect(star?.classList.contains('w-3.5')).toBe(true)
  })

  it('uses h-4 for md size (default)', () => {
    const { container } = render(<StarRating rating={1} />)
    const star = container.querySelector('svg')
    expect(star?.classList.contains('h-4')).toBe(true)
    expect(star?.classList.contains('w-4')).toBe(true)
  })
})
