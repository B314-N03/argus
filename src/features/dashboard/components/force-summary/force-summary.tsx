import { Shield } from 'lucide-react'
import { Card } from '@/components/ui/card/card'
import { InfoTooltip } from '@/components/ui/info-tooltip/info-tooltip'
import type { GlobePoint } from '../globe-view/globe-view'
import styles from './force-summary.module.scss'

interface ForceSummaryProps {
  aircraftPoints: GlobePoint[]
  vesselPoints: GlobePoint[]
  signalCount: number
}

export function ForceSummary({ aircraftPoints, vesselPoints, signalCount }: ForceSummaryProps) {
  const militaryAircraft = aircraftPoints.filter(
    (p) => p.category === 'military' || p.category === 'government',
  ).length
  const civilianAircraft = aircraftPoints.length - militaryAircraft

  const militaryVessels = vesselPoints.filter(
    (p) => p.shipType === 'military' || p.shipType === 'coast guard',
  ).length
  const civilianVessels = vesselPoints.length - militaryVessels

  return (
    <Card padding="sm">
      <div className={styles.widget}>
        <div className={styles.header}>
          <Shield size={16} className={styles.icon} />
          <span className={styles.title}>Force Disposition</span>
          <InfoTooltip content="Summary breakdown of tracked entities by military and civilian classification." />
        </div>

        <div className={styles.groups}>
          <div className={styles.group}>
            <span className={styles.groupTitle}>Aircraft</span>
            <div className={styles.rows}>
              <div className={styles.row}>
                <span className={styles.label}>
                  <span className={styles.dot} style={{ backgroundColor: '#1d9bf0' }} />
                  Military / Gov
                </span>
                <span className={styles.value}>{militaryAircraft}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>
                  <span className={styles.dot} style={{ backgroundColor: '#71767b' }} />
                  Civilian
                </span>
                <span className={styles.value}>{civilianAircraft}</span>
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.group}>
            <span className={styles.groupTitle}>Vessels</span>
            <div className={styles.rows}>
              <div className={styles.row}>
                <span className={styles.label}>
                  <span className={styles.dot} style={{ backgroundColor: '#1d9bf0' }} />
                  Military / CG
                </span>
                <span className={styles.value}>{militaryVessels}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>
                  <span className={styles.dot} style={{ backgroundColor: '#18b76f' }} />
                  Civilian
                </span>
                <span className={styles.value}>{civilianVessels}</span>
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.group}>
            <span className={styles.groupTitle}>Signals</span>
            <div className={styles.rows}>
              <div className={styles.totalRow}>
                <span className={styles.label}>
                  <span className={styles.dot} style={{ backgroundColor: '#f4900c' }} />
                  Total Captured
                </span>
                <span className={styles.value}>{signalCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
