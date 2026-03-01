import { createFileRoute } from '@tanstack/react-router'
import { MainLayout } from '@/components/layout/main-layout/main-layout'
import { Card } from '@/components/ui/card/card'
import { VesselTable, VesselSummary, useVessels } from '@/features/naval'

export const Route = createFileRoute('/naval')({
  component: NavalPage,
})

function NavalPage() {
  const { data, isLoading } = useVessels()

  const vessels = data?.vessels ?? []

  return (
    <MainLayout>
      <h1>Naval Activity</h1>
      <VesselSummary vessels={vessels} isLoading={isLoading} />
      <Card padding="none">
        <VesselTable vessels={vessels} isLoading={isLoading} />
      </Card>
    </MainLayout>
  )
}
