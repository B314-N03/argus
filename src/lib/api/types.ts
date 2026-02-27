// API response types
import type { ActivityIndicator, Aircraft, Vessel, SignalEvent, Region } from '@/domain/models'

// Indicators API types
export interface GetIndicatorsRequest {
  region?: string
  type?: string
  timeWindow?: string
}

export interface GetIndicatorsResponse {
  indicators: ActivityIndicator[]
  summary: {
    totalIndicators: number
    elevatedCount: number
    anomalousCount: number
  }
}

// Aircraft API types
export interface GetAircraftRequest {
  region?: string
  bounds?: {
    north: number
    south: number
    east: number
    west: number
  }
  category?: string
  limit?: number
}

export interface GetAircraftResponse {
  aircraft: Aircraft[]
  total: number
}

// Vessels API types
export interface GetVesselsRequest {
  region?: string
  bounds?: {
    north: number
    south: number
    east: number
    west: number
  }
  shipType?: string
  limit?: number
}

export interface GetVesselsResponse {
  vessels: Vessel[]
  total: number
}

// Signals API types
export interface GetSignalsRequest {
  region?: string
  signalType?: string
  startTime?: string
  endTime?: string
  limit?: number
}

export interface GetSignalsResponse {
  signals: SignalEvent[]
  total: number
}

// Regions API types
export interface GetRegionsResponse {
  regions: Region[]
}
