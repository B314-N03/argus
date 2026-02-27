// Re-use the GeoPosition interface
export interface GeoPosition {
  latitude: number
  longitude: number
  altitude?: number
}

// Signal types based on OSINT classification
export type SignalType =
  | 'adsb'
  | 'ais'
  | 'hf'
  | 'vhf'
  | 'satellite'
  | 'radar'
  | 'unknown'

// Signal event entity
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

// Helper function to get signal type label
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

// Helper function to format frequency
export function formatFrequency(frequency: number): string {
  if (frequency >= 1000000) {
    return `${(frequency / 1000000).toFixed(2)} MHz`
  }
  if (frequency >= 1000) {
    return `${(frequency / 1000).toFixed(2)} kHz`
  }
  return `${frequency.toFixed(2)} Hz`
}
