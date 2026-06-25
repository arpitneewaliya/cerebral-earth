import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Play, AlertTriangle, Calendar, User } from 'lucide-react';
import { FaYoutube } from 'react-icons/fa';
import { ErrorMessage } from './LoadingComponents.jsx';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');

const VideoNewsList = ({ region, isDarkMode }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeVideoId, setActiveVideoId] = useState(null);

  const fetchVideos = async () => {
    if (!region) return;

    setLoading(true);
    setError(null);
    setActiveVideoId(null);

    try {
      const response = await axios.get(`${API_BASE}/api/news-videos`, {
        params: {
          lat: region.lat,
          lng: region.lng,
        },
      });
      setVideos(response.data);
    } catch (err) {
      console.error('Error in VideoNewsList:', err);
      setError('Failed to load news videos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [region]);

  const getRelativeTime = (dateString) => {
    try {
      const now = new Date();
      const date = new Date(dateString);
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 60) {
        return `${Math.max(1, diffMins)}m ago`;
      } else if (diffHours < 24) {
        return `${diffHours}h ago`;
      } else {
        return `${diffDays}d ago`;
      }
    } catch (e) {
      return 'Recent';
    }
  };

  if (loading) {
    return (
      <div className="p-5 grid grid-cols-1 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={`rounded-xl overflow-hidden border p-4 space-y-4 animate-pulse ${
              isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
            }`}
          >
            <div className={`aspect-video w-full rounded-lg ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`} />
            <div className="space-y-3">
              <div className={`h-4 w-3/4 rounded ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`} />
              <div className={`h-3 w-1/2 rounded ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5">
        <ErrorMessage message={error} onRetry={fetchVideos} isDarkMode={isDarkMode} />
      </div>
    );
  }

  return (
    <div className="p-5">
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {videos.map((video) => {
            const isPlaying = activeVideoId === video.videoId;
            return (
              <div
                key={video.videoId}
                className={`rounded-xl overflow-hidden border transition-all duration-300 flex flex-col ${
                  isDarkMode
                    ? 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 shadow-none'
                    : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Video / Player Container */}
                <div className="relative aspect-video w-full bg-black">
                  {isPlaying ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
                      title={video.title}
                      className="w-full h-full border-none"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      onClick={() => setActiveVideoId(video.videoId)}
                      className="absolute inset-0 w-full h-full group/btn focus:outline-none"
                      aria-label={`Play video: ${video.title}`}
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover transition-opacity duration-300 group-hover/btn:opacity-90"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=640&q=80';
                        }}
                      />
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover/btn:bg-black/35">
                        <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:bg-red-700">
                          <Play className="w-7 h-7 fill-white text-white ml-0.5" />
                        </div>
                      </div>
                      
                      {/* YouTube Brand Tag */}
                      <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded bg-black/80 text-xs font-semibold text-white tracking-wider">
                        <FaYoutube className="w-4 h-4 text-red-500 fill-red-500" />
                        YOUTUBE
                      </span>
                    </button>
                  )}
                </div>

                {/* Video Info Panel */}
                <div className="p-4 flex flex-col gap-2.5">
                  <h4 className={`font-semibold text-sm leading-snug line-clamp-2 ${
                    isDarkMode ? 'text-zinc-50' : 'text-zinc-950'
                  }`}>
                    {video.title}
                  </h4>
                  
                  {video.description && (
                    <p className={`text-xs leading-relaxed line-clamp-2 ${
                      isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                    }`}>
                      {video.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-dashed border-zinc-800/10 dark:border-zinc-800">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                      isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                    }`}>
                      <User className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[150px]">{video.channelTitle}</span>
                    </span>

                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                      isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                    }`}>
                      <Calendar className="w-3.5 h-3.5" />
                      {getRelativeTime(video.publishedAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 flex flex-col items-center">
          <FaYoutube className={`w-12 h-12 mb-4 text-red-600`} />
          <h3 className={`text-base font-semibold tracking-tight mb-1 ${isDarkMode ? 'text-zinc-50' : 'text-zinc-900'}`}>
            No videos found
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
            No news videos found for this region.
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoNewsList;
