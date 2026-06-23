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

      // Check if file is a standard image (not PDF, audio, video)
      const isImage = info.mime && info.mime.startsWith('image/');
      
      const titleLower = page.title.toLowerCase();
      
      // Filter out non-photo extensions (.svg, .pdf, .djvu, .tif, .tiff, etc.)
      const extension = page.title.substring(page.title.lastIndexOf('.')).toLowerCase();
      const isValidExtension = ['.jpg', '.jpeg', '.png', '.webp'].includes(extension);

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

      // Filter out closeups, wildlife, books, and portraits to keep strictly landscape / landmarks
      const isRandomNonScenic =
        titleLower.includes('portrait') ||
        titleLower.includes('close up') ||
        titleLower.includes('close-up') ||
        titleLower.includes('butterfly') ||
        titleLower.includes('insect') ||
        titleLower.includes('bee ') ||
        titleLower.includes('wasp') ||
        titleLower.includes('fly ') ||
        titleLower.includes('spider') ||
        titleLower.includes('caterpillar') ||
        titleLower.includes('beetle') ||
        titleLower.includes('bird') ||
        titleLower.includes('flower') ||
        titleLower.includes('leaf') ||
        titleLower.includes('plant') ||
        titleLower.includes('mushroom') ||
        titleLower.includes('fungus') ||
        titleLower.includes('animal') ||
        titleLower.includes('mammal') ||
        titleLower.includes('cat ') ||
        titleLower.includes('dog ') ||
        titleLower.includes('food') ||
        titleLower.includes('dish') ||
        titleLower.includes('recipe') ||
        titleLower.includes('stamp') ||
        titleLower.includes('coin') ||
        titleLower.includes('money') ||
        titleLower.includes('book') ||
        titleLower.includes('page') ||
        titleLower.includes('volume') ||
        titleLower.includes('vol ') ||
        titleLower.includes('cover') ||
        titleLower.includes('history') ||
        titleLower.includes('handshake') ||
        titleLower.includes('meeting') ||
        titleLower.includes('signing') ||
        titleLower.includes('ceremony');

      if (isImage && isValidExtension && !isMapOrFlag && !isRandomNonScenic) {
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

    // 1. Primary: Search for query + restricted to high-quality images category
    const qualityQuery = `${searchQuery} incategory:"Quality images"`;
    console.log(`Searching primary quality query: "${qualityQuery}"`);
    let data = await fetchWikimediaImages(qualityQuery);
    let images = parseWikimediaResponse(data);

    // 2. Secondary: If we have fewer than 5 images, do a keyword-refined search
    const targetKeywords = '(landscape OR landmark OR "tourist attraction" OR scenery OR architecture OR travel)';
    if (images.length < 5) {
      const refinedQuery = `${searchQuery} ${targetKeywords}`;
      console.log(`Fewer than 5 images found. Searching secondary: "${refinedQuery}"`);
      data = await fetchWikimediaImages(refinedQuery);
      const secondaryImages = parseWikimediaResponse(data);
      
      for (const img of secondaryImages) {
        if (!images.some(i => i.id === img.id)) {
          images.push(img);
        }
      }
    }

    // 3. Tertiary: Fallback to country name Quality search if we still have fewer than 3 images
    if (images.length < 3 && countryName && searchQuery !== countryName) {
      const countryQualityQuery = `${countryName} incategory:"Quality images"`;
      console.log(`Fewer than 3 images. Falling back to country quality: "${countryQualityQuery}"`);
      data = await fetchWikimediaImages(countryQualityQuery);
      const countryImages = parseWikimediaResponse(data);
      
      for (const img of countryImages) {
        if (!images.some(i => i.id === img.id)) {
          images.push(img);
        }
      }
    }

    // 4. Quaternary: Fallback to country name + keywords if needed
    if (images.length < 3 && countryName && searchQuery !== countryName) {
      const countryRefinedQuery = `${countryName} ${targetKeywords}`;
      console.log(`Still fewer than 3 images. Falling back to country refined: "${countryRefinedQuery}"`);
      data = await fetchWikimediaImages(countryRefinedQuery);
      const countryRefinedImages = parseWikimediaResponse(data);
      
      for (const img of countryRefinedImages) {
        if (!images.some(i => i.id === img.id)) {
          images.push(img);
        }
      }
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
