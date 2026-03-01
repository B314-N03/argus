# Argus: Mock-to-Real Data Migration Guide

This document describes how to migrate each data domain from seeded mock generators to real API data sources. It covers every mocked entity, the recommended real API, field mapping, backend requirements, and migration strategy.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Aviation — Aircraft Tracking](#aviation--aircraft-tracking)
3. [Aviation — Aircraft Asset Database](#aviation--aircraft-asset-database)
4. [Naval — Vessel Tracking](#naval--vessel-tracking)
5. [Signals — Radio Monitoring](#signals--radio-monitoring)
6. [News — OSINT Feed](#news--osint-feed)
7. [Indicators — Activity Metrics](#indicators--activity-metrics)
8. [Zones — Geographic Restrictions](#zones--geographic-restrictions)
9. [Regions — Geographic Organization](#regions--geographic-organization)
10. [Social Media — Twitter/X and Alternatives](#social-media--twitterx-and-alternatives)
11. [Geospatial — Base Map Data](#geospatial--base-map-data)
12. [Backend Proxy Architecture](#backend-proxy-architecture)
13. [Environment Variables](#environment-variables)
14. [Migration Order](#migration-order)

---

## Architecture Overview

### Current Flow (Mock)

```
Mock Generators (seeded PRNG)
  → Feature API functions (simulated latency)
    → TanStack Query hooks (cache, auto-refetch)
      → React components
```

### Target Flow (Real)

```
External APIs (OpenSky, AISStream, GDELT, etc.)
  → Backend proxy (rate limiting, caching, key management)
    → Feature API functions (fetch from proxy)
      → TanStack Query hooks (cache, auto-refetch)
        → React components
```

### Key Principle

The migration boundary is at the **feature API layer** (`src/features/*/api/`). Each `get*.ts` file currently calls a mock generator — replace its implementation with a `fetch()` call to the backend proxy. Domain models, hooks, and components stay untouched if field mapping is done correctly in the API layer.

### Files That Change Per Domain

| Layer | Files | Changes |
|---|---|---|
| Feature API | `src/features/*/api/get-*.ts` | Replace mock calls with `fetch()` to backend |
| API Types | `src/lib/api/types.ts` | Add raw API response types for mapping |
| Backend (new) | `server/routes/*.ts` | New proxy endpoints per data source |
| Config (new) | `.env` | API keys, base URLs |

### Files That Do NOT Change

- `src/domain/models/*` — domain models remain stable
- `src/features/*/hooks/*` — hooks consume the same API function signatures
- `src/components/*` — UI consumes domain models, not raw API data
- `src/lib/api/mock/*` — keep for development/testing fallback

---

## Aviation — Aircraft Tracking

### Current Mock

- **Generator**: `src/lib/api/mock/aircraft.ts` → `generateMockAircraftList(count)`
- **Domain model**: `src/domain/models/aircraft.ts` → `Aircraft`
- **Feature API**: `src/features/air/api/get-aircraft.ts`
- **Fields**: `id`, `callsign`, `icao24`, `originCountry`, `position`, `velocity`, `altitude`, `lastSeen`, `category`, `registration`, `type`
- **Mock behavior**: 50 aircraft, seeded random positions, 80% have velocity, categories include military/government/commercial

### Recommended APIs

#### Primary: Airplanes.live (free, unfiltered)

- **Base URL**: `https://api.airplanes.live/v2`
- **Auth**: None
- **Rate limit**: 1 request/second
- **Key endpoints**:
  - `GET /mil` — all military-tagged aircraft globally
  - `GET /point/{lat}/{lon}/{radius}` — aircraft within radius (max 250nm)
  - `GET /type/{icaoType}` — by airframe type (e.g. `RC135`, `P8`, `E3`)
  - `GET /hex/{icao24}` — by ICAO hex address
  - `GET /callsign/{callsign}` — by callsign

**Field mapping (Airplanes.live → Aircraft domain model)**:

```typescript
function mapAirplanesToAircraft(raw: AirplanesLiveAircraft): Aircraft {
  return {
    id: `ac_${raw.hex}`,
    callsign: raw.flight?.trim() ?? null,
    icao24: raw.hex,
    originCountry: raw.r ?? 'Unknown', // registration country
    position: {
      latitude: raw.lat,
      longitude: raw.lon,
      altitude: raw.alt_baro ?? raw.alt_geom ?? null,
    },
    velocity: raw.gs != null ? {
      heading: raw.track ?? raw.true_heading ?? 0,
      speed: raw.gs * 1.852, // knots → km/h
      verticalSpeed: raw.baro_rate ?? raw.geom_rate ?? null,
    } : null,
    altitude: raw.alt_baro ?? raw.alt_geom ?? 0,
    lastSeen: new Date((raw.seen_pos ? Date.now() / 1000 - raw.seen_pos : raw.now) * 1000).toISOString(),
    category: mapCategory(raw.category, raw.dbFlags),
    registration: raw.r ?? null,
    type: raw.t ?? null,
  };
}
```

#### Secondary: OpenSky Network (authenticated, historical data)

- **Base URL**: `https://opensky-network.org/api`
- **Auth**: OAuth2 Client Credentials (required since March 2025)
- **Rate limit**: 4,000 credits/day authenticated, 8,000 if contributing a receiver
- **Key endpoints**:
  - `GET /states/all?lamin=&lomin=&lamax=&lomax=` — state vectors in bounding box
  - `GET /flights/all?begin=&end=` — historical flights (max 2h window)
  - `GET /flights/aircraft?icao24=&begin=&end=` — flight history per aircraft (max 2 days)
  - `GET /tracks?icao24=&time=` — track waypoints

**Use OpenSky for**: historical flight data, track reconstruction, statistical baselines. Use Airplanes.live for real-time state.

### Backend Proxy Endpoint

```
GET /api/aircraft?bounds=latmin,lonmin,latmax,lonmax&category=military&limit=50
```

The proxy should:
1. Call Airplanes.live `/mil` and `/point/{lat}/{lon}/{radius}` based on params
2. Map raw responses to `Aircraft[]`
3. Cache responses for 10 seconds (ADS-B data updates ~every 5s)
4. Fall back to OpenSky if Airplanes.live is down

---

## Aviation — Aircraft Asset Database

### Current Mock

- **Data**: `src/lib/api/mock/aircraft-assets.ts` — hardcoded array of ~10 military aircraft types
- **Domain model**: `src/domain/models/aircraft-asset.ts` → `AircraftAsset`
- **Fields**: `id`, `designation`, `name`, `natoName`, `role`, `operator`, `country`, `manufacturer`, `specs`, `description`, `inService`, `knownRegistrations`

### Recommended Approach

This is **reference data**, not live telemetry. No external API needed — maintain as a curated static database.

Options:
1. **Keep as-is** — expand the hardcoded array as needed
2. **Move to JSON file** — `src/lib/data/aircraft-assets.json` for easier editing
3. **Move to a lightweight DB** — SQLite or a simple JSON-backed store if the dataset grows beyond ~100 entries

### Enrichment Sources (manual/periodic)

- **MILAMOS database**: https://www.milamos.org — military aircraft reference
- **Scramble.nl**: https://scramble.nl — military aviation database
- **ICAO Aircraft Type Designators**: https://www.icao.int/publications/doc8643 — official type codes

No migration needed for this domain. Expand the dataset manually over time.

---

## Naval — Vessel Tracking

### Current Mock

- **Generator**: `src/lib/api/mock/vessels.ts` → `generateMockVesselsList(count)`
- **Domain model**: `src/domain/models/vessel.ts` → `Vessel`
- **Feature API**: `src/features/naval/api/get-vessels.ts`
- **Fields**: `id`, `mmsi`, `name`, `flag`, `position`, `course`, `speed`, `shipType`, `lastSeen`, `imo`, `callSign`, `destination`, `eta`
- **Mock behavior**: 30 vessels, 12 flag states, 7 ship types, realistic MMSI ranges

### Recommended API: AISStream.io (free, real-time WebSocket)

- **Protocol**: WebSocket at `wss://stream.aisstream.io/v0/stream`
- **Auth**: API key (free, register via GitHub)
- **Rate limit**: ~300 messages/second throughput

**Subscription message**:

```json
{
  "APIKey": "<AISSTREAM_API_KEY>",
  "BoundingBoxes": [
    [[-90, -180], [90, 180]]
  ],
  "FilterMessageTypes": ["PositionReport", "ShipStaticData"]
}
```

**Field mapping (AISStream → Vessel domain model)**:

```typescript
function mapAisToVessel(msg: AISStreamMessage): Partial<Vessel> {
  if (msg.MessageType === 'PositionReport') {
    return {
      id: `vs_${msg.MetaData.MMSI}`,
      mmsi: msg.MetaData.MMSI.toString(),
      name: msg.MetaData.ShipName?.trim() ?? null,
      position: {
        latitude: msg.MetaData.latitude,
        longitude: msg.MetaData.longitude,
      },
      course: msg.Message.PositionReport.Cog ?? null,
      speed: msg.Message.PositionReport.Sog ?? null,
      lastSeen: msg.MetaData.time_utc,
    };
  }
  if (msg.MessageType === 'ShipStaticData') {
    return {
      id: `vs_${msg.MetaData.MMSI}`,
      mmsi: msg.MetaData.MMSI.toString(),
      imo: msg.Message.ShipStaticData.ImoNumber?.toString() ?? null,
      callSign: msg.Message.ShipStaticData.CallSign?.trim() ?? null,
      shipType: mapShipType(msg.Message.ShipStaticData.Type),
      destination: msg.Message.ShipStaticData.Destination?.trim() ?? null,
      eta: msg.Message.ShipStaticData.Eta ?? null,
      flag: lookupFlag(msg.MetaData.MMSI), // derive from MMSI MID code
    };
  }
}
```

### Secondary: AISHub (polling fallback)

- **Base URL**: `https://data.aishub.net/ws.php`
- **Auth**: Username (requires contributing a receiver or requesting access)
- **Rate limit**: 1 request/minute
- **Params**: `username`, `format=1`, `output=json`, `latmin`, `latmax`, `lonmin`, `lonmax`

### Backend Requirements

AISStream is WebSocket-based, so the backend needs a **persistent connection**:

1. Backend connects to AISStream WebSocket on startup
2. Maintains an in-memory vessel state map (keyed by MMSI)
3. Merges PositionReport and ShipStaticData messages into complete vessel records
4. Expires stale entries after configurable timeout (e.g. 1 hour)
5. Exposes REST endpoint for the frontend:

```
GET /api/vessels?bounds=latmin,lonmin,latmax,lonmax&shipType=military&limit=30
```

---

## Signals — Radio Monitoring

### Current Mock

- **Generator**: `src/lib/api/mock/signals.ts` → `generateMockSignalsList(count)`
- **Domain model**: `src/domain/models/signal-event.ts` → `SignalEvent`
- **Feature API**: `src/features/signals/api/get-signals.ts`
- **Fields**: `id`, `timestamp`, `frequency`, `signalType`, `location`, `strength`, `modulation`, `source`, `duration`, `encodedData`
- **Mock behavior**: 50 signals, frequency-accurate per type (ADS-B ~1090MHz, AIS ~162MHz, HF 3-27MHz, etc.), 70% geolocated

### Recommended Approach: KiwiSDR Network + Custom Monitoring

There is no single REST API for signal intelligence. This domain requires a custom backend service.

#### KiwiSDR Network

- **Public receivers**: http://kiwisdr.com/public/ (hundreds of HF receivers globally)
- **Client library**: [kiwiclient](https://github.com/jks-prv/kiwiclient) (Python)
- **Protocol**: WebSocket to individual KiwiSDR receivers
- **Frequency range**: DC to 30 MHz (entire HF band)

#### Integration Strategy

Build a **signal monitoring service** (Python or Node.js) that:

1. Maintains a list of monitored frequencies (military HF, HFGCS, known number stations)
2. Periodically connects to multiple KiwiSDR receivers via kiwiclient
3. Samples signal strength (S-meter) at each target frequency
4. Detects activity changes (signal present vs absent, strength above threshold)
5. Logs events as `SignalEvent` records
6. Exposes via REST:

```
GET /api/signals?type=hf&since=2024-01-01T00:00:00Z&limit=50
```

#### Radio Station Monitoring

- **Current mock**: `src/lib/api/mock/radios.ts` — 6 hardcoded stations (UVB-76, S28, etc.)
- **Domain model**: `src/domain/models/radio-station.ts` → `RadioStation`

For known stations (UVB-76, The Pip, etc.), the monitoring service should:
1. Sample their known frequencies every 5-10 minutes via nearby KiwiSDR receivers
2. Record signal strength as `activityLevel`
3. Log state changes (active/inactive transitions) as history events
4. Some stations have public WebSDR links (e.g. `websdr.ewi.utwente.nl`) — link these in the `webSdrUrl` field

#### Reference Database: SigIDWiki

- **URL**: https://www.sigidwiki.com
- **Use for**: signal classification and identification
- **Data**: 568+ identified signals with audio samples and waterfall images
- **Integration**: Use as a lookup table to enrich `signalType` and `modulation` fields

### Complexity Note

This is the hardest domain to migrate — there is no turnkey API. Start with monitoring a small set of well-known stations (5-10) and expand coverage over time. Consider this a Phase 2 or Phase 3 task.

---

## News — OSINT Feed

### Current Mock

- **Data**: `src/lib/api/mock/news.ts` — 15 hardcoded news items
- **Domain model**: `src/domain/models/news-item.ts` → `NewsItem`
- **Fields**: `id`, `source`, `sourceType`, `author`, `content`, `url`, `timestamp`, `tags`, `region`
- **Source types**: twitter, news, telegram, forum

### Recommended API: GDELT Project (free, no auth)

- **Base URL**: `https://api.gdeltproject.org/api/v2/doc/doc`
- **Auth**: None
- **Rate limit**: Not formally documented, reasonable use expected
- **Data window**: Rolling 3 months

**Key endpoint — Article search**:

```
GET https://api.gdeltproject.org/api/v2/doc/doc
  ?query="military exercise" OR "naval deployment" OR "air defense"
  &mode=artlist
  &format=json
  &maxrecords=100
  &timespan=24h
```

**Query operators**:
- `sourcecountry:US` — filter by source country
- `sourcelang:English` — filter by language
- `domain:reuters.com` — filter by news domain
- `near10:"military deployment"` — proximity search
- `tone<-5` — negative sentiment filter

**Field mapping (GDELT → NewsItem domain model)**:

```typescript
function mapGdeltToNewsItem(article: GdeltArticle): NewsItem {
  return {
    id: `news_${hashString(article.url)}`,
    source: extractDomain(article.url),         // e.g. "reuters.com"
    sourceType: 'news',
    author: null,                                // GDELT doesn't provide author
    content: article.title,                      // GDELT free tier returns titles, not full text
    url: article.url,
    timestamp: parseGdeltDate(article.seendate), // format: "20250128T120000Z"
    tags: deriveTagsFromTitle(article.title),    // NLP or keyword matching
    region: mapCountryToRegion(article.sourcecountry),
  };
}
```

**Volume timeline** (for indicators):

```
GET https://api.gdeltproject.org/api/v2/doc/doc
  ?query="South China Sea" military
  &mode=timelinevol
  &format=json
  &timespan=30d
```

Returns daily article counts — feed directly into the indicator engine as a "media attention" metric.

### Secondary: ACLED (structured conflict events)

- **Base URL**: `https://acleddata.com/api/acled/read`
- **Auth**: API key + email (free registration)
- **Rate limit**: 5,000 rows per request
- **Params**: `key`, `email`, `country`, `region`, `event_date`, `event_type`, `_format=json`

**Example**:

```
GET https://acleddata.com/api/acled/read
  ?key=<KEY>&email=<EMAIL>
  &_format=json
  &event_date=2025-01-01|2025-01-31
  &event_date_where=BETWEEN
  &event_type=Battles
  &limit=1000
```

ACLED provides structured event data (battles, explosions, protests) with geocoordinates — useful for generating zone data and feeding indicator calculations.

### Backend Proxy Endpoint

```
GET /api/news?query=military&region=mediterranean&since=24h&limit=50
```

The proxy should:
1. Query GDELT DOC API with mapped query parameters
2. Optionally merge with ACLED events (mapped to `sourceType: 'report'`)
3. Deduplicate by URL
4. Apply tag extraction (keyword matching or simple NLP)
5. Cache for 5 minutes

---

## Indicators — Activity Metrics

### Current Mock

- **Generator**: `src/lib/api/mock/indicators.ts` → `generateMockIndicators()`
- **Domain model**: `src/domain/models/activity-indicator.ts` → `ActivityIndicator`
- **Feature API**: `src/features/indicators/api/get-indicators.ts`
- **Fields**: `id`, `name`, `type`, `value`, `baseline`, `deviation`, `confidence`, `timeWindow`, `region`, `updatedAt`, `trend`, `history`
- **Types**: `isr_activity`, `naval_presence`, `tanker_density`, `signal_activity`, `air_activity`, `anomaly_score`
- **Behavior**: 42 indicators (6 types × 7 regions), each with 24-hour history

### Migration Strategy

Indicators are **computed aggregates**, not raw API data. They are derived from the other data sources.

#### Computation Pipeline

Build a backend service that computes each indicator type from real data:

| Indicator | Source Data | Computation |
|---|---|---|
| `isr_activity` | Airplanes.live `/mil` | Count ISR-type aircraft (RC-135, P-8, E-3, RQ-4, etc.) in region per time window, compare to rolling 30-day baseline |
| `naval_presence` | AISStream vessel data | Count military/coast guard vessels in region, compare to baseline |
| `tanker_density` | AISStream vessel data | Count tanker-type vessels in region, compare to baseline |
| `signal_activity` | KiwiSDR monitoring data | Aggregate signal events per region per time window, compare to baseline |
| `air_activity` | Airplanes.live + OpenSky | Total aircraft count in region, compare to baseline |
| `anomaly_score` | All sources | Composite: weighted sum of deviations across all other indicators for the region |

#### Baseline Calculation

For each (region, type, timeWindow) tuple:
1. Collect historical data for the past 30-90 days
2. Compute rolling average as baseline
3. Store baseline values in a database (update daily)
4. `deviation = ((currentValue - baseline) / baseline) * 100`
5. `confidence` = function of data completeness and source reliability

#### Backend Storage

Indicators need a time-series store. Options:
- **SQLite** — simplest, good enough for 42 indicators × hourly updates
- **TimescaleDB** — if scaling to more regions/types
- **In-memory with periodic persistence** — for a prototype

#### Backend Endpoint

```
GET /api/indicators?region=mediterranean&type=naval_presence&timeWindow=24h
```

Returns the same `GetIndicatorsResponse` shape as the current mock, with real computed values.

---

## Zones — Geographic Restrictions

### Current Mock

- **Data**: `src/lib/api/mock/zones.ts` — 8 hardcoded zones (South China Sea, Strait of Hormuz, etc.)
- **Domain model**: `src/domain/models/zone.ts` → `Zone`
- **Types**: `notam`, `blockade`, `duty_zone`, `exclusion`

### Recommended Sources

#### NOTAMs (Notice to Air Missions)

- **FAA NOTAM API**: https://notams.aim.faa.gov/notamSearch
- **ICAO API Portal**: https://www.icao.int/safety/iStars/Pages/API-Data-Service.aspx
- **Auth**: Registration required (free)
- **Format**: XML/JSON
- **Use for**: `notam` type zones — active airspace restrictions, temporary flight restrictions (TFRs)

#### Naval Warnings

- **NGA Maritime Safety**: https://msi.nga.mil/NavWarnings
- **Format**: XML feed of active navigational warnings by region (HYDROLANT, HYDROPAC, NAVAREA)
- **Auth**: None (public US government data)
- **Use for**: `blockade` and `exclusion` type zones

#### ACLED Conflict Zones

- Derive `duty_zone` type zones from ACLED event clustering
- Areas with high event density become active zones

### Migration Approach

1. Start by keeping the 8 hardcoded hotspot zones as a static base layer
2. Overlay dynamic NOTAM and naval warning data from the sources above
3. Build a periodic sync (every 6 hours) that fetches active NOTAMs/warnings and converts to `Zone` objects
4. Merge static + dynamic zones in the API response

---

## Regions — Geographic Organization

### Current Mock

- **Data**: `src/domain/models/region.ts` — 7 hardcoded regions
- **Regions**: north_atlantic, south_china_sea, mediterranean, persian_gulf, indo_pacific, baltic_sea, caribbean

### Migration Approach

Regions are **reference data** defining the geographic organization of the dashboard. Keep as static configuration. No API needed.

If you want to add more regions, use Natural Earth data for boundary definitions:
- **Natural Earth GeoJSON**: https://github.com/martynafford/natural-earth-geojson
- Maritime boundaries: https://www.marineregions.org (IHO sea areas)

No migration needed — expand manually as the dashboard covers more areas.

---

## Social Media — Twitter/X and Alternatives

### Current Mock

News items with `sourceType: 'twitter'` are hardcoded in `src/lib/api/mock/news.ts`.

### Option 1: Bluesky AT Protocol (RECOMMENDED — free)

- **Public API**: `https://public.api.bsky.app`
- **Auth**: None for search; app password for full access
- **Rate limit**: No formal limits documented
- **Firehose**: `wss://jetstream1.us-east.bsky.network/subscribe` (real-time, no auth)

**Key endpoints**:

```
GET https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts
  ?q=military+deployment
  &limit=25
  &sort=latest
```

**Field mapping (Bluesky → NewsItem)**:

```typescript
function mapBlueskyToNewsItem(post: BlueskyPost): NewsItem {
  return {
    id: `bsky_${post.uri.split('/').pop()}`,
    source: post.author.handle,
    sourceType: 'twitter', // or add 'bluesky' as a new sourceType
    author: post.author.displayName ?? post.author.handle,
    content: post.record.text,
    url: `https://bsky.app/profile/${post.author.handle}/post/${post.uri.split('/').pop()}`,
    timestamp: post.record.createdAt,
    tags: extractHashtags(post.record.text),
    region: null, // derive from content analysis
  };
}
```

The growing OSINT community on Bluesky makes this a strong free alternative.

### Option 2: Mastodon API (free, federated)

- **Per-instance API**: `https://{instance}/api/v1/timelines/tag/{hashtag}`
- **Auth**: None for public timelines
- **Rate limit**: 300 requests/5 minutes
- **Key OSINT instances**: `mastodon.social`, `infosec.exchange`

Monitor hashtags like `#OSINT`, `#military`, `#SIGINT` across instances.

### Option 3: X/Twitter API (paid)

- **Base URL**: `https://api.x.com/2`
- **Auth**: OAuth 2.0
- **Pricing**: Basic tier $200/month (15,000 reads/month), Pro $5,000/month
- **Endpoints**:
  - `GET /2/tweets/search/recent?query=` — recent search (7 days)
  - `GET /2/tweets/search/stream` — filtered stream (Pro+ only)

**Field mapping (Twitter → NewsItem)**:

```typescript
function mapTweetToNewsItem(tweet: Tweet, author: User): NewsItem {
  return {
    id: `tw_${tweet.id}`,
    source: `@${author.username}`,
    sourceType: 'twitter',
    author: author.name,
    content: tweet.text,
    url: `https://x.com/${author.username}/status/${tweet.id}`,
    timestamp: tweet.created_at,
    tags: tweet.entities?.hashtags?.map(h => h.tag) ?? [],
    region: null,
  };
}
```

### Recommendation

Start with **Bluesky** (free, growing OSINT community). Add **X/Twitter** later only if budget allows $200+/month. Merge posts from all social sources into the unified `NewsItem` stream with appropriate `sourceType` tagging.

---

## Geospatial — Base Map Data

### Natural Earth (static boundaries)

- **URL**: https://www.naturalearthdata.com
- **Format**: GeoJSON via https://github.com/martynafford/natural-earth-geojson
- **Use for**: country boundaries, coastlines, disputed territories
- **Integration**: Bundle as static assets or fetch from CDN

### Overpass API (military infrastructure)

- **URL**: `https://overpass-api.de/api/interpreter`
- **Auth**: None
- **Use for**: military base locations, airfield positions, naval bases

**Example query — military airfields in Europe**:

```
[out:json][timeout:60];
(
  node["military"="airfield"](35,-15,72,45);
  way["military"="airfield"](35,-15,72,45);
);
out center;
```

Cache results — this data changes rarely. Refresh weekly at most.

---

## Backend Proxy Architecture

All external API calls must go through a backend proxy. Never expose API keys to the frontend.

### Recommended Stack

Since the project uses TanStack Start, build the proxy as **TanStack Start server functions** or API routes. Alternatively, use a lightweight Node.js service (Express/Hono/Fastify).

### Proxy Responsibilities

1. **API key management** — store keys in env vars, never send to client
2. **Rate limiting** — respect upstream rate limits, queue excess requests
3. **Response caching** — reduce API calls (Redis or in-memory)
4. **Field mapping** — transform raw API responses to domain models
5. **Fallback** — if primary API is down, fall back to secondary or cached data
6. **Mock mode toggle** — `USE_MOCK_DATA=true` env var to switch back to mock generators for development

### Suggested Route Structure

```
server/
  routes/
    aircraft.ts     → GET /api/aircraft
    vessels.ts      → GET /api/vessels      (backed by in-memory state from AISStream WebSocket)
    signals.ts      → GET /api/signals
    news.ts         → GET /api/news
    indicators.ts   → GET /api/indicators
    zones.ts        → GET /api/zones
    radios.ts       → GET /api/radios
  services/
    aisstream.ts    → WebSocket connection manager
    kiwisdr.ts      → Signal monitoring service
    indicator-engine.ts → Indicator computation pipeline
    baseline.ts     → Baseline calculation and storage
  cache/
    store.ts        → Caching abstraction (in-memory or Redis)
```

### Mock Fallback Pattern

In each feature API file, support a toggle:

```typescript
// src/features/air/api/get-aircraft.ts
import { generateMockAircraftList } from '@/lib/api/mock/aircraft';

export async function getAircraft(params: GetAircraftRequest): Promise<GetAircraftResponse> {
  if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
    // existing mock logic
    return { data: generateMockAircraftList(params.limit ?? 50) };
  }

  const res = await fetch(`/api/aircraft?${new URLSearchParams(/* ... */)}`);
  return res.json();
}
```

---

## Environment Variables

```env
# Feature flags
VITE_USE_MOCK_DATA=false

# Aviation
OPENSKY_CLIENT_ID=
OPENSKY_CLIENT_SECRET=
# Airplanes.live requires no auth

# Naval
AISSTREAM_API_KEY=

# News
ACLED_API_KEY=
ACLED_EMAIL=
# GDELT requires no auth

# Social Media
BLUESKY_IDENTIFIER=        # optional, for authenticated access
BLUESKY_APP_PASSWORD=       # optional
TWITTER_BEARER_TOKEN=       # optional, $200+/month

# Radio (no keys needed for KiwiSDR public receivers)

# Geospatial (no keys needed)
```

---

## Migration Order

Migrate domains in order of API accessibility and value delivered:

### Phase 1 — Quick Wins (free, no auth, REST)

| Priority | Domain | API | Effort |
|---|---|---|---|
| 1 | Aviation | Airplanes.live | Low — simple REST, no auth |
| 2 | News | GDELT | Low — simple REST, no auth |
| 3 | Social | Bluesky | Low — simple REST, no auth for search |

### Phase 2 — Authenticated APIs

| Priority | Domain | API | Effort |
|---|---|---|---|
| 4 | Aviation (historical) | OpenSky Network | Medium — OAuth2 setup |
| 5 | Naval | AISStream.io | Medium — WebSocket, state management |
| 6 | News (conflict) | ACLED | Low — API key registration |

### Phase 3 — Computed Data

| Priority | Domain | Source | Effort |
|---|---|---|---|
| 7 | Indicators | All above sources | High — computation pipeline, baseline engine |
| 8 | Zones | NOTAMs + Naval warnings | Medium — multiple sources, parsing |

### Phase 4 — Advanced / Optional

| Priority | Domain | API | Effort |
|---|---|---|---|
| 9 | Signals/Radios | KiwiSDR network | High — custom monitoring service |
| 10 | Social (paid) | X/Twitter | Low effort, high cost ($200+/mo) |

### Per-Domain Migration Checklist

For each domain migration:

- [ ] Create backend proxy route
- [ ] Add raw API response types to `src/lib/api/types.ts`
- [ ] Implement field mapping function (raw → domain model)
- [ ] Update feature API file to call proxy (with mock fallback)
- [ ] Add error handling for API failures (return stale cache or empty state)
- [ ] Add env vars and document in `.env.example`
- [ ] Test with real API responses
- [ ] Verify TanStack Query hooks still work correctly (no changes should be needed)
- [ ] Verify UI components render correctly with real data shapes
- [ ] Update indicator calculations if this domain feeds any indicators

---

## API Cost Summary

| API | Cost | Notes |
|---|---|---|
| Airplanes.live | Free | 1 req/sec limit |
| OpenSky Network | Free | 4,000-8,000 credits/day |
| AISStream.io | Free | WebSocket, beta |
| GDELT | Free | No limits documented |
| ACLED | Free | Non-commercial, registration |
| Bluesky | Free | No limits documented |
| Natural Earth | Free | Static data |
| Overpass API | Free | Reasonable use |
| KiwiSDR | Free | Public receivers |
| X/Twitter Basic | $200/month | 15,000 reads/month |
| X/Twitter Pro | $5,000/month | Full archive search |

**Total cost for full migration (excluding Twitter): $0/month**
