export type ZoneType = 'notam' | 'blockade' | 'duty_zone' | 'exclusion'

export interface Zone {
  id: string
  name: string
  type: ZoneType
  center: [number, number] // [lat, lng]
  radius?: number // km, for circular zones
  polygon?: [number, number][] // for irregular zones
  severity: 'low' | 'medium' | 'high'
  description: string
  active: boolean
}

export function getZoneTypeLabel(type: ZoneType): string {
  const labels: Record<ZoneType, string> = {
    notam: 'NOTAM',
    blockade: 'Naval Blockade',
    duty_zone: 'Active Duty Zone',
    exclusion: 'Exclusion Zone',
  }
  return labels[type]
}
