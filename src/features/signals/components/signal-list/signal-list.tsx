import type { SignalEvent } from "@/domain/models";
import { getSignalTypeLabel, formatFrequency } from "@/domain/models";

import styles from "./signal-list.module.scss";

interface SignalListProps {
  signals: SignalEvent[];
  isLoading?: boolean;
}

export const SignalList = ({ signals, isLoading = false }: SignalListProps) => {
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
        </div>
      </div>
    );
  }

  if (signals.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>No signal events available.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Frequency</th>
              <th>Strength</th>
              <th>Source</th>
              <th>Modulation</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {signals.map((signal) => (
              <tr key={signal.id}>
                <td>
                  <span
                    className={`${styles.badge} ${styles[`badge${signal.signalType}`]}`}
                  >
                    {getSignalTypeLabel(signal.signalType)}
                  </span>
                </td>
                <td className={styles.mono}>
                  {formatFrequency(signal.frequency)}
                </td>
                <td>
                  <div className={styles.strengthBar}>
                    <div
                      className={styles.strengthFill}
                      style={{ width: `${signal.strength}%` }}
                    />
                    <span className={styles.strengthValue}>
                      {signal.strength}%
                    </span>
                  </div>
                </td>
                <td>{signal.source}</td>
                <td className={styles.mono}>{signal.modulation ?? "N/A"}</td>
                <td className={styles.time}>
                  {new Date(signal.timestamp).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
