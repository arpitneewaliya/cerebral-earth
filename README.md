# Cerebral Earth — Interactive News & Data Map

Cerebral Earth is a premium, interactive web application that bridges geography, global news, and socio-economic data visualization. By combining custom-layered map views, location-aware news feeds, and dynamic charts, the app provides a highly visual, analytical interface to explore the state of the world.

---

## 🌟 Key Features

### 1. Interactive Leaflet Map & Split-Tile Rendering
* **Split Basemaps for Text Legibility:** To prevent coloring or overlay layers from covering map text labels (country names, cities, and borders), the basemap is split into two layers:
  * **Base Map Tiles:** A label-free base layer (`dark_nolabels` / `light_nolabels`) sitting underneath.
  * **Interactive GeoJSON:** Vector country boundaries and heatmap layers render on top of the base.
  * **Labels Pane Overlay:** A transparent, high z-index overlay layer (`dark_only_labels` / `light_only_labels`) rendering printed names on top of everything, ensuring country names remain crisp and readable without capturing hover or click events.
* **Seamless Dark Mode:** Natively integrates CARTO's light and dark tile sets, updating dynamically via React state and context.

### 2. Custom Choropleth Data Layers (Heatmaps)
* **Visual Global Indicators:** Turn on layers to color-code the entire globe based on World Bank database indicators:
  * **GDP Heatmap:** Gross Domestic Product in USD (Greens).
  * **Population Heatmap:** Total population count (Purples).
  * **FDI Heatmap:** Foreign Direct Investment inflows (Oranges).
  * **Inflation Heatmap:** Consumer price inflation rate (Reds).
  * **Unemployment Heatmap:** Unemployment percentage of labor force (Yellows).
  * **Literacy Heatmap:** Adult literacy rates (Blues).
* **Quantile Percentile Styling:** Map coloring dynamically calculates values based on percentiles (e.g., top 20% dark shades, bottom 20% light shades) rather than linear values to maintain high visual contrast regardless of extreme outliers.
* **Interactive Legend Panel:** Toggleable indicator details panel explaining exact value ranges for each color scale.

### 3. Integrated Global & Region-Specific News
* **AI-Geocoded Major Global News:** On startup, major news headlines are aggregated via **NewsAPI** (`newsapi.org`). A backend process passes the articles to **Google Gemini AI** to extract the primary city mentioned, geocodes it via forward lookup, and plots custom image pins on the map.
* **Region-Specific News Feed:** Clicking on any country on the map performs a reverse-geocoding lookup to identify the country name and pulls a list of localized news stories.
* **Category Filters:** Filter news articles directly from the sidebar by category (e.g., Business, Technology, Science).

### 4. Interactive Analytical Charts
* **Socio-Economic History:** Selecting any country opens a slide-over panel displaying interactive historical trend lines using `recharts` for the active indicator.
* **Performance Caching:** Backend caches World Bank global datasets in-memory to provide instant transition speeds when selecting different heatmap layers.

### 5. Video News Integration
* **Regional Video Feeds:** Selecting a region allows the user to switch from text articles to localized video news reports.
* **YouTube Data API Caching:** Queries the YouTube search API and caches video metadata for 4 hours to manage API quota limits.
* **Resilient Fallback Mode:** In the absence of an API key or on rate limit triggers, the backend returns beautiful dynamically populated mock video feeds so the user experience is never broken.

### 6. Conflict Tracker Map
* **GDELT Live Event Feed:** Displays current global security events, protests, and armed conflicts by querying the GDELT Project GKG GeoJSON stream.
* **Real-time Categorized Pins:** Map markers pulse color-coded rings based on severity: Red for Armed Conflicts, Orange for Civil Unrest, and Yellow for Geopolitical Tensions.
* **Responsive Sub-Views & Bottom Sheets:** The Conflict Panel features full desktop resizability and dynamic mobile bottom-sheet adjustments, complete with click-to-fly map autofocus zoom transitions.
* **Hybrid Environment Caching:** Uses Vercel KV (Upstash Redis) in production serverless environments with a 15-minute TTL to ensure extremely fast (sub-10ms) responses. Falls back to local background sync and file caching during offline/local development.

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
│   │   ├── components/           # UI components (Map, Header, SlideOverPanel, ConflictPanel, VideoNewsList, etc.)
│   │   ├── contexts/             # ThemeContext (Dark/Light mode)
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
