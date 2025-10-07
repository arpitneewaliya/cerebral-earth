import React, { useState } from 'react';
import NewsList from './NewsList.jsx';
import NewsFilter from './widgets/NewsFilter.jsx';

const NewsContainer = ({ region, isDarkMode }) => {
  const [category, setCategory] = useState('All');

  const handleFilterChange = (category) => {
    setCategory(category);
  };

  return (
    <div>
      <NewsFilter selectedCategory={category} onFilterChange={handleFilterChange} isDarkMode={isDarkMode} />
      <NewsList region={region} category={category} isDarkMode={isDarkMode} />
    </div>
  );
};

export default NewsContainer;
