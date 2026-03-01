import { useRef, useEffect, useState, Suspense, lazy, useCallback, useMemo } from 'react'
import type { Zone, AircraftCategory, ShipType, SignalType } from '@/domain/models'
import { getEntityIconSvg } from './globe-entity-icon'
import styles from './globe-view.module.scss'

export interface GlobePoint {
  id: string
  lat: number
  lng: number
  label: string | null
  type: 'aircraft' | 'vessel' | 'signal'
  category?: AircraftCategory
  shipType?: ShipType
  signalType?: SignalType
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GeoJSONFeature = any

interface GlobeViewProps {
  aircraftPoints: GlobePoint[]
  vesselPoints: GlobePoint[]
  signalPoints: GlobePoint[]
  zones: Zone[]
  countries?: GeoJSONFeature[]
  onCountrySelect?: (countryName: string) => void
}

const GlobeGL = lazy(() => import('react-globe.gl'))

function GlobeLoading() {
  return (
    <div className={styles.loading}>
      <div className={styles.loadingText}>Initializing globe...</div>
    </div>
  )
}

const ZONE_TYPE_PREFIX: Record<string, string> = {
  notam: '[NOTAM]',
  exclusion: '[EXCLUSION]',
  blockade: '[BLOCKADE]',
  duty_zone: '[PATROL]',
}

function getZoneRingConfig(zone: Zone) {
  switch (zone.type) {
    case 'exclusion':
      return { propagationSpeed: 4, repeatPeriod: 400, color: '#f4212e' }
    case 'blockade':
      return { propagationSpeed: 2.5, repeatPeriod: 600, color: '#f4900c' }
    case 'duty_zone':
      return { propagationSpeed: 1, repeatPeriod: 1000, color: '#1d9bf0' }
    case 'notam':
    default:
      return { propagationSpeed: 2, repeatPeriod: 800, color: '#00d4ff' }
  }
}

function GlobeRenderer({
  aircraftPoints,
  vesselPoints,
  signalPoints,
  zones,
  countries,
  onCountrySelect,
}: GlobeViewProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [hoverCountry, setHoverCountry] = useState<GeoJSONFeature | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
      }
    })

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const allPoints = useMemo(
    () => [...aircraftPoints, ...vesselPoints, ...signalPoints],
    [aircraftPoints, vesselPoints, signalPoints],
  )

  const zoneRings = useMemo(
    () =>
      zones
        .filter((z) => z.active)
        .map((z) => {
          const config = getZoneRingConfig(z)
          return {
            lat: z.center[0],
            lng: z.center[1],
            maxR: (z.radius ?? 100) / 111,
            propagationSpeed: config.propagationSpeed,
            repeatPeriod: config.repeatPeriod,
            color: config.color,
            altitude: 0.001,
          }
        }),
    [zones],
  )

  const zoneLabels = useMemo(
    () =>
      zones
        .filter((z) => z.active)
        .map((z) => ({
          lat: z.center[0],
          lng: z.center[1],
          text: `${ZONE_TYPE_PREFIX[z.type] ?? ''} ${z.name}`,
          color:
            z.type === 'exclusion'
              ? '#f4212e'
              : z.type === 'blockade'
                ? '#f4900c'
                : z.type === 'duty_zone'
                  ? '#1d9bf0'
                  : '#00d4ff',
        })),
    [zones],
  )

  const htmlElement = useCallback((d: object) => {
    const point = d as GlobePoint
    const el = document.createElement('div')
    el.innerHTML = getEntityIconSvg(point)
    el.style.cursor = 'pointer'
    el.title = `${point.label ?? point.id} (${point.type})`
    return el
  }, [])

  const ringColor = useCallback((d: object) => {
    const ring = d as { color: string }
    return (t: number) =>
      `${ring.color}${Math.round((1 - t) * 255)
        .toString(16)
        .padStart(2, '0')}`
  }, [])

  const labelText = useCallback((d: object) => (d as { text: string }).text, [])
  const labelSize = useCallback(() => 1.2, [])
  const labelDotRadius = useCallback(() => 0, [])
  const labelColor = useCallback((d: object) => (d as { color: string }).color, [])
  const labelAltitude = useCallback(() => 0.005, [])
  const labelResolution = 3

  const polygonCapColor = useCallback(
    (d: object) => {
      return d === hoverCountry ? 'rgba(29, 155, 240, 0.15)' : 'rgba(0, 0, 0, 0)'
    },
    [hoverCountry],
  )

  const polygonSideColor = useCallback(() => 'rgba(0, 0, 0, 0)', [])

  const polygonStrokeColor = useCallback(
    (d: object) => {
      return d === hoverCountry ? 'rgba(255, 215, 0, 0.8)' : 'rgba(47, 51, 54, 0.3)'
    },
    [hoverCountry],
  )

  const polygonAltitude = useCallback(
    (d: object) => (d === hoverCountry ? 0.005 : 0.001),
    [hoverCountry],
  )

  const polygonLabel = useCallback((d: object) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const feat = d as any
    const name = feat?.properties?.name ?? ''
    return `<div style="background:#16181c;padding:4px 8px;border-radius:4px;border:1px solid #2f3336;font-size:12px;color:#e7e9ea">${name}</div>`
  }, [])

  const handlePolygonHover = useCallback((d: object | null) => {
    setHoverCountry(d)
  }, [])

  const handlePolygonClick = useCallback(
    (d: object) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const feat = d as any
      const name = feat?.properties?.name
      if (name && onCountrySelect) {
        onCountrySelect(name)
      }
    },
    [onCountrySelect],
  )

  return (
    <div ref={containerRef} className={styles.container}>
      {dimensions.width > 0 && (
        <GlobeGL
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl="https://unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
          animateIn={false}
          atmosphereColor="#1d9bf0"
          atmosphereAltitude={0.15}
          htmlElementsData={allPoints}
          htmlLat="lat"
          htmlLng="lng"
          htmlAltitude={0.01}
          htmlElement={htmlElement}
          ringsData={zoneRings}
          ringLat="lat"
          ringLng="lng"
          ringMaxRadius="maxR"
          ringPropagationSpeed="propagationSpeed"
          ringRepeatPeriod="repeatPeriod"
          ringColor={ringColor}
          labelsData={zoneLabels}
          labelLat="lat"
          labelLng="lng"
          labelText={labelText}
          labelSize={labelSize}
          labelDotRadius={labelDotRadius}
          labelColor={labelColor}
          labelAltitude={labelAltitude}
          labelResolution={labelResolution}
          polygonsData={countries ?? []}
          polygonCapColor={polygonCapColor}
          polygonSideColor={polygonSideColor}
          polygonStrokeColor={polygonStrokeColor}
          polygonAltitude={polygonAltitude}
          polygonLabel={polygonLabel}
          onPolygonHover={handlePolygonHover}
          onPolygonClick={handlePolygonClick}
        />
      )}
    </div>
  )
}

export function GlobeView(props: GlobeViewProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <GlobeLoading />
  }

  return (
    <Suspense fallback={<GlobeLoading />}>
      <GlobeRenderer {...props} />
    </Suspense>
  )
}
