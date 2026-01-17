// routes/countryInfoRoutes.js
const express = require('express');
const axios = require('axios');
const { reverseGeocodeCountry } = require('../geocoding');

const router = express.Router();

// Endpoint: GET /api/country-info
router.get('/', async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const countryName = await reverseGeocodeCountry(lat, lng);
    const REST_COUNTRIES_API_URL = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;
    const response = await axios.get(REST_COUNTRIES_API_URL);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching country info:', error.message);
    if (error.response) {
      res.status(error.response.status).json({
        error: error.response.statusText,
        details: error.response.data,
      });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

module.exports = router;
