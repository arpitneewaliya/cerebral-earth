// routes/newsRoutes.js
const express = require('express');
const axios = require('axios');
const { reverseGeocode } = require('../geocoding');

const router = express.Router();
const NEWS_API_URL = 'https://gnews.io/api/v4/search';

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
      apikey: process.env.GNEWS_API_KEY,
      max: 10,
      lang: 'en',
    };

    const newsResponse = await axios.get(NEWS_API_URL, { params });
    
    // Map GNews format to what frontend expects
    const formattedArticles = newsResponse.data.articles.map(article => ({
      ...article,
      urlToImage: article.image,
    }));
    
    res.json(formattedArticles);
  } catch (error) {
    console.error('Error fetching news:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error fetching news' });
  }
});

module.exports = router;
