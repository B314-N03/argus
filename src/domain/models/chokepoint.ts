export interface Chokepoint {
  id: string
  name: string
  position: { latitude: number; longitude: number }
  description: string
  significance: string
  dailyTransits: number
  currentVessels: number
  riskLevel: 'low' | 'moderate' | 'elevated' | 'high'
}

export function getRiskLevelLabel(level: Chokepoint['riskLevel']): string {
  const labels: Record<Chokepoint['riskLevel'], string> = {
    low: 'Low',
    moderate: 'Moderate',
    elevated: 'Elevated',
    high: 'High',
  }
  return labels[level]
}
