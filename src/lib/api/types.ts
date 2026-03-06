// API response types
import type {
  ActivityIndicator,
  Aircraft,
  Vessel,
  SignalEvent,
  Region,
  RadioStation,
  RadioSummary,
} from "@/domain/models";

// Indicators API types
export interface GetIndicatorsRequest {
  region?: string;
  type?: string;
  timeWindow?: string;
}

export interface GetIndicatorsResponse {
  indicators: ActivityIndicator[];
  summary: {
    totalIndicators: number;
    elevatedCount: number;
    anomalousCount: number;
    averageDeviation: number;
  };
}

// Aircraft API types
export interface GetAircraftRequest {
  region?: string;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  category?: string;
  limit?: number;
}

export interface GetAircraftResponse {
  aircraft: Aircraft[];
  total: number;
}

// Vessels API types
export interface GetVesselsRequest {
  region?: string;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  shipType?: string;
  limit?: number;
}

export interface GetVesselsResponse {
  vessels: Vessel[];
  total: number;
}

// Signals API types
export interface GetSignalsRequest {
  region?: string;
  signalType?: string;
  startTime?: string;
  endTime?: string;
  limit?: number;
}

export interface GetSignalsResponse {
  signals: SignalEvent[];
  total: number;
}

// Regions API types
export interface GetRegionsResponse {
  regions: Region[];
}

// Radios API types
export interface GetRadiosResponse {
  stations: RadioStation[];
  summary: RadioSummary;
}

// Airplanes.live API response type
export interface AirplanesLiveResponse {
  ac: AirplanesLiveAircraft[];
  total: number;
  ctime: number;
  now: number;
  msg: string;
}

export interface AirplanesLiveAircraft {
  hex: string;
  flight?: string;
  r?: string;
  t?: string;
  lat: number;
  lon: number;
  alt_baro?: number;
  alt_geom?: number;
  gs?: number;
  track?: number;
  true_heading?: number;
  baro_rate?: number;
  geom_rate?: number;
  seen_pos?: number;
  now: number;
  category?: number;
  dbFlags?: number;
}

// GDELT API response type
export interface GdeltArticle {
  url: string;
  domain: string;
  title: string;
  seendate: string;
  themes?: string;
}
