// Re-use the GeoPosition interface
export interface GeoPosition {
  latitude: number
  longitude: number
  altitude?: number
}

// Ship types based on OSINT classification
export type ShipType =
  | 'cargo'
  | 'tanker'
  | 'passenger'
  | 'fishing'
  | 'military'
  | 'coast guard'
  | 'research'
  | 'unknown'

// Vessel entity
export interface Vessel {
  id: string
  mmsi: string
  name: string | null
  flag: string
  position: GeoPosition
  course: number | null
  speed: number | null
  shipType: ShipType
  lastSeen: string
  imo?: string
  callSign?: string
  destination?: string
  eta?: string
}

// Helper function to get ship type label
export function getShipTypeLabel(shipType: ShipType): string {
  const labels: Record<ShipType, string> = {
    cargo: 'Cargo Vessel',
    tanker: 'Tanker',
    passenger: 'Passenger Ship',
    fishing: 'Fishing Vessel',
    military: 'Military Vessel',
    'coast guard': 'Coast Guard',
    research: 'Research Vessel',
    unknown: 'Unknown',
  }
  return labels[shipType]
}
