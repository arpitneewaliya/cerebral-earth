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
const gdpChartRoute = require('./routes/gdpChartRoute');
const reverseGeocodeRoute = require('./routes/reverseGeocodeRoute');
const populationChartRoute = require('./routes/populationChartRoute');
const fdiChartRoute = require('./routes/fdiChartRoute');
const inflationChartRoute = require('./routes/inflationChartRoute');
const unemploymentChartRoute = require('./routes/unemploymentChartRoute');

// Use routes
app.use('/api/news', newsRoutes);
app.use('/api/major-news', majorNewsRoutes);
app.use('/api/country-info', countryInfoRoutes);
app.use('/api/chart', gdpChartRoute);
app.use('/api/reverse-geocode-country-code', reverseGeocodeRoute);
app.use('/api/population-chart', populationChartRoute);
app.use('/api/fdi-chart', fdiChartRoute);
app.use('/api/inflation-chart', inflationChartRoute);
app.use('/api/unemployment-chart', unemploymentChartRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
