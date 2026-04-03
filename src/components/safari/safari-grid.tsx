import { SafariCard } from './safari-card'
import type { SafariCardLabels } from './safari-card'
import { StaggerContainer, StaggerItem } from '@/components/motion/stagger'
import type { TripCard } from '@/lib/types'

interface SafariGridProps {
  trips: TripCard[]
  labels?: SafariCardLabels
}

export function SafariGrid({ trips, labels }: SafariGridProps) {
  if (trips.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
          Geen safari reizen gevonden.
        </p>
      </div>
    )
  }

  return (
    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {trips.map((trip) => (
        <StaggerItem key={trip._id}>
          <SafariCard trip={trip} labels={labels} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  )
}
