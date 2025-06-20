require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { reverseGeocode, forwardGeocoding } = require('./geocoding');
const { get_gemini_response } = require('./gemini_ai');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const NEWS_API_URL = 'https://newsapi.org/v2/everything';

// Endpoint to fetch news
app.get('/api/news', async (req, res) => {
  const { lat, lng, category } = req.query;

  console.log(`Received request for coordinates: lat=${lat}, lng=${lng}, category=${category}`);

  try {
    // Use the custom geocoding module for reverse geocoding
    const region = await reverseGeocode(lat, lng);

    console.log(`Using region for news API: ${region}`);

    // Fetch news based on the obtained region and category
    const params = {
      q: region,
      apiKey: process.env.NEWS_API_KEY,
      pageSize: 10,
      sortBy: 'publishedAt',
      language: 'en',
    };

    if (category && category !== 'All') {
      params.q += ` ${category}`;
    }

    const newsResponse = await axios.get(NEWS_API_URL, { params });

    console.log('News API response received');

    // Generate summary for each article
    // const summarizedArticles = await Promise.all(
    //   newsResponse.data.articles.map(async (article) => {
    //     const prompt = `${article.title}\n\n${article.description || article.content}`;
    //     try {
    //       const summarizedText = await gemini_summary(prompt);
    //       return { ...article, summarizedText };
    //     } catch (error) {
    //       console.error(`Error summarizing article: ${article.title}`, error);
    //       return { ...article, summarizedText: 'Error summarizing this article' };
    //     }
    //   })
    // );

    res.json(newsResponse.data.articles);
  } catch (error) {
    console.error('Error fetching news:', error.message);

    // Log error response details
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }

    res.status(500).json({ message: 'Error fetching news' });
  }
});

// Endpoint to fetch major news
app.get('/api/major-news', async (req, res) => {
  try {
    // Fetch top 10 global news articles
    const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';
    const newsResponse = await axios.get(NEWS_API_URL, {
      params: {
        apiKey: process.env.NEWS_API_KEY,
        pageSize: 10, // Fetch top 10 articles
        sortBy: 'publishedAt',
        language: 'en',
      },
    });

    console.log('News API response received');

    // Get coordinates for each article
    const articlesWithCoordinates = await Promise.all(
      newsResponse.data.articles.map(async (article) => {
        const location = await get_gemini_response(`In one word give me the city name from the content of the article '${article.content}'`); // Example: use the source name as location
        const { lat, lng } = await forwardGeocoding(location);
        return { ...article, lat, lng };
      })
    );

    res.json(articlesWithCoordinates);
  } catch (error) {
    console.error('Error fetching major news:', error.message);

    // Log error response details
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }

    res.status(500).json({ message: 'Error fetching major news' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
