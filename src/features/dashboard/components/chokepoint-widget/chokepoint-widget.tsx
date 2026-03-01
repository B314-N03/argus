import { Navigation } from 'lucide-react'
import { Card } from '@/components/ui/card/card'
import { InfoTooltip } from '@/components/ui/info-tooltip/info-tooltip'
import { mockChokepoints } from '@/lib/api/mock/chokepoints'
import type { Chokepoint } from '@/domain/models'
import clsx from 'clsx'
import styles from './chokepoint-widget.module.scss'

const riskStyles: Record<Chokepoint['riskLevel'], string> = {
  low: styles.riskLow,
  moderate: styles.riskModerate,
  elevated: styles.riskElevated,
  high: styles.riskHigh,
}

const riskBarColors: Record<Chokepoint['riskLevel'], string> = {
  low: '#18b76f',
  moderate: '#f4900c',
  elevated: '#f4900c',
  high: '#f4212e',
}

export function ChokepointWidget() {
  return (
    <Card padding="sm">
      <div className={styles.widget}>
        <div className={styles.header}>
          <Navigation size={16} className={styles.icon} />
          <span className={styles.title}>Chokepoints</span>
          <InfoTooltip content="Strategic maritime chokepoints monitored for transit activity and risk level changes." />
        </div>
        <div className={styles.list}>
          {mockChokepoints.map((cp) => {
            const ratio = Math.min(cp.currentVessels / cp.dailyTransits, 1)
            return (
              <div key={cp.id} className={styles.item}>
                <div className={styles.itemHeader}>
                  <span className={styles.name}>{cp.name}</span>
                  <span className={clsx(styles.riskBadge, riskStyles[cp.riskLevel])}>
                    {cp.riskLevel}
                  </span>
                </div>
                <div className={styles.stats}>
                  <span className={styles.stat}>
                    Current: <strong>{cp.currentVessels}</strong>
                  </span>
                  <span className={styles.stat}>
                    Avg/day: <strong>{cp.dailyTransits}</strong>
                  </span>
                </div>
                <div className={styles.barContainer}>
                  <div
                    className={styles.bar}
                    style={{
                      width: `${ratio * 100}%`,
                      backgroundColor: riskBarColors[cp.riskLevel],
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
