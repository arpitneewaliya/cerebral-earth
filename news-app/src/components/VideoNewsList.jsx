import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Play, AlertTriangle, Calendar, User } from 'lucide-react';
import { FaYoutube } from 'react-icons/fa';
import { ErrorMessage } from './LoadingComponents.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');

const VideoNewsList = ({ region }) => {
  const { isDarkMode } = useTheme();
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
      setVideos(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error in VideoNewsList:', err);
      setError('Failed to load broadcast video feeds. Please try again.');
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
      <div className="p-4 grid grid-cols-1 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className={`rounded-2xl overflow-hidden border p-3.5 space-y-3 animate-pulse ${
              isDarkMode ? 'bg-zinc-900/70 border-zinc-800' : 'bg-white border-zinc-200'
            }`}
          >
            <div
              className={`aspect-video w-full rounded-xl ${
                isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'
              }`}
            />
            <div className="space-y-2">
              <div
                className={`h-3.5 w-3/4 rounded ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}
              />
              <div
                className={`h-3 w-1/2 rounded ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorMessage message={error} onRetry={fetchVideos} />
      </div>
    );
  }

  return (
    <div className="p-4">
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {videos.map((video) => {
            const isPlaying = activeVideoId === video.videoId;
            return (
              <div
                key={video.videoId}
                className={`rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col text-left ${
                  isDarkMode
                    ? 'bg-zinc-900/80 border-zinc-800 hover:border-cyan-500/40'
                    : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-xs hover:shadow-md'
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
                      className="absolute inset-0 w-full h-full group/btn focus:outline-none cursor-pointer"
                      aria-label={`Play video: ${video.title}`}
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover transition-opacity duration-300 group-hover/btn:opacity-90"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=640&q=80';
                        }}
                      />
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover/btn:bg-black/45">
                        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:bg-red-500">
                          <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                        </div>
                      </div>

                      {/* YouTube Brand Tag */}
                      <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold text-white tracking-wider">
                        <FaYoutube className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                        BROADCAST
                      </span>
                    </button>
                  )}
                </div>

                {/* Video Info Panel */}
                <div className="p-3.5 flex flex-col gap-2">
                  <h4
                    className={`font-bold text-xs sm:text-sm leading-snug line-clamp-2 ${
                      isDarkMode ? 'text-zinc-100' : 'text-zinc-950'
                    }`}
                  >
                    {video.title}
                  </h4>

                  {video.description && (
                    <p
                      className={`text-xs leading-relaxed line-clamp-2 ${
                        isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                      }`}
                    >
                      {video.description}
                    </p>
                  )}

                  {/* Channel & Time Meta */}
                  <div
                    className={`flex items-center justify-between pt-2 mt-auto border-t text-[11px] font-mono ${
                      isDarkMode
                        ? 'border-zinc-800 text-zinc-400'
                        : 'border-zinc-100 text-zinc-500'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5 font-semibold truncate max-w-[65%]">
                      <User className="w-3 h-3 shrink-0 text-cyan-400" />
                      <span className="truncate">{video.channelTitle}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 shrink-0">
                      <Calendar className="w-3 h-3" />
                      {getRelativeTime(video.publishedAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className={`text-center py-12 rounded-2xl border ${
            isDarkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
          }`}
        >
          <AlertTriangle className="w-8 h-8 mx-auto mb-2.5 opacity-40 text-amber-400" />
          <h3 className="text-sm font-bold mb-1">No Video Broadcasts</h3>
          <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
            No regional broadcast streams found for this sector.
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoNewsList;
