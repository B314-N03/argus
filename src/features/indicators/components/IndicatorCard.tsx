import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { ActivityIndicator } from '@/domain/models'
import { formatDeviation, getConfidenceLabel } from '@/domain/models'
import IndicatorTrend from './IndicatorTrend'
import styles from './IndicatorCard.module.scss'

interface IndicatorCardProps {
  indicator: ActivityIndicator
  onClick?: () => void
}

export default function IndicatorCard({ indicator, onClick }: IndicatorCardProps) {
  const deviationClass =
    indicator.deviation > 0
      ? styles.deviationPositive
      : indicator.deviation < 0
        ? styles.deviationNegative
        : styles.deviationNeutral

  const trendClass =
    indicator.trend === 'increasing'
      ? styles.trendIncreasing
      : indicator.trend === 'decreasing'
        ? styles.trendDecreasing
        : styles.trendStable

  const confidenceClass =
    indicator.confidence >= 0.9
      ? styles.confidenceHigh
      : indicator.confidence >= 0.7
        ? styles.confidenceMedium
        : styles.confidenceLow

  const TrendIcon =
    indicator.trend === 'increasing'
      ? TrendingUp
      : indicator.trend === 'decreasing'
        ? TrendingDown
        : Minus

  const regionLabel = indicator.region.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <div className={styles.card} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.name}>{indicator.name}</h3>
          <span className={styles.type}>{indicator.type.replace(/_/g, ' ')}</span>
        </div>
        <span className={`${styles.trendBadge} ${trendClass}`}>
          <TrendIcon size={12} />
          {indicator.trend}
        </span>
      </div>

      <div className={styles.valueContainer}>
        <span className={styles.value}>{indicator.value.toFixed(1)}</span>
        <span className={`${styles.deviation} ${deviationClass}`}>
          {formatDeviation(indicator.deviation)}
        </span>
      </div>

      <div className={styles.baseline}>Baseline: {indicator.baseline.toFixed(1)}</div>

      {indicator.history && indicator.history.length > 0 && (
        <IndicatorTrend history={indicator.history} />
      )}

      <div className={styles.meta}>
        <span className={styles.region}>{regionLabel}</span>
        <span className={`${styles.confidence} ${confidenceClass}`}>
          {getConfidenceLabel(indicator.confidence)} confidence
        </span>
      </div>
    </div>
  )
}
