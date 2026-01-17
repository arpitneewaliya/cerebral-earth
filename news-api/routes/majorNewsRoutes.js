// routes/majorNewsRoutes.js
const express = require('express');
const axios = require('axios');
const { forwardGeocoding } = require('../geocoding');
const { get_gemini_response } = require('../gemini_ai');

const router = express.Router();
const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';

// Endpoint: GET /api/major-news
router.get('/', async (req, res) => {
  try {
    const newsResponse = await axios.get(NEWS_API_URL, {
      params: {
        apiKey: process.env.NEWS_API_KEY,
        pageSize: 10,
        sortBy: 'publishedAt',
        language: 'en',
      },
    });

    const articlesWithCoordinates = await Promise.all(
      newsResponse.data.articles.map(async (article) => {
        const location = await get_gemini_response(
          `In one word give me the city name from the content of the article '${article.content}'`
        );
        const { lat, lng } = await forwardGeocoding(location);
        return { ...article, lat, lng };
      })
    );

    res.json(articlesWithCoordinates);
  } catch (error) {
    console.error('Error fetching major news:', error.message);
    res.status(500).json({ message: 'Error fetching major news' });
  }
});

module.exports = router;
