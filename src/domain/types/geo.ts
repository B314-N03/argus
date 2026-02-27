// Shared geographic types used across domain models

// Geographic position
export interface GeoPosition {
  latitude: number
  longitude: number
  altitude?: number
}

// Velocity information
export interface Velocity {
  heading: number
  speed: number
  verticalSpeed?: number
}

// Geographic bounds
export interface GeoBounds {
  north: number
  south: number
  east: number
  west: number
}

// Helper function to check if coordinates are within bounds
export function isWithinBounds(
  latitude: number,
  longitude: number,
  bounds: GeoBounds
): boolean {
  return (
    latitude >= bounds.south &&
    latitude <= bounds.north &&
    longitude >= bounds.west &&
    longitude <= bounds.east
  )
}
