import { useRef, useEffect, useState, Suspense, lazy, useCallback, useMemo } from 'react'
import type { Zone, ZoneType, AircraftCategory, ShipType, SignalType } from '@/domain/models'
import {
  getAircraftCategoryLabel,
  getShipTypeLabel,
  getSignalTypeLabel,
  getZoneTypeLabel,
  buildZonePolygonGeometry,
} from '@/domain/models'
import {
  useSettings,
  SETTINGS_KEYS,
  DEFAULT_GLOBE_ENTITY_FILTERS,
} from '@/lib/settings'
import type { GlobeEntityFilters } from '@/lib/settings'
import { getEntityIconSvg } from './globe-entity-icon'
import { GlobeEntityFilter } from './globe-entity-filter'
import styles from './globe-view.module.scss'

export interface GlobePoint {
  id: string
  lat: number
  lng: number
  label: string | null
  type: 'aircraft' | 'vessel' | 'signal' | 'zone'
  category?: AircraftCategory
  shipType?: ShipType
  signalType?: SignalType
  zone?: Zone
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GeoJSONFeature = any

interface ZonePolygon {
  _kind: 'zone'
  zone: Zone
  geometry: ReturnType<typeof buildZonePolygonGeometry>
  color: string
}

function isZonePolygon(d: object): d is ZonePolygon {
  return '_kind' in d && (d as ZonePolygon)._kind === 'zone'
}

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

const ZONE_TYPE_DESCRIPTION: Record<string, string> = {
  notam:
    'Notice to Air Missions — Issued when airspace restrictions are activated due to military exercises, hazardous conditions, or temporary flight restrictions.',
  exclusion:
    'Exclusion Zone — A designated area where civilian access is restricted. Typically declared during active military operations or heightened security.',
  blockade:
    'Naval Blockade Zone — Maritime area with restricted vessel transit. Coalition or national forces actively monitoring and controlling shipping lanes.',
  duty_zone:
    'Active Patrol Zone — Area with sustained military patrol presence. Forces maintain continuous surveillance and readiness posture.',
}

const SEVERITY_LABEL: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

const ZONE_TYPE_COLOR: Record<ZoneType, string> = {
  notam: '#00d4ff',
  exclusion: '#f4212e',
  blockade: '#f4900c',
  duty_zone: '#1d9bf0',
}

const ZONE_TYPE_ABBR: Record<ZoneType, string> = {
  notam: 'N',
  exclusion: 'X',
  blockade: 'B',
  duty_zone: 'P',
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

function buildEntityTooltipHtml(point: GlobePoint): string {
  const name = point.label ?? point.id
  let typeLabel = ''
  let details = ''

  if (point.type === 'aircraft') {
    typeLabel = getAircraftCategoryLabel(point.category ?? 'unknown') + ' Aircraft'
    details = `<div style="margin-top:4px;font-size:11px;color:#71767b">Callsign: ${name}</div>`
  } else if (point.type === 'vessel') {
    typeLabel = getShipTypeLabel(point.shipType ?? 'unknown')
    details = `<div style="margin-top:4px;font-size:11px;color:#71767b">Name: ${name}</div>`
  } else {
    typeLabel = getSignalTypeLabel(point.signalType ?? 'unknown') + ' Signal'
    details = `<div style="margin-top:4px;font-size:11px;color:#71767b">Source: ${name}</div>`
  }

  const typeColor =
    point.type === 'aircraft'
      ? '#1d9bf0'
      : point.type === 'vessel'
        ? '#18b76f'
        : '#f4900c'

  return `<div style="background:#16181c;padding:8px 12px;border-radius:6px;border:1px solid #2f3336;min-width:160px;pointer-events:none">
    <div style="font-size:12px;font-weight:600;color:${typeColor}">${typeLabel}</div>
    ${details}
    <div style="margin-top:4px;font-size:10px;color:#71767b">Position: ${point.lat.toFixed(2)}°, ${point.lng.toFixed(2)}°</div>
  </div>`
}

function buildZoneTooltipHtml(zone: Zone): string {
  const typeLabel = getZoneTypeLabel(zone.type)
  const typeDesc = ZONE_TYPE_DESCRIPTION[zone.type] ?? ''
  const severityLabel = SEVERITY_LABEL[zone.severity] ?? zone.severity
  const severityColor =
    zone.severity === 'high' ? '#f4212e' : zone.severity === 'medium' ? '#f4900c' : '#1d9bf0'
  const color = ZONE_TYPE_COLOR[zone.type]

  return `<div style="background:#16181c;padding:10px 14px;border-radius:6px;border:1px solid #2f3336;max-width:280px;pointer-events:none">
    <div style="font-size:13px;font-weight:600;color:${color};margin-bottom:4px">${typeLabel}: ${zone.name}</div>
    <div style="font-size:11px;color:#e7e9ea;line-height:1.5;margin-bottom:6px">${typeDesc}</div>
    <div style="display:flex;gap:12px;font-size:11px">
      <span style="color:#71767b">Severity: <span style="color:${severityColor};font-weight:600">${severityLabel}</span></span>
      <span style="color:#71767b">Radius: ${zone.radius ?? '—'} km</span>
    </div>
    <div style="margin-top:6px;font-size:11px;color:#71767b;line-height:1.4">${zone.description}</div>
  </div>`
}

interface ZoneRingData {
  lat: number
  lng: number
  maxR: number
  propagationSpeed: number
  repeatPeriod: number
  color: string
  altitude: number
  zone: Zone
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
  const tooltipRef = useRef<HTMLDivElement>(null)
  const zoneTooltipRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [hoverCountry, setHoverCountry] = useState<GeoJSONFeature | null>(null)
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null)
  const [filters, setFilters] = useSettings<GlobeEntityFilters>(
    SETTINGS_KEYS.GLOBE_ENTITY_FILTERS,
    DEFAULT_GLOBE_ENTITY_FILTERS,
  )

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

  const zonePoints: GlobePoint[] = useMemo(
    () =>
      zones
        .filter((z) => z.active)
        .map((z) => ({
          id: z.id,
          lat: z.center[0],
          lng: z.center[1],
          label: z.name,
          type: 'zone' as const,
          zone: z,
        })),
    [zones],
  )

  const allPoints = useMemo(
    () => [
      ...(filters.aircraft ? aircraftPoints : []),
      ...(filters.vessel ? vesselPoints : []),
      ...(filters.signal ? signalPoints : []),
      ...zonePoints,
    ],
    [aircraftPoints, vesselPoints, signalPoints, zonePoints, filters],
  )

  const zonePolygons: ZonePolygon[] = useMemo(
    () =>
      zones
        .filter((z) => z.active && z.radius)
        .map((z) => ({
          _kind: 'zone' as const,
          zone: z,
          geometry: buildZonePolygonGeometry(z.center, z.radius!),
          color: ZONE_TYPE_COLOR[z.type],
        })),
    [zones],
  )

  const allPolygons = useMemo(
    () => [...(countries ?? []), ...zonePolygons],
    [countries, zonePolygons],
  )

  const zoneRings: ZoneRingData[] = useMemo(
    () =>
      zones
        .filter((z) => z.active)
        .map((z) => {
          const config = getZoneRingConfig(z)
          return {
            lat: z.center[0],
            lng: z.center[1],
            maxR: (z.radius ?? 100) / 80,
            propagationSpeed: config.propagationSpeed,
            repeatPeriod: config.repeatPeriod,
            color: config.color,
            altitude: 0.001,
            zone: z,
          }
        }),
    [zones],
  )

  const showEntityTooltip = useCallback((el: HTMLElement, point: GlobePoint) => {
    const tooltip = tooltipRef.current
    if (!tooltip || !containerRef.current) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    tooltip.innerHTML = buildEntityTooltipHtml(point)
    tooltip.style.display = 'block'
    tooltip.style.left = `${elRect.left - containerRect.left + elRect.width / 2}px`
    tooltip.style.top = `${elRect.top - containerRect.top - 8}px`
  }, [])

  const hideEntityTooltip = useCallback(() => {
    const tooltip = tooltipRef.current
    if (tooltip) {
      tooltip.style.display = 'none'
    }
  }, [])

  const showZoneTooltip = useCallback((el: HTMLElement, zone: Zone) => {
    const tooltip = zoneTooltipRef.current
    if (!tooltip || !containerRef.current) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    tooltip.innerHTML = buildZoneTooltipHtml(zone)
    tooltip.style.display = 'block'
    tooltip.style.left = `${elRect.left - containerRect.left + elRect.width / 2}px`
    tooltip.style.top = `${elRect.top - containerRect.top - 8}px`
  }, [])

  const hideZoneTooltip = useCallback(() => {
    const tooltip = zoneTooltipRef.current
    if (tooltip) {
      tooltip.style.display = 'none'
    }
  }, [])

  const htmlElement = useCallback(
    (d: object) => {
      const point = d as GlobePoint

      if (point.type === 'zone' && point.zone) {
        const zone = point.zone
        const color = ZONE_TYPE_COLOR[zone.type]
        const abbr = ZONE_TYPE_ABBR[zone.type]

        const el = document.createElement('div')
        el.className = styles.zoneBadge
        el.style.color = color
        el.style.backgroundColor = `${color}22`
        el.textContent = abbr

        el.addEventListener('mouseenter', () => {
          setHoveredZoneId(zone.id)
          showZoneTooltip(el, zone)
        })
        el.addEventListener('mouseleave', () => {
          setHoveredZoneId(null)
          hideZoneTooltip()
        })

        return el
      }

      const entityPoint = point as GlobePoint & { type: 'aircraft' | 'vessel' | 'signal' }
      const el = document.createElement('div')
      el.innerHTML = getEntityIconSvg(entityPoint)
      el.style.cursor = 'pointer'
      el.style.pointerEvents = 'auto'
      el.addEventListener('mouseenter', () => showEntityTooltip(el, point))
      el.addEventListener('mouseleave', hideEntityTooltip)
      return el
    },
    [showEntityTooltip, hideEntityTooltip, showZoneTooltip, hideZoneTooltip],
  )

  const ringColor = useCallback((d: object) => {
    const ring = d as { color: string }
    return (t: number) =>
      `${ring.color}${Math.round((1 - t) * 255)
        .toString(16)
        .padStart(2, '0')}`
  }, [])

  const polygonCapColor = useCallback(
    (d: object) => {
      if (isZonePolygon(d)) {
        return hoveredZoneId === d.zone.id
          ? `${d.color}26`
          : 'rgba(0, 0, 0, 0)'
      }
      return d === hoverCountry ? 'rgba(29, 155, 240, 0.15)' : 'rgba(0, 0, 0, 0)'
    },
    [hoverCountry, hoveredZoneId],
  )

  const polygonSideColor = useCallback(() => 'rgba(0, 0, 0, 0)', [])

  const polygonStrokeColor = useCallback(
    (d: object) => {
      if (isZonePolygon(d)) {
        return hoveredZoneId === d.zone.id
          ? `${d.color}cc`
          : 'rgba(0, 0, 0, 0)'
      }
      return d === hoverCountry ? 'rgba(255, 215, 0, 0.8)' : 'rgba(47, 51, 54, 0.3)'
    },
    [hoverCountry, hoveredZoneId],
  )

  const polygonAltitude = useCallback(
    (d: object) => {
      if (isZonePolygon(d)) {
        return hoveredZoneId === d.zone.id ? 0.008 : 0.002
      }
      return d === hoverCountry ? 0.005 : 0.001
    },
    [hoverCountry, hoveredZoneId],
  )

  const polygonLabel = useCallback((d: object) => {
    if (isZonePolygon(d)) return ''
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const feat = d as any
    const name = feat?.properties?.name ?? ''
    return `<div style="background:#16181c;padding:4px 8px;border-radius:4px;border:1px solid #2f3336;font-size:12px;color:#e7e9ea">${name}</div>`
  }, [])

  const polygonGeoJsonGeometry = useCallback((d: object) => {
    if (isZonePolygon(d)) return d.geometry
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (d as any)?.geometry
  }, [])

  const handlePolygonHover = useCallback((d: object | null) => {
    if (d && isZonePolygon(d)) return
    setHoverCountry(d)
  }, [])

  const handlePolygonClick = useCallback(
    (d: object | null) => {
      if (!d || !onCountrySelect || isZonePolygon(d)) return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const feat = d as any
      const name = feat?.properties?.name
      if (name) {
        onCountrySelect(name)
      }
    },
    [onCountrySelect],
  )

  return (
    <div ref={containerRef} className={styles.container}>
      <div ref={tooltipRef} className={styles.entityTooltip} />
      <div ref={zoneTooltipRef} className={styles.zoneTooltip} />
      <GlobeEntityFilter filters={filters} onChange={setFilters} />
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
          polygonsData={allPolygons}
          polygonGeoJsonGeometry={polygonGeoJsonGeometry}
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
