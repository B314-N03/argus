# Project: Global Activity Situational Dashboard Named Argus

## Overview

This project is a web-based situational awareness dashboard focused on global military-related activity using open-source intelligence (OSINT).

The purpose of the application is:

- Early recognition of activity patterns
- Trend and anomaly visualization
- Aggregated situational awareness
- Analytical exploration

This application is NOT:

- A tactical control system
- A military decision-support system
- A real-time interception or response platform

The focus is descriptive analytics, not operational action.

---

# Core Principles

## 1. Analysis Over Action

The system emphasizes:

- Indicators
- Trends
- Pattern deviations
- Regional activity scores

It must NOT:

- Provide tactical recommendations
- Suggest responses
- Optimize operational decisions
- Enable real-time targeting behavior

Language used in UI must be neutral:

- "Increased activity"
- "Deviation from baseline"
- "Elevated signal frequency"
- "Regional anomaly detected"

Avoid:

- "Threat"
- "Intercept"
- "Engage"
- "Respond"

---

# Technical Stack

## Framework

- TanStack Start
- React 19
- TypeScript (strict mode enabled)

## Styling

- SCSS (no Tailwind)
- SCSS Modules for components
- Global SCSS architecture
- Mobile-first responsive design
- Dark mode default

## State Management

- TanStack Query for server/async state
- `useSyncExternalStore` + localStorage for user settings (see `/lib/settings/`)
- Minimal global state
- Colocated state when possible

## Globe Visualization

- `react-globe.gl` (lazy-loaded, WebGL)
- `topojson-client` for country GeoJSON (Natural Earth 110m from CDN)
- Custom HTML elements layer for entity icons (SVG per type)
- Labels layer for zone names
- Polygons layer for country borders (hover highlight, click to select)
- Rings layer for zone animations (differentiated by zone type)

## UI Components

- `lucide-react` for icons
- Native `<dialog>` element for modals (see `/components/ui/dialog/`)
- `clsx` for conditional classnames

## Architecture Style

- Feature-based modular architecture
- Small, composable components
- Strict separation of concerns
- No business logic inside page components

---

# Folder Structure

```
/src
  /components
    /ui          — Reusable UI primitives (Button, Card, Dialog, InfoTooltip, StatCard)
    /layout      — Layout shells (GlobeLayout, MainLayout, Header, Sidebar, DashboardGrid)
  /domain
    /models      — TypeScript interfaces and pure helpers only, no UI logic
    /types       — Shared type definitions (GeoPosition, Velocity)
  /features
    /air         — Aircraft tracking (table, summary, asset lookup)
    /naval       — Vessel tracking (table, summary)
    /signals     — Signal event monitoring
    /radios      — Radio station monitoring (waveform, dashboard card)
    /indicators  — Activity indicators (grid, cards, trends, type grouping)
    /dashboard   — Main dashboard feature:
      /components
        /globe-view         — 3D globe with entity icons, zone rings, country polygons
        /globe-entity-icon  — SVG icon generation per entity type
        /activity-feed      — Real-time entity detection feed
        /news-feed          — OSINT news feed (clickable items)
        /tension-index      — Composite tension score with chart
        /dashboard-header   — Header with UTC time and entity stats
        /widget-stack       — Right panel with configurable widgets
        /widget-settings    — Popover for toggling widget visibility
        /country-modal      — Country detail modal (leadership, military, news)
        /news-detail-modal  — Full news item modal
        /chokepoint-widget  — Strategic chokepoint monitoring
        /force-summary      — Military vs civilian entity breakdown
      /hooks
        /use-globe-data       — Aggregates all data sources for globe
        /use-country-geojson  — Fetches and caches country GeoJSON
  /lib
    /api/mock    — Seeded mock data generators (deterministic via mulberry32)
    /api/types   — API response type definitions
    /settings    — localStorage settings system (useSettings hook)
    /tooltip-content — Centralized tooltip strings
  /styles        — SCSS variables, mixins, breakpoints
  /routes        — TanStack Router file-based routes
  /integrations  — TanStack Query provider
```

Each feature:

- Self-contained
- Has UI components
- Has hooks
- Has data access
- Has no cross-feature tight coupling

---

# Domain Models

Core domain entities:

- Aircraft (category: commercial, military, government, private, cargo)
- Vessel (shipType: cargo, tanker, passenger, fishing, military, coast guard, research)
- SignalEvent (signalType: adsb, ais, hf, vhf, satellite, radar)
- ActivityIndicator (type: isr_activity, naval_presence, tanker_density, signal_activity, air_activity, anomaly_score)
- Region
- Zone (type: notam, blockade, duty_zone, exclusion)
- NewsItem (sourceType: twitter, news, telegram, forum)
- RadioStation
- AircraftAsset
- Country (leadership, military branches, alliances, personnel)
- Chokepoint (transit data, risk levels)

Domain layer contains:

- Types
- Interfaces
- Pure utility functions (label formatters, etc.)

