import type { Vessel } from '@/domain/models'
import { Card } from '@/components/ui/card/card'
import styles from './vessel-summary.module.scss'

interface VesselSummaryProps {
  vessels: Vessel[]
  isLoading?: boolean
}

export function VesselSummary({ vessels, isLoading = false }: VesselSummaryProps) {
  if (isLoading) {
    return null
  }

  const militaryCount = vessels.filter((v) => v.shipType === 'military').length
  const tankerCount = vessels.filter((v) => v.shipType === 'tanker').length
  const cargoCount = vessels.filter((v) => v.shipType === 'cargo').length
  const uniqueFlags = new Set(vessels.map((v) => v.flag)).size

  return (
    <div className={styles.container}>
      <Card padding="lg">
        <h3 className={styles.title}>Naval Overview</h3>
        <div className={styles.grid}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Total Vessels</span>
            <span className={styles.statValue}>{vessels.length}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Military</span>
            <span className={`${styles.statValue} ${styles.military}`}>{militaryCount}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Tankers</span>
            <span className={`${styles.statValue} ${styles.tanker}`}>{tankerCount}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Cargo</span>
            <span className={styles.statValue}>{cargoCount}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Flags</span>
            <span className={styles.statValue}>{uniqueFlags}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
