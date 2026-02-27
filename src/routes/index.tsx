import { createFileRoute } from '@tanstack/react-router'
import { Radar, Waves, Radio, Activity, AlertTriangle } from 'lucide-react'
import MainLayout from '@/components/layout/MainLayout'
import { DashboardGrid, GridItem } from '@/components/layout/DashboardGrid'
import StatCard from '@/components/ui/StatCard/StatCard'
import Card from '@/components/ui/Card/Card'
import { IndicatorsGrid, useIndicators } from '@/features/indicators'
import type { TimeWindow } from '@/domain/models'

export const Route = createFileRoute('/')({
  component: DashboardPage,
})

function DashboardPage() {
  const { data, isLoading } = useIndicators({ timeWindow: '24h' as TimeWindow })

  const summary = data?.summary

  return (
    <MainLayout>
      <div style={{ paddingBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--color-foreground)' }}>
          Global Activity Overview
        </h1>
        <p style={{ color: 'var(--color-muted-foreground)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Real-time situational awareness dashboard
        </p>

        <DashboardGrid>
          <GridItem>
            <StatCard
              label="Air Activity"
              value="2,847"
              trend="up"
              trendValue="+12.3%"
              description="Aircraft tracked in last 24h"
              icon={<Radar size={20} />}
            />
          </GridItem>
          <GridItem>
            <StatCard
              label="Naval Vessels"
              value="1,432"
              trend="up"
              trendValue="+5.7%"
              description="Vessels detected globally"
              icon={<Waves size={20} />}
            />
          </GridItem>
          <GridItem>
            <StatCard
              label="Signal Events"
              value="18,294"
              trend="down"
              trendValue="-2.1%"
              description="Signals captured today"
              icon={<Radio size={20} />}
            />
          </GridItem>
          <GridItem>
            <StatCard
              label="Active Indicators"
              value={summary?.totalIndicators ?? 12}
              trend="up"
              trendValue="+3"
              description="Elevated activity regions"
              icon={<Activity size={20} />}
            />
          </GridItem>
        </DashboardGrid>

        <div style={{ marginTop: '2rem' }}>
          <Card padding="lg">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <AlertTriangle size={20} style={{ color: 'var(--color-chart-3)' }} />
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0, color: 'var(--color-foreground)' }}>
                Activity Summary
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)' }}>Elevated Regions</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-chart-2)' }}>
                  {summary?.elevatedCount ?? 0}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)' }}>Anomalies Detected</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-destructive)' }}>
                  {summary?.anomalousCount ?? 0}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)' }}>Average Deviation</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-chart-1)' }}>
                  {summary?.averageDeviation != null ? `${summary.averageDeviation > 0 ? '+' : ''}${summary.averageDeviation}%` : 'N/A'}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <IndicatorsGrid
            indicators={data?.indicators ?? []}
            isLoading={isLoading}
            timeWindow="24h"
          />
        </div>
      </div>
    </MainLayout>
  )
}
