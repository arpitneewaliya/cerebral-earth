import React from 'react';

const FloatingActionButton = ({ isVisible, onClick, isDarkMode }) => {
  if (!isVisible) return null;

  return (
    <button
      className={`fixed right-5 bottom-5 z-[1001] w-14 h-14 rounded-full shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 ${
        isDarkMode 
          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      }`}
      onClick={onClick}
      aria-label="Open options"
    >
      <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </button>
  );
};

export default FloatingActionButton;