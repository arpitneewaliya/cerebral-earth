# Developer Agent Guide — Cerebral Earth

This file provides architectural context, state mapping, and coding patterns to help AI agents develop, debug, and expand the Cerebral Earth codebase.

---

## 🗺️ Leaflet Integration & React-Leaflet Quirks

### 1. TileLayer Re-renders require Keys & Keyless Basemaps
React-Leaflet does not automatically hook into React state updates for the `url` prop of `<TileLayer>`. If the URL shifts (e.g., when the user toggles dark mode or switches basemaps), the underlying tiles will remain unchanged.
* **Pattern:** Always apply a dynamic, state-dependent `key` to `<TileLayer>` elements when their URLs are dynamic:
  ```jsx
  <TileLayer
    key={`base-${basemap}-${isDarkMode ? 'dark' : 'light'}`}
    url={activeTiles.base}
  />
  ```
* **Keyless Basemap Provider:** `Map.jsx` uses keyless **Esri ArcGIS** MapServer tile endpoints across all three modes (`dark` via `World_Dark_Gray_Base`/`Reference`, `satellite` via `World_Imagery`/`World_Boundaries_and_Places`, and `light` via `World_Light_Gray_Base`/`Reference`). Avoid CARTO `basemaps.cartocdn.com` URLs without an API key, as they serve `"API KEY REQUIRED"` watermarks.

### 2. Labels Visibility (Split-Tile Rendering)
To allow vector layers (like GeoJSON overlays) to be rendered under map names and labels:
* Split the map tiles into two separate `<TileLayer>` instances.
* Render the labels overlay inside a React-Leaflet `<Pane>` with high z-index and disable mouse capture:
  ```jsx
  {/* Base Map tiles without labels (zIndex: 200 default) */}
  <TileLayer url={baseTileUrl} />

  {/* GeoJSON layer (zIndex: 400 default) */}
  <GeoJSON data={geoJsonData} />

  {/* Text labels tile layer drawn above GeoJSON (zIndex: 450) */}
  <Pane name="map-labels" style={{ zIndex: 450, pointerEvents: 'none' }}>
    <TileLayer url={labelsTileUrl} />
  </Pane>
  ```
* **Constraint:** The style on `<Pane>` must include `pointerEvents: 'none'` so mouse clicks click *through* the label tiles onto the interactive GeoJSON shapes below.

---

## 📡 Backend Route Rules & Caching

### 1. World Bank API Caching
The World Bank global data endpoints are slow and rate-limited.
* **Pattern:** Always cache parsed World Bank indicator responses in-memory on the server (`news-api/routes/chartRoutes.js`).
* **Format:** The response should be formatted as a key-value object using ISO Alpha-3 country codes:
  ```json
  {
    "USA": 25460000000,
    "IND": 3385000000
  }
  ```

### 2. Rate-Limiting and Geocoding Sequential Delays
LocationIQ free tiers limit requests to 2 per second (500ms intervals).
* **Pattern:** When geocoding loops in backend routes (e.g., `majorNewsRoutes.js` geocoding cities extracted by Gemini), enforce a sequential delay of at least 500ms between coordinates requests:
  ```javascript
  await new Promise(resolve => setTimeout(resolve, 500));
  ```
* Also implement cache maps (`geocodeCache`) on the server to prevent querying the geocoding service for the same location name multiple times.

### 3. NewsAPI Service Integration
Our regional and global top headlines endpoints retrieve news via **NewsAPI** (`newsapi.org`).
* **Everything API (`/api/news`)**: Queries the `/v2/everything` endpoint based on location (reverse-geocoded) and category.
* **Top Headlines API (`/api/major-news`)**: Queries the `/v2/top-headlines` endpoint, parses the returned headlines using Gemini AI to extract cities, and resolves coordinates using forward-geocoding.
* **Image Fields:** Use standard camelCase `urlToImage` for images, which is natively returned by NewsAPI. Do not map from `image` as was required by GNews.

### 4. GDELT Conflict API & Caching (Hybrid Mode)
To bypass GDELT API latency and rate-limiting across environments:
* **Production/Vercel Mode:** When `KV_REST_API_URL` / `KV_REST_API_TOKEN` or `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` are present, the app initializes an `@upstash/redis` client.
  * The `/api/conflicts` route fetches data from Redis (`conflicts_data`).
  * On cache miss, it fetches GDELT data, caches it in Redis with a 15-minute Time-To-Live (`EX 900`), and returns the results.
  * Background intervals are disabled to prevent running extra timers on serverless infrastructure.
* **Local/File Mode (Fallback):** If KV variables are absent:
  * A background sync loop `syncConflicts()` runs every 15 minutes, querying GDELT and caching to `news-api/conflicts_cache.json` and in-memory `memoryCache`.
  * The endpoint serves instantly from `memoryCache` (falling back to disk `conflicts_cache.json` or `fallbackConflicts` if unpopulated).

