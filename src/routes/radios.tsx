import { createFileRoute } from "@tanstack/react-router";

import { MainLayout } from "@/components/layout/main-layout/main-layout";
import { RadioSummary, RadioStationsList, useRadios } from "@/features/radios";

const RadiosPage = () => {
  const { data, isLoading } = useRadios();

  return (
    <MainLayout>
      <h1>Radio Stations</h1>
      <RadioSummary summary={data?.summary} isLoading={isLoading} />
      <RadioStationsList
        stations={data?.stations ?? []}
        isLoading={isLoading}
      />
    </MainLayout>
  );
};

export const Route = createFileRoute("/radios")({
  component: RadiosPage,
});
