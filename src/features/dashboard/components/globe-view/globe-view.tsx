import {
  useRef,
  useEffect,
  useState,
  Suspense,
  lazy,
  useCallback,
  useMemo,
} from "react";

import { Sprite, SpriteMaterial, CanvasTexture } from "three";

import type {
  Zone,
  ZoneType,
  AircraftCategory,
  ShipType,
  SignalType,
  Aircraft,
} from "@/domain/models";
import {
  getAircraftCategoryLabel,
  getShipTypeLabel,
  getSignalTypeLabel,
  getZoneTypeLabel,
  buildZonePolygonGeometry,
} from "@/domain/models";
import {
  useSettings,
  SETTINGS_KEYS,
  DEFAULT_GLOBE_ENTITY_FILTERS,
  DEFAULT_GLOBE_SETTINGS,
  DEFAULT_AIRCRAFT_CATEGORY_FILTERS,
  isAircraftCategoryIncluded,
} from "@/lib/settings";
import type {
  GlobeEntityFilters,
  GlobeSettings,
  AircraftCategoryFilters,
} from "@/lib/settings";

import { AircraftModal } from "../aircraft-modal/aircraft-modal";
import {
  TEXTURE_URLS,
  BACKGROUND_CONFIG,
  ATMOSPHERE_COLORS,
  ATMOSPHERE_ALTITUDES,
} from "../globe-settings/globe-settings-constants";
import { GlobeSettingsTrigger } from "../globe-settings/globe-settings-trigger";

import { GlobeEntityFilter } from "./globe-entity-filter";
import { getEntityIconSvg } from "./globe-entity-icon";
import styles from "./globe-view.module.scss";

