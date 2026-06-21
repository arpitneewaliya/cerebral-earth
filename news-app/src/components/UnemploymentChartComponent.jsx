import React, { useEffect, useState } from 'react';
import { LoadingSpinner, ChartSkeleton, ErrorMessage } from './LoadingComponents.jsx';
import InteractiveChart from './InteractiveChart.jsx';

const UnemploymentChartComponent = ({ countryName, countryCode, start = 2000, end = 2023, isDarkMode }) => {
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchChart = async () => {
    if (!countryCode) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:5000/api/unemployment-chart/${countryCode}?start=${start}&end=${end}`);
      const data = await response.json();

      if (response.ok) {
        setChartData(data);
      } else {
        setError('Unemployment chart data retrieval failed. Please try again.');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please check your connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChart();
  }, [countryName, countryCode, start, end]);

  if (loading) {
    return <ChartSkeleton isDarkMode={isDarkMode} />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchChart} isDarkMode={isDarkMode} />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Unemployment Rate Trends
        </h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
          {countryName} • {start} - {end}
        </p>
      </div>
      
      <div className={`p-4 rounded-xl border ${
        isDarkMode ? 'border-zinc-800 bg-zinc-950/40' : 'border-zinc-200 bg-white'
      }`}>
        <InteractiveChart
          data={chartData}
          type="bar"
          name="Unemployment"
          unit="%"
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};

export default UnemploymentChartComponent;
