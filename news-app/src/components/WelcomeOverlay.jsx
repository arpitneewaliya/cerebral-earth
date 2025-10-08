import React from 'react';

const WelcomeOverlay = ({ isVisible, isDarkMode }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none">
      <div className="flex items-center justify-center h-full">
        <div className={`mx-4 px-6 py-4 rounded-xl shadow-lg pointer-events-auto backdrop-blur-sm ${
          isDarkMode ? 'bg-gray-800/90 text-gray-100' : 'bg-white/90 text-gray-900'
        }`}>
          <div className="text-center">
            <div className="text-4xl mb-3">🗺️</div>
            <h2 className="text-xl font-bold mb-2">Welcome to Cerebral Earth</h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Click anywhere on the map to explore news and data for that region
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeOverlay;