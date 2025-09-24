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

const App = () => {
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
        <div className="flex flex-col gap-5 items-center p-8">
          <button className="w-[90%] max-w-[400px] px-8 py-5 text-[1.1rem] font-semibold text-white bg-gradient-to-br from-[#1e3c72] to-[#2a5298] rounded-xl shadow-lg cursor-pointer transition hover:from-[#2a5298] hover:to-[#1e3c72] hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2" onClick={() => setSelectedOption('news')}>
            📰 Get Latest News about this region
          </button>
          <button className="w-[90%] max-w-[400px] px-8 py-5 text-[1.1rem] font-semibold text-white bg-gradient-to-br from-[#1e3c72] to-[#2a5298] rounded-xl shadow-lg cursor-pointer transition hover:from-[#2a5298] hover:to-[#1e3c72] hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2" onClick={() => setSelectedOption('country')}>
            🌍 Get Country Information
          </button>
          <button className="w-[90%] max-w-[400px] px-8 py-5 text-[1.1rem] font-semibold text-white bg-gradient-to-br from-[#1e3c72] to-[#2a5298] rounded-xl shadow-lg cursor-pointer transition hover:from-[#2a5298] hover:to-[#1e3c72] hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2" onClick={() => setSelectedOption('chart')}>
            📈 Show GDP Chart
          </button>
          <button className="w-[90%] max-w-[400px] px-8 py-5 text-[1.1rem] font-semibold text-white bg-gradient-to-br from-[#1e3c72] to-[#2a5298] rounded-xl shadow-lg cursor-pointer transition hover:from-[#2a5298] hover:to-[#1e3c72] hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2" onClick={() => setSelectedOption('population')}>
            🧑‍🤝‍🧑 Show Population Chart
          </button>
          <button className="w-[90%] max-w-[400px] px-8 py-5 text-[1.1rem] font-semibold text-white bg-gradient-to-br from-[#1e3c72] to-[#2a5298] rounded-xl shadow-lg cursor-pointer transition hover:from-[#2a5298] hover:to-[#1e3c72] hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2" onClick={() => setSelectedOption('fdi')}>
            💸 Show FDI Chart
          </button>
          <button className="w-[90%] max-w-[400px] px-8 py-5 text-[1.1rem] font-semibold text-white bg-gradient-to-br from-[#1e3c72] to-[#2a5298] rounded-xl shadow-lg cursor-pointer transition hover:from-[#2a5298] hover:to-[#1e3c72] hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2" onClick={() => setSelectedOption('inflation')}>
            📊 Show Inflation Chart
          </button>
          <button className="w-[90%] max-w-[400px] px-8 py-5 text-[1.1rem] font-semibold text-white bg-gradient-to-br from-[#1e3c72] to-[#2a5298] rounded-xl shadow-lg cursor-pointer transition hover:from-[#2a5298] hover:to-[#1e3c72] hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2" onClick={() => setSelectedOption('unemployment')}>
            📉 Show Unemployment Chart
          </button>
          <button className="w-[90%] max-w-[400px] px-8 py-5 text-[1.1rem] font-semibold text-white bg-gradient-to-br from-[#1e3c72] to-[#2a5298] rounded-xl shadow-lg cursor-pointer transition hover:from-[#2a5298] hover:to-[#1e3c72] hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2" onClick={() => setSelectedOption('literacy')}>
            📚 Show Literacy Rate Chart
          </button>
        </div>
      );
    }

    switch (selectedOption) {
      case 'news':
        return <NewsContainer region={region} category="All" />;
      case 'country':
        return <CountryInfo region={region} />;
      case 'chart':
        return countryCode ? (
          <ChartComponent countryName={countryName} countryCode={countryCode} start={1960} end={2023} />
        ) : (
          <p>Loading chart data...</p>
        );
      case 'population':
        return countryCode ? (
          <PopulationChartComponent countryName={countryName} countryCode={countryCode} start={1960} end={2023} />
        ) : (
          <p>Loading chart data...</p>
        );
      case 'fdi':
        return countryCode ? (
          <FDIChartComponent countryName={countryName} countryCode={countryCode} start={1960} end={2023} />
        ) : (
          <p>Loading chart data...</p>
        );
      case 'inflation':
        return countryCode ? (
          <InflationChartComponent countryName={countryName} countryCode={countryCode} start={1960} end={2023} />
        ) : (
          <p>Loading chart data...</p>
        );
      case 'unemployment':
        return countryCode ? (
          <UnemploymentChartComponent countryName={countryName} countryCode={countryCode} start={1960} end={2023} />
        ) : (
          <p>Loading chart data...</p>
        );
      case 'literacy':
        return countryCode ? (
          <LiteracyChartComponent countryName={countryName} countryCode={countryCode} start={1980} end={2023} />
        ) : (
          <p>Loading chart data...</p>
        );
      default:
        return null;
    }
  };

  // Inline styles for overlay UI
  // converted inline styles to Tailwind utility classes

  return (
  <div className="flex flex-col h-screen text-center">
      

      {/* Full-screen Map in background */}
      <Map
        setRegion={(coords) => {
          setRegion(coords);
          setSelectedOption(null);   // reset to show options again
          setIsOptionsOpen(false);   // keep panel closed until user clicks the button
        }}
        pins={pins}
      />

      {/* Floating button to open the options panel (only after a region is selected) */}
      {region && !isOptionsOpen && (
        <button
          className="fixed right-5 bottom-5 z-[1001] px-4 py-3 rounded-full border-0 bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition"
          onClick={() => setIsOptionsOpen(true)}
        >
          Show Options
        </button>
      )}

      {/* Slide-over options/content panel */}
      {isOptionsOpen && (
        <div className="fixed top-5 right-5 bottom-5 w-[420px] max-w-[90vw] bg-white rounded-xl p-4 overflow-y-auto z-[1002] shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="m-0 text-lg font-semibold">{countryName ? `Explore ${countryName}` : 'Explore region'}</h3>
            <button
              className="bg-transparent border border-gray-200 rounded-md px-2 py-1 cursor-pointer hover:bg-gray-50"
              onClick={() => setIsOptionsOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div>
            {renderContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
