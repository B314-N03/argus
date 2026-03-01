import type { GeoPosition } from '../types/geo'

export type SignalType =
  | 'adsb'
  | 'ais'
  | 'hf'
  | 'vhf'
  | 'satellite'
  | 'radar'
  | 'unknown'

export interface SignalEvent {
  id: string
  timestamp: string
  frequency: number
  signalType: SignalType
  location: GeoPosition | null
  strength: number
  modulation: string | null
  source: string
  duration?: number
  encodedData?: string
}

export function getSignalTypeLabel(signalType: SignalType): string {
  const labels: Record<SignalType, string> = {
    adsb: 'ADS-B',
    ais: 'AIS',
    hf: 'HF Radio',
    vhf: 'VHF Radio',
    satellite: 'Satellite',
    radar: 'Radar',
    unknown: 'Unknown',
  }
  return labels[signalType]
}

export function formatFrequency(frequency: number): string {
  if (frequency >= 1000000) {
    return `${(frequency / 1000000).toFixed(2)} MHz`
  }
  if (frequency >= 1000) {
    return `${(frequency / 1000).toFixed(2)} kHz`
  }
  return `${frequency.toFixed(2)} Hz`
}
