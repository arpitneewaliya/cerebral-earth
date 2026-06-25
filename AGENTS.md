# Developer Agent Guide — Cerebral Earth

This file provides architectural context, state mapping, and coding patterns to help AI agents develop, debug, and expand the Cerebral Earth codebase.

---

## 🗺️ Leaflet Integration & React-Leaflet Quirks

### 1. TileLayer Re-renders require Keys
React-Leaflet does not automatically hook into React state updates for the `url` prop of `<TileLayer>`. If the URL shifts (e.g., when the user toggles dark mode), the underlying tiles will remain unchanged.
* **Pattern:** Always apply a dynamic, state-dependent `key` to `<TileLayer>` elements when their URLs are dynamic:
  ```jsx
  <TileLayer
    key={isDarkMode ? 'dark' : 'light'}
    url={tileUrl}
  />
  ```

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

### 1. Theme State
Managed in `ThemeContext.jsx`. The hook `useTheme()` yields:
* `isDarkMode`: Boolean representing current theme.
* `toggleTheme`: Toggle function.
* On change, it sets `localStorage` and appends/removes class `.dark` to the `document.body` element to handle dark mode styling.

### 2. Map Control Cards Overlay
* State for rendering the MapLayerControl (`showLayersControl`) lives in `App.jsx`.
* Passing toggles between `Header.jsx` ("Activate Layers" navigation) and the map overlay allows the selector panel to overlay correctly and be closed via the `X` button.
* Mobile positioning relies on `left-16` to leave space for the left-aligned `+` and `-` zoom buttons.

### 3. Conflict Tracker Panel Overlay & Autofocus
* State for showing the panels (`showConflictsPanel`) lives in `App.jsx` and toggles off `showLayersControl` when activated.
* **Coordination with Map:** When an incident is selected inside the `ConflictPanel` or the user clicks a pulsing map marker, the state `selectedConflict` is set.
* **Autofocus Effect:** A map-nested child component `<MapConflictsAutofocus selectedConflict={selectedConflict} />` calls `map.flyTo([lat, lng], 6)` to center the map on the selected conflict location.
* **Visual Style:** Pulsing markers use Leaflet `DivIcon` wrappers with nested CSS rings (`.conflict-marker-ring` and `.conflict-marker-dot`) styled according to categorization:
  * Red: `ARMED_CONFLICT`
  * Orange: `CIVIL_UNREST`
  * Yellow: `GEOPOLITICAL_TENSION`

