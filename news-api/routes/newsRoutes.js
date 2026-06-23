// routes/newsRoutes.js
const express = require('express');
const axios = require('axios');
const { reverseGeocode } = require('../geocoding');

const router = express.Router();
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

// Endpoint: GET /api/news
router.get('/', async (req, res) => {
  const { lat, lng, category } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const region = await reverseGeocode(lat, lng);
    let query = region;
    if (category && category !== 'All') {
      query += ` ${category}`;
    }

    const params = {
      q: query,
      apiKey: process.env.NEWS_API_KEY,
      pageSize: 10,
      language: 'en',
    };

    const newsResponse = await axios.get(NEWS_API_URL, { params });
    
    // NewsAPI natively returns urlToImage
    const formattedArticles = newsResponse.data.articles || [];
    
    res.json(formattedArticles);
  } catch (error) {
    console.error('Error fetching news:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error fetching news' });
  }
});

module.exports = router;
