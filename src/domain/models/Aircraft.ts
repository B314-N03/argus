// Geographic position
export interface GeoPosition {
  latitude: number
  longitude: number
  altitude?: number
}

// Velocity information
export interface Velocity {
  heading: number
  speed: number
  verticalSpeed?: number
}

// Aircraft categories based on OSINT classification
export type AircraftCategory =
  | 'commercial'
  | 'military'
  | 'government'
  | 'private'
  | 'cargo'
  | 'unknown'

// Aircraft entity
export interface Aircraft {
  id: string
  callsign: string | null
  icao24: string
  originCountry: string
  position: GeoPosition
  velocity: Velocity | null
  altitude: number | null
  lastSeen: string
  category: AircraftCategory
  registration?: string
  type?: string
}

// Helper function to get category label
export function getAircraftCategoryLabel(category: AircraftCategory): string {
  const labels: Record<AircraftCategory, string> = {
    commercial: 'Commercial',
    military: 'Military',
    government: 'Government',
    private: 'Private',
    cargo: 'Cargo',
    unknown: 'Unknown',
  }
  return labels[category]
}
