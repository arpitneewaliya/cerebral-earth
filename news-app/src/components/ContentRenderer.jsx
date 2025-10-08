import React from 'react';
import NewsContainer from './NewsContainer.jsx';
import CountryInfo from './CountryInfo.jsx';
import ChartComponent from './ChartComponent.jsx';
import PopulationChartComponent from './PopulationChartComponent.jsx';
import FDIChartComponent from './FDIChartComponent.jsx';
import InflationChartComponent from './InflationChartComponent.jsx';
import UnemploymentChartComponent from './UnemploymentChartComponent.jsx';
import LiteracyChartComponent from './LiteracyChartComponent.jsx';
import { LoadingSpinner } from './LoadingComponents.jsx';

const ContentRenderer = ({ 
  selectedOption, 
  region, 
  countryCode, 
  countryName, 
  isDarkMode 
}) => {
  if (!selectedOption) {
    return null;
  }

  const renderLoadingState = () => (
    <div className="flex items-center justify-center p-8">
      <LoadingSpinner size="lg" />
      <span className={`ml-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Loading chart data...
      </span>
    </div>
  );

  const chartProps = {
    countryName,
    countryCode,
    start: 1960,
    end: 2023,
    isDarkMode
  };

  const literacyProps = {
    ...chartProps,
    start: 1980
  };

  switch (selectedOption) {
    case 'news':
      return <NewsContainer region={region} category="All" isDarkMode={isDarkMode} />;
    
    case 'country':
      return <CountryInfo region={region} isDarkMode={isDarkMode} />;
    
    case 'chart':
      return countryCode ? 
        <ChartComponent {...chartProps} /> : 
        renderLoadingState();
    
    case 'population':
      return countryCode ? 
        <PopulationChartComponent {...chartProps} /> : 
        renderLoadingState();
    
    case 'fdi':
      return countryCode ? 
        <FDIChartComponent {...chartProps} /> : 
        renderLoadingState();
    
    case 'inflation':
      return countryCode ? 
        <InflationChartComponent {...chartProps} /> : 
        renderLoadingState();
    
    case 'unemployment':
      return countryCode ? 
        <UnemploymentChartComponent {...chartProps} /> : 
        renderLoadingState();
    
    case 'literacy':
      return countryCode ? 
        <LiteracyChartComponent {...literacyProps} /> : 
        renderLoadingState();
    
    default:
      return null;
  }
};

export default ContentRenderer;