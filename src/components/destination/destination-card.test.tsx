import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DestinationCard } from './destination-card'

const baseDestination = {
  _id: 'dest-1',
  slug: 'kenya',
  name: 'Kenya',
  country: 'Kenia',
  continent: 'Afrika',
  excerpt: 'Beautiful',
  tripCount: 3,
  heroImage: {
    asset: { _id: 'img-1', url: 'https://example.com/img.jpg', metadata: { dimensions: { width: 800, height: 600, aspectRatio: 1.33 }, lqip: '' } },
    alt: 'Kenya',
  },
}

describe('DestinationCard', () => {
  it('links to /bestemmingen/{slug}', () => {
    render(<DestinationCard destination={baseDestination} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/bestemmingen/kenya')
  })

  it('renders destination name', () => {
    render(<DestinationCard destination={baseDestination} />)
    expect(screen.getByText('Kenya')).toBeInTheDocument()
  })

  it('shows country', () => {
    render(<DestinationCard destination={baseDestination} />)
    expect(screen.getByText(/Kenia/)).toBeInTheDocument()
  })

  it('shows continent prefix when provided', () => {
    render(<DestinationCard destination={baseDestination} />)
    // Rendered as "Afrika • Kenia"
    expect(screen.getByText(/Afrika/)).toBeInTheDocument()
  })

  it('does not show continent prefix when not provided', () => {
    const dest = { ...baseDestination, continent: undefined }
    render(<DestinationCard destination={dest} />)
    expect(screen.queryByText(/Afrika/)).not.toBeInTheDocument()
  })

  it('shows excerpt when provided', () => {
    render(<DestinationCard destination={baseDestination} />)
    expect(screen.getByText('Beautiful')).toBeInTheDocument()
  })

  it('shows trip count with plural "reizen" for > 1', () => {
    render(<DestinationCard destination={baseDestination} />)
    expect(screen.getByText(/3 reizen beschikbaar/)).toBeInTheDocument()
  })

  it('shows trip count with singular "reis" for 1', () => {
    const dest = { ...baseDestination, tripCount: 1 }
    render(<DestinationCard destination={dest} />)
    expect(screen.getByText(/1 reis beschikbaar/)).toBeInTheDocument()
  })

  it('respects custom labels', () => {
    render(
      <DestinationCard
        destination={baseDestination}
        labels={{
          tripPluralLabel: 'trips',
          availableLabel: 'available',
        }}
      />
    )
    expect(screen.getByText(/3 trips available/)).toBeInTheDocument()
  })
})
