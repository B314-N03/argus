import { createFileRoute } from "@tanstack/react-router";

import { MainLayout } from "@/components/layout/main-layout/main-layout";
import { Card } from "@/components/ui/card/card";
import { SignalList, SignalSummary, useSignals } from "@/features/signals";

const SignalsPage = () => {
  const { data, isLoading } = useSignals();

  const signals = data?.signals ?? [];

  return (
    <MainLayout>
      <h1>Signal Intelligence</h1>
      <SignalSummary signals={signals} isLoading={isLoading} />
      <Card padding="none">
        <SignalList signals={signals} isLoading={isLoading} />
      </Card>
    </MainLayout>
  );
};

export const Route = createFileRoute("/signals")({
  component: SignalsPage,
});
