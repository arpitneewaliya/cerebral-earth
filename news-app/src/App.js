// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Map from './components/Map';
import NewsContainer from './components/NewsContainer';
import axios from 'axios';
import Header from './components/Header';

const App = () => {
  const [region, setRegion] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countryDetails, setCountryDetails] = useState(null);

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
    category: 'Default' // Set a default category for display
  }));

  return (
    <div className="App">
      <Header />
      <div style={{ display: 'flex', height: '100%' }}>
        <div className="map-container">
          <Map setRegion={setRegion} pins={pins} setCountryDetails={setCountryDetails} />
        </div>
        <div style={{ flex: 1, overflowY: 'scroll', padding: '20px' }}>
          {countryDetails ? (
            <div className="country-details">
              <h2>Country Details</h2>
              <p><strong>Population:</strong> {countryDetails.population}</p>
              <p><strong>Capital:</strong> {countryDetails.capital}</p>
              <p><strong>GDP:</strong> {countryDetails.gdp}</p>
              <p><strong>Area:</strong> {countryDetails.area} km²</p>
            </div>
          ) : (
            <p>Click on a country to view details.</p>
          )}
          <div className="news-list">
            <NewsContainer region={region} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
