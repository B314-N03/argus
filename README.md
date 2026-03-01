# Argus — Global Activity Situational Dashboard

A web-based situational awareness dashboard for monitoring global military-related activity using open-source intelligence (OSINT). Focused on descriptive analytics: pattern recognition, trend visualization, and anomaly detection.

## Getting Started

```bash
npm install
npm run dev
```

## Building For Production

```bash
npm run build
```

## Tech Stack

- **Framework**: TanStack Start + React 19 + TypeScript (strict)
- **Styling**: SCSS Modules (no Tailwind, no CSS-in-JS)
- **State**: TanStack Query (server state), `useSyncExternalStore` + localStorage (settings)
- **Globe**: `react-globe.gl` (lazy-loaded WebGL)
- **Icons**: `lucide-react`

## Architecture

Feature-based modular structure under `src/`:

```
src/
  components/ui/       — Reusable primitives (Button, Card, Dialog, etc.)
  components/layout/   — Layout shells (GlobeLayout, Sidebar, Header)
  domain/models/       — TypeScript interfaces and pure helpers
  domain/types/        — Shared type definitions
  features/            — Self-contained feature modules
    dashboard/         — Main dashboard (globe, feeds, widgets, modals)
    air/               — Aircraft tracking
    naval/             — Vessel tracking
    signals/           — Signal event monitoring
    radios/            — Radio station monitoring
    indicators/        — Activity indicators
  lib/api/mock/        — Seeded deterministic mock data
  lib/settings/        — localStorage settings system
  styles/              — SCSS variables, mixins, breakpoints
  routes/              — TanStack Router file-based routes
```

## Dashboard

Three-column layout:

- **Left**: Activity feed + OSINT news feed (collapsible, draggable divider)
- **Center**: Interactive 3D globe with entity icons, zone rings, country polygons
- **Right**: Configurable widget stack (aircraft, vessels, signals, chokepoints, force disposition, indicators, radio stations)

## Linting & Formatting

```bash
npm run lint
npm run format
npm run check
```
