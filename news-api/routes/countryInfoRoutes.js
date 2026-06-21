// routes/countryInfoRoutes.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const { reverseGeocodeCountry } = require('../geocoding');

const router = express.Router();

// Load local database of countries
const countriesDb = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'countries_db.json'), 'utf8'));

// Helper to look up country by name in the local database
function findCountry(name) {
  if (!name) return null;
  const cleanName = name.trim().toLowerCase();
  
  // 1. Direct name match
  let match = countriesDb.find(c => c.name.toLowerCase() === cleanName);
  if (match) return match;
  
  // 2. Alt spellings / native name match
  match = countriesDb.find(c => 
    c.altSpellings?.some(alt => alt.toLowerCase() === cleanName) ||
    c.nativeName?.toLowerCase() === cleanName
  );
  if (match) return match;
  
  // 3. Substring match
  match = countriesDb.find(c => 
    c.name.toLowerCase().includes(cleanName) || 
    cleanName.includes(c.name.toLowerCase())
  );
  return match;
}

// Endpoint: GET /api/country-info
router.get('/', async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const countryName = await reverseGeocodeCountry(lat, lng);
    if (!countryName) {
      return res.status(404).json({ error: 'Country not found for these coordinates' });
    }

    const country = findCountry(countryName);
    if (!country) {
      console.warn(`Country not found in local db: ${countryName}`);
      return res.status(404).json({ error: `Country info not found in local database for: ${countryName}` });
    }

    // Map local database properties to Rest Countries v3.1 JSON schema expected by frontend
    const formatted = {
      name: {
        common: country.name,
        official: country.nativeName || country.name
      },
      flags: country.flags || {
        svg: `https://flagcdn.com/${country.alpha2Code.toLowerCase()}.svg`,
        png: `https://flagcdn.com/w320/${country.alpha2Code.toLowerCase()}.png`
      },
      capital: Array.isArray(country.capital) ? country.capital : [country.capital],
      region: country.region,
      subregion: country.subregion,
      population: country.population,
      area: country.area,
      currencies: country.currencies ? country.currencies.reduce((acc, curr) => {
        if (curr.code) {
          acc[curr.code] = { name: curr.name, symbol: curr.symbol };
        }
        return acc;
      }, {}) : null,
      maps: {
        googleMaps: `https://www.google.com/maps/place/${encodeURIComponent(country.name)}`
      }
    };

    // Return as array to match restcountries API format
    res.json([formatted]);
  } catch (error) {
    console.error('Error fetching country info:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

