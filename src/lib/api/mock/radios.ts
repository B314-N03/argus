// Mock radio stations data — known military and numbers stations
import type { RadioStation, RadioSummary } from "@/domain/models";

import { createSeededRandom } from "./seed";

const stationsDatabase: Omit<
  RadioStation,
  "activityLevel" | "lastActivity" | "history"
>[] = [
  {
    id: "radio_uvb76",
    name: "UVB-76 (The Buzzer)",
    callsign: "UVB-76",
    nickname: "The Buzzer",
    frequency: 4625,
    mode: "USB",
    country: "Russia",
    status: "active",
    description:
      "Continuously broadcasting a short, monotonous buzzing tone since 1982. Occasionally interrupted by voice messages in Russian. Believed to be a Russian military communications channel.",
    signalPattern: "buzz",
    webSdrUrl: "https://websdr.ewi.utwente.nl/?tune=4625usb",
  },
  {
    id: "radio_pip",
    name: "The Pip (S28)",
    callsign: "S28",
    nickname: "The Pip",
    frequency: 5448,
    mode: "USB",
    country: "Russia",
    status: "active",
    description:
      "Emits a continuous series of rapid pips/beeps. Like UVB-76, occasionally features voice transmissions. Located near St. Petersburg, Russia.",
    signalPattern: "pip",
    webSdrUrl: "https://websdr.ewi.utwente.nl/?tune=5448usb",
  },
  {
    id: "radio_squeaky",
    name: "The Squeaky Wheel",
    callsign: "S32",
    nickname: "The Squeaky Wheel",
    frequency: 3828,
    mode: "CW",
    country: "Russia",
    status: "active",
    description:
      "Transmits a characteristic squeaky, repetitive sound pattern. Part of the Russian military communication network alongside UVB-76 and The Pip.",
    signalPattern: "sweep",
    webSdrUrl: "https://websdr.ewi.utwente.nl/?tune=3828cw",
  },
  {
    id: "radio_hm01",
    name: "HM01 (Atención)",
    callsign: "HM01",
    nickname: "Atención",
    frequency: 6855,
    mode: "AM",
    country: "Cuba",
    status: "active",
    description:
      'Cuban numbers station broadcasting encoded messages in Spanish. Transmissions begin with "Atención" followed by groups of numbers. Associated with Cuban intelligence services.',
    signalPattern: "numbers",
    webSdrUrl: "https://websdr.ewi.utwente.nl/?tune=6855am",
  },
  {
    id: "radio_e11",
    name: "E11 (Oblique)",
    callsign: "E11",
    nickname: "Oblique",
    frequency: 8100,
    mode: "USB",
    country: "Poland",
    status: "intermittent",
    description:
      "Three-letter NATO phonetic alphabet station believed to be operated by Polish or NATO intelligence. Transmits encrypted message groups on varying HF frequencies.",
    signalPattern: "morse",
    webSdrUrl: "https://websdr.ewi.utwente.nl/?tune=8100usb",
  },
  {
    id: "radio_lincolnshire",
    name: "The Lincolnshire Poacher",
    callsign: "E03",
    nickname: "Lincolnshire Poacher",
    frequency: 11545,
    mode: "USB",
    country: "United Kingdom",
    status: "inactive",
    description:
      'Former MI6 numbers station that used the English folk song "The Lincolnshire Poacher" as an interval signal. Ceased operations around 2008. Believed transmitted from RAF Akrotiri, Cyprus.',
    signalPattern: "silence",
  },
];

function generateStationData(
  station: (typeof stationsDatabase)[number],
): RadioStation {
  const random = createSeededRandom(station.id);

  const activityLevel =
    station.status === "inactive"
      ? 0
      : station.status === "intermittent"
        ? Math.floor(random() * 40) + 10
        : Math.floor(random() * 50) + 50;

  const hoursAgo =
    station.status === "inactive"
      ? Math.floor(random() * 8760) + 8760 // 1-2 years ago
      : Math.floor(random() * 24);

  const lastActivity = new Date(Date.now() - hoursAgo * 3600000).toISOString();

  const historyRandom = createSeededRandom(`${station.id}_history`);
  const events = [
    "Routine transmission detected",
    "Signal strength increased",
    "Brief voice message observed",
    "Transmission pattern change noted",
    "Signal temporarily absent",
    "Frequency drift detected",
    "Modulation anomaly observed",
    "Scheduled maintenance window",
  ];

  const history = Array.from({ length: 5 }, (_, i) => ({
    timestamp: new Date(
      Date.now() - (i + 1) * Math.floor(historyRandom() * 86400000),
    ).toISOString(),
    event: events[Math.floor(historyRandom() * events.length)],
  }));

  return {
    ...station,
    activityLevel,
    lastActivity,
    history,
  };
}

export function generateMockRadioStations(): RadioStation[] {
  return stationsDatabase.map(generateStationData);
}

export function calculateRadioSummary(stations: RadioStation[]): RadioSummary {
  const active = stations.filter((s) => s.status === "active").length;
  const inactive = stations.filter((s) => s.status === "inactive").length;
  const avgActivity =
    stations.length > 0
      ? stations.reduce((sum, s) => sum + s.activityLevel, 0) / stations.length
      : 0;

  return {
    total: stations.length,
    active,
    inactive,
    averageActivity: Math.round(avgActivity),
  };
}
