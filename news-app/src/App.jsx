// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Map from './components/Map.jsx';
import NewsContainer from './components/NewsContainer.jsx';
import CountryInfo from './components/CountryInfo.jsx';
import ChartComponent from './components/ChartComponent.jsx';
import PopulationChartComponent from './components/PopulationChartComponent.jsx';
import FDIChartComponent from './components/FDIChartComponent.jsx';
import InflationChartComponent from './components/InflationChartComponent.jsx';
import UnemploymentChartComponent from './components/UnemploymentChartComponent.jsx';
import LiteracyChartComponent from './components/LiteracyChartComponent.jsx';
import Header from './components/Header.jsx';
import { LoadingSpinner } from './components/LoadingComponents.jsx';
import { useTheme } from './contexts/ThemeContext.jsx';

const App = () => {
  // Use theme from context
  const { isDarkMode, toggleTheme } = useTheme();

  // State to store the selected region coordinates
  const [region, setRegion] = useState(null);

  // State to track which content option (news, charts, etc.) the user selected
  const [selectedOption, setSelectedOption] = useState(null);

  // News data fetched from backend
  const [news, setNews] = useState([]);

  // Loading and error flags for fetching news
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Country code derived from region coordinates (e.g., 'US', 'IN')
  const [countryCode, setCountryCode] = useState(null);

  // Country name derived from region coordinates.
  const [countryName, setCountryName] = useState(null);

  // NEW: controls the visibility of the options panel
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  // Fetch latest news on component mount
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:5000/api/major-news');
        setNews(response.data);
      } catch (err) {
        setError('Error fetching news');
      }
      setLoading(false);
    };
    fetchNews();
  }, []);

  // Fetch country code when a region is selected
  useEffect(() => {
    const getCountryCode = async () => {
      if (region && region.lat && region.lng) {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/reverse-geocode-country-code?lat=${region.lat}&lon=${region.lng}`
          );
          setCountryCode(res.data.countryCode);
        } catch (err) {
          console.error('Error fetching country code:', err.message);
        }
      }
    };
    getCountryCode();
  }, [region]);

  // Fetch country name when a region is selected
  useEffect(() => {
    const getCountryName = async () => {
      if (region && region.lat && region.lng) {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/reverse-geocode-country-name?lat=${region.lat}&lon=${region.lng}`
          );
          setCountryName(res.data.countryName);
        } catch (err) {
          console.error('Error fetching country code:', err.message);
        }
      }
    };
    getCountryName();
  }, [region]);

  // Create map pins for each news article
  const pins = news.map(article => ({
    position: [article.lat, article.lng],
    image: article.urlToImage,
    title: article.title,
    url: article.url,
    category: 'Default'
  }));

  // Renders the right pane content based on user selection
  const renderContent = () => {
    if (!region) {
      return <p>Click on a region on the map to get started.</p>;
    }

    if (!selectedOption) {
      return (
        <div className="space-y-6 p-6">
          {/* Information Section */}
          <div className="space-y-3">
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
              <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                📍 Location Selected
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                {countryName ? `Exploring ${countryName}` : 'Loading location info...'}
              </p>
            </div>
          </div>

          {/* Main Options */}
          <div className="space-y-3">
            <h4 className={`font-semibold text-lg mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              What would you like to explore?
            </h4>
            
            <button 
              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left group hover:scale-[1.02] ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 hover:border-blue-500 hover:bg-gray-750' 
                  : 'bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50'
              }`}
              onClick={() => setSelectedOption('news')}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isDarkMode ? 'bg-red-600' : 'bg-red-500'
                }`}>
                  📰
                </div>
                <div>
                  <h5 className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Latest News
                  </h5>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Get recent news from this region
                  </p>
                </div>
              </div>
            </button>

            <button 
              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left group hover:scale-[1.02] ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 hover:border-green-500 hover:bg-gray-750' 
                  : 'bg-white border-gray-200 hover:border-green-400 hover:bg-green-50'
              }`}
              onClick={() => setSelectedOption('country')}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isDarkMode ? 'bg-green-600' : 'bg-green-500'
                }`}>
                  🌍
                </div>
                <div>
                  <h5 className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Country Information
                  </h5>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Basic facts and statistics
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Charts Section */}
          <div className="space-y-3">
            <h4 className={`font-semibold text-lg mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Economic & Social Data
            </h4>
            
            <div className="grid grid-cols-1 gap-3">
              <button 
                className={`w-full p-3 rounded-lg border transition-all duration-200 text-left hover:scale-[1.01] ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 hover:border-blue-500' 
                    : 'bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-25'
                }`}
                onClick={() => setSelectedOption('chart')}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">📈</span>
                  <div>
                    <h6 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>GDP Trends</h6>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Economic growth over time</p>
                  </div>
                </div>
              </button>
              
              <button 
                className={`w-full p-3 rounded-lg border transition-all duration-200 text-left hover:scale-[1.01] ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 hover:border-purple-500' 
                    : 'bg-white border-gray-200 hover:border-purple-400 hover:bg-purple-25'
                }`}
                onClick={() => setSelectedOption('population')}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">👥</span>
                  <div>
                    <h6 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Population</h6>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Demographic trends</p>
                  </div>
                </div>
              </button>
              
              <button 
                className={`w-full p-3 rounded-lg border transition-all duration-200 text-left hover:scale-[1.01] ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 hover:border-orange-500' 
                    : 'bg-white border-gray-200 hover:border-orange-400 hover:bg-orange-25'
                }`}
                onClick={() => setSelectedOption('fdi')}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">💰</span>
                  <div>
                    <h6 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Foreign Investment</h6>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>FDI trends</p>
                  </div>
                </div>
              </button>
              
              <button 
                className={`w-full p-3 rounded-lg border transition-all duration-200 text-left hover:scale-[1.01] ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 hover:border-red-500' 
                    : 'bg-white border-gray-200 hover:border-red-400 hover:bg-red-25'
                }`}
                onClick={() => setSelectedOption('inflation')}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">📊</span>
                  <div>
                    <h6 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Inflation Rate</h6>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Price stability trends</p>
                  </div>
                </div>
              </button>
              
              <button 
                className={`w-full p-3 rounded-lg border transition-all duration-200 text-left hover:scale-[1.01] ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 hover:border-yellow-500' 
                    : 'bg-white border-gray-200 hover:border-yellow-400 hover:bg-yellow-25'
                }`}
                onClick={() => setSelectedOption('unemployment')}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">📉</span>
                  <div>
                    <h6 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Unemployment</h6>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Labor market trends</p>
                  </div>
                </div>
              </button>
              
              <button 
                className={`w-full p-3 rounded-lg border transition-all duration-200 text-left hover:scale-[1.01] ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 hover:border-indigo-500' 
                    : 'bg-white border-gray-200 hover:border-indigo-400 hover:bg-indigo-25'
                }`}
                onClick={() => setSelectedOption('literacy')}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">📚</span>
                  <div>
                    <h6 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Literacy Rate</h6>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Education indicators</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Scroll hint */}
          <div className={`mt-6 p-4 text-center border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`text-xs flex items-center justify-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <span>Scroll to see all options</span>
              <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      );
    }

    switch (selectedOption) {
      case 'news':
        return <NewsContainer region={region} category="All" isDarkMode={isDarkMode} />;
      case 'country':
        return <CountryInfo region={region} isDarkMode={isDarkMode} />;
      case 'chart':
        return countryCode ? (
          <ChartComponent countryName={countryName} countryCode={countryCode} start={1960} end={2023} isDarkMode={isDarkMode} />
        ) : (
          <div className="flex items-center justify-center p-8">
            <LoadingSpinner size="lg" />
            <span className={`ml-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading chart data...</span>
          </div>
        );
      case 'population':
        return countryCode ? (
          <PopulationChartComponent countryName={countryName} countryCode={countryCode} start={1960} end={2023} isDarkMode={isDarkMode} />
        ) : (
          <div className="flex items-center justify-center p-8">
            <LoadingSpinner size="lg" />
            <span className={`ml-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading chart data...</span>
          </div>
        );
      case 'fdi':
        return countryCode ? (
          <FDIChartComponent countryName={countryName} countryCode={countryCode} start={1960} end={2023} isDarkMode={isDarkMode} />
        ) : (
          <div className="flex items-center justify-center p-8">
            <LoadingSpinner size="lg" />
            <span className={`ml-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading chart data...</span>
          </div>
        );
      case 'inflation':
        return countryCode ? (
          <InflationChartComponent countryName={countryName} countryCode={countryCode} start={1960} end={2023} isDarkMode={isDarkMode} />
        ) : (
          <div className="flex items-center justify-center p-8">
            <LoadingSpinner size="lg" />
            <span className={`ml-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading chart data...</span>
          </div>
        );
      case 'unemployment':
        return countryCode ? (
          <UnemploymentChartComponent countryName={countryName} countryCode={countryCode} start={1960} end={2023} isDarkMode={isDarkMode} />
        ) : (
          <div className="flex items-center justify-center p-8">
            <LoadingSpinner size="lg" />
            <span className={`ml-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading chart data...</span>
          </div>
        );
      case 'literacy':
        return countryCode ? (
          <LiteracyChartComponent countryName={countryName} countryCode={countryCode} start={1980} end={2023} isDarkMode={isDarkMode} />
        ) : (
          <div className="flex items-center justify-center p-8">
            <LoadingSpinner size="lg" />
            <span className={`ml-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading chart data...</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Inline styles for overlay UI
  // converted inline styles to Tailwind utility classes

  return (
    <div className={`flex flex-col h-screen text-center transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Full-screen Map in background */}
      <div className="mt-16 h-full">
        <Map
          setRegion={(coords) => {
            setRegion(coords);
            setSelectedOption(null);   // reset to show options again
            setIsOptionsOpen(true);   // keep panel closed until user clicks the button
          }}
          pins={pins}
        />
      </div>

      {/* Floating action button to open the options panel */}
      {region && !isOptionsOpen && (
        <button
          className={`fixed right-5 bottom-5 z-[1001] w-14 h-14 rounded-full shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 ${
            isDarkMode 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          onClick={() => setIsOptionsOpen(true)}
          aria-label="Open options"
        >
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      )}

      {/* Enhanced slide-over panel with backdrop */}
      {isOptionsOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[1001] transition-opacity"
            onClick={() => setIsOptionsOpen(false)}
          />
          
          {/* Panel */}
          <div className={`fixed top-0 right-0 h-full w-[420px] max-w-[90vw] z-[1002] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            {/* Panel Header */}
            <div className={`flex-shrink-0 p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {countryName ? `Explore ${countryName}` : 'Explore Region'}
                  </h3>
                  {selectedOption && (
                    <button
                      className={`text-sm flex items-center gap-1 mt-1 transition-colors ${
                        isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                      }`}
                      onClick={() => setSelectedOption(null)}
                    >
                      ← Back to options
                    </button>
                  )}
                </div>
                <button
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' 
                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setIsOptionsOpen(false)}
                  aria-label="Close panel"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Panel Content - Scrollable Area */}
            <div className="flex-1 min-h-0 overflow-y-scroll" 
                 style={{
                   scrollbarWidth: 'thin',
                   scrollbarColor: isDarkMode ? '#4B5563 transparent' : '#9CA3AF transparent'
                 }}>
              {renderContent()}
            </div>
          </div>
        </>
      )}

      {/* Initial instruction overlay */}
      {!region && (
        <div className="fixed inset-0 z-[999] pointer-events-none">
          <div className="flex items-center justify-center h-full">
            <div className={`mx-4 px-6 py-4 rounded-xl shadow-lg pointer-events-auto backdrop-blur-sm ${
              isDarkMode ? 'bg-gray-800/90 text-gray-100' : 'bg-white/90 text-gray-900'
            }`}>
              <div className="text-center">
                <div className="text-4xl mb-3">🗺️</div>
                <h2 className="text-xl font-bold mb-2">Welcome to Cerebral Earth</h2>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Click anywhere on the map to explore news and data for that region
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
