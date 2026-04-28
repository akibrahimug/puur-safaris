import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SafariCard } from './safari-card'

const baseTrip = {
  _id: 'trip-1',
  slug: 'serengeti',
  title: 'Serengeti Safari',
  excerpt: 'An amazing safari experience',
  price: 2500,
  priceType: 'per_person' as const,
  duration: '7 dagen',
  difficulty: 'moderate' as const,
  category: 'wildlife',
  featured: true,
  destination: { name: 'Serengeti', country: 'Tanzania', slug: 'serengeti' },
  heroImage: {
    asset: { _id: 'img-1', url: 'https://example.com/img.jpg', metadata: { dimensions: { width: 800, height: 600, aspectRatio: 1.33 }, lqip: '' } },
    alt: 'Serengeti',
  },
}

describe('SafariCard', () => {
  it('links to safari detail page', () => {
    render(<SafariCard trip={baseTrip} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/nl/safari-reizen/serengeti')
  })

  it('renders title', () => {
    render(<SafariCard trip={baseTrip} />)
    expect(screen.getByText('Serengeti Safari')).toBeInTheDocument()
  })

  it('renders formatted price containing euro sign', () => {
    render(<SafariCard trip={baseTrip} />)
    // formatPrice(2500) with nl-NL locale produces a string with €
    expect(screen.getByText(/€/)).toBeInTheDocument()
  })

  it('renders the per-person price label from props', () => {
    render(<SafariCard trip={baseTrip} labels={{ pricePerPerson: 'per persoon' }} />)
    expect(screen.getByText('per persoon')).toBeInTheDocument()
  })

  it('renders the per-group price label from props for per_group price type', () => {
    const trip = { ...baseTrip, priceType: 'per_group' as const }
    render(<SafariCard trip={trip} labels={{ pricePerGroup: 'per groep' }} />)
    expect(screen.getByText('per groep')).toBeInTheDocument()
  })

  it('shows duration', () => {
    render(<SafariCard trip={baseTrip} />)
    expect(screen.getByText('7 dagen')).toBeInTheDocument()
  })

  it('shows the Dutch difficulty fallback when locale is nl', () => {
    render(<SafariCard trip={baseTrip} />)
    // 'moderate' maps to 'Gemiddeld' under the NL default fallback
    expect(screen.getByText('Gemiddeld')).toBeInTheDocument()
  })

  it('shows the English difficulty fallback when locale is en', () => {
    render(<SafariCard trip={baseTrip} locale="en" />)
    // 'moderate' maps to 'Moderate' under the EN default fallback
    expect(screen.getByText('Moderate')).toBeInTheDocument()
  })

  it('shows the Dutch category fallback when locale is nl', () => {
    render(<SafariCard trip={baseTrip} />)
    // 'wildlife' maps to 'Wildlife Safari' (same in NL and EN)
    expect(screen.getByText('Wildlife Safari')).toBeInTheDocument()
  })

  it('shows the English category fallback when locale is en', () => {
    const trip = { ...baseTrip, category: 'combined' }
    render(<SafariCard trip={trip} locale="en" />)
    // 'combined' maps to 'Combination Trip' under the EN default fallback
    // (would be 'Combinatiereis' under NL — this is the regression we guard against)
    expect(screen.getByText('Combination Trip')).toBeInTheDocument()
  })

  it('renders the featured badge from props when featured is true', () => {
    render(<SafariCard trip={baseTrip} labels={{ featuredBadge: 'Aanbevolen' }} />)
    expect(screen.getByText('Aanbevolen')).toBeInTheDocument()
  })

  it('does not render the featured badge when featured is false', () => {
    const trip = { ...baseTrip, featured: false }
    render(<SafariCard trip={trip} labels={{ featuredBadge: 'Aanbevolen' }} />)
    expect(screen.queryByText('Aanbevolen')).not.toBeInTheDocument()
  })

  it('shows destination when provided', () => {
    render(<SafariCard trip={baseTrip} />)
    expect(screen.getByText('Serengeti, Tanzania')).toBeInTheDocument()
  })

  it('does not show destination when not provided', () => {
    const trip = { ...baseTrip, destination: undefined }
    render(<SafariCard trip={trip} />)
    expect(screen.queryByText(/Tanzania/)).not.toBeInTheDocument()
  })
})
