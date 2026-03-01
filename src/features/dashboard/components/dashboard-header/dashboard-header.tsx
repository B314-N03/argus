import { useState, useEffect } from 'react'
import styles from './dashboard-header.module.scss'

interface DashboardHeaderProps {
  activeRegions: number
  totalEntities: number
}

export function DashboardHeader({ activeRegions, totalEntities }: DashboardHeaderProps) {
  const [utcTime, setUtcTime] = useState(getUTC())

  useEffect(() => {
    const interval = setInterval(() => setUtcTime(getUTC()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.name}>ARGUS</span>
        <span className={styles.subtitle}>Global Situational Dashboard</span>
      </div>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{activeRegions}</span>
          <span className={styles.statLabel}>Active Regions</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.stat}>
          <span className={styles.statValue}>{totalEntities}</span>
          <span className={styles.statLabel}>Tracked Entities</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.utc}>
          <span className={styles.utcLabel}>UTC</span>
          <span className={styles.utcTime}>{utcTime}</span>
        </div>
      </div>
    </div>
  )
}

function getUTC(): string {
  const now = new Date()
  return now.toISOString().slice(11, 19)
}
