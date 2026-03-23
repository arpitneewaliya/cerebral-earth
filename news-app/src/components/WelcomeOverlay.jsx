import React, { useState } from 'react';

const WelcomeOverlay = ({ isVisible, isDarkMode }) => {
  const [dismissed, setDismissed] = useState(false);

  if (!isVisible || dismissed) return null;

  return (
    <div 
      className="fixed inset-0 z-[2000] cursor-pointer bg-black/5"
      onClick={(e) => {
        e.stopPropagation();
        setDismissed(true);
      }}
    >
      <div className="flex items-center justify-center h-full pointer-events-none">
        <div className={`mx-4 px-6 py-4 rounded-xl shadow-2xl pointer-events-auto backdrop-blur-md transition-all duration-300 ${
          isDarkMode ? 'bg-black/80 text-gray-100 border border-white/10' : 'bg-white/95 text-gray-900 border border-gray-200'
        }`}>
          <div className="text-center">
            <div className="text-4xl mb-3">🗺️</div>
            <h2 className="text-xl font-bold mb-2">Welcome to Cerebral Earth</h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Click anywhere to start exploring the globe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeOverlay;