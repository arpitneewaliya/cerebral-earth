import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './NewsList.css';

const NewsList = ({ region, category }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (region) {
      const fetchNews = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get('http://localhost:5000/api/news', {
            params: {
              lat: region[0],
              lng: region[1],
              category: category,
            },
          });
          setNews(response.data);
        } catch (err) {
          setError('Error fetching news');
        }
        setLoading(false);
      };
      fetchNews();
    }
  }, [region, category]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="news-list">
      {news.length > 0 ? (
        news.map((article, index) => (
          <div key={index} className="news-card">
            <img src={article.urlToImage || 'default.svg'} alt="News" className="news-image" />
            <div className="news-content">
              <h3 className="news-title">{article.title}</h3>
              <p className="news-description">{article.summarizedText || article.description}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-link">Read more</a>
            </div>
          </div>
        ))
      ) : (
        <p>No news available for this region.</p>
      )}
    </div>
  );
};

export default NewsList;
