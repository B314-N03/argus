import type { ReactNode } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { InfoTooltip } from '@/components/ui/info-tooltip/info-tooltip'
import styles from './stat-card.module.scss'

interface StatCardProps {
  label: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  description?: string
  icon?: ReactNode
  tooltip?: string
  className?: string
}

export function StatCard({
  label,
  value,
  trend = 'neutral',
  trendValue,
  description,
  icon,
  tooltip,
  className = '',
}: StatCardProps) {
  const trendClass = {
    up: styles.trendUp,
    down: styles.trendDown,
    neutral: styles.trendNeutral,
  }[trend]

  const TrendIcon = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
  }[trend]

  return (
    <div className={`${styles.statCard} ${className}`}>
      <div className={styles.header}>
        <span className={styles.label}>
          {label}
          {tooltip && <InfoTooltip content={tooltip} />}
        </span>
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>
      <div className={styles.value}>{value}</div>
      {(trend !== 'neutral' || trendValue) && (
        <div className={`${styles.trend} ${trendClass}`}>
          <TrendIcon size={16} />
          {trendValue && <span>{trendValue}</span>}
        </div>
      )}
      {description && <div className={styles.description}>{description}</div>}
    </div>
  )
}
