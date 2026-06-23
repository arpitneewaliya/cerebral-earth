const express = require('express');
const axios = require('axios');
const router = express.Router();

const INDICATORS = {
  gdp: { id: 'NY.GDP.MKTP.CD', defaultStart: 1960 },
  population: { id: 'SP.POP.TOTL', defaultStart: 1960 },
  fdi: { id: 'BX.KLT.DINV.CD.WD', defaultStart: 2000 },
  inflation: { id: 'FP.CPI.TOTL.ZG', defaultStart: 2000 },
  unemployment: { id: 'SL.UEM.TOTL.ZS', defaultStart: 2000 },
  literacy: { id: 'SE.ADT.LITR.ZS', defaultStart: 1980 }
};

const globalDataCache = {};
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

router.get('/global/:indicator', async (req, res) => {
  const { indicator } = req.params;
  const config = INDICATORS[indicator];

  if (!config) {
    return res.status(400).json({ error: `Unsupported indicator: ${indicator}` });
  }

  const cached = globalDataCache[indicator];
  if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
    return res.json(cached.data);
  }

  try {
    const url = `http://api.worldbank.org/v2/country/all/indicator/${config.id}?mrnev=1&format=json&per_page=300`;
    const response = await axios.get(url);

    if (!response.data || response.data.length < 2 || !Array.isArray(response.data[1])) {
      return res.json({});
    }

    const records = response.data[1];
    const formattedData = {};
    
    records.forEach(record => {
      if (record.countryiso3code && record.value !== null) {
        formattedData[record.countryiso3code] = record.value;
      }
    });

    globalDataCache[indicator] = { data: formattedData, timestamp: Date.now() };
    res.json(formattedData);
  } catch (error) {
    console.error(`Error fetching global ${indicator} data:`, error.message);
    res.status(500).json({ error: `Failed to fetch global ${indicator} data` });
  }
});

router.get('/:indicator/:countryCode', async (req, res) => {
  const { indicator, countryCode } = req.params;
  const config = INDICATORS[indicator];

  if (!config) {
    return res.status(400).json({ error: `Unsupported indicator: ${indicator}` });
  }

  const start = req.query.start || config.defaultStart;
  const end = req.query.end || 2023;

  try {
    const url = `http://api.worldbank.org/v2/country/${countryCode}/indicator/${config.id}?date=${start}:${end}&format=json`;
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
    console.error(`Error fetching ${indicator} data:`, error.message);
    res.status(500).json({ error: `Failed to fetch ${indicator} data` });
  }
});

module.exports = router;
