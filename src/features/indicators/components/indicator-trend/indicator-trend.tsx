import type { IndicatorHistoryPoint } from '@/domain/models'
import styles from './indicator-trend.module.scss'

interface IndicatorTrendProps {
  history: IndicatorHistoryPoint[]
}

export function IndicatorTrend({ history }: IndicatorTrendProps) {
  if (!history || history.length === 0) return null

  const values = history.map((h) => h.value)
  const maxValue = Math.max(...values, ...history.map((h) => h.baseline))
  const minValue = Math.min(...values, ...history.map((h) => h.baseline))
  const range = maxValue - minValue || 1

  return (
    <div className={styles.container}>
      {history.map((point, index) => {
        const height = ((point.value - minValue) / range) * 100
        const baselineHeight = ((point.baseline - minValue) / range) * 100

        return (
          <div key={index} className={styles.barWrapper}>
            <div
              className={`${styles.bar} ${styles.barValue}`}
              style={{ height: `${Math.max(height, 5)}%` }}
              title={`${point.value.toFixed(1)} (baseline: ${point.baseline.toFixed(1)})`}
            />
            <div
              className={`${styles.bar} ${styles.barBaseline}`}
              style={{ height: `${Math.max(baselineHeight, 2)}%`, position: 'absolute', bottom: 0 }}
            />
          </div>
        )
      })}
    </div>
  )
}
