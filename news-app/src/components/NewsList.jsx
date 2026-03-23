import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Newspaper, ExternalLink } from 'lucide-react';
import { SkeletonList, ErrorMessage } from './LoadingComponents.jsx';

const NewsList = ({ region, category, isDarkMode }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    if (!region) return;

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
      setError('Failed to fetch news. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [region, category]);

  if (loading) {
    return <SkeletonList count={6} isDarkMode={isDarkMode} />;
  }

  if (error) {
    return (
      <div className="p-5">
        <ErrorMessage message={error} onRetry={fetchNews} isDarkMode={isDarkMode} />
      </div>
    );
  }

  return (
    <div className="p-5">
      {news.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {news.map((article, index) => (
            <div
              key={index}
              className={`rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group flex flex-col ${isDarkMode ? 'bg-gray-800/80 backdrop-blur-md shadow-black/50 border border-gray-700/50' : 'bg-white shadow-gray-200/50 border border-gray-100'
                }`}
            >
              <div className="relative overflow-hidden">
                <img
                  src={article.urlToImage || '/src/media/news-default.svg'}
                  alt="News"
                  className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = '/src/media/news-default.svg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="p-4 space-y-3">
                <h3 className={`font-semibold text-lg leading-tight line-clamp-2 transition-colors ${isDarkMode ? 'text-blue-400 group-hover:text-blue-300' : 'text-blue-600 group-hover:text-blue-700'
                  }`}>
                  {article.title}
                </h3>

                <p className={`text-sm leading-relaxed line-clamp-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                  {article.summarizedText || article.description || 'No description available.'}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 text-sm font-medium transition-colors group/link ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                      }`}
                  >
                    Read full article
                    <ExternalLink className="w-4 h-4 transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
                  </a>

                  {article.source?.name && (
                    <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                      {article.source.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 flex flex-col items-center">
          <Newspaper className={`w-16 h-16 mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            No news found
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No news articles available for this region and category.
          </p>
        </div>
      )}
    </div>
  );
};

export default NewsList;
