// Mock vessels data generator
import type { Vessel, ShipType } from '@/domain/models'

const countries = [
  'United States',
  'Russia',
  'China',
  'United Kingdom',
  'France',
  'Germany',
  'Japan',
  'India',
  'Brazil',
  'Panama',
  'Liberia',
  'Marshall Islands',
]

const vesselNames = [
  'Atlantic Pioneer',
  'Pacific Guardian',
  'Northern Star',
  'Ocean Titan',
  'Sea Sentinel',
  'Marine Explorer',
  'Naval Protector',
  'Deep Blue',
  'Wave Rider',
  'Maritime Express',
  null,
]

const shipTypes: ShipType[] = [
  'cargo',
  'tanker',
  'passenger',
  'fishing',
  'military',
  'coast guard',
  'research',
]

// Generate random maritime position
function generatePosition(): { latitude: number; longitude: number } {
  const latitude = -60 + Math.random() * 120
  const longitude = -180 + Math.random() * 360

  return { latitude, longitude }
}

// Generate mock vessel
export function generateMockVessel(overrides?: Partial<Vessel>): Vessel {
  const shipType = shipTypes[Math.floor(Math.random() * shipTypes.length)]

  return {
    id: `vs_${Math.random().toString(36).substr(2, 9)}`,
    mmsi: Math.floor(200000000 + Math.random() * 799999999).toString(),
    name: vesselNames[Math.floor(Math.random() * vesselNames.length)],
    flag: countries[Math.floor(Math.random() * countries.length)],
    position: generatePosition(),
    course: Math.random() > 0.3 ? Math.floor(Math.random() * 360) : null,
    speed: Math.random() > 0.3 ? Math.floor(Math.random() * 25) : null,
    shipType,
    lastSeen: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    ...overrides,
  }
}

// Generate multiple mock vessels
export function generateMockVesselsList(count: number = 30): Vessel[] {
  return Array.from({ length: count }, () => generateMockVessel())
}
