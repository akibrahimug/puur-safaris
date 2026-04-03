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
  it('links to /safari-reizen/{slug}', () => {
    render(<SafariCard trip={baseTrip} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/safari-reizen/serengeti')
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

  it('shows "per persoon" for per_person price type', () => {
    render(<SafariCard trip={baseTrip} />)
    expect(screen.getByText('per persoon')).toBeInTheDocument()
  })

  it('shows "per groep" for per_group price type', () => {
    const trip = { ...baseTrip, priceType: 'per_group' as const }
    render(<SafariCard trip={trip} />)
    expect(screen.getByText('per groep')).toBeInTheDocument()
  })

  it('shows duration', () => {
    render(<SafariCard trip={baseTrip} />)
    expect(screen.getByText('7 dagen')).toBeInTheDocument()
  })

  it('shows difficulty label when provided', () => {
    render(<SafariCard trip={baseTrip} />)
    // 'moderate' maps to 'Gemiddeld'
    expect(screen.getByText('Gemiddeld')).toBeInTheDocument()
  })

  it('shows category label when provided', () => {
    render(<SafariCard trip={baseTrip} />)
    // 'wildlife' maps to 'Wildlife Safari'
    expect(screen.getByText('Wildlife Safari')).toBeInTheDocument()
  })

  it('shows featured badge when featured is true', () => {
    render(<SafariCard trip={baseTrip} />)
    expect(screen.getByText('Aanbevolen')).toBeInTheDocument()
  })

  it('does not show featured badge when featured is false', () => {
    const trip = { ...baseTrip, featured: false }
    render(<SafariCard trip={trip} />)
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
