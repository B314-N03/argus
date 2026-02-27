// Mock aircraft data generator
import type { Aircraft, AircraftCategory } from '@/domain/models'

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
  'Australia',
]

const callsigns = [
  'RCH123',
  'EGLL456',
  'AAR789',
  'UAC234',
  'CPA567',
  'UAE890',
  'BAW123',
  'DLH456',
  'AFR789',
  null,
]

const aircraftCategories: AircraftCategory[] = [
  'commercial',
  'military',
  'government',
  'private',
  'cargo',
]

const registrations = [
  'N12345',
  'G-ABCD',
  'F-GHIJ',
  'D-ABCD',
  'JA-ABCD',
  'VT-ABCD',
  'PR-ABCD',
  'CC-ABCD',
  null,
]

// Generate random position within bounds
function generatePosition(): { latitude: number; longitude: number; altitude: number } {
  const latitude = -60 + Math.random() * 120
  const longitude = -180 + Math.random() * 360
  const altitude = Math.floor(Math.random() * 40000) + 10000

  return { latitude, longitude, altitude }
}

// Generate random velocity
function generateVelocity(): { heading: number; speed: number; verticalSpeed: number } | null {
  if (Math.random() > 0.8) return null

  return {
    heading: Math.floor(Math.random() * 360),
    speed: Math.floor(Math.random() * 500) + 200,
    verticalSpeed: Math.floor(Math.random() * 2000) - 1000,
  }
}

// Generate mock aircraft
export function generateMockAircraft(overrides?: Partial<Aircraft>): Aircraft {
  const category = aircraftCategories[Math.floor(Math.random() * aircraftCategories.length)]

  return {
    id: `ac_${Math.random().toString(36).substr(2, 9)}`,
    callsign: callsigns[Math.floor(Math.random() * callsigns.length)],
    icao24: Math.random().toString(16).substr(2, 6).toUpperCase(),
    originCountry: countries[Math.floor(Math.random() * countries.length)],
    position: generatePosition(),
    velocity: generateVelocity(),
    altitude: Math.floor(Math.random() * 40000) + 10000,
    lastSeen: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    category,
    registration: registrations[Math.floor(Math.random() * registrations.length)] ?? undefined,
    ...overrides,
  }
}

// Generate multiple mock aircraft
export function generateMockAircraftList(count: number = 50): Aircraft[] {
  return Array.from({ length: count }, () => generateMockAircraft())
}
