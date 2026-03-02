import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { MainLayout } from "@/components/layout/main-layout/main-layout";
import { Card } from "@/components/ui/card/card";
import {
  AircraftTable,
  AircraftSummary,
  AssetLookup,
  useAircraft,
} from "@/features/air";

import styles from "./air.module.scss";

type AirTab = "tracking" | "assets";

const AirPage = () => {
  const [activeTab, setActiveTab] = useState<AirTab>("tracking");
  const { data, isLoading } = useAircraft();

  const aircraft = data?.aircraft ?? [];

  return (
    <MainLayout>
      <h1>Air Activity</h1>

      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === "tracking" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("tracking")}
        >
          Live Tracking
        </button>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === "assets" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("assets")}
        >
          Asset Database
        </button>
      </div>

      {activeTab === "tracking" && (
        <>
          <AircraftSummary aircraft={aircraft} isLoading={isLoading} />
          <Card padding="none">
            <AircraftTable aircraft={aircraft} isLoading={isLoading} />
          </Card>
        </>
      )}

      {activeTab === "assets" && <AssetLookup />}
    </MainLayout>
  );
};

export const Route = createFileRoute("/air")({
  component: AirPage,
});
