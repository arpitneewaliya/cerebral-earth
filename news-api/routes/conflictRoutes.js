// routes/conflictRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

let cacheData = null;
let cacheTime = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

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

  // 1. Armed Conflict / Clashes / Violence / Terror
  const armedConflictKeywords = [
    'ARMEDCONFLICT', 'TERROR', 'KILL', 'KIDNAP', 'ATTACK', 
    'BOMBS', 'EXPLOSION', 'AIRSTRIKE', 'VIOLENCE', 'HOSTAGE'
  ];
  if (armedConflictKeywords.some(keyword => upperThemes.includes(keyword))) {
    return 'ARMED_CONFLICT';
  }

  // 2. Civil Unrest / Protests / Riots / Rebellion
  const civilUnrestKeywords = [
    'PROTEST', 'RIOT', 'STRIKE', 'DEMONSTRATION', 'REBELLION', 'CIVIL_WAR', 'UNREST'
  ];
  if (civilUnrestKeywords.some(keyword => upperThemes.includes(keyword))) {
    return 'CIVIL_UNREST';
  }

  // 3. Geopolitical / Diplomatic Tension / Military
  // Default fallback if not matched above is GEOPOLITICAL_TENSION
  return 'GEOPOLITICAL_TENSION';
}

router.get('/', async (req, res) => {
  const currentTime = Date.now();

  // If cache is fresh, return it
  if (cacheData && (currentTime - cacheTime < CACHE_DURATION)) {
    console.log('Serving conflicts from cache');
    return res.json({ source: 'cache', conflicts: cacheData });
  }

  try {
    console.log('Fetching live conflict data from GDELT API...');
    const gdeltUrl = 'https://api.gdeltproject.org/api/v1/gkg_geojson?QUERY=(theme:PROTEST%20OR%20theme:MILITARY%20OR%20theme:ARMEDCONFLICT%20OR%20theme:TERROR)&MAXROWS=80';
    
    const response = await axios.get(gdeltUrl, { timeout: 12000 });
    
    if (response.status === 200 && response.data && Array.isArray(response.data.features)) {
      const parsedConflicts = response.data.features
        .filter(feature => 
          feature.geometry && 
          feature.geometry.type === 'Point' && 
          Array.isArray(feature.geometry.coordinates) && 
          feature.geometry.coordinates.length >= 2 &&
          // Filter out obvious 0,0 locations
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

      cacheData = uniqueConflicts;
      cacheTime = currentTime;
      console.log(`Successfully fetched and parsed ${uniqueConflicts.length} conflicts`);
      return res.json({ source: 'live', conflicts: uniqueConflicts });
    } else {
      throw new Error(`GDELT responded with status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching live GDELT conflict data:', error.message);
    
    // Serve stale cache if available, otherwise serve fallback static data
    if (cacheData) {
      console.log('Serving stale cache due to error');
      return res.json({ source: 'stale-cache', conflicts: cacheData });
    }

    console.log('Serving fallback conflicts data');
    return res.json({ source: 'fallback', conflicts: fallbackConflicts });
  }
});

module.exports = router;
