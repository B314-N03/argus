import type { Aircraft } from '@/domain/models'
import { getAircraftCategoryLabel } from '@/domain/models'
import styles from './aircraft-table.module.scss'

interface AircraftTableProps {
  aircraft: Aircraft[]
  isLoading?: boolean
}

export function AircraftTable({ aircraft, isLoading = false }: AircraftTableProps) {
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
        </div>
      </div>
    )
  }

  if (aircraft.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>No aircraft data available.</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Callsign</th>
              <th>ICAO24</th>
              <th>Origin</th>
              <th>Category</th>
              <th>Altitude</th>
              <th>Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {aircraft.map((ac) => (
              <tr key={ac.id}>
                <td className={styles.callsign}>{ac.callsign ?? 'N/A'}</td>
                <td className={styles.mono}>{ac.icao24}</td>
                <td>{ac.originCountry}</td>
                <td>
                  <span className={`${styles.badge} ${styles[`badge${ac.category}`]}`}>
                    {getAircraftCategoryLabel(ac.category)}
                  </span>
                </td>
                <td>{ac.altitude != null ? `${ac.altitude.toLocaleString()} ft` : 'N/A'}</td>
                <td className={styles.time}>
                  {new Date(ac.lastSeen).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
