import React, { useEffect, useState } from 'react';
import { LoadingSpinner, ChartSkeleton, ErrorMessage } from './LoadingComponents.jsx';

const PopulationChartComponent = ({ countryName, countryCode, start = 1960, end = 2023, isDarkMode }) => {
  const [imageBase64, setImageBase64] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchChart = async () => {
    if (!countryCode) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:5000/api/population-chart/${countryCode}?start=${start}&end=${end}`);
      const data = await response.json();

      if (response.ok && data.imageBase64) {
        setImageBase64(data.imageBase64);
      } else {
        setError('Population chart generation failed. Please try again.');
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
          Population Trends
        </h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {countryName} • {start} - {end}
        </p>
      </div>
      
      {imageBase64 ? (
        <div className={`rounded-lg overflow-hidden border ${
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}>
          <img
            src={`data:image/png;base64,${imageBase64}`}
            alt={`Population Chart of ${countryName}`}
            className="w-full h-auto"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Generating chart...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopulationChartComponent;
