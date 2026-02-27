// Mock signals data generator
import type { SignalEvent, SignalType } from '@/domain/models'

const signalTypes: SignalType[] = [
  'adsb',
  'ais',
  'hf',
  'vhf',
  'satellite',
  'radar',
]

const sources = [
  'Ground Station Alpha',
  'Coast Guard Station',
  'Satellite Constellation',
  'Military Radar',
  'Civilian ATC',
  'Naval Operations',
  'Research Station',
]

const modulations = [
  'AM',
  'FM',
  'PSK31',
  'CW',
  'SSB',
  'FDM',
  null,
]

// Generate random position
function generatePosition(): { latitude: number; longitude: number } | null {
  if (Math.random() > 0.7) return null

  return {
    latitude: -60 + Math.random() * 120,
    longitude: -180 + Math.random() * 360,
  }
}

// Generate mock signal event
export function generateMockSignal(overrides?: Partial<SignalEvent>): SignalEvent {
  const signalType = signalTypes[Math.floor(Math.random() * signalTypes.length)]

  // Generate frequency based on signal type
  let frequency: number
  switch (signalType) {
    case 'adsb':
      frequency = 1090000000 + Math.random() * 100000000 // 1090 MHz
      break
    case 'ais':
      frequency = 161975000 + Math.random() * 20000 // 162 MHz
      break
    case 'hf':
      frequency = 3000000 + Math.random() * 27000000 // 3-30 MHz
      break
    case 'vhf':
      frequency = 30000000 + Math.random() * 300000000 // 30-330 MHz
      break
    case 'satellite':
      frequency = 2000000000 + Math.random() * 6000000000 // 2-8 GHz
      break
    case 'radar':
      frequency = 1000000000 + Math.random() * 10000000000 // 1-11 GHz
      break
    default:
      frequency = 100000 + Math.random() * 10000000
  }

  return {
    id: `sig_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    frequency: Math.round(frequency),
    signalType,
    location: generatePosition(),
    strength: Math.floor(Math.random() * 100),
    modulation: modulations[Math.floor(Math.random() * modulations.length)],
    source: sources[Math.floor(Math.random() * sources.length)],
    duration: Math.random() > 0.5 ? Math.floor(Math.random() * 300) : undefined,
    ...overrides,
  }
}

// Generate multiple mock signals
export function generateMockSignalsList(count: number = 50): SignalEvent[] {
  return Array.from({ length: count }, () => generateMockSignal())
}
