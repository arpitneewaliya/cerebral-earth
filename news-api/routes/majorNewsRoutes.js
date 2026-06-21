// routes/majorNewsRoutes.js
const express = require('express');
const axios = require('axios');
const { forwardGeocoding } = require('../geocoding');
const { get_gemini_response } = require('../gemini_ai');

const router = express.Router();
const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';

// In-memory cache for coordinates to avoid repetitive external requests
const geocodeCache = {};

// Helper to get coordinates with delay and cache
async function getCoordinatesWithDelay(city) {
  if (!city || typeof city !== 'string') return { lat: null, lng: null };
  const cleanCity = city.trim();
  if (!cleanCity || cleanCity.toLowerCase() === 'null') return { lat: null, lng: null };
  
  if (geocodeCache[cleanCity]) {
    return geocodeCache[cleanCity];
  }
  
  // Wait 500ms to respect LocationIQ free tier rate limits (2 requests per second)
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    const coords = await forwardGeocoding(cleanCity);
    geocodeCache[cleanCity] = coords;
    return coords;
  } catch (err) {
    console.error(`Geocoding failed for ${cleanCity}:`, err.message);
    return { lat: null, lng: null };
  }
}

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

    const articles = newsResponse.data.articles || [];

    if (articles.length === 0) {
      return res.json([]);
    }

    // 1. Batch prompt to Gemini to extract city names for all articles in one API call
    const prompt = `
You are a helpful geocoding assistant. 
Your task is to extract the primary city name mentioned in the content/description of each article.
I will give you a list of articles. Respond with a JSON array of strings containing ONLY the city names in the exact same order as the articles provided.
If no city name is mentioned or it's unclear, use null for that article.
Do not wrap your response in markdown code blocks. Return the raw JSON array string.

Articles:
${articles.map((art, idx) => `[Article ${idx + 1}] Title: ${art.title}\nContent: ${art.content || art.description || 'No content'}`).join('\n\n')}
`;

    let cities = [];
    try {
      const geminiText = await get_gemini_response(prompt);
      let cleanText = geminiText.trim();
      if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
      }
      cities = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('Error parsing Gemini batch response:', parseError.message);
      cities = new Array(articles.length).fill(null);
    }

    // Ensure cities array length matches articles length
    if (!Array.isArray(cities) || cities.length !== articles.length) {
      cities = new Array(articles.length).fill(null);
    }

    // 2. Geocode cities sequentially with delay and caching
    const articlesWithCoordinates = [];
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      const city = cities[i];
      const { lat, lng } = await getCoordinatesWithDelay(city);
      
      // Only include coords if they are valid
      articlesWithCoordinates.push({
        ...article,
        lat: lat !== null ? lat : undefined,
        lng: lng !== null ? lng : undefined
      });
    }

    res.json(articlesWithCoordinates);
  } catch (error) {
    console.error('Error fetching major news:', error.message);
    res.status(500).json({ message: 'Error fetching major news' });
  }
});

module.exports = router;

