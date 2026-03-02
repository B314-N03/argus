// Mock zone data — NOTAM, blockade, and duty zones
import type { Zone } from "@/domain/models";

export const mockZones: Zone[] = [
  {
    id: "zone_scs_notam",
    name: "South China Sea NOTAM",
    type: "notam",
    center: [15.5, 114.0],
    radius: 300,
    severity: "high",
    description:
      "Active NOTAM covering contested South China Sea airspace. Frequent military exercises reported.",
    active: true,
  },
  {
    id: "zone_hormuz",
    name: "Strait of Hormuz",
    type: "duty_zone",
    center: [26.5, 56.3],
    radius: 150,
    severity: "high",
    description:
      "Heightened naval patrol activity. Multiple carrier groups maintaining presence.",
    active: true,
  },
  {
    id: "zone_black_sea",
    name: "Black Sea Exclusion Zone",
    type: "exclusion",
    center: [43.5, 34.0],
    radius: 250,
    severity: "high",
    description:
      "Maritime exclusion zone with restricted civilian shipping. Active military operations area.",
    active: true,
  },
  {
    id: "zone_baltic",
    name: "Baltic Sea Patrol Zone",
    type: "duty_zone",
    center: [57.0, 20.0],
    radius: 200,
    severity: "medium",
    description:
      "NATO enhanced Air Policing and naval patrol operations. Increased ISR activity.",
    active: true,
  },
  {
    id: "zone_east_med",
    name: "Eastern Mediterranean NOTAM",
    type: "notam",
    center: [34.5, 33.0],
    radius: 180,
    severity: "medium",
    description:
      "Naval exercise area with temporary flight restrictions. Multiple navies participating.",
    active: true,
  },
  {
    id: "zone_taiwan_strait",
    name: "Taiwan Strait",
    type: "duty_zone",
    center: [24.5, 119.5],
    radius: 120,
    severity: "high",
    description:
      "High-tension patrol zone with frequent air and naval activity from multiple parties.",
    active: true,
  },
  {
    id: "zone_norway",
    name: "Norwegian Sea Exercise Area",
    type: "notam",
    center: [67.0, 5.0],
    radius: 250,
    severity: "low",
    description:
      "Seasonal NATO exercise area. Submarine and anti-submarine warfare training operations.",
    active: true,
  },
  {
    id: "zone_persian_gulf",
    name: "Persian Gulf Patrol",
    type: "blockade",
    center: [27.0, 51.5],
    radius: 200,
    severity: "medium",
    description:
      "Maritime security patrol zone. Coalition naval forces monitoring shipping lanes.",
    active: true,
  },
];
