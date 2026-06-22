import { useState, useEffect } from 'react';
import axios from 'axios';

export const useRegionData = (region) => {
  const [countryCode, setCountryCode] = useState(null);
  const [alpha3Code, setAlpha3Code] = useState(null);
  const [countryName, setCountryName] = useState(null);

  // Fetch country code when a region is selected
  useEffect(() => {
    const getCountryCode = async () => {
      if (region && region.lat && region.lng) {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/reverse-geocode-country-code?lat=${region.lat}&lon=${region.lng}`
          );
          setCountryCode(res.data.countryCode);
          setAlpha3Code(res.data.alpha3Code);
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
          console.error('Error fetching country name:', err.message);
        }
      }
    };
    getCountryName();
  }, [region]);

  return { countryCode, alpha3Code, countryName };
};

export const useNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return { news, loading, error };
};