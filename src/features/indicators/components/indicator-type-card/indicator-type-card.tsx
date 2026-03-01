import { useState, useMemo } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { ActivityIndicator, IndicatorType, IndicatorHistoryPoint } from '@/domain/models'
import { getIndicatorTypeLabel, formatDeviation, getConfidenceLabel } from '@/domain/models'
import { InfoTooltip } from '@/components/ui/info-tooltip/info-tooltip'
import { tooltipContent } from '@/lib/tooltip-content'
import { IndicatorTrend } from '../indicator-trend/indicator-trend'
import styles from './indicator-type-card.module.scss'

interface IndicatorTypeCardProps {
  type: IndicatorType
  indicators: ActivityIndicator[]
}

function formatRegion(region: string): string {
  return region.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function averageHistory(indicators: ActivityIndicator[]): IndicatorHistoryPoint[] {
  const withHistory = indicators.filter((i) => i.history && i.history.length > 0)
  if (withHistory.length === 0) return []

  const length = withHistory[0].history!.length
  const result: IndicatorHistoryPoint[] = []

  for (let i = 0; i < length; i++) {
    let sumValue = 0
    let sumBaseline = 0
    let count = 0
    for (const ind of withHistory) {
      const point = ind.history![i]
      if (point) {
        sumValue += point.value
        sumBaseline += point.baseline
        count++
      }
    }
    result.push({
      timestamp: withHistory[0].history![i].timestamp,
      value: count > 0 ? sumValue / count : 0,
      baseline: count > 0 ? sumBaseline / count : 0,
    })
  }

  return result
}

export function IndicatorTypeCard({ type, indicators }: IndicatorTypeCardProps) {
  const [expanded, setExpanded] = useState(false)

  const globalAvgValue = useMemo(
    () => indicators.reduce((s, i) => s + i.value, 0) / indicators.length,
    [indicators],
  )

  const globalAvgDeviation = useMemo(
    () => indicators.reduce((s, i) => s + i.deviation, 0) / indicators.length,
    [indicators],
  )

  const avgHistory = useMemo(() => averageHistory(indicators), [indicators])

  const deviationClass =
    globalAvgDeviation > 15
      ? styles.deviationElevated
      : globalAvgDeviation > 30
        ? styles.deviationAnomalous
        : globalAvgDeviation < -10
          ? styles.deviationNegative
          : styles.deviationNeutral

  return (
    <div className={styles.card}>
      <button
        className={styles.header}
        onClick={() => setExpanded(!expanded)}
        type="button"
      >
        <div className={styles.headerLeft}>
          <h3 className={styles.typeName}>
            {getIndicatorTypeLabel(type)}
            {tooltipContent[type] && <InfoTooltip content={tooltipContent[type]} />}
          </h3>
          <div className={styles.stats}>
            <span className={styles.avgValue}>{globalAvgValue.toFixed(1)}</span>
            <span className={`${styles.avgDeviation} ${deviationClass}`}>
              {formatDeviation(globalAvgDeviation)}
            </span>
          </div>
        </div>
        <div className={styles.headerRight}>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      <div className={styles.sparkline}>
        <IndicatorTrend history={avgHistory} />
      </div>

      {expanded && (
        <div className={styles.regionBreakdown}>
          <table className={styles.regionTable}>
            <thead>
              <tr>
                <th>Region</th>
                <th>Value</th>
                <th>vs Baseline</th>
                <th>Trend</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {indicators.map((ind) => {
                const rowClass =
                  ind.deviation > 30
                    ? styles.rowAnomalous
                    : ind.deviation > 15
                      ? styles.rowElevated
                      : ''

                const devClass =
                  ind.deviation > 0
                    ? styles.deviationPositive
                    : ind.deviation < 0
                      ? styles.deviationNegative
                      : styles.deviationNeutral

                return (
                  <tr key={ind.id} className={rowClass}>
                    <td>{formatRegion(ind.region)}</td>
                    <td>{ind.value.toFixed(1)}</td>
                    <td className={devClass}>{formatDeviation(ind.deviation)}</td>
                    <td>{ind.trend}</td>
                    <td>{getConfidenceLabel(ind.confidence)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
