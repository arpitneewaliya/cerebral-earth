import React from 'react';
import { Newspaper, Cpu, Briefcase, HeartPulse, FlaskConical, Trophy, Film } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext.jsx';

const NewsFilter = ({ selectedCategory, onFilterChange }) => {
  const { isDarkMode } = useTheme();

  const categories = [
    { value: 'All', icon: <Newspaper size={13} />, label: 'All Feed' },
    { value: 'Technology', icon: <Cpu size={13} />, label: 'Tech' },
    { value: 'Business', icon: <Briefcase size={13} />, label: 'Business' },
    { value: 'Health', icon: <HeartPulse size={13} />, label: 'Health' },
    { value: 'Science', icon: <FlaskConical size={13} />, label: 'Science' },
    { value: 'Sports', icon: <Trophy size={13} />, label: 'Sports' },
    { value: 'Entertainment', icon: <Film size={13} />, label: 'Culture' },
  ];

  return (
    <div
      className={`px-4 py-3 border-b ${
        isDarkMode ? 'border-zinc-800/80' : 'border-zinc-200'
      }`}
    >
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => onFilterChange(cat.value)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap border cursor-pointer ${
                isSelected
                  ? isDarkMode
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-xs'
                    : 'bg-blue-600 border-blue-600 text-white shadow-xs'
                  : isDarkMode
                  ? 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NewsFilter;
