// Mock signals data generator
import type { SignalEvent, SignalType } from "@/domain/models";

import { createSeededRandom } from "./seed";

const signalTypes: SignalType[] = [
  "adsb",
  "ais",
  "hf",
  "vhf",
  "satellite",
  "radar",
];

const sources = [
  "Ground Station Alpha",
  "Coast Guard Station",
  "Satellite Constellation",
  "Military Radar",
  "Civilian ATC",
  "Naval Operations",
  "Research Station",
];

const modulations = ["AM", "FM", "PSK31", "CW", "SSB", "FDM", null];

function generateFrequency(
  random: () => number,
  signalType: SignalType,
): number {
  switch (signalType) {
    case "adsb":
      return 1090000000 + random() * 100000000;
    case "ais":
      return 161975000 + random() * 20000;
    case "hf":
      return 3000000 + random() * 27000000;
    case "vhf":
      return 30000000 + random() * 300000000;
    case "satellite":
      return 2000000000 + random() * 6000000000;
    case "radar":
      return 1000000000 + random() * 10000000000;
    default:
      return 100000 + random() * 10000000;
  }
}

function generateSeededSignal(index: number): SignalEvent {
  const random = createSeededRandom(`signal_${index}`);

  const signalType = signalTypes[Math.floor(random() * signalTypes.length)];
  const hasLocation = random() > 0.3;
  const hasDuration = random() > 0.5;

  return {
    id: `sig_${index.toString(36).padStart(6, "0")}`,
    timestamp: new Date(
      Date.now() - Math.floor(random() * 86400000),
    ).toISOString(),
    frequency: Math.round(generateFrequency(random, signalType)),
    signalType,
    location: hasLocation
      ? {
          latitude: -60 + random() * 120,
          longitude: -180 + random() * 360,
        }
      : null,
    strength: Math.floor(random() * 100),
    modulation: modulations[Math.floor(random() * modulations.length)],
    source: sources[Math.floor(random() * sources.length)],
    duration: hasDuration ? Math.floor(random() * 300) : undefined,
  };
}

// Generate multiple mock signals
export function generateMockSignalsList(count: number = 50): SignalEvent[] {
  return Array.from({ length: count }, (_, i) => generateSeededSignal(i));
}
