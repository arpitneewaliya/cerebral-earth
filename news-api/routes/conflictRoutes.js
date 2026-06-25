// routes/conflictRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { Redis } = require('@upstash/redis');

const cacheFilePath = path.join(__dirname, '../conflicts_cache.json');
let memoryCache = null;

// Initialize Vercel KV / Upstash Redis client conditionally
let redis = null;
const isKvConfigured = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

if (isKvConfigured) {
  redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
  console.log('[Conflict Cache] Vercel KV / Upstash Redis client initialized successfully.');
} else {
  console.log('[Conflict Cache] No KV environment variables found. Falling back to local disk and memory cache.');
}


// Static fallback data in case GDELT API fails, is rate-limited (429), or is slow
const fallbackConflicts = [
  {
    id: 'fallback-1',
    lat: 34.5553,
    lng: 69.1762,
    name: 'Kabul, Afghanistan',
    pubDate: new Date().toISOString(),
    tone: -5.4,
    url: 'https://www.un.org/securitycouncil/',
    category: 'GEOPOLITICAL_TENSION',
    themes: 'MILITARY;SECURITY;'
  },
  {
    id: 'fallback-2',
    lat: 48.3794,
    lng: 31.1656,
    name: 'Ukraine Region',
    pubDate: new Date().toISOString(),
    tone: -8.2,
    url: 'https://www.reuters.com/',
    category: 'ARMED_CONFLICT',
    themes: 'ARMEDCONFLICT;WAR;MILITARY;'
  },
  {
    id: 'fallback-3',
    lat: 31.0461,
    lng: 34.8516,
    name: 'Gaza, Palestine/Israel',
    pubDate: new Date().toISOString(),
    tone: -9.1,
    url: 'https://www.bbc.com/news',
    category: 'ARMED_CONFLICT',
    themes: 'ARMEDCONFLICT;AIRSTRIKE;VIOLENCE;'
  },
  {
    id: 'fallback-4',
    lat: 15.3694,
    lng: 44.1910,
    name: 'Sanaa, Yemen',
    pubDate: new Date().toISOString(),
    tone: -6.5,
    url: 'https://www.apnews.com/',
    category: 'ARMED_CONFLICT',
    themes: 'ARMEDCONFLICT;MILITARY;'
  },
  {
    id: 'fallback-5',
    lat: 30.0444,
    lng: 31.2357,
    name: 'Cairo, Egypt',
    pubDate: new Date().toISOString(),
    tone: -2.3,
    url: 'https://www.aljazeera.com/',
    category: 'CIVIL_UNREST',
    themes: 'PROTEST;DEMONSTRATION;'
  },
  {
    id: 'fallback-6',
    lat: -23.5505,
    lng: -46.6333,
    name: 'São Paulo, Brazil',
    pubDate: new Date().toISOString(),
    tone: -3.1,
    url: 'https://www.brasil247.com/',
    category: 'CIVIL_UNREST',
    themes: 'PROTEST;RIOT;'
  }
];

function classifyThemes(themesStr) {
  if (!themesStr) return 'GEOPOLITICAL_TENSION';
  const upperThemes = themesStr.toUpperCase();

  // 1. Civil Unrest / Protests / Riots / Rebellion
  // Checked first because protest events often contain keywords like 'violence' or 'attack' in media reports
  const civilUnrestKeywords = [
    'PROTEST', 'RIOT', 'STRIKE', 'DEMONSTRATION', 'REBELLION', 'CIVIL_WAR', 'UNREST'
  ];
  if (civilUnrestKeywords.some(keyword => upperThemes.includes(keyword))) {
    return 'CIVIL_UNREST';
  }

  // 2. Armed Conflict / Active Clashes / Bombings / Hostages
  // Focuses on active violence rather than general security/military policy
  const armedConflictKeywords = [
    'ARMEDCONFLICT', 'AIRSTRIKE', 'BOMBS', 'EXPLOSION', 'HOSTAGE', 'KIDNAP', 
    'PEACEKEEPING', 'KILL', 'DEAD', 'VICTIM', 'ATTACK', 'CASUALTIES'
  ];
  if (armedConflictKeywords.some(keyword => upperThemes.includes(keyword))) {
    return 'ARMED_CONFLICT';
  }

  // 3. Geopolitical / Diplomatic Tension / Military & Security Policies
  // Includes themes related to boundary disputes, state military forces, treaties, and general security/terror alerts
  const geopoliticalKeywords = [
    'MILITARY', 'WAR', 'DIPLOMACY', 'SANCTIONS', 'TREATY', 'SOVEREIGNTY', 'BORDER', 
    'SECURITY', 'TERROR', 'TERRORISM', 'HEZBOLLAH'
  ];
  if (geopoliticalKeywords.some(keyword => upperThemes.includes(keyword))) {
    return 'GEOPOLITICAL_TENSION';
  }

  return 'GEOPOLITICAL_TENSION';
}

