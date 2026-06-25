// routes/videoNewsRoutes.js
const express = require('express');
const axios = require('axios');
const { reverseGeocode } = require('../geocoding');

const router = express.Router();

// In-memory cache for news videos
// Key: region name (lowercase), Value: { videos, expiresAt }
const videoCache = new Map();
const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

// Helper for generating dynamic mock data when API key is missing or calls fail
function getMockVideos(regionName) {
  return [
    {
      videoId: "Gp50V29Z1Q0",
      title: `${regionName} News Today: Major Headlines and Live Updates`,
      description: `Catch up on the key stories making headlines in ${regionName} today. Live reports, local analysis, and breaking news updates from the region.`,
      thumbnail: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=640&q=80",
      publishedAt: new Date().toISOString(),
      channelTitle: `${regionName} Broadcast Network`
    },
    {
      videoId: "V7X3QeSjD4c",
      title: `${regionName} Regional Economic & Policy Forum Briefing`,
      description: `An in-depth look at this week's economic trends, trade negotiations, and policy shifts affecting ${regionName}.`,
      thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=640&q=80",
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      channelTitle: `${regionName} Economic Desk`
    },
    {
      videoId: "l9K95mX7P3Y",
      title: `Environmental Impact Report: Climate Actions in ${regionName}`,
      description: `Regional leaders in ${regionName} announce new green initiatives and environmental standards. We examine the projected impacts.`,
      thumbnail: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=640&q=80",
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      channelTitle: "Green Earth Network"
    },
    {
      videoId: "r3c25W5v0xY",
      title: `Technology and Infrastructure in ${regionName}: The Next Decade`,
      description: `Smart cities, transit networks, and high-speed communications are reshaping urban centers across ${regionName}. Reports look at major projects.`,
      thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=640&q=80",
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      channelTitle: "Tech & Infrastructure Live"
    }
  ];
}

// Endpoint: GET /api/news-videos
router.get('/', async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    // 1. Resolve coordinates to a region/city name
    const regionName = await reverseGeocode(lat, lng);
    const cacheKey = regionName.toLowerCase().trim();

    // 2. Check Cache
    if (videoCache.has(cacheKey)) {
      const cached = videoCache.get(cacheKey);
      if (Date.now() < cached.expiresAt) {
        console.log(`[Cache Hit] Serving news videos for: ${regionName}`);
        return res.json(cached.videos);
      } else {
        videoCache.delete(cacheKey);
      }
    }

    // 3. Check for API key
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.warn(`[YouTube API] YOUTUBE_API_KEY is not defined. Serving mock data for: ${regionName}`);
      const mockVideos = getMockVideos(regionName);
      // Cache the mock data as well to behave identically
      videoCache.set(cacheKey, {
        videos: mockVideos,
        expiresAt: Date.now() + CACHE_DURATION
      });
      return res.json(mockVideos);
    }

    console.log(`[YouTube API] Fetching latest news videos for query: "${regionName} news"`);
    
    // 4. Query YouTube Data API v3
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: `${regionName} news`,
        type: 'video',
        videoCategoryId: '25', // News & Politics Category
        order: 'date',
        maxResults: 8,
        key: apiKey
      }
    });

    const items = response.data.items || [];
    
    // 5. Format response items
    const formattedVideos = items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
      publishedAt: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle
    })).filter(video => video.videoId); // Ensure videoId exists

    // If API returned empty results, fall back to mock data
    if (formattedVideos.length === 0) {
      console.warn(`[YouTube API] Empty results for query: "${regionName} news". Serving mock data.`);
      const mockVideos = getMockVideos(regionName);
      return res.json(mockVideos);
    }

    // 6. Cache & Return results
    videoCache.set(cacheKey, {
      videos: formattedVideos,
      expiresAt: Date.now() + CACHE_DURATION
    });

    res.json(formattedVideos);
  } catch (error) {
    console.error('Error fetching news videos:', error.response ? error.response.data : error.message);
    
    // Safety Fallback: if geocoding or API call fails, don't crash, serve global mock news
    try {
      const fallbackName = "Global";
      const fallbackVideos = getMockVideos(fallbackName);
      res.json(fallbackVideos);
    } catch (fallbackError) {
      res.status(500).json({ message: 'Error retrieving news videos' });
    }
  }
});

module.exports = router;
