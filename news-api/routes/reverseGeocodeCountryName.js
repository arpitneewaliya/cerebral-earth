const express = require('express');
const router = express.Router();
const { reverseGeocodeCountry } = require('../geocoding');

// Route: GET /api/reverse-geocode-country-name?lat=...&lon=...
router.get('/', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Missing latitude or longitude' });
  }

  try {
    const country = await reverseGeocodeCountry(lat, lon);
    res.json({ countryName: country });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reverse geocode country code' });
  }
});

module.exports = router;
