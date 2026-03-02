import type { AircraftCategory, ShipType, SignalType } from "@/domain/models";

interface EntityPoint {
  type: "aircraft" | "vessel" | "signal";
  category?: AircraftCategory;
  shipType?: ShipType;
  signalType?: SignalType;
}

function jetIcon(color: string, filled: boolean): string {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="${filled ? color : "none"}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`;
}

function shipIcon(color: string, filled: boolean): string {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="${filled ? color : "none"}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path d="M12 1v4"/></svg>`;
}

function radioWaveIcon(color: string): string {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.4"/><circle cx="12" cy="12" r="2" fill="${color}"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.4"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/></svg>`;
}

export function getEntityIconSvg(point: EntityPoint): string {
  if (point.type === "aircraft") {
    switch (point.category) {
      case "military":
        return jetIcon("#1d9bf0", true);
      case "government":
        return jetIcon("#8947c5", true);
      case "cargo":
        return jetIcon("#f4900c", false);
      default:
        return jetIcon("#71767b", false);
    }
  }

  if (point.type === "vessel") {
    switch (point.shipType) {
      case "military":
      case "coast guard":
        return shipIcon("#1d9bf0", true);
      default:
        return shipIcon("#18b76f", false);
    }
  }

  return radioWaveIcon("#f4900c");
}
