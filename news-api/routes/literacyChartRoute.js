const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/:countryCode', async (req, res) => {
  const { countryCode } = req.params;
  const { start = 1980, end = 2023 } = req.query;

  try {
    const url = `http://api.worldbank.org/v2/country/${countryCode}/indicator/SE.ADT.LITR.ZS?date=${start}:${end}&format=json`;
    const response = await axios.get(url);

    if (!response.data || response.data.length < 2 || !Array.isArray(response.data[1])) {
      return res.json([]);
    }

    const records = response.data[1];
    const formatted = records
      .filter(record => record.value !== null)
      .map(record => ({
        year: parseInt(record.date),
        value: record.value
      }))
      .sort((a, b) => a.year - b.year);

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching literacy rate data:', error.message);
    res.status(500).json({ error: 'Failed to fetch literacy rate data' });
  }
});

module.exports = router;
