import type { Vessel } from "@/domain/models";
import { getShipTypeLabel } from "@/domain/models";

import styles from "./vessel-table.module.scss";

interface VesselTableProps {
  vessels: Vessel[];
  isLoading?: boolean;
}

export const VesselTable = ({
  vessels,
  isLoading = false,
}: VesselTableProps) => {
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
        </div>
      </div>
    );
  }

  if (vessels.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>No vessel data available.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>MMSI</th>
              <th>Flag</th>
              <th>Type</th>
              <th>Speed</th>
              <th>Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {vessels.map((vessel) => (
              <tr key={vessel.id}>
                <td className={styles.name}>{vessel.name ?? "Unknown"}</td>
                <td className={styles.mono}>{vessel.mmsi}</td>
                <td>{vessel.flag}</td>
                <td>
                  <span
                    className={`${styles.badge} ${styles[`badge${vessel.shipType.replace(" ", "")}`]}`}
                  >
                    {getShipTypeLabel(vessel.shipType)}
                  </span>
                </td>
                <td>{vessel.speed != null ? `${vessel.speed} kn` : "N/A"}</td>
                <td className={styles.time}>
                  {new Date(vessel.lastSeen).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
