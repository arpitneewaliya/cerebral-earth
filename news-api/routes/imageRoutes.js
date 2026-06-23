// routes/imageRoutes.js
const express = require('express');
const axios = require('axios');
const { reverseGeocode, reverseGeocodeCountry } = require('../geocoding');

const router = express.Router();

// Helper function to query Wikimedia Commons
async function fetchWikimediaImages(searchQuery) {
  const url = 'https://commons.wikimedia.org/w/api.php';
  const params = {
    action: 'query',
    generator: 'search',
    gsrsearch: searchQuery,
    gsrnamespace: 6, // Namespace 6 is for files
    prop: 'imageinfo',
    iiprop: 'url|mime|extmetadata',
    iiurlwidth: 800, // Request resized thumbnail with width 800px
    gsrlimit: 30, // Request up to 30 items to allow filtering out maps/flags
    format: 'json',
    origin: '*'
  };

  const response = await axios.get(url, {
    params,
    headers: {
      'User-Agent': 'CerebralEarth/1.0 (https://github.com/arpitneewaliya/mapApp; arpit@example.com)'
    }
  });

  return response.data;
}

// Helper to filter and parse Wikimedia API response
function parseWikimediaResponse(data) {
  if (!data || !data.query || !data.query.pages) {
    return [];
  }

  const pages = data.query.pages;
  const parsedImages = [];

  for (const key of Object.keys(pages)) {
    const page = pages[key];
    if (page.imageinfo && page.imageinfo[0]) {
      const info = page.imageinfo[0];

      // Check if file is a standard image and not SVG, PDF, Audio, Video
      const isImage = info.mime && info.mime.startsWith('image/');
      
      const titleLower = page.title.toLowerCase();
      // Filter out flags, maps, coat of arms, locator maps, and diagrams
      const isMapOrFlag = 
        titleLower.includes('map') || 
        titleLower.includes('flag') || 
        titleLower.includes('coat of arms') || 
        titleLower.includes('arms of') ||
        titleLower.includes('locator') ||
        titleLower.includes('location') ||
        titleLower.includes('infobox') ||
        titleLower.includes('orthographic') ||
        titleLower.includes('svg') ||
        titleLower.includes('diagram') ||
        titleLower.includes('seal of') ||
        titleLower.includes('blazon');

      if (isImage && !isMapOrFlag) {
        // Clean up title (remove "File:" and extension, replace underscores with spaces)
        let title = page.title.replace(/^File:/i, '');
        title = title.substring(0, title.lastIndexOf('.')) || title;
        title = title.replace(/_/g, ' ');

        // Safely extract metadata fields, stripping HTML if present
        const rawDesc = info.extmetadata?.ImageDescription?.value || '';
        const rawArtist = info.extmetadata?.Artist?.value || '';
        const rawLicense = info.extmetadata?.LicenseShortName?.value || 'CC BY-SA';

        const description = rawDesc.replace(/<[^>]*>/g, '').trim();
        const artist = rawArtist.replace(/<[^>]*>/g, '').trim();

        parsedImages.push({
          id: page.pageid,
          title,
          imageUrl: info.thumburl || info.url,
          fullUrl: info.url,
          descriptionUrl: info.descriptionurl,
          description: description || 'No description available.',
          artist: artist || 'Unknown Artist',
          license: rawLicense
        });
      }
    }
  }

  return parsedImages;
}

// Route: GET /api/images
router.get('/', async (req, res) => {
  const { q, lat, lon } = req.query;

  try {
    let searchQuery = q ? q.trim() : '';
    let countryName = '';

    // If query text is not provided but coordinates are, try to reverse-geocode
    if (!searchQuery && lat && lon) {
      try {
        const place = await reverseGeocode(lat, lon);
        countryName = await reverseGeocodeCountry(lat, lon);
        
        if (place && countryName) {
          searchQuery = place === countryName ? countryName : `${place} ${countryName}`;
        } else if (countryName) {
          searchQuery = countryName;
        } else if (place) {
          searchQuery = place;
        }
      } catch (err) {
        console.error('Reverse geocoding failed for images query:', err.message);
      }
    }

    if (!searchQuery) {
      return res.status(400).json({ error: 'Search query or coordinates are required' });
    }

    console.log(`Searching images on Wikimedia for: "${searchQuery}"`);
    let data = await fetchWikimediaImages(searchQuery);
    let images = parseWikimediaResponse(data);

    // If specific search returns nothing and we have a country name, fall back to country
    if (images.length === 0 && countryName && searchQuery !== countryName) {
      console.log(`No results for "${searchQuery}". Falling back to country search: "${countryName}"`);
      data = await fetchWikimediaImages(countryName);
      images = parseWikimediaResponse(data);
    }

    // Limit to top 5 images as requested
    const top5Images = images.slice(0, 5);

    res.json(top5Images);
  } catch (error) {
    console.error('Error fetching images:', error.message);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

module.exports = router;
