import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { MainLayout } from "@/components/layout/main-layout/main-layout";
import type { TimeWindow } from "@/domain/models";
import { IndicatorsGrid, useIndicators } from "@/features/indicators";

const IndicatorsPage = () => {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("24h");
  const { data, isLoading } = useIndicators({ timeWindow });

  return (
    <MainLayout>
      <h1>Activity Indicators</h1>
      <IndicatorsGrid
        indicators={data?.indicators ?? []}
        isLoading={isLoading}
        timeWindow={timeWindow}
        onTimeWindowChange={setTimeWindow}
      />
    </MainLayout>
  );
};

export const Route = createFileRoute("/indicators")({
  component: IndicatorsPage,
});
