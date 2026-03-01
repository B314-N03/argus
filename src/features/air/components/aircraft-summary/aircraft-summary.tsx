import type { Aircraft } from '@/domain/models'
import { Card } from '@/components/ui/card/card'
import styles from './aircraft-summary.module.scss'

interface AircraftSummaryProps {
  aircraft: Aircraft[]
  isLoading?: boolean
}

export function AircraftSummary({ aircraft, isLoading = false }: AircraftSummaryProps) {
  if (isLoading) {
    return null
  }

  const militaryCount = aircraft.filter((a) => a.category === 'military').length
  const governmentCount = aircraft.filter((a) => a.category === 'government').length
  const commercialCount = aircraft.filter((a) => a.category === 'commercial').length
  const uniqueCountries = new Set(aircraft.map((a) => a.originCountry)).size

  return (
    <div className={styles.container}>
      <Card padding="lg">
        <h3 className={styles.title}>Activity Summary</h3>
        <div className={styles.grid}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Total Tracked</span>
            <span className={styles.statValue}>{aircraft.length}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Military</span>
            <span className={`${styles.statValue} ${styles.military}`}>{militaryCount}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Government</span>
            <span className={`${styles.statValue} ${styles.government}`}>{governmentCount}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Commercial</span>
            <span className={styles.statValue}>{commercialCount}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Countries</span>
            <span className={styles.statValue}>{uniqueCountries}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
