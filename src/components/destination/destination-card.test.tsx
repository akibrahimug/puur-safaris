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
  it('links to destination detail page', () => {
    render(<DestinationCard destination={baseDestination} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/nl/bestemmingen/kenya')
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

  it('renders the plural trip-count label from props for tripCount > 1', () => {
    render(
      <DestinationCard
        destination={baseDestination}
        labels={{ tripPluralLabel: 'reizen', availableLabel: 'beschikbaar' }}
      />
    )
    expect(screen.getByText(/3 reizen beschikbaar/)).toBeInTheDocument()
  })

  it('renders the singular trip-count label from props for tripCount === 1', () => {
    const dest = { ...baseDestination, tripCount: 1 }
    render(
      <DestinationCard
        destination={dest}
        labels={{ tripSingularLabel: 'reis', availableLabel: 'beschikbaar' }}
      />
    )
    expect(screen.getByText(/1 reis beschikbaar/)).toBeInTheDocument()
  })

  it('respects custom (English) labels', () => {
    render(
      <DestinationCard
        destination={baseDestination}
        labels={{ tripPluralLabel: 'trips', availableLabel: 'available' }}
      />
    )
    expect(screen.getByText(/3 trips available/)).toBeInTheDocument()
  })
})
