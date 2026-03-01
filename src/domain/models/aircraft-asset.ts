export interface AircraftAsset {
  id: string
  designation: string
  name: string
  natoName?: string
  role: string
  operator: string
  country: string
  manufacturer: string
  specs: {
    maxSpeed: string
    range: string
    ceiling: string
    crew: string
    length: string
    wingspan: string
  }
  description: string
  inService: boolean
  knownRegistrations: string[]
}
