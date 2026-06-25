import React, { useState } from 'react';
import NewsList from './NewsList.jsx';
import NewsFilter from './widgets/NewsFilter.jsx';
import VideoNewsList from './VideoNewsList.jsx';
import { Newspaper, PlayCircle } from 'lucide-react';

const NewsContainer = ({ region, isDarkMode }) => {
  const [category, setCategory] = useState('All');
  const [viewMode, setViewMode] = useState('articles'); // 'articles' or 'videos'

  const handleFilterChange = (category) => {
    setCategory(category);
  };

  return (
    <div>
      {/* View Mode Toggle Tabs */}
      <div className="px-5 pt-5 pb-2">
        <div className={`flex p-1 rounded-xl border ${
          isDarkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-100/80 border-zinc-200'
        }`}>
          <button
            onClick={() => setViewMode('articles')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none ${
              viewMode === 'articles'
                ? isDarkMode
                  ? 'bg-zinc-800 text-zinc-50 shadow-md border border-zinc-700/50'
                  : 'bg-white text-zinc-900 shadow-sm border border-zinc-200/50'
                : isDarkMode
                  ? 'text-zinc-400 hover:text-zinc-200'
                  : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            Articles
          </button>
          <button
            onClick={() => setViewMode('videos')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none ${
              viewMode === 'videos'
                ? isDarkMode
                  ? 'bg-zinc-800 text-zinc-50 shadow-md border border-zinc-700/50'
                  : 'bg-white text-zinc-900 shadow-sm border border-zinc-200/50'
                : isDarkMode
                  ? 'text-zinc-400 hover:text-zinc-200'
                  : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            Watch Videos
          </button>
        </div>
      </div>

      {viewMode === 'articles' ? (
        <>
          <NewsFilter selectedCategory={category} onFilterChange={handleFilterChange} isDarkMode={isDarkMode} />
          <NewsList region={region} category={category} isDarkMode={isDarkMode} />
        </>
      ) : (
        <VideoNewsList region={region} isDarkMode={isDarkMode} />
      )}
    </div>
  );
};

export default NewsContainer;
