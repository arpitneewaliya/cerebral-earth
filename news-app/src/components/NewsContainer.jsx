import React, { useState } from 'react';
import NewsList from './NewsList.jsx';
import NewsFilter from './widgets/NewsFilter.jsx';

const NewsContainer = ({region}) => {
  const [category, setCategory] = useState('All');

  const handleFilterChange = (category) => {
    setCategory(category);
  };

  return (
    <div>
      <NewsFilter selectedCategory={category} onFilterChange={handleFilterChange} />
      <NewsList region={region} category={category} />
    </div>
  );
};

export default NewsContainer;
