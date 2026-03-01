// Mock vessels data generator
import type { Vessel, ShipType } from '@/domain/models'
import { createSeededRandom } from './seed'

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

function generateSeededVessel(index: number): Vessel {
  const random = createSeededRandom(`vessel_${index}`)

  const shipType = shipTypes[Math.floor(random() * shipTypes.length)]
  const latitude = -60 + random() * 120
  const longitude = -180 + random() * 360
  const hasCourse = random() > 0.3
  const hasSpeed = random() > 0.3

  return {
    id: `vs_${index.toString(36).padStart(6, '0')}`,
    mmsi: Math.floor(200000000 + random() * 799999999).toString(),
    name: vesselNames[Math.floor(random() * vesselNames.length)],
    flag: countries[Math.floor(random() * countries.length)],
    position: { latitude, longitude },
    course: hasCourse ? Math.floor(random() * 360) : null,
    speed: hasSpeed ? Math.floor(random() * 25) : null,
    shipType,
    lastSeen: new Date(Date.now() - Math.floor(random() * 3600000)).toISOString(),
  }
}

// Generate multiple mock vessels
export function generateMockVesselsList(count: number = 30): Vessel[] {
  return Array.from({ length: count }, (_, i) => generateSeededVessel(i))
}
