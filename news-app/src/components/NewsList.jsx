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
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/news`, {
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
              className={`rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md group flex flex-col border ${isDarkMode ? 'bg-zinc-950 border-zinc-800 shadow-none' : 'bg-white border-zinc-200 shadow-sm'
                }`}
            >
              <div className={`relative overflow-hidden border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
                <img
                  src={article.urlToImage || '/src/media/news-default.svg'}
                  alt="News"
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = '/src/media/news-default.svg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-5 flex-1 flex flex-col gap-3">
                <h3 className={`font-semibold text-base leading-tight line-clamp-2 transition-colors ${isDarkMode ? 'text-zinc-50 group-hover:text-zinc-300' : 'text-zinc-950 group-hover:text-zinc-600'
                  }`}>
                  {article.title}
                </h3>

                <p className={`text-sm leading-relaxed line-clamp-3 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                  }`}>
                  {article.summarizedText || article.description || 'No description available.'}
                </p>

                <div className="flex items-center justify-between pt-2 mt-auto">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors group/link ${isDarkMode ? 'text-zinc-50 hover:text-zinc-300' : 'text-zinc-900 hover:text-zinc-600'
                      }`}
                  >
                    Read article
                    <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </a>

                  {article.source?.name && (
                    <span className={`text-xs px-2 py-0.5 rounded-md font-medium border ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-600'
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
        <div className="text-center py-16 flex flex-col items-center">
          <Newspaper className={`w-12 h-12 mb-4 stroke-1 ${isDarkMode ? 'text-zinc-600' : 'text-zinc-400'}`} />
          <h3 className={`text-base font-semibold tracking-tight mb-1 ${isDarkMode ? 'text-zinc-50' : 'text-zinc-900'}`}>
            No news found
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
            No news articles available for this region and category.
          </p>
        </div>
      )}
    </div>
  );
};

export default NewsList;
