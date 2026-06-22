import React from 'react';
import { Globe2 } from 'lucide-react';

const FloatingActionButton = ({ isVisible, onClick, isDarkMode }) => {
  if (!isVisible) return null;

  return (
    <button
      className={`fixed right-5 bottom-5 z-[1001] flex items-center gap-2 px-5 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-blue-500/25 font-semibold text-sm tracking-wide ${
        isDarkMode 
          ? 'bg-blue-600 hover:bg-blue-500 text-zinc-100 border border-blue-500/30' 
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      }`}
      onClick={onClick}
      aria-label="Open country information panel"
    >
      <Globe2 className="w-4 h-4 animate-[spin_8s_linear_infinite]" />
      <span>Details</span>
    </button>
  );
};

export default FloatingActionButton;