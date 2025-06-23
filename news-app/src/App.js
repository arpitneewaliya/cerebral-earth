// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Map from './components/Map';
import NewsContainer from './components/NewsContainer';
import axios from 'axios';
import Header from './components/Header';
import CountryInfo from './components/CountryInfo';

const App = () => {
  const [region, setRegion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const pins = news.map(article => ({
    position: [article.lat, article.lng],
    image: article.urlToImage,
    title: article.title,
    url: article.url,
    category: 'Default'
  }));

  return (
    <div className="App">
      <Header />
      <div style={{ display: 'flex', height: '100%' }}>
        <div className="map-container">
          <Map
            setRegion={(coords) => {
              setRegion(coords);
              setSelectedOption(null); // reset option on new map click
            }}
            pins={pins}
          />
        </div>
        <div style={{ flex: 1, overflowY: 'scroll', padding: '20px' }} className="right-pane">
          {region ? (
            !selectedOption ? (
              <div className="options-container">
                <button className="option-button" onClick={() => setSelectedOption('news')}>
                  📰 Get Latest News about this region
                </button>
                <button className="option-button" onClick={() => setSelectedOption('country')}>
                  🌍 Get Country Information
                </button>
              </div>
            ) : selectedOption === 'news' ? (
              <NewsContainer region={region} category="All" />
            ) : (
              <CountryInfo region={region} />
            )
          ) : (
            <p>Click on a region on the map to get started.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
