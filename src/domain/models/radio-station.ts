export type RadioModulation = 'AM' | 'USB' | 'LSB' | 'CW' | 'FM'

export type RadioStationStatus = 'active' | 'inactive' | 'intermittent' | 'unknown'

export type SignalPattern = 'buzz' | 'pip' | 'sweep' | 'numbers' | 'morse' | 'silence'

export interface RadioStation {
  id: string
  name: string
  callsign: string
  nickname: string
  frequency: number // in kHz
  mode: RadioModulation
  country: string
  status: RadioStationStatus
  lastActivity: string // ISO timestamp
  description: string
  activityLevel: number // 0-100
  history: { timestamp: string; event: string }[]
  webSdrUrl?: string
  signalPattern: SignalPattern
}

export interface RadioSummary {
  total: number
  active: number
  inactive: number
  averageActivity: number
}

export function getStatusLabel(status: RadioStationStatus): string {
  const labels: Record<RadioStationStatus, string> = {
    active: 'Active',
    inactive: 'Inactive',
    intermittent: 'Intermittent',
    unknown: 'Unknown',
  }
  return labels[status]
}

export function formatKHz(frequency: number): string {
  if (frequency >= 1000) {
    return `${(frequency / 1000).toFixed(3)} MHz`
  }
  return `${frequency} kHz`
}
