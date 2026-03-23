import React from 'react';

const NewsFilter = ({ selectedCategory, onFilterChange, isDarkMode }) => {
  const categories = [
    { value: 'All', icon: '📰', label: 'All News' },
    { value: 'Technology', icon: '💻', label: 'Technology' },
    { value: 'Business', icon: '💼', label: 'Business' },
    { value: 'Health', icon: '🏥', label: 'Health' },
    { value: 'Science', icon: '🔬', label: 'Science' },
    { value: 'Sports', icon: '⚽', label: 'Sports' },
    { value: 'Entertainment', icon: '🎭', label: 'Entertainment' }
  ];

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="mb-3">
        <h4 className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          News Category
        </h4>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Filter news by category
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onFilterChange(cat.value)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
              selectedCategory === cat.value
                ? isDarkMode
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-blue-600 text-white shadow-lg'
                : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="text-xs">{cat.icon}</span>
            <span className="hidden sm:inline">{cat.label}</span>
            <span className="sm:hidden">{cat.value}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NewsFilter;