No UI dependencies allowed inside domain.

---

# Dashboard Architecture

The main dashboard (`/routes/index.tsx`) uses a 3-column `GlobeLayout`:

- **Left panel**: ActivityFeed + feed divider + NewsFeed (OSINT)
- **Center**: GlobeView (3D globe) + TensionIndex overlay
- **Right panel**: WidgetStack (configurable, scrollable)
- **Header**: DashboardHeader with UTC time, entity counts, region count

## Globe View

- Entity icons rendered as HTML elements (not WebGL points) for per-type SVG icons
- Zone rings with type-differentiated animation (exclusion=fast red, blockade=medium orange, notam=blue, duty_zone=slow blue)
- Zone labels with type prefix: `[NOTAM]`, `[EXCLUSION]`, `[BLOCKADE]`, `[PATROL]`
- Country polygons from Natural Earth GeoJSON — hover highlights border yellow, click opens CountryModal
- No auto-rotation (user controls only)

## Widgets

Widgets in the right panel are individually togglable via a settings popover. Visibility is persisted to localStorage under key `argus.widgets.visible`. Current widgets:

1. Radio Stations (waveform dashboard card)
2. Indicator Status (elevated/anomalous counts)
3. Aircraft (tracked count)
4. Vessels (detected count)
5. Signals (captured count)
6. Chokepoints (8 strategic maritime chokepoints with transit data and risk levels)
7. Force Disposition (military vs civilian breakdown for aircraft and vessels)

## Modals

- **CountryModal**: Shows overview, leadership, military branches/personnel/alliances, regional news. Uses `<Dialog size="lg">`.
- **NewsDetailModal**: Full news content, source info, timestamp, tags, external source link. Uses `<Dialog size="md">`.

## Settings System

- `useSettings<T>(key, defaultValue)` — built on `useSyncExternalStore`
- Reads/writes localStorage
- Cross-tab sync via `storage` event
- Same-tab reactivity via custom `argus-settings-change` event

---

# Mock Data

All mock data uses seeded random generation (`/lib/api/mock/seed.ts`) with the mulberry32 algorithm for deterministic, reproducible output.

Key datasets:

- 30 aircraft, 20 vessels, 25 signals (generated per-index with seed)
- 42 indicators (6 types x 7 regions) with 24h hourly history
- 8 active zones (NOTAM, blockade, duty_zone, exclusion)
- 15 OSINT news items with realistic sources and timestamps
- 30 countries with real leadership, military data, alliances
- 8 strategic chokepoints with transit counts and risk levels
- Radio stations with waveform data

---

# Indicator Philosophy

Indicators are statistical representations of activity over time.

Examples:

- ISR Activity Index
- Naval Presence Index
- Tanker Density Score
- Signal Activity Index

Indicators must:

- Be based on time windows
- Compare against baselines
- Express uncertainty
- Avoid deterministic claims

---

# Tension Index

Composite score (0-100) derived from indicator data:

- `deviationComponent = min(|averageDeviation| * 1.5, 40)`
- `elevatedComponent = min(elevatedCount * 3, 30)`
- `anomalousComponent = min(anomalousCount * 5, 30)`

Color-coded: green (0-29), yellow (30-59), orange (60-79), red (80+).

---

# Responsiveness Strategy

Mobile-first design.

Layout rules:

- Desktop: multi-column dashboard layout (3 columns with 280-320px sidebars)
- Tablet: reduced panels
- Mobile: stacked vertical layout (left panel at bottom, max-height 300px)

Use SCSS breakpoints via mixins (`@include sm`, `@include md`, `@include lg`, `@include xl`).
No inline styles.
No CSS-in-JS.

---

# Code Quality Rules

- Strict TypeScript (no `any`, except `react-globe.gl` ref and GeoJSON features)
- Named exports only
- Functional components only
- Components under ~120 lines
- Composition over configuration
- No monolithic files
- No implicit side effects
- Clean architecture boundaries

---

# Data Handling Philosophy

- Data is aggregated
- Delays may be applied
- Statistical interpretation preferred over exact precision
- UI must reflect uncertainty

The system visualizes patterns — it does not assert intent.

---

# Future Scalability Considerations

- Modular feature isolation
- Replaceable data sources
- API abstraction layer
- Indicator engine extensibility
- Clear domain contracts
- Widget system extensible via settings keys
- Country data replaceable with live API

---

# When Generating Code

Claude must:

- Respect feature boundaries
- Avoid mixing domain and UI logic
- Maintain strict typing
- Avoid tight coupling between features
- Keep components small and composable
- Prefer readability over cleverness
- Use `@include` mixins for card styles, scrollbars, buttons, text truncation
- Use SCSS variables for all colors, spacing, typography — never hardcode values
- Use the Dialog component for modals (not custom implementations)
- Use the settings system for user preferences that should persist
- Follow kebab-case file naming convention for all new files
- Run `npm run validate` in the end to verify it didnt produce any issues

---