// Helper function to fetch and parse live GDELT data
async function fetchLiveConflicts() {
  const gdeltUrl = 'https://api.gdeltproject.org/api/v1/gkg_geojson?QUERY=(theme:PROTEST%20OR%20theme:MILITARY%20OR%20theme:ARMEDCONFLICT%20OR%20theme:TERROR)&MAXROWS=80';
  const response = await axios.get(gdeltUrl, { timeout: 15000 });
  
  if (response.status === 200 && response.data && Array.isArray(response.data.features)) {
    const parsedConflicts = response.data.features
      .filter(feature => 
        feature.geometry && 
        feature.geometry.type === 'Point' && 
        Array.isArray(feature.geometry.coordinates) && 
        feature.geometry.coordinates.length >= 2 &&
        !(feature.geometry.coordinates[0] === 0 && feature.geometry.coordinates[1] === 0)
      )
      .map((feature, idx) => {
        const coords = feature.geometry.coordinates;
        const props = feature.properties || {};
        const category = classifyThemes(props.mentionedthemes || '');

        return {
          id: `gdelt-${idx}-${props.urlpubtimedate || ''}`,
          lng: coords[0],
          lat: coords[1],
          name: props.name || 'Unknown Location',
          pubDate: props.urlpubtimedate || new Date().toISOString(),
          tone: typeof props.urltone === 'number' ? props.urltone : 0,
          url: props.url || 'https://www.gdeltproject.org/',
          category: category,
          themes: props.mentionedthemes || ''
        };
      });

    // Filter out duplicates (same location and URL)
    const seen = new Set();
    const uniqueConflicts = parsedConflicts.filter(item => {
      const key = `${item.lat.toFixed(3)},${item.lng.toFixed(3)},${item.url}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return uniqueConflicts;
  } else {
    throw new Error(`GDELT API returned status ${response.status}`);
  }
}

// Background sync function for local cache fallback mode
async function syncConflicts() {
  console.log('[Background Sync] Fetching live conflict data from GDELT API...');
  try {
    const uniqueConflicts = await fetchLiveConflicts();
    memoryCache = uniqueConflicts;
    fs.writeFileSync(cacheFilePath, JSON.stringify(uniqueConflicts, null, 2), 'utf8');
    console.log(`[Background Sync] Success: Cached ${uniqueConflicts.length} conflicts to disk.`);
  } catch (error) {
    console.error('[Background Sync] Error fetching GDELT data:', error.message);
    if (!memoryCache && fs.existsSync(cacheFilePath)) {
      try {
        const fileContent = fs.readFileSync(cacheFilePath, 'utf8');
        memoryCache = JSON.parse(fileContent);
        console.log('[Background Sync] Loaded historical disk cache on failure');
      } catch (e) {
        console.error('[Background Sync] Failed to parse disk cache:', e.message);
      }
    }
  }
}

// Only start background timers and local file caching if Vercel KV is not configured
if (!isKvConfigured) {
  // Initial Sync on server start (non-blocking)
  syncConflicts();

  // Set interval for periodic background syncs (every 15 minutes)
  const SYNC_INTERVAL = 15 * 60 * 1000;
  setInterval(syncConflicts, SYNC_INTERVAL);
}

// GET /api/conflicts - responds instantly
router.get('/', async (req, res) => {
  // Scenario A: Vercel KV Cache Mode (Production Serverless Environment)
  if (isKvConfigured && redis) {
    try {
      // 1. Try to read from Vercel KV Redis
      const cachedConflicts = await redis.get('conflicts_data');
      if (cachedConflicts) {
        console.log('[Conflict Cache] Serving live conflicts from Vercel KV Redis');
        return res.json({ source: 'vercel-kv', conflicts: cachedConflicts });
      }

      // 2. Cache Miss: Fetch live GDELT data
      console.log('[Conflict Cache] Vercel KV cache miss. Fetching from GDELT...');
      const conflicts = await fetchLiveConflicts();

      // 3. Save to Redis with 15-minute TTL (900 seconds)
      await redis.set('conflicts_data', conflicts, { ex: 900 });
      console.log('[Conflict Cache] Successfully saved fresh GDELT conflicts to Vercel KV with 15m TTL.');
      
      return res.json({ source: 'live-fetch-kv', conflicts });
    } catch (err) {
      console.error('[Conflict Cache] Vercel KV error, falling back to static list:', err.message);
      return res.json({ source: 'fallback', conflicts: fallbackConflicts });
    }
  }

  // Scenario B: Local Dev / File Cache Mode
  // 1. Serve memory cache if available (sub-1ms)
  if (memoryCache) {
    return res.json({ source: 'memory-cache', conflicts: memoryCache });
  }

  // 2. Serve disk cache if memory is not loaded yet (1-2ms)
  if (fs.existsSync(cacheFilePath)) {
    try {
      const fileContent = fs.readFileSync(cacheFilePath, 'utf8');
      memoryCache = JSON.parse(fileContent);
      console.log('Serving conflicts from disk cache');
      return res.json({ source: 'disk-cache', conflicts: memoryCache });
    } catch (e) {
      console.error('Failed to read disk cache:', e.message);
    }
  }

  // 3. Fallback to static conflicts list if no cache is available yet
  console.log('Serving fallback static conflicts');
  return res.json({ source: 'fallback', conflicts: fallbackConflicts });
});

module.exports = router;
