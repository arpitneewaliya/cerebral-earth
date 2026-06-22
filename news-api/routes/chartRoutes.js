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
