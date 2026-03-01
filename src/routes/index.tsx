import { useMemo, useState, useCallback } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { GlobeLayout } from '@/components/layout/globe-layout/globe-layout'
import {
  GlobeView,
  ActivityFeed,
  NewsFeed,
  TensionIndex,
  DashboardHeader,
  WidgetStack,
  CountryModal,
  NewsDetailModal,
  useGlobeData,
} from '@/features/dashboard'
import type { NewsItem, Country } from '@/domain/models'
import { generateTensionHistory } from '@/lib/api/mock/indicators'
import { mockNewsItems } from '@/lib/api/mock/news'
import { findCountryByName } from '@/lib/api/mock/countries'
import styles from './index.module.scss'

export const Route = createFileRoute('/')({
  component: DashboardPage,
})

function DashboardPage() {
  const {
    aircraftPoints,
    vesselPoints,
    signalPoints,
    zones,
    countries,
    indicators,
    vessels,
    signals,
  } = useGlobeData()

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [selectedNewsItem, setSelectedNewsItem] = useState<NewsItem | null>(null)

  const tensionValue = useMemo(() => {
    if (!indicators?.summary) return 35
    const { averageDeviation, elevatedCount, anomalousCount } = indicators.summary
    const deviationComponent = Math.min(Math.abs(averageDeviation) * 1.5, 40)
    const elevatedComponent = Math.min(elevatedCount * 3, 30)
    const anomalousComponent = Math.min(anomalousCount * 5, 30)
    return Math.round(deviationComponent + elevatedComponent + anomalousComponent)
  }, [indicators])

  const tensionHistory = useMemo(() => {
    if (!indicators?.indicators) return undefined
    return generateTensionHistory(indicators.indicators)
  }, [indicators])

  const totalEntities = aircraftPoints.length + vesselPoints.length + signalPoints.length
  const activeRegions = zones.filter((z) => z.active).length

  const aircraftForFeed = useMemo(() => {
    return aircraftPoints.map((p) => ({
      id: p.id,
      callsign: p.label,
      icao24: p.id,
      originCountry: 'Unknown',
      position: { latitude: p.lat, longitude: p.lng, altitude: 0 },
      velocity: null,
      altitude: null,
      lastSeen: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      category: (p as { category?: string }).category ?? 'unknown',
    }))
  }, [aircraftPoints])

  const handleCountrySelect = useCallback((name: string) => {
    const country = findCountryByName(name)
    if (country) {
      setSelectedCountry(country)
    }
  }, [])

  const handleNewsItemClick = useCallback((item: NewsItem) => {
    setSelectedNewsItem(item)
  }, [])

  return (
    <>
      <GlobeLayout
        header={<DashboardHeader activeRegions={activeRegions} totalEntities={totalEntities} />}
        left={
          <div className={styles.leftColumn}>
            <ActivityFeed
              aircraft={aircraftForFeed as never[]}
              vessels={vessels}
              signals={signals}
            />
            <div className={styles.feedDivider}>OSINT Sources</div>
            <NewsFeed items={mockNewsItems} onItemClick={handleNewsItemClick} />
          </div>
        }
        center={
          <>
            <GlobeView
              aircraftPoints={aircraftPoints}
              vesselPoints={vesselPoints}
              signalPoints={signalPoints}
              zones={zones}
              countries={countries}
              onCountrySelect={handleCountrySelect}
            />
            <TensionIndex value={tensionValue} history={tensionHistory} />
          </>
        }
        right={
          <WidgetStack
            indicatorData={indicators}
            aircraftCount={aircraftPoints.length}
            vesselCount={vesselPoints.length}
            signalCount={signalPoints.length}
            aircraftPoints={aircraftPoints}
            vesselPoints={vesselPoints}
          />
        }
      />
      <CountryModal
        country={selectedCountry}
        newsItems={mockNewsItems}
        onClose={() => setSelectedCountry(null)}
      />
      <NewsDetailModal
        item={selectedNewsItem}
        onClose={() => setSelectedNewsItem(null)}
      />
    </>
  )
}
