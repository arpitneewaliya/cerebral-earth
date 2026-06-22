// routes/reverseGeocodeRoute.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { reverseGeocodeCountryCode } = require('../geocoding');

// Load countries database to map codes
const countriesDb = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'countries_db.json'), 'utf8'));

// Route: GET /api/reverse-geocode-country-code?lat=...&lon=...
router.get('/', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Missing latitude or longitude' });
  }

  try {
    const code = await reverseGeocodeCountryCode(lat, lon);
    
    // Find the country in the database using 2-letter code (lowercase)
    const country = countriesDb.find(
      c => c.alpha2Code && c.alpha2Code.toLowerCase() === code.toLowerCase()
    );
    const alpha3Code = country ? country.alpha3Code : null;

    res.json({ countryCode: code, alpha3Code });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reverse geocode country code' });
  }
});

module.exports = router;
