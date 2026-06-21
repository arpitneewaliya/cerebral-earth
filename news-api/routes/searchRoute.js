// routes/searchRoute.js
const express = require('express');
const axios = require('axios');

const router = express.Router();

// Endpoint: GET /api/search?q=...
router.get('/', async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Search query parameter "q" is required' });
  }

  try {
    const LOCATIONIQ_URL = `https://us1.locationiq.com/v1/search?key=${process.env.LOCATIONIQ_API_KEY}&q=${encodeURIComponent(q)}&format=json`;
    const response = await axios.get(LOCATIONIQ_URL);

    // Format the response to return relevant fields
    const results = response.data.map(item => ({
      display_name: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      boundingbox: item.boundingbox ? item.boundingbox.map(coord => parseFloat(coord)) : null
    }));

    res.json(results);
  } catch (error) {
    console.error('Error fetching search results from LocationIQ:', error.message);
    if (error.response && error.response.status === 404) {
      // Return empty results if nothing found
      return res.json([]);
    }
    res.status(500).json({ error: 'Failed to retrieve search results' });
  }
});

module.exports = router;
