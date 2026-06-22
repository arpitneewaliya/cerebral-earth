import React from 'react';
import NewsContainer from './NewsContainer.jsx';
import CountryInfo from './CountryInfo.jsx';
import IndicatorChart from './IndicatorChart.jsx';
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

  const baseChartProps = {
    countryName,
    countryCode,
    isDarkMode,
    end: 2023
  };

  switch (selectedOption) {
    case 'news':
      return <NewsContainer region={region} category="All" isDarkMode={isDarkMode} />;
    
    case 'country':
      return <CountryInfo region={region} isDarkMode={isDarkMode} />;
    
    case 'chart':
      return countryCode ? 
        <IndicatorChart {...baseChartProps} indicator="gdp" title="GDP Trends" chartType="area" start={1960} unit="USD" /> : 
        renderLoadingState();
    
    case 'population':
      return countryCode ? 
        <IndicatorChart {...baseChartProps} indicator="population" title="Population" chartType="line" start={1960} /> : 
        renderLoadingState();
    
    case 'fdi':
      return countryCode ? 
        <IndicatorChart {...baseChartProps} indicator="fdi" title="Foreign Direct Investments (FDI)" chartType="line" start={2000} unit="USD" /> : 
        renderLoadingState();
    
    case 'inflation':
      return countryCode ? 
        <IndicatorChart {...baseChartProps} indicator="inflation" title="Inflation Rate" chartType="line" start={2000} unit="%" /> : 
        renderLoadingState();
    
    case 'unemployment':
      return countryCode ? 
        <IndicatorChart {...baseChartProps} indicator="unemployment" title="Unemployment Rate" chartType="line" start={2000} unit="%" /> : 
        renderLoadingState();
    
    case 'literacy':
      return countryCode ? 
        <IndicatorChart {...baseChartProps} indicator="literacy" title="Literacy Rate" chartType="line" start={1980} unit="%" /> : 
        renderLoadingState();
    
    default:
      return null;
  }
};

export default ContentRenderer;