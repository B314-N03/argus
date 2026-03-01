import { Radio } from 'lucide-react'
import { Card } from '@/components/ui/card/card'
import { InfoTooltip } from '@/components/ui/info-tooltip/info-tooltip'
import { tooltipContent } from '@/lib/tooltip-content'
import { useRadios } from '../../hooks/use-radios'
import styles from './radio-dashboard-card.module.scss'

export function RadioDashboardCard() {
  const { data, isLoading } = useRadios()

  if (isLoading || !data) {
    return (
      <Card padding="sm">
        <div className={styles.loading}>Loading radios...</div>
      </Card>
    )
  }

  const { summary, stations } = data
  const mostRecent = [...stations]
    .filter((s) => s.status !== 'inactive')
    .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())[0]

  return (
    <Card padding="sm">
      <div className={styles.header}>
        <Radio size={16} className={styles.icon} />
        <span className={styles.title}>Radio Stations</span>
        <InfoTooltip content={tooltipContent.radio_status} />
      </div>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{summary.total}</span>
          <span className={styles.statLabel}>Monitored</span>
        </div>
        <div className={styles.stat}>
          <span className={`${styles.statValue} ${styles.active}`}>{summary.active}</span>
          <span className={styles.statLabel}>Active</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{summary.averageActivity}%</span>
          <span className={styles.statLabel}>Avg Activity</span>
        </div>
      </div>
      {mostRecent && (
        <div className={styles.recent}>
          <span className={styles.recentLabel}>Most recent:</span>
          <span className={styles.recentName}>{mostRecent.nickname}</span>
        </div>
      )}
    </Card>
  )
}
