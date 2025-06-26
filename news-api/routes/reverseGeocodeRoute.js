// routes/reverseGeocodeRoute.js
const express = require('express');
const router = express.Router();
const { reverseGeocodeCountryCode } = require('../geocoding');

// Route: GET /api/reverse-geocode-country-code?lat=...&lon=...
router.get('/', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Missing latitude or longitude' });
  }

  try {
    const code = await reverseGeocodeCountryCode(lat, lon);
    res.json({ countryCode: code });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reverse geocode country code' });
  }
});

module.exports = router;
