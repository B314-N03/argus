// Mock indicators data generator
import type { ActivityIndicator, IndicatorType, TimeWindow, TrendDirection } from '@/domain/models'

const indicatorTypes: IndicatorType[] = [
  'isr_activity',
  'naval_presence',
  'tanker_density',
  'signal_activity',
  'air_activity',
  'anomaly_score',
]

const regions = [
  'north_atlantic',
  'south_china_sea',
  'mediterranean',
  'persian_gulf',
  'indo_pacific',
  'baltic_sea',
  'caribbean',
]

const timeWindows: TimeWindow[] = ['1h', '6h', '24h', '7d']

const trends: TrendDirection[] = ['increasing', 'decreasing', 'stable']

const indicatorNames: Record<IndicatorType, string> = {
  isr_activity: 'ISR Activity Index',
  naval_presence: 'Naval Presence Index',
  tanker_density: 'Tanker Density Score',
  signal_activity: 'Signal Activity Index',
  air_activity: 'Air Activity Index',
  anomaly_score: 'Anomaly Score',
}

// Generate random deviation (-30% to +50%)
function generateDeviation(): number {
  return Math.random() * 80 - 30
}

// Generate confidence (0.6 to 0.98)
function generateConfidence(): number {
  return 0.6 + Math.random() * 0.38
}

// Generate baseline value (40 to 80)
function generateBaseline(): number {
  return 40 + Math.random() * 40
}

// Generate value based on deviation from baseline
function generateValue(baseline: number, deviation: number): number {
  return baseline * (1 + deviation / 100)
}

// Generate trend based on deviation
function generateTrend(deviation: number): TrendDirection {
  if (deviation > 10) return 'increasing'
  if (deviation < -10) return 'decreasing'
  return 'stable'
}

// Generate history points
function generateHistory(baseValue: number, deviation: number): { timestamp: string; value: number; baseline: number }[] {
  const history = []
  const now = new Date()

  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
    const variance = (Math.random() - 0.5) * 20
    const value = baseValue * (1 + (deviation + variance) / 100)

    history.push({
      timestamp: timestamp.toISOString(),
      value: Math.max(0, value),
      baseline: baseValue,
    })
  }

  return history
}

// Generate a single mock indicator
export function generateMockIndicator(overrides?: Partial<ActivityIndicator>): ActivityIndicator {
  const type = indicatorTypes[Math.floor(Math.random() * indicatorTypes.length)]
  const region = regions[Math.floor(Math.random() * regions.length)]
  const timeWindow = timeWindows[Math.floor(Math.random() * timeWindows.length)]
  const deviation = generateDeviation()
  const baseline = generateBaseline()
  const value = generateValue(baseline, deviation)
  const confidence = generateConfidence()

  return {
    id: `ind_${type}_${region}_${timeWindow}`,
    name: indicatorNames[type],
    type,
    value: Math.round(value * 10) / 10,
    baseline: Math.round(baseline * 10) / 10,
    deviation: Math.round(deviation * 10) / 10,
    confidence: Math.round(confidence * 100) / 100,
    timeWindow,
    region,
    updatedAt: new Date().toISOString(),
    trend: generateTrend(deviation),
    history: generateHistory(baseline, deviation),
    ...overrides,
  }
}

// Generate multiple mock indicators
export function generateMockIndicators(count: number = 12): ActivityIndicator[] {
  const indicators: ActivityIndicator[] = []

  // Ensure at least one of each type
  for (const type of indicatorTypes) {
    indicators.push(generateMockIndicator({ type }))
  }

  // Fill remaining with random indicators
  const remaining = count - indicatorTypes.length
  for (let i = 0; i < remaining; i++) {
    indicators.push(generateMockIndicator())
  }

  return indicators
}

// Calculate summary statistics
export function calculateIndicatorsSummary(indicators: ActivityIndicator[]): {
  totalIndicators: number
  elevatedCount: number
  anomalousCount: number
  averageDeviation: number
} {
  const elevatedCount = indicators.filter(i => i.deviation > 15).length
  const anomalousCount = indicators.filter(i => i.deviation > 30).length
  const averageDeviation = indicators.reduce((sum, i) => sum + i.deviation, 0) / indicators.length

  return {
    totalIndicators: indicators.length,
    elevatedCount,
    anomalousCount,
    averageDeviation: Math.round(averageDeviation * 10) / 10,
  }
}
