import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SectionHeading } from './section-heading'

describe('SectionHeading', () => {
  it('renders the title in a heading', () => {
    render(<SectionHeading title="Our Safaris" />)
    expect(screen.getByRole('heading', { name: 'Our Safaris' })).toBeDefined()
  })

  it('shows eyebrow text when provided', () => {
    render(<SectionHeading title="Title" eyebrow="Discover" />)
    expect(screen.getByText('Discover')).toBeDefined()
  })

  it('shows gold divider when no eyebrow is provided', () => {
    const { container } = render(<SectionHeading title="Title" />)
    const divider = container.querySelector('.bg-gold')
    expect(divider).not.toBeNull()
  })

  it('hides gold divider when eyebrow is provided', () => {
    const { container } = render(<SectionHeading title="Title" eyebrow="Label" />)
    const divider = container.querySelector('.bg-gold')
    expect(divider).toBeNull()
  })

  it('shows subtitle when provided', () => {
    render(<SectionHeading title="Title" subtitle="Some description" />)
    expect(screen.getByText('Some description')).toBeDefined()
  })

  it('applies text-center class when centered is true', () => {
    const { container } = render(<SectionHeading title="Title" centered />)
    // FadeUp is mocked to a plain div, so the first child div should have text-center
    const wrapper = container.firstElementChild
    expect(wrapper?.className).toContain('text-center')
  })
})
