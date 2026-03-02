import type { GeoPosition, Velocity } from "../types/geo";

export type AircraftCategory =
  | "commercial"
  | "military"
  | "government"
  | "private"
  | "cargo"
  | "unknown";

export interface Aircraft {
  id: string;
  callsign: string | null;
  icao24: string;
  originCountry: string;
  position: GeoPosition;
  velocity: Velocity | null;
  altitude: number | null;
  lastSeen: string;
  category: AircraftCategory;
  registration?: string;
  type?: string;
}

export function getAircraftCategoryLabel(category: AircraftCategory): string {
  const labels: Record<AircraftCategory, string> = {
    commercial: "Commercial",
    military: "Military",
    government: "Government",
    private: "Private",
    cargo: "Cargo",
    unknown: "Unknown",
  };

  return labels[category];
}
