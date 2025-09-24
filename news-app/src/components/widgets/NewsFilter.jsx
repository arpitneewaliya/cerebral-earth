import React from 'react';

const NewsFilter = ({ selectedCategory, onFilterChange }) => {
  const categories = ['All', 'Technology', 'Business', 'Health', 'Science', 'Sports', 'Entertainment'];

  const handleSelectChange = (e) => {
    onFilterChange(e.target.value);
  };

  return (
    <form className="p-4">
      <select value={selectedCategory} onChange={handleSelectChange} className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
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
