import React from 'react';

const NewsFilter = ({ selectedCategory, onFilterChange }) => {
  const categories = ['All', 'Technology', 'Business', 'Health', 'Science', 'Sports', 'Entertainment'];

  const handleSelectChange = (e) => {
    onFilterChange(e.target.value);
  };

  return (
    <form>
      <select value={selectedCategory} onChange={handleSelectChange}>
        {categories.map((cat, index) => (
          <option key={index} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </form>
  );
};

export default NewsFilter;
