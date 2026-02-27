import type { ActivityIndicator, TimeWindow } from '@/domain/models'
import IndicatorCard from './IndicatorCard'
import styles from './IndicatorsGrid.module.scss'

interface IndicatorsGridProps {
  indicators: ActivityIndicator[]
  isLoading?: boolean
  timeWindow?: TimeWindow
  onTimeWindowChange?: (timeWindow: TimeWindow) => void
  onIndicatorClick?: (indicator: ActivityIndicator) => void
}

const timeWindowOptions: { value: TimeWindow; label: string }[] = [
  { value: '1h', label: '1 Hour' },
  { value: '6h', label: '6 Hours' },
  { value: '24h', label: '24 Hours' },
  { value: '7d', label: '7 Days' },
]

export default function IndicatorsGrid({
  indicators,
  isLoading = false,
  timeWindow,
  onTimeWindowChange,
  onIndicatorClick,
}: IndicatorsGridProps) {
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Activity Indicators</h2>
        </div>
        <div className={styles.loading}>
          <div className={styles.spinner} />
        </div>
      </div>
    )
  }

  if (!indicators || indicators.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Activity Indicators</h2>
        </div>
        <div className={styles.empty}>
          <p>No indicators available for the selected criteria.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Activity Indicators</h2>
        <div className={styles.controls}>
          {onTimeWindowChange && (
            <select
              className={styles.filter}
              value={timeWindow}
              onChange={(e) => onTimeWindowChange(e.target.value as TimeWindow)}
            >
              {timeWindowOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      <div className={styles.grid}>
        {indicators.map((indicator) => (
          <IndicatorCard
            key={indicator.id}
            indicator={indicator}
            onClick={() => onIndicatorClick?.(indicator)}
          />
        ))}
      </div>
    </div>
  )
}
