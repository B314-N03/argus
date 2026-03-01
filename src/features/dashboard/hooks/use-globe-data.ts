import { useMemo } from 'react'
import { useAircraft } from '@/features/air'
import { useRadios } from '@/features/radios'
import { useIndicators } from '@/features/indicators'
import type { TimeWindow } from '@/domain/models'
import { mockZones } from '@/lib/api/mock/zones'
import { generateMockVesselsList } from '@/lib/api/mock/vessels'
import { generateMockSignalsList } from '@/lib/api/mock/signals'
import { useCountryGeoJSON } from './use-country-geojson'

export function useGlobeData() {
  const { data: aircraftData } = useAircraft({ limit: 30 })
  const { data: radiosData } = useRadios()
  const { data: indicatorsData } = useIndicators({ timeWindow: '24h' as TimeWindow })
  const { countries } = useCountryGeoJSON()

  const vessels = useMemo(() => generateMockVesselsList(20), [])
  const signals = useMemo(() => generateMockSignalsList(25), [])

  const aircraftPoints = useMemo(
    () =>
      (aircraftData?.aircraft ?? [])
        .filter((a) => a.position)
        .map((a) => ({
          id: a.id,
          lat: a.position.latitude,
          lng: a.position.longitude,
          label: a.callsign ?? a.icao24,
          category: a.category,
          type: 'aircraft' as const,
        })),
    [aircraftData],
  )

  const vesselPoints = useMemo(
    () =>
      vessels
        .filter((v) => v.position)
        .map((v) => ({
          id: v.id,
          lat: v.position.latitude,
          lng: v.position.longitude,
          label: v.name ?? v.mmsi,
          shipType: v.shipType,
          type: 'vessel' as const,
        })),
    [vessels],
  )

  const signalPoints = useMemo(
    () =>
      signals
        .filter((s) => s.location)
        .map((s) => ({
          id: s.id,
          lat: s.location!.latitude,
          lng: s.location!.longitude,
          label: s.source,
          signalType: s.signalType,
          type: 'signal' as const,
        })),
    [signals],
  )

  return {
    aircraftPoints,
    vesselPoints,
    signalPoints,
    zones: mockZones,
    countries,
    indicators: indicatorsData,
    radios: radiosData,
    vessels,
    signals,
  }
}
