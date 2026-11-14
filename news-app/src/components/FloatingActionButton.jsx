import React from 'react';
import { Globe2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext.jsx';

const FloatingActionButton = ({ isVisible, onClick, countryName }) => {
  const { isDarkMode } = useTheme();
  if (!isVisible) return null;

  return (
    <button
      className={`fixed right-4 bottom-16 z-[1001] flex items-center gap-2 px-4 py-2.5 rounded-2xl border shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 font-mono font-bold text-xs uppercase tracking-wider cursor-pointer backdrop-blur-xl ${
        isDarkMode
          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30 shadow-cyan-500/15'
          : 'bg-blue-600 border-blue-500 text-white hover:bg-blue-700'
      }`}
      onClick={onClick}
      aria-label="Open country intelligence dossier"
    >
      <Globe2 className="w-4 h-4 animate-[spin_10s_linear_infinite]" />
      <span>{countryName ? `${countryName} Dossier` : 'Open Dossier'}</span>
    </button>
  );
};

export default FloatingActionButton;
