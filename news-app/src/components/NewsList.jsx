import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Newspaper, ExternalLink, Clock } from 'lucide-react';
import { SkeletonList, ErrorMessage } from './LoadingComponents.jsx';
import newsDefault from '../media/news-default.svg';
import { useTheme } from '../contexts/ThemeContext.jsx';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');

const formatRelativeDate = (dateStr) => {
  if (!dateStr) return null;
  try {
    const diffHours = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch (e) {
    return null;
  }
};

const NewsList = ({ region, category }) => {
  const { isDarkMode } = useTheme();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    if (!region) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE}/api/news`, {
        params: {
          lat: region.lat,
          lng: region.lng,
          category: category,
        },
      });
      setNews(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Failed to fetch regional news dispatches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [region, category]);

  if (loading) {
    return <SkeletonList count={5} />;
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorMessage message={error} onRetry={fetchNews} />
      </div>
    );
  }

  return (
    <div className="p-4">
      {news.length > 0 ? (
        <div className="grid grid-cols-1 gap-3.5">
          {news.map((article, index) => {
            const relTime = formatRelativeDate(article.publishedAt);
            return (
              <a
                key={index}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 group flex flex-col border text-left ${
                  isDarkMode
                    ? 'bg-zinc-900/75 border-zinc-800/90 hover:border-cyan-500/40 hover:bg-zinc-900'
                    : 'bg-white border-zinc-200 hover:border-blue-300 shadow-xs hover:shadow-md'
                }`}
              >
                <div className="flex gap-3.5 p-3.5">
                  {/* Thumbnail */}
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-500/20 bg-zinc-900">
                    <img
                      src={article.urlToImage || newsDefault}
                      alt={article.title || 'News'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = newsDefault;
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        {article.source?.name ? (
                          <span
                            className={`text-[10px] font-mono font-bold uppercase tracking-wider truncate px-1.5 py-0.2 rounded ${
                              isDarkMode
                                ? 'bg-cyan-500/15 text-cyan-300'
                                : 'bg-blue-50 text-blue-700'
                            }`}
                          >
                            {article.source.name}
                          </span>
                        ) : (
                          <span />
                        )}
                        {relTime && (
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-mono flex-shrink-0 ${
                              isDarkMode ? 'text-zinc-500' : 'text-zinc-400'
                            }`}
                          >
                            <Clock className="w-2.5 h-2.5" />
                            {relTime}
                          </span>
                        )}
                      </div>

                      <h3
                        className={`font-bold text-xs sm:text-sm leading-snug line-clamp-2 transition-colors ${
                          isDarkMode
                            ? 'text-zinc-100 group-hover:text-cyan-300'
                            : 'text-zinc-900 group-hover:text-blue-600'
                        }`}
                      >
                        {article.title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between pt-2 mt-1">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-mono font-semibold ${
                          isDarkMode ? 'text-cyan-400' : 'text-blue-600'
                        }`}
                      >
                        Read Dispatch
                        <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </div>

                {(article.summarizedText || article.description) && (
                  <div
                    className={`px-3.5 pb-3 pt-0 text-xs leading-relaxed line-clamp-2 ${
                      isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                    }`}
                  >
                    {article.summarizedText || article.description}
                  </div>
                )}
              </a>
            );
          })}
        </div>
      ) : (
        <div
          className={`text-center py-12 rounded-2xl border ${
            isDarkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
          }`}
        >
          <Newspaper className="w-8 h-8 mx-auto mb-2.5 opacity-40 text-cyan-400" />
          <h3 className="text-sm font-bold mb-1">No Active Dispatches</h3>
          <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
            No recent articles found for this sector and category.
          </p>
        </div>
      )}
    </div>
  );
};

export default NewsList;
