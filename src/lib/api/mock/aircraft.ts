// Mock aircraft data generator
import type { Aircraft, AircraftCategory } from "@/domain/models";

import { createSeededRandom } from "./seed";

const countries = [
  "United States",
  "Russia",
  "China",
  "United Kingdom",
  "France",
  "Germany",
  "Japan",
  "India",
  "Brazil",
  "Australia",
];

const callsigns = [
  "RCH123",
  "EGLL456",
  "AAR789",
  "UAC234",
  "CPA567",
  "UAE890",
  "BAW123",
  "DLH456",
  "AFR789",
  null,
];

const aircraftCategories: AircraftCategory[] = [
  "commercial",
  "military",
  "government",
  "private",
  "cargo",
];

const registrations = [
  "N12345",
  "G-ABCD",
  "F-GHIJ",
  "D-ABCD",
  "JA-ABCD",
  "VT-ABCD",
  "PR-ABCD",
  "CC-ABCD",
  null,
];

// Generate a stable mock aircraft based on index
function generateSeededAircraft(index: number): Aircraft {
  const random = createSeededRandom(`aircraft_${index}`);

  const category =
    aircraftCategories[Math.floor(random() * aircraftCategories.length)];
  const latitude = -60 + random() * 120;
  const longitude = -180 + random() * 360;
  const altitude = Math.floor(random() * 40000) + 10000;
  const hasVelocity = random() > 0.2;

  return {
    id: `ac_${index.toString(36).padStart(6, "0")}`,
    callsign: callsigns[Math.floor(random() * callsigns.length)],
    icao24: Math.floor(random() * 16777215)
      .toString(16)
      .toUpperCase()
      .padStart(6, "0"),
    originCountry: countries[Math.floor(random() * countries.length)],
    position: { latitude, longitude, altitude },
    velocity: hasVelocity
      ? {
          heading: Math.floor(random() * 360),
          speed: Math.floor(random() * 500) + 200,
          verticalSpeed: Math.floor(random() * 2000) - 1000,
        }
      : null,
    altitude,
    lastSeen: new Date(
      Date.now() - Math.floor(random() * 3600000),
    ).toISOString(),
    category,
    registration:
      registrations[Math.floor(random() * registrations.length)] ?? undefined,
  };
}

// Generate multiple mock aircraft
export function generateMockAircraftList(count: number = 50): Aircraft[] {
  return Array.from({ length: count }, (_, i) => generateSeededAircraft(i));
}
