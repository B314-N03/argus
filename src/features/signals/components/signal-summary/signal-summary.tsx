import { Card } from "@/components/ui/card/card";
import type { SignalEvent } from "@/domain/models";

import styles from "./signal-summary.module.scss";

interface SignalSummaryProps {
  signals: SignalEvent[];
  isLoading?: boolean;
}

export const SignalSummary = ({
  signals,
  isLoading = false,
}: SignalSummaryProps) => {
  if (isLoading) {
    return null;
  }

  const adsbCount = signals.filter((s) => s.signalType === "adsb").length;
  const aisCount = signals.filter((s) => s.signalType === "ais").length;
  const hfCount = signals.filter((s) => s.signalType === "hf").length;
  const avgStrength =
    signals.length > 0
      ? Math.round(
          signals.reduce((sum, s) => sum + s.strength, 0) / signals.length,
        )
      : 0;

  return (
    <div className={styles.container}>
      <Card padding="lg">
        <h3 className={styles.title}>Signal Overview</h3>
        <div className={styles.grid}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Total Events</span>
            <span className={styles.statValue}>{signals.length}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>ADS-B</span>
            <span className={`${styles.statValue} ${styles.adsb}`}>
              {adsbCount}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>AIS</span>
            <span className={`${styles.statValue} ${styles.ais}`}>
              {aisCount}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>HF Radio</span>
            <span className={`${styles.statValue} ${styles.hf}`}>
              {hfCount}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Avg Strength</span>
            <span className={styles.statValue}>{avgStrength}%</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
