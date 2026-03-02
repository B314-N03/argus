import { useMemo } from "react";

import type {
  ActivityIndicator,
  IndicatorType,
  TimeWindow,
} from "@/domain/models";

import { IndicatorTypeCard } from "../indicator-type-card/indicator-type-card";

import styles from "./indicators-grid.module.scss";

interface IndicatorsGridProps {
  indicators: ActivityIndicator[];
  isLoading?: boolean;
  timeWindow?: TimeWindow;
  onTimeWindowChange?: (timeWindow: TimeWindow) => void;
}

const timeWindowOptions: { value: TimeWindow; label: string }[] = [
  { value: "1h", label: "1 Hour" },
  { value: "6h", label: "6 Hours" },
  { value: "24h", label: "24 Hours" },
  { value: "7d", label: "7 Days" },
];

export const IndicatorsGrid = ({
  indicators,
  isLoading = false,
  timeWindow,
  onTimeWindowChange,
}: IndicatorsGridProps) => {
  const grouped = useMemo(() => {
    const map = new Map<IndicatorType, ActivityIndicator[]>();

    for (const ind of indicators) {
      const existing = map.get(ind.type) ?? [];

      existing.push(ind);
      map.set(ind.type, existing);
    }

    return map;
  }, [indicators]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Activity Indicators</h2>
        </div>
        <div className={styles.loading}>
          <div className={styles.spinner} />
        </div>
      </div>
    );
  }

  if (!indicators || indicators.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Activity Indicators</h2>
        </div>
        <div className={styles.empty}>
          <p>No indicators available for the selected criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Activity Indicators</h2>
        <div className={styles.controls}>
          {onTimeWindowChange && (
            <select
              className={styles.filter}
              value={timeWindow}
              onChange={(e) => onTimeWindowChange(e.target.value as TimeWindow)}
            >
              {timeWindowOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      <div className={styles.grid}>
        {Array.from(grouped.entries()).map(([type, typeIndicators]) => (
          <IndicatorTypeCard
            key={type}
            type={type}
            indicators={typeIndicators}
          />
        ))}
      </div>
    </div>
  );
};
