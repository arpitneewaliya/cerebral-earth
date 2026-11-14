# Cerebral Earth — Global Geoint & Telemetry Command Center

Cerebral Earth is an interactive, dark-first geospatial intelligence (GEOINT) and socio-economic telemetry platform. By combining split-tile basemaps, live GDELT conflict monitoring, AI-geocoded news beacons, and World Bank macro indicators inside a unified glassmorphic HUD, it provides a real-time analytical interface to explore global events and national metrics.

---

## 🌟 Key Features

### 1. Tactical Multi-Basemap Engine & Split-Tile Rendering
* **Three Keyless Basemap Modes:** Switch seamlessly from the Top Command Bar between **Dark Tactical** (`Esri World_Dark_Gray`), **Satellite Hybrid** (`Esri World_Imagery` + boundaries), and **Clean Light** (`Esri World_Light_Gray`).
* **Split Basemaps for Text Legibility:** To prevent choropleth coloring from obscuring geographic labels, the basemap is split into two layers:
  * **Base Map Tiles:** A label-free base layer sitting underneath.
  * **Interactive GeoJSON:** Vector country boundaries and heatmap layers render on top of the base with hover glow.
  * **Labels Pane Overlay:** A transparent, high z-index overlay pane (`zIndex: 450`, `pointerEvents: 'none'`) rendering crisp place names above vector layers without blocking clicks or hovers.
* **Dark-First Theme System:** Managed via `ThemeContext.jsx`, syncing UI glassmorphism, charts, popups, and basemaps between Dark Tactical (default) and Clean Light modes.

### 2. Unified Top Command Bar & Country Hover Telemetry
* **Floating Command HUD:** Consolidates branding, `/` keyboard-focusable global search (`SearchBox.jsx`) with coordinate badges, basemap switcher, choropleth layer controls, conflict monitor & marker toggles, news beacon toggle, and theme switcher into one unified top bar.
* **Country Hover HUD:** Hovering over any country highlights its border and displays a floating telemetry card with its name, ISO-3 code, and active World Bank indicator value + global percentile rank.

### 3. Custom Choropleth Data Layers (Heatmaps)
* **Visual Global Indicators:** Color-code the globe using World Bank database indicators with theme-adapted dark and light palettes:
  * **GDP Heatmap:** Gross Domestic Product in USD (Greens).
  * **Population Heatmap:** Total population count (Purples).
  * **FDI Heatmap:** Foreign Direct Investment inflows (Oranges).
  * **Inflation Heatmap:** Consumer price inflation rate (Reds).
  * **Unemployment Heatmap:** Unemployment percentage of labor force (Yellows).
  * **Literacy Heatmap:** Adult literacy rates (Blues).
* **Quantile Percentile Styling & Scale Legend:** Dynamically bins country values by percentile for high visual contrast, accompanied by a collapsible scale legend.

### 4. Persistent 3-Tab Country Intelligence Dossier
* **Zero-Friction Inspection:** Selecting any country opens a resizable right-side dossier (`SlideOverPanel.jsx`) featuring a flag, ISO badge, sector coordinates, and three persistent tabs:
  * **Intel & News:** Localized NewsAPI articles with category filters alongside embedded YouTube regional broadcast feeds (`VideoNewsList.jsx`).
  * **Macro Telemetry:** One-click 6-pill indicator switcher (`GDP`, `Population`, `FDI`, `Inflation`, `Unemployment`, `Literacy`) paired with KPI summary cards (**Latest**, **Peak**, **Period Shift**) and interactive `recharts` visualizations.
  * **Country Profile:** Sovereign overview card with flag, capital, region/subregion, population, landmass, currency, and satellite reconnaissance link.

