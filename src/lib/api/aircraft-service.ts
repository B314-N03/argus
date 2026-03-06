import type { Aircraft } from "@/domain/models";
import type { AirplanesLiveResponse, AirplanesLiveAircraft } from "@/lib/api/types";

const AIRPLANES_LIVE_BASE = "https://api.airplanes.live/v2";

/**
 * Map Airplanes.live response to domain Aircraft model
 */
export function mapAirplanesToAircraft(raw: AirplanesLiveAircraft): Aircraft {
  return {
    id: `ac_${raw.hex}`,
    callsign: raw.flight?.trim() ?? null,
    icao24: raw.hex,
    originCountry: raw.r ?? "Unknown",
    position: {
      latitude: raw.lat,
      longitude: raw.lon,
      altitude: raw.alt_baro ?? raw.alt_geom ?? undefined,
    },
    velocity:
      raw.gs != null
        ? {
          heading: raw.track ?? raw.true_heading ?? 0,
          speed: raw.gs * 1.852, // knots → km/h
          verticalSpeed: raw.baro_rate ?? raw.geom_rate ?? undefined,
        }
        : null,
    altitude: raw.alt_baro ?? raw.alt_geom ?? 0,
    lastSeen:
      raw.seen_pos != null
        ? new Date((raw.now - raw.seen_pos) * 1000).toISOString()
        : new Date(raw.now * 1000).toISOString(),
    category: mapCategory(raw.category, raw.dbFlags),
    registration: raw.r ?? undefined,
    type: raw.t ?? undefined,
  };
}

/**
 * Map Airplanes.live category to AircraftCategory
 */
function mapCategory(
  category?: number,
  dbFlags?: number,
): Aircraft["category"] {
  // Category: 1=Aircraft, 2=Ground vehicle, 3=Stationary object, 4=Helicopter,
  //          5=Light aircraft, 6=Heavy aircraft
  // dbFlags: bit 0 = military
  if (dbFlags && dbFlags & 1) return "military";
  if (dbFlags && dbFlags & 2) return "government";

  switch (category) {
    case 4:
    case 5:
      return "private";
    case 6:
      return "commercial";
    default:
      return "unknown";
  }
}

/**
 * Fetch aircraft from Airplanes.live API
 * Returns empty array on failure (caller should fall back to mock)
 */
export async function fetchAircraftFromApi(
  category?: string,
  limit = 50,
): Promise<{ aircraft: Aircraft[]; total: number }> {
  try {
    const response = await fetch(`${AIRPLANES_LIVE_BASE}/mil`, {
      // Airplanes.live allows ~1 request/second
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return { aircraft: [], total: 0 };
    }

    const responseData: AirplanesLiveResponse = await response.json();
    const aircraftData = responseData.ac || [];

    let aircraft = aircraftData.map(mapAirplanesToAircraft);

    if (category && category !== "all") {
      aircraft = aircraft.filter((a) => a.category === category);
    }

    aircraft = aircraft.slice(0, limit);

    return {
      aircraft,
      total: aircraft.length,
    };
  } catch {
    return { aircraft: [], total: 0 };
  }
}
