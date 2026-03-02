export type ZoneType = "notam" | "blockade" | "duty_zone" | "exclusion";

export interface Zone {
  id: string;
  name: string;
  type: ZoneType;
  center: [number, number]; // [lat, lng]
  radius?: number; // km, for circular zones
  polygon?: [number, number][]; // for irregular zones
  severity: "low" | "medium" | "high";
  description: string;
  active: boolean;
}

export function getZoneTypeLabel(type: ZoneType): string {
  const labels: Record<ZoneType, string> = {
    notam: "NOTAM",
    blockade: "Naval Blockade",
    duty_zone: "Active Duty Zone",
    exclusion: "Exclusion Zone",
  };

  return labels[type];
}

/**
 * Generates a GeoJSON Polygon geometry approximating a circle on the globe.
 * Uses the haversine destination formula to compute points at a given radius.
 */
export function buildZonePolygonGeometry(
  center: [number, number],
  radiusKm: number,
  sides: number = 64,
): { type: "Polygon"; coordinates: [number, number][][] } {
  const [latDeg, lngDeg] = center;
  const lat = (latDeg * Math.PI) / 180;
  const lng = (lngDeg * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const angularDist = radiusKm / R;

  const coords: [number, number][] = [];

  for (let i = 0; i <= sides; i++) {
    const bearing = (2 * Math.PI * i) / sides;
    const destLat = Math.asin(
      Math.sin(lat) * Math.cos(angularDist) +
        Math.cos(lat) * Math.sin(angularDist) * Math.cos(bearing),
    );
    const destLng =
      lng +
      Math.atan2(
        Math.sin(bearing) * Math.sin(angularDist) * Math.cos(lat),
        Math.cos(angularDist) - Math.sin(lat) * Math.sin(destLat),
      );

    // GeoJSON uses [lng, lat] order
    coords.push([(destLng * 180) / Math.PI, (destLat * 180) / Math.PI]);
  }

  return { type: "Polygon", coordinates: [coords] };
}
