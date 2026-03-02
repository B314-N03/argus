import { Radio, Activity } from "lucide-react";

import { StatCard } from "@/components/ui/stat-card/stat-card";
import type { RadioSummary as RadioSummaryType } from "@/domain/models";
import { tooltipContent } from "@/lib/tooltip-content";

import styles from "./radio-summary.module.scss";

interface RadioSummaryProps {
  summary: RadioSummaryType | undefined;
  isLoading: boolean;
}

export const RadioSummary = ({ summary, isLoading }: RadioSummaryProps) => {
  if (isLoading || !summary) {
    return <div className={styles.loading}>Loading summary...</div>;
  }

  return (
    <div className={styles.grid}>
      <StatCard
        label="Total Stations"
        value={summary.total}
        icon={<Radio size={20} />}
        tooltip={tooltipContent.radio_status}
        description="Monitored radio stations"
      />
      <StatCard
        label="Active"
        value={summary.active}
        trend="up"
        icon={<Activity size={20} />}
        description="Currently broadcasting"
      />
      <StatCard
        label="Avg Activity"
        value={`${summary.averageActivity}%`}
        trend={summary.averageActivity > 50 ? "up" : "neutral"}
        tooltip={tooltipContent.radio_activity}
        description="Average activity level"
      />
    </div>
  );
};
