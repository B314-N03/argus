import { useState } from "react";

import type { RadioStation, RadioStationStatus } from "@/domain/models";

import { RadioStationCard } from "../radio-station-card/radio-station-card";

import styles from "./radio-stations-list.module.scss";

interface RadioStationsListProps {
  stations: RadioStation[];
  isLoading: boolean;
}

const statusFilters: { value: "all" | RadioStationStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "intermittent", label: "Intermittent" },
  { value: "inactive", label: "Inactive" },
];

export const RadioStationsList = ({
  stations,
  isLoading,
}: RadioStationsListProps) => {
  const [filter, setFilter] = useState<"all" | RadioStationStatus>("all");

  const filtered =
    filter === "all" ? stations : stations.filter((s) => s.status === filter);

  if (isLoading) {
    return <div className={styles.loading}>Loading stations...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        {statusFilters.map((f) => (
          <button
            type="button"
            key={f.value}
            className={`${styles.filterButton} ${filter === f.value ? styles.filterActive : ""}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className={styles.grid}>
        {filtered.map((station) => (
          <RadioStationCard key={station.id} station={station} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className={styles.empty}>
          No stations match the selected filter.
        </div>
      )}
    </div>
  );
};
