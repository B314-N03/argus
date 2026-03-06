# Aircraft Feature Implementation Status

## Completed

### 1. Aircraft Category Filtering
- Added settings for filtering aircraft by category (military, government, commercial, cargo, private)
- Military and government are enabled by default
- Commercial, cargo, and private are hidden by default
- Settings persisted to localStorage under `argus.globe.aircraftCategoryFilters`
- Created dropdown UI component (`aircraft-category-filter.tsx`)
- Filter opens upward (fixed from initial downward position)

**Files modified:**
- `src/lib/settings/settings-keys.ts` - Added `AircraftCategoryFilters` interface and helper function
- `src/lib/settings/index.ts` - Exported new settings
- `src/features/dashboard/components/globe-view/aircraft-category-filter.tsx` - New dropdown component
- `src/features/dashboard/components/globe-view/aircraft-category-filter.module.scss` - Styles
- `src/features/dashboard/components/globe-view/globe-entity-filter.tsx` - Integrated category filter
- `src/features/dashboard/components/globe-view/globe-view.tsx` - Added filtering logic

### 2. Aircraft Click to Open Modal
- Clicking on an aircraft icon opens a detail modal
- Modal displays: callsign, ICAO24, registration, aircraft type, category, origin country, altitude, ground speed, last seen, position
- Added click handler with propagation stop to prevent country modal from also opening

**Files modified:**
- `src/features/dashboard/components/aircraft-modal/aircraft-modal.tsx` - New modal component
- `src/features/dashboard/components/aircraft-modal/aircraft-modal.module.scss` - Modal styles
- `src/features/dashboard/components/globe-view/globe-view.tsx` - Added click handler

### 3. Aircraft Direction (Heading)
- Aircraft icons now rotate based on their heading
- Added `heading` field to `GlobePoint` interface
- Updated `getEntityIconSvg` to accept heading and rotate the SVG

**Files modified:**
- `src/features/dashboard/components/globe-view/globe-entity-icon.tsx` - Added rotation parameter
- `src/features/dashboard/components/globe-view/globe-view.tsx` - Added heading to interface
- `src/features/dashboard/hooks/use-globe-data.ts` - Map heading from velocity data

---

## Still Open

### 1. Coordinate Mapping Issue
- Aircraft positions appear incorrect on globe (e.g., showing over Iran when none are there)
- Need to verify lat/lng mapping is correct
- The API uses `lat` and `lon` which should map to latitude and longitude
- Need to verify the mapping in `use-globe-data.ts`

### 2. Aircraft Type Description
- Currently showing ICAO type code (e.g., "B738") in modal
- Should map to description value from data if available
- The API may have a `tdesc` field for type description
- Need to add to types and map in aircraft-service.ts

### 3. Globe Spinning Issue
- User reports globe spins very slowly
- User mentioned autoRotate is false by default, so this may not be the issue
- Need to investigate performance - possibly too many points being rendered

### 4. Visibility Culling (Partial)
- Started implementation by adding `globeRotation` state
- Need to add `onMoveEnd` callback to GlobeGL to track rotation
- Need to filter `entityPoints` to only include visible points (those on the front of the globe)

**In progress:**
- `src/features/dashboard/components/globe-view/globe-view.tsx` - Added state, partial handler added but code has syntax error

---

## Pre-existing Issues (Not Related to This Feature)

- File casing issues in TypeScript (Card/card.tsx, Aircraft.ts vs aircraft.ts, etc.)
- Some implicit `any` types in news-service.ts
