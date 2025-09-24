import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
              lat: region.lat,
              lng: region.lng,
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
    <div className="flex flex-wrap gap-5 p-5 justify-center">
      {news.length > 0 ? (
        news.map((article, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden w-[300px] flex flex-col transition-transform duration-200 hover:scale-105">
            <img src={article.urlToImage || 'default.svg'} alt="News" className="w-full h-[180px] object-cover" />
            <div className="p-4 flex flex-col gap-2">
              <h3 className="text-[1.2rem] text-sky-600 m-0">{article.title}</h3>
              <p className="text-sm text-gray-600 m-0">{article.summarizedText || article.description}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-600 hover:underline self-start">Read more</a>
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
