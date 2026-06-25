// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Route imports
const newsRoutes = require('./routes/newsRoutes');
const majorNewsRoutes = require('./routes/majorNewsRoutes');
const countryInfoRoutes = require('./routes/countryInfoRoutes');
const chartRoutes = require('./routes/chartRoutes');
const reverseGeocodeRoute = require('./routes/reverseGeocodeRoute');
const reverseGeocodeCountryName = require('./routes/reverseGeocodeCountryName');
const searchRoute = require('./routes/searchRoute');
const videoNewsRoutes = require('./routes/videoNewsRoutes');

// Use routes
app.use('/api/news', newsRoutes);
app.use('/api/major-news', majorNewsRoutes);
app.use('/api/country-info', countryInfoRoutes);
app.use('/api/charts', chartRoutes);
app.use('/api/reverse-geocode-country-code', reverseGeocodeRoute);
app.use('/api/reverse-geocode-country-name', reverseGeocodeCountryName);
app.use('/api/search', searchRoute);
app.use('/api/news-videos', videoNewsRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
