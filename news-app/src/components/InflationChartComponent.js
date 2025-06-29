import React, { useEffect, useState } from 'react';

const InflationChartComponent = ({ countryName, countryCode, start = 2000, end = 2023 }) => {
  const [imageBase64, setImageBase64] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!countryCode) return;

    const fetchChart = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/inflation-chart/${countryCode}?start=${start}&end=${end}`);
        const data = await response.json();

        if (response.ok && data.imageBase64) {
          setImageBase64(data.imageBase64);
          setError(null);
        } else {
          setError('Chart generation failed');
        }
      } catch (err) {
        setError('Failed to fetch chart');
        console.error(err);
      }
    };

    fetchChart();
  }, [countryName, countryCode, start, end]);

  return (
    <div>
      <h2>Inflation (Consumer Price Index - CPI) Chart for {countryName}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {imageBase64 ? (
        <img
          src={`data:image/png;base64,${imageBase64}`}
          alt={`Inflation Chart of ${countryCode}`}
          style={{ width: '100%', maxWidth: '800px' }}
        />
      ) : (
        !error && <p>Loading chart...</p>
      )}
    </div>
  );
};

export default InflationChartComponent;