* **Incident Classification:** Map incoming GDELT news mentioned themes into three categories:
  * `ARMED_CONFLICT`: Triggered by active violence themes (`ARMEDCONFLICT`, `AIRSTRIKE`, `BOMBS`, `EXPLOSION`, `HOSTAGE`, `KILL`).
  * `CIVIL_UNREST`: Triggered by public disorder themes (`PROTEST`, `RIOT`, `STRIKE`, `DEMONSTRATION`, `CIVIL_WAR`).
  * `GEOPOLITICAL_TENSION`: Triggered by diplomacy/military state actions (`MILITARY`, `WAR`, `SANCTIONS`, `TREATY`, `BORDER`, `SECURITY`, `TERROR`).

### 5. YouTube Video News Caching & Fallback
* **Regional Resolution:** Resolve clicked map coordinates to a country/region using `reverseGeocode(lat, lng)`, then query YouTube using `<Region> news`.
* **In-Memory Cache:** Cache responses in a Map keyed by lowercase region names with a 4-hour expiration TTL (`CACHE_DURATION = 14400000`).
* **Mock Fallback:** If `YOUTUBE_API_KEY` is absent or the quota is depleted, dynamically generate structured mock videos with high-quality stock thumbnails (e.g. Unsplash) referencing the region name, preventing UI empty states.

---

## 🔄 State Coordination Flow

### 1. Theme State & Basemap Sync
Managed in `news-app/src/contexts/ThemeContext.jsx`. The hook `useTheme()` yields:
* `isDarkMode`: Boolean representing current theme (defaults to `true` for Dark Tactical mode).
* `toggleTheme`: Toggle function.
* On change, it persists to `localStorage` (`cerebral_theme` and `darkMode`) and appends/removes `.dark` on both `document.body` and `document.documentElement`.
* `App.jsx` automatically syncs `basemap` between `'dark'` and `'light'` when `isDarkMode` changes (unless the user explicitly selected `'satellite'`).

### 2. Unified Top Command Bar HUD (`Header.jsx`)
* `Header.jsx` renders a unified dual-island floating HUD bar at the top of the viewport:
  * **Left Island:** Branding + embedded `SearchBox.jsx` (supports `/` keyboard shortcut to focus).
  * **Right Island:** Segmented basemap switcher (`Dark`, `Sat`, `Light`), `Layers` choropleth toggle (`showLayersControl` + active layer badge), `Conflicts` drawer toggle (`showConflictsPanel`) + marker visibility eye toggle (`showConflictPins`), `Beacons` news marker toggle (`showNewsPins`), and UI theme toggle.

### 3. Map Overlay Controls & Country Hover Telemetry (`Map.jsx`)
* `MapLayerControl` (`showLayersControl`), `MapLegend`, and `CountryHoverHUD` render as theme-aware glassmorphic overlays.
* `onEachFeature` tracks `hoveredCountry` (`mouseover`/`mouseout`) to highlight country borders and display ISO-3 code, active choropleth value, and global percentile rank in `CountryHoverHUD`.
* `MapTelemetryEvents` reports live cursor `lat`, `lng`, and `zoom` to `App.jsx` for the bottom `TelemetryBar`.

### 4. Persistent 3-Tab Country Intelligence Dossier (`SlideOverPanel.jsx`)
* `useAppState.js` manages `region`, `selectedOption` (defaults to `'news'`), and `isOptionsOpen`.
* `SlideOverPanel.jsx` renders a resizable right-side dossier with a country flag/ISO/coordinates header and a persistent 3-tab bar: `Intel & News` (`'news'`), `Macro Telemetry` (`'macro'`), and `Country Profile` (`'country'`).
* `ContentRenderer.jsx` provides a 6-pill indicator switcher (`GDP`, `Population`, `FDI`, `Inflation`, `Unemployment`, `Literacy`) inside `Macro Telemetry`, backed by `IndicatorChart.jsx` KPI summary cards (`Latest`, `Peak`, `Period Shift`).

### 5. Conflict Tracker, Preloading & Bottom Telemetry Bar
* `App.jsx` preloads `/api/conflicts` on mount (falling back to `FALLBACK_CONFLICTS` if the backend is offline) so conflict hotspots and the bottom ticker populate immediately.
* `showConflictsPanel` toggles the left-side `ConflictPanel` drawer and toggles off `showLayersControl`.
* **Coordination with Map:** Selecting an incident in `ConflictPanel`, clicking a pulsing map marker, or clicking a ticker item sets `selectedConflict`, triggering `<MapConflictsAutofocus selectedConflict={selectedConflict} />` (`map.flyTo([lat, lng], 6)`).
* **Visual Style:**
  * Conflict markers use `DivIcon` wrappers (`.conflict-marker-ring` and `.conflict-marker-dot`) styled by category: Red (`ARMED_CONFLICT`), Orange (`CIVIL_UNREST`), Yellow (`GEOPOLITICAL_TENSION`).
  * News beacons (`Pin.jsx`) use diamond `DivIcon` wrappers (`.news-marker-core` and `.news-marker-ring`) with glassmorphic `.news-popup` popups.
* `TelemetryBar.jsx` displays live hotspot/beacon counts, a clickable breaking intelligence ticker, and live cursor `LAT / LNG / ZOOM` coordinates along the bottom edge.

