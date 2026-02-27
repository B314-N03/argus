// Geographic bounds
export interface GeoBounds {
  north: number
  south: number
  east: number
  west: number
}

// Region types
export type RegionType =
  | 'country'
  | 'region'
  | 'theater'
  | 'maritime'
  | 'airspace'

// Region entity
export interface Region {
  id: string
  name: string
  code: string
  bounds: GeoBounds
  type: RegionType
  parentId?: string
  center?: {
    latitude: number
    longitude: number
  }
}

// Helper function to check if coordinates are within bounds
export function isWithinBounds(
  latitude: number,
  longitude: number,
  bounds: GeoBounds
): boolean {
  return (
    latitude >= bounds.south &&
    latitude <= bounds.north &&
    longitude >= bounds.west &&
    longitude <= bounds.east
  )
}

// Helper function to get region type label
export function getRegionTypeLabel(type: RegionType): string {
  const labels: Record<RegionType, string> = {
    country: 'Country',
    region: 'Geographic Region',
    theater: 'Theater',
    maritime: 'Maritime Region',
    airspace: 'Airspace',
  }
  return labels[type]
}

// Helper function to format bounds
export function formatBounds(bounds: GeoBounds): string {
  return `${bounds.north.toFixed(2)}°N, ${bounds.south.toFixed(2)}°S, ${bounds.east.toFixed(2)}°E, ${bounds.west.toFixed(2)}°W`
}
