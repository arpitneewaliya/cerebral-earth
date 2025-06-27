// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import Map from './components/Map';
import NewsContainer from './components/NewsContainer';
import Header from './components/Header';
import CountryInfo from './components/CountryInfo';
import ChartComponent from './components/ChartComponent';
import PopulationChartComponent from './components/PopulationChartComponent';
import FDIChartComponent from './components/FDIChartComponent';
import InflationChartComponent from './components/InflationChartComponent';
import UnemploymentChartComponent from './components/UnemploymentChartComponent';
import LiteracyChartComponent from './components/LiteracyChartComponent';


const App = () => {
  const [region, setRegion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countryCode, setCountryCode] = useState(null); // default


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


  useEffect(() => {
    const getCountryCode = async () => {
      if (region && region.lat && region.lng) {
        try {
          const res = await axios.get(`http://localhost:5000/api/reverse-geocode-country-code?lat=${region.lat}&lon=${region.lng}`);
          setCountryCode(res.data.countryCode);
        } catch (err) {
          console.error('Error fetching country code:', err.message);
        }
      }
    };
    getCountryCode();
  }, [region]);


  const pins = news.map(article => ({
    position: [article.lat, article.lng],
    image: article.urlToImage,
    title: article.title,
    url: article.url,
    category: 'Default'
  }));


  const renderContent = () => {
    if (!region) {
      return <p>Click on a region on the map to get started.</p>;
    }

    if (!selectedOption) {
      return (
        <div className="options-container">
          <button className="option-button" onClick={() => setSelectedOption('news')}>
            📰 Get Latest News about this region
          </button>
          <button className="option-button" onClick={() => setSelectedOption('country')}>
            🌍 Get Country Information
          </button>
          <button className="option-button" onClick={() => setSelectedOption('chart')}>
            📈 Show GDP Chart
          </button>
          <button className="option-button" onClick={() => setSelectedOption('population')}>
            🧑‍🤝‍🧑 Show Population Chart
          </button>
          <button className="option-button" onClick={() => setSelectedOption('fdi')}>
            💸 Show FDI Chart
          </button>
          <button className="option-button" onClick={() => setSelectedOption('inflation')}>
            📊 Show Inflation Chart
          </button>
          <button className="option-button" onClick={() => setSelectedOption('unemployment')}>
            📉 Show Unemployment Chart
          </button>
          <button className="option-button" onClick={() => setSelectedOption('literacy')}>
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
          <ChartComponent countryCode={countryCode} start={1960} end={2023} />
        ) : (
          <p>Loading chart data...</p>
        );
      case 'population':
        return countryCode ? (
          <PopulationChartComponent countryCode={countryCode} start={1960} end={2023} />
        ) : (
          <p>Loading chart data...</p>
        );
      case 'fdi':
        return countryCode ? (
          <FDIChartComponent countryCode={countryCode} start={1960} end={2023} />
        ) : (
          <p>Loading chart data...</p>
        );
      case 'inflation':
        return countryCode ? (
          <InflationChartComponent countryCode={countryCode} start={1960} end={2023} />
        ) : (
          <p>Loading chart data...</p>
        );
      case 'unemployment':
        return countryCode ? (
          <UnemploymentChartComponent countryCode={countryCode} start={1960} end={2023} />
        ) : (
          <p>Loading chart data...</p>
        );
      case 'literacy':
        return countryCode ? (
          <LiteracyChartComponent countryCode={countryCode} start={1980} end={2023} />
        ) : (
          <p>Loading chart data...</p>
        );
      default:
        return null;
    }
  };


  return (
    <div className="App">
      <Header />
      <div style={{ display: 'flex', height: '100%' }}>
        <div className="map-container">
          <Map
            setRegion={(coords) => {
              setRegion(coords);
              setSelectedOption(null);
            }}
            pins={pins}
          />
        </div>
        <div style={{ flex: 1, overflowY: 'scroll', padding: '20px' }} className="right-pane">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};


export default App;
