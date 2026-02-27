// Time window for indicator calculation
export type TimeWindow = '1h' | '6h' | '24h' | '7d' | '30d'

// Indicator types
export type IndicatorType =
  | 'isr_activity'
  | 'naval_presence'
  | 'tanker_density'
  | 'signal_activity'
  | 'air_activity'
  | 'anomaly_score'

// Trend direction
export type TrendDirection = 'increasing' | 'decreasing' | 'stable'

// Activity indicator entity
export interface ActivityIndicator {
  id: string
  name: string
  type: IndicatorType
  value: number
  baseline: number
  deviation: number
  confidence: number
  timeWindow: TimeWindow
  region: string
  updatedAt: string
  trend: TrendDirection
  history?: IndicatorHistoryPoint[]
}

// Historical data point for trend visualization
export interface IndicatorHistoryPoint {
  timestamp: string
  value: number
  baseline: number
}

// Helper function to get indicator type label
export function getIndicatorTypeLabel(type: IndicatorType): string {
  const labels: Record<IndicatorType, string> = {
    isr_activity: 'ISR Activity Index',
    naval_presence: 'Naval Presence Index',
    tanker_density: 'Tanker Density Score',
    signal_activity: 'Signal Activity Index',
    air_activity: 'Air Activity Index',
    anomaly_score: 'Anomaly Score',
  }
  return labels[type]
}

// Helper function to get time window label
export function getTimeWindowLabel(timeWindow: TimeWindow): string {
  const labels: Record<TimeWindow, string> = {
    '1h': 'Last Hour',
    '6h': 'Last 6 Hours',
    '24h': 'Last 24 Hours',
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
  }
  return labels[timeWindow]
}

// Helper function to format deviation as percentage
export function formatDeviation(deviation: number): string {
  const sign = deviation >= 0 ? '+' : ''
  return `${sign}${deviation.toFixed(1)}%`
}

// Helper function to get confidence label
export function getConfidenceLabel(confidence: number): string {
  if (confidence >= 0.9) return 'High'
  if (confidence >= 0.7) return 'Medium'
  return 'Low'
}

// Helper function to get trend label
export function getTrendLabel(trend: TrendDirection): string {
  const labels: Record<TrendDirection, string> = {
    increasing: 'Increasing',
    decreasing: 'Decreasing',
    stable: 'Stable',
  }
  return labels[trend]
}
