import React, { useState } from 'react';
import NewsList from './NewsList.jsx';
import NewsFilter from './widgets/NewsFilter.jsx';
import VideoNewsList from './VideoNewsList.jsx';
import { Newspaper, PlayCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext.jsx';

const NewsContainer = ({ region }) => {
  const { isDarkMode } = useTheme();
  const [category, setCategory] = useState('All');
  const [viewMode, setViewMode] = useState('articles'); // 'articles' or 'videos'

  const handleFilterChange = (cat) => {
    setCategory(cat);
  };

  return (
    <div>
      {/* View Mode Toggle Tabs */}
      <div className="px-5 pt-5 pb-2">
        <div
          className={`flex p-1.5 rounded-xl border ${
            isDarkMode
              ? 'bg-zinc-900/80 border-zinc-800'
              : 'bg-zinc-100/90 border-zinc-200'
          }`}
        >
          <button
            onClick={() => setViewMode('articles')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all focus:outline-none cursor-pointer ${
              viewMode === 'articles'
                ? isDarkMode
                  ? 'bg-zinc-800 text-cyan-300 border border-cyan-500/30 shadow-xs'
                  : 'bg-white text-zinc-900 shadow-xs border border-zinc-200/70'
                : isDarkMode
                ? 'text-zinc-400 hover:text-zinc-200'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>Dispatches &amp; Articles</span>
          </button>
          <button
            onClick={() => setViewMode('videos')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all focus:outline-none cursor-pointer ${
              viewMode === 'videos'
                ? isDarkMode
                  ? 'bg-zinc-800 text-cyan-300 border border-cyan-500/30 shadow-xs'
                  : 'bg-white text-zinc-900 shadow-xs border border-zinc-200/70'
                : isDarkMode
                ? 'text-zinc-400 hover:text-zinc-200'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            <span>Broadcast Feeds</span>
          </button>
        </div>
      </div>

      {viewMode === 'articles' ? (
        <>
          <NewsFilter selectedCategory={category} onFilterChange={handleFilterChange} />
          <NewsList region={region} category={category} />
        </>
      ) : (
        <VideoNewsList region={region} />
      )}
    </div>
  );
};

export default NewsContainer;