export interface GlobePoint {
  id: string;
  lat: number;
  lng: number;
  label: string | null;
  type: "aircraft" | "vessel" | "signal";
  category?: AircraftCategory;
  shipType?: ShipType;
  signalType?: SignalType;
  heading?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GeoJSONFeature = any;

interface ZonePolygon {
  _kind: "zone";
  zone: Zone;
  geometry: ReturnType<typeof buildZonePolygonGeometry>;
  color: string;
}

function isZonePolygon(d: object): d is ZonePolygon {
  return "_kind" in d;
}

interface ZoneBadgeData {
  lat: number;
  lng: number;
  text: string;
  color: string;
  zone: Zone;
}

interface GlobeViewProps {
  aircraftPoints: GlobePoint[];
  vesselPoints: GlobePoint[];
  signalPoints: GlobePoint[];
  zones: Zone[];
  countries?: GeoJSONFeature[];
  aircraftData: Aircraft[];
  onCountrySelect?: (countryName: string) => void;
}

const GlobeGL = lazy(() => import("react-globe.gl"));

const GlobeLoading = () => {
  return (
    <div className={styles.loading}>
      <div className={styles.loadingText}>Initializing globe...</div>
    </div>
  );
};

const ZONE_TYPE_DESCRIPTION: Record<string, string> = {
  notam:
    "Notice to Air Missions — Issued when airspace restrictions are activated due to military exercises, hazardous conditions, or temporary flight restrictions.",
  exclusion:
    "Exclusion Zone — A designated area where civilian access is restricted. Typically declared during active military operations or heightened security.",
  blockade:
    "Naval Blockade Zone — Maritime area with restricted vessel transit. Coalition or national forces actively monitoring and controlling shipping lanes.",
  duty_zone:
    "Active Patrol Zone — Area with sustained military patrol presence. Forces maintain continuous surveillance and readiness posture.",
};

const SEVERITY_LABEL: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const ZONE_TYPE_COLOR: Record<ZoneType, string> = {
  notam: "#00d4ff",
  exclusion: "#f4212e",
  blockade: "#f4900c",
  duty_zone: "#1d9bf0",
};

const ZONE_TYPE_ABBR: Record<ZoneType, string> = {
  notam: "N",
  exclusion: "X",
  blockade: "B",
  duty_zone: "P",
};

const ZONE_FILL_OPACITY = "1a";
const ZONE_STROKE_OPACITY = "88";

const GLOBE_RADIUS = 100;
const BADGE_ALTITUDE = 0.012;

function polar2Cartesian(lat: number, lng: number, alt: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((90 - lng) * Math.PI) / 180;
  const r = GLOBE_RADIUS * (1 + alt);

  return {
    x: r * Math.sin(phi) * Math.cos(theta),
    y: r * Math.cos(phi),
    z: r * Math.sin(phi) * Math.sin(theta),
  };
}

function createZoneBadgeSprite(text: string, color: string): Sprite {
  const size = 128;
  const canvas = document.createElement("canvas");

  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
  ctx.fillStyle = `${color}33`;
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.font = "bold 52px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, size / 2, size / 2);

  const texture = new CanvasTexture(canvas);
  const material = new SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  const sprite = new Sprite(material);

  sprite.scale.set(5, 5, 1);

  return sprite;
}

function buildEntityTooltipHtml(point: GlobePoint): string {
  const name = point.label ?? point.id;
  let typeLabel = "";
  let details = "";

  if (point.type === "aircraft") {
    typeLabel =
      getAircraftCategoryLabel(point.category ?? "unknown") + " Aircraft";
    details = `<div style="margin-top:4px;font-size:11px;color:#71767b">Callsign: ${name}</div>`;
  } else if (point.type === "vessel") {
    typeLabel = getShipTypeLabel(point.shipType ?? "unknown");
    details = `<div style="margin-top:4px;font-size:11px;color:#71767b">Name: ${name}</div>`;
  } else {
    typeLabel = getSignalTypeLabel(point.signalType ?? "unknown") + " Signal";
    details = `<div style="margin-top:4px;font-size:11px;color:#71767b">Source: ${name}</div>`;
  }

  const typeColor =
    point.type === "aircraft"
      ? "#1d9bf0"
      : point.type === "vessel"
        ? "#18b76f"
        : "#f4900c";

  return `<div style="background:#16181c;padding:8px 12px;border-radius:6px;border:1px solid #2f3336;min-width:160px;pointer-events:none">
    <div style="font-size:12px;font-weight:600;color:${typeColor}">${typeLabel}</div>
    ${details}
    <div style="margin-top:4px;font-size:10px;color:#71767b">Position: ${point.lat.toFixed(2)}°, ${point.lng.toFixed(2)}°</div>
  </div>`;
}

function buildZoneTooltipHtml(zone: Zone): string {
  const typeLabel = getZoneTypeLabel(zone.type);
  const typeDesc = ZONE_TYPE_DESCRIPTION[zone.type] ?? "";
  const severityLabel = SEVERITY_LABEL[zone.severity] ?? zone.severity;
  const severityColor =
    zone.severity === "high"
      ? "#f4212e"
      : zone.severity === "medium"
        ? "#f4900c"
        : "#1d9bf0";
  const color = ZONE_TYPE_COLOR[zone.type];

  return `<div style="background:#16181c;padding:10px 14px;border-radius:6px;border:1px solid #2f3336;max-width:280px;pointer-events:none">
    <div style="font-size:13px;font-weight:600;color:${color};margin-bottom:4px">${typeLabel}: ${zone.name}</div>
    <div style="font-size:11px;color:#e7e9ea;line-height:1.5;margin-bottom:6px">${typeDesc}</div>
    <div style="display:flex;gap:12px;font-size:11px">
      <span style="color:#71767b">Severity: <span style="color:${severityColor};font-weight:600">${severityLabel}</span></span>
      <span style="color:#71767b">Radius: ${zone.radius ?? "—"} km</span>
    </div>
    <div style="margin-top:6px;font-size:11px;color:#71767b;line-height:1.4">${zone.description}</div>
  </div>`;
}

const GlobeRenderer = ({
  aircraftPoints,
  vesselPoints,
  signalPoints,
  zones,
  countries,
  aircraftData,
  onCountrySelect,
}: GlobeViewProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoverCountry, setHoverCountry] = useState<GeoJSONFeature | null>(null);
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);
  const [filters, setFilters] = useSettings<GlobeEntityFilters>(
    SETTINGS_KEYS.GLOBE_ENTITY_FILTERS,
    DEFAULT_GLOBE_ENTITY_FILTERS,
  );
  const [categoryFilters, setCategoryFilters] = useSettings<AircraftCategoryFilters>(
    SETTINGS_KEYS.AIRCRAFT_CATEGORY_FILTERS,
    DEFAULT_AIRCRAFT_CATEGORY_FILTERS,
  );
  const [globeSettings, setGlobeSettings] = useSettings<GlobeSettings>(
    SETTINGS_KEYS.GLOBE_SETTINGS,
    DEFAULT_GLOBE_SETTINGS,
  );
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);
  const [globeRotation, setGlobeRotation] = useState({ lng: 0, lat: 90 });

  // Track if we just clicked on an aircraft to prevent country modal from also opening
  const justClickedAircraftRef = useRef(false);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resolvedTexture = TEXTURE_URLS[globeSettings.texture];
  const resolvedBg = BACKGROUND_CONFIG[globeSettings.background];
  const resolvedAtmosphereColor =
    ATMOSPHERE_COLORS[globeSettings.atmosphereColor];
  const resolvedAtmosphereAlt = globeSettings.showAtmosphere
    ? ATMOSPHERE_ALTITUDES[globeSettings.atmosphereAltitude]
    : 0;

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const filteredAircraftPoints = useMemo(
    () =>
      aircraftPoints.filter((a) =>
        isAircraftCategoryIncluded(a.category ?? "unknown", categoryFilters),
      ),
    [aircraftPoints, categoryFilters],
  );

  const entityPoints = useMemo(
    () => [
      ...(filters.aircraft ? filteredAircraftPoints : []),
      ...(filters.vessel ? vesselPoints : []),
      ...(filters.signal ? signalPoints : []),
    ],
    [filteredAircraftPoints, vesselPoints, signalPoints, filters],
  );

  const zoneBadgeData: ZoneBadgeData[] = useMemo(
    () =>
      zones
        .filter((z) => z.active)
        .map((z) => ({
          lat: z.center[0],
          lng: z.center[1],
          text: ZONE_TYPE_ABBR[z.type],
          color: ZONE_TYPE_COLOR[z.type],
          zone: z,
        })),
    [zones],
  );

  const zonePolygons: ZonePolygon[] = useMemo(
    () =>
      zones
        .filter((z) => z.active && z.radius)
        .map((z) => ({
          _kind: "zone" as const,
          zone: z,
          geometry: buildZonePolygonGeometry(z.center, z.radius!),
          color: ZONE_TYPE_COLOR[z.type],
        })),
    [zones],
  );

  const allPolygons = useMemo(
    () => [...(countries ?? []), ...zonePolygons],
    [countries, zonePolygons],
  );

  const showEntityTooltip = useCallback(
    (el: HTMLElement, point: GlobePoint) => {
      const tooltip = tooltipRef.current;

      if (!tooltip || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();

      tooltip.innerHTML = buildEntityTooltipHtml(point);
      tooltip.style.display = "block";
      tooltip.style.left = `${elRect.left - containerRect.left + elRect.width / 2}px`;
      tooltip.style.top = `${elRect.top - containerRect.top - 8}px`;
    },
    [],
  );

  const hideEntityTooltip = useCallback(() => {
    const tooltip = tooltipRef.current;

    if (tooltip) {
      tooltip.style.display = "none";
    }
  }, []);

  const handleAircraftClick = useCallback(
    (point: GlobePoint) => {
      if (point.type !== "aircraft") return;

      // Set flag to prevent polygon click from opening country modal
      justClickedAircraftRef.current = true;
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }

      clickTimeoutRef.current = setTimeout(() => {
        justClickedAircraftRef.current = false;
      }, 300);

      const aircraft = aircraftData.find((a) => a.id === point.id);

      if (aircraft) {
        setSelectedAircraft(aircraft);
      }
    },
    [aircraftData],
  );

  const htmlElement = useCallback(
    (d: object) => {
      const point = d as GlobePoint;
      const el = document.createElement("div");

      el.innerHTML = getEntityIconSvg(point);
      el.style.cursor = "pointer";
      el.style.pointerEvents = "auto";
      el.addEventListener("mouseenter", () => showEntityTooltip(el, point));
      el.addEventListener("mouseleave", hideEntityTooltip);
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        handleAircraftClick(point);
      });

      return el;
    },
    [showEntityTooltip, hideEntityTooltip, handleAircraftClick],
  );

  // Zone badges as WebGL sprites via custom layer
  const customThreeObject = useCallback((d: object) => {
    const item = d as ZoneBadgeData;
    const sprite = createZoneBadgeSprite(item.text, item.color);
    const pos = polar2Cartesian(item.lat, item.lng, BADGE_ALTITUDE);

    sprite.position.set(pos.x, pos.y, pos.z);

    return sprite;
  }, []);

  const customLayerLabel = useCallback((d: object) => {
    const item = d as ZoneBadgeData;

    return buildZoneTooltipHtml(item.zone);
  }, []);

  const polygonCapColor = useCallback(
    (d: object) => {
      if (isZonePolygon(d)) {
        return hoveredZoneId === d.zone.id
          ? `${d.color}33`
          : `${d.color}${ZONE_FILL_OPACITY}`;
      }

      return d === hoverCountry
        ? "rgba(29, 155, 240, 0.15)"
        : "rgba(0, 0, 0, 0)";
    },
    [hoverCountry, hoveredZoneId],
  );

  const polygonSideColor = useCallback(() => "rgba(0, 0, 0, 0)", []);

  const polygonStrokeColor = useCallback(
    (d: object) => {
      if (isZonePolygon(d)) {
        return hoveredZoneId === d.zone.id
          ? `${d.color}cc`
          : `${d.color}${ZONE_STROKE_OPACITY}`;
      }

      return d === hoverCountry
        ? "rgba(255, 215, 0, 0.8)"
        : "rgba(47, 51, 54, 0.3)";
    },
    [hoverCountry, hoveredZoneId],
  );

  const polygonAltitude = useCallback(
    (d: object) => {
      if (isZonePolygon(d)) {
        return hoveredZoneId === d.zone.id ? 0.008 : 0.002;
      }

      return d === hoverCountry ? 0.005 : 0.001;
    },
    [hoverCountry, hoveredZoneId],
  );

  const polygonLabel = useCallback((d: object) => {
    if (isZonePolygon(d)) return buildZoneTooltipHtml(d.zone);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const feat = d as any;
    const name = feat?.properties?.name ?? "";

    return `<div style="background:#16181c;padding:4px 8px;border-radius:4px;border:1px solid #2f3336;font-size:12px;color:#e7e9ea">${name}</div>`;
  }, []);

  const polygonGeoJsonGeometry = useCallback((d: object) => {
    if (isZonePolygon(d)) return d.geometry;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- GeoJSON features lack strict typing
    return (d as any)?.geometry;
  }, []);

  const handlePolygonHover = useCallback((d: object | null) => {
    if (d && isZonePolygon(d)) {
      setHoveredZoneId(d.zone.id);

      return;
    }

    setHoveredZoneId(null);
    setHoverCountry(d);
  }, []);

  const handleMoveEnd = useCallback((coords: { lat: number; lng: number; altitude: number }) => {
    setGlobeRotation({ lng: coords.lng, lat: coords.lat });
  }, []); const handlePolygonClick = useCallback((d: object | null) => {
    // Don't open country modal if we just clicked on an aircraft
    if (justClickedAircraftRef.current) {
      return;
    }

    if (!d || !onCountrySelect || isZonePolygon(d)) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const feat = d as any;
    const name = feat?.properties?.name;

    if (name) {
      onCountrySelect(name);
    }
  },
    [onCountrySelect],
  );

  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={resolvedBg.url ? undefined : { backgroundColor: resolvedBg.color }}
    >
      <div ref={tooltipRef} className={styles.entityTooltip} />
      <GlobeEntityFilter
        filters={filters}
        categoryFilters={categoryFilters}
        onChange={setFilters}
        onCategoryChange={setCategoryFilters}
      />
      <GlobeSettingsTrigger
        settings={globeSettings}
        onChange={setGlobeSettings}
      />
      {dimensions.width > 0 && (
        <GlobeGL
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl={resolvedTexture}
          backgroundImageUrl={resolvedBg.url ?? ""}
          animateIn={globeSettings.animateIn}
          showAtmosphere={globeSettings.showAtmosphere}
          atmosphereColor={resolvedAtmosphereColor}
          atmosphereAltitude={resolvedAtmosphereAlt}
          showGraticules={globeSettings.showGraticules}
          htmlElementsData={entityPoints}
          htmlLat="lat"
          htmlLng="lng"
          htmlAltitude={0.01}
          htmlElement={htmlElement}
          customLayerData={zoneBadgeData}
          customThreeObject={customThreeObject}
          customLayerLabel={customLayerLabel}
          polygonsData={allPolygons}
          polygonGeoJsonGeometry={polygonGeoJsonGeometry}
          polygonCapColor={polygonCapColor}
          polygonSideColor={polygonSideColor}
          polygonStrokeColor={polygonStrokeColor}
          polygonAltitude={polygonAltitude}
          polygonLabel={polygonLabel}
          onPolygonHover={handlePolygonHover}
          onPolygonClick={handlePolygonClick}
          enablePointerInteraction
        />
      )}
      <AircraftModal
        aircraft={selectedAircraft}
        onClose={() => setSelectedAircraft(null)}
      />
    </div>
  );
};

export const GlobeView = (props: GlobeViewProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <GlobeLoading />;
  }

  return (
    <Suspense fallback={<GlobeLoading />}>
      <GlobeRenderer {...props} />
    </Suspense>
  );
};
