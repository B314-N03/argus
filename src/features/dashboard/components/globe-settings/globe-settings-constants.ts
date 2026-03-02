import type { GlobeSettings } from "@/lib/settings";

const CDN_BASE = "https://unpkg.com/three-globe/example/img";

export const TEXTURE_URLS: Record<GlobeSettings["texture"], string> = {
  night: `${CDN_BASE}/earth-night.jpg`,
  day: `${CDN_BASE}/earth-day.jpg`,
  "blue-marble": `${CDN_BASE}/earth-blue-marble.jpg`,
  topology: `${CDN_BASE}/earth-topology.png`,
};

export const BACKGROUND_CONFIG: Record<
  GlobeSettings["background"],
  { url?: string; color: string }
> = {
  "night-sky": { url: `${CDN_BASE}/night-sky.png`, color: "#000810" },
  dark: { color: "#000810" },
};

export const ATMOSPHERE_COLORS: Record<
  GlobeSettings["atmosphereColor"],
  string
> = {
  blue: "#1d9bf0",
  cyan: "#00d4ff",
  green: "#18b76f",
  orange: "#f4900c",
};

export const ATMOSPHERE_ALTITUDES: Record<
  GlobeSettings["atmosphereAltitude"],
  number
> = {
  low: 0.08,
  medium: 0.15,
  high: 0.3,
};
