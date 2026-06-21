const express = require('express');
const { spawn } = require('child_process');
const { getPythonExecutable } = require('../pythonResolver');
const router = express.Router();

router.get('/:countryCode', (req, res) => {
  const { countryCode } = req.params;
  const { start = 2000, end = 2023 } = req.query;

  const pythonExecutable = getPythonExecutable();
  const python = spawn(pythonExecutable, ['generate_unemployment_chart.py', countryCode, start, end]);

  let output = '';
  python.stdout.on('data', data => output += data.toString());
  python.stderr.on('data', err => console.error('Python error:', err.toString()));

  python.on('close', code => {
    if (code === 0) {
      res.json({ imageBase64: output.trim() });
    } else {
      res.status(500).json({ error: 'Unemployment chart generation failed' });
    }
  });
});

module.exports = router;
