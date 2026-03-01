import type { GeoBounds } from '../types/geo'
import { isWithinBounds } from '../types/geo'

export { isWithinBounds }

export type RegionType =
  | 'country'
  | 'region'
  | 'theater'
  | 'maritime'
  | 'airspace'

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

export function formatBounds(bounds: GeoBounds): string {
  return `${bounds.north.toFixed(2)}°N, ${bounds.south.toFixed(2)}°S, ${bounds.east.toFixed(2)}°E, ${bounds.west.toFixed(2)}°W`
}