### 5. Live Conflict Monitor & Bottom Telemetry Ticker
* **Preloaded GDELT Hotspots:** Security incidents are fetched on startup (with built-in client fallback hotspots if offline) and rendered as color-coded pulsing radar markers: Red (`ARMED_CONFLICT`), Orange (`CIVIL_UNREST`), and Yellow (`GEOPOLITICAL_TENSION`).
* **Tactical News Beacons:** AI-geocoded global top headlines (`NewsAPI` + `Google Gemini AI`) render as glowing diamond beacons with glassmorphic dispatch popups.
* **Bottom Live Telemetry Bar (`TelemetryBar.jsx`):** Displays active hotspot and beacon counters, a clickable breaking intelligence ticker that flies (`flyTo`) the map directly to events, and live cursor `LAT / LNG / ZOOM` readouts.
* **Hybrid Environment Caching:** Uses Vercel KV (Upstash Redis) in production serverless environments with a 15-minute TTL, falling back to local background sync and `conflicts_cache.json` during local development.

---

## 🛠️ Technology Stack

### Client (`news-app`)
* **Core:** React 18, Vite
* **Map Engine:** React Leaflet / Leaflet
* **Charts:** Recharts
* **Styling:** Vanilla CSS, Tailwind CSS (v4)
* **Icons:** Lucide React
* **Client Request Handling:** Axios

### Backend (`news-api`)
* **Server Environment:** Node.js, Express
* **AI integration:** Google Generative AI (`@google/generative-ai`)
* **Geocoding:** Node Geocoder (LocationIQ)
* **Request Handling:** Axios, CORS, Dotenv

---

## 📂 Project Architecture

The repository is organized as a monorepo utilizing npm workspaces:

```text
cerebral_earth/
├── news-api/                     # Node.js backend server
│   ├── routes/                   # API routes (charts, news lookup, search, conflicts, video news)
│   ├── server.js                 # Entry point (Express server setup)
│   ├── gemini_ai.js              # Google Gemini AI client configuration
│   ├── geocoding.js              # Location geocoding utility functions
│   ├── conflicts_cache.json      # Offline/local disk cache for GDELT incidents
│   └── countries_db.json         # Static country coordinates database
│
├── news-app/                     # React client application
│   ├── public/                   # Static icons, GeoJSON map borders
│   ├── src/                      # Source code
│   │   ├── components/           # UI components (Map, Header, TelemetryBar, SlideOverPanel, ConflictPanel, VideoNewsList, etc.)
│   │   ├── contexts/             # ThemeContext (Dark Tactical / Light mode)
│   │   ├── hooks/                # Custom React hooks (useAppState, useRegionData)
│   │   ├── index.css             # Main styling configuration
│   │   └── index.jsx             # React entry mount
│   ├── vite.config.js            # Vite build configuration
│   └── package.json              # Frontend scripts & modules

│
├── package.json                  # Workspace workspace definition & monorepo script entry
├── README.md                     # General setup & details
├── AGENTS.md                     # Repository instructions & developer patterns for agents
└── CLAUDE.md                     # CLI developer scripting handbook
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js:** Ensure Node.js (v18+) is installed.
* **API Keys:** You will need API keys for:
  * [NewsAPI](https://newsapi.org/) (for real-time news articles).
  * [Google Gemini API](https://ai.google.dev/) (for news text analysis).
  * [LocationIQ](https://locationiq.com/) (for geocoding).
  * [YouTube Data API v3](https://developers.google.com/youtube/v3) (optional, for region-specific video searches; falls back to premium mock feeds if missing).

### Environment Configuration
1. Create a `.env` file in the `news-api/` directory:
   ```env
   PORT=5000
   NEWS_API_KEY=your_news_api_key
   GEMINI_API_KEY=your_gemini_key
   LOCATIONIQ_API_KEY=your_locationiq_key
   YOUTUBE_API_KEY=your_youtube_api_key_optional
   KV_REST_API_URL=your_vercel_kv_rest_api_url_optional
   KV_REST_API_TOKEN=your_vercel_kv_rest_api_token_optional
   UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url_optional
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token_optional
   ```

2. Create a `.env` file in the `news-app/` directory (if configuring custom URLs):
   ```env
   VITE_API_URL=http://localhost:5000
   ```

### Setup and Start
Run the following commands in the project root:
```bash
# Install dependencies in workspaces
npm install

# Start both backend and frontend servers concurrently
npm run dev
```
Access the application at `http://localhost:5173` (or the console printed port).
