import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, X, MapPin } from 'lucide-react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext.jsx';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');

const SearchBox = ({ onSelectLocation, embedded = false }) => {
  const { isDarkMode } = useTheme();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Focus search input when pressing '/' outside of an input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`);
        setSuggestions(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching search results:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item) => {
    onSelectLocation({
      lat: Number(item.lat),
      lng: Number(item.lon),
      boundingbox: item.boundingbox,
      display_name: item.display_name,
    });
    setQuery(item.display_name);
    setSuggestions([]);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className={
        embedded
          ? 'relative w-full sm:w-64 md:w-72 lg:w-80'
          : 'absolute top-4 left-16 z-[1000] w-80 max-w-[calc(100vw-5rem)]'
      }
    >
      {/* Search Input Container */}
      <div
        className={`relative flex items-center rounded-xl border transition-all duration-200 ${
          isDarkMode
            ? 'bg-zinc-900/90 border-zinc-800 text-zinc-100 focus-within:border-cyan-500/60 focus-within:ring-1 focus-within:ring-cyan-500/30'
            : 'bg-zinc-100/90 border-zinc-200/80 text-zinc-900 focus-within:border-blue-500/60 focus-within:bg-white'
        }`}
      >
        <Search
          className={`w-3.5 h-3.5 ml-3 flex-shrink-0 ${
            isDarkMode ? 'text-cyan-400/80' : 'text-zinc-500'
          }`}
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Locate sector, city, country..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className={`w-full px-2.5 py-1.5 text-xs font-medium bg-transparent outline-none border-none ${
            isDarkMode ? 'placeholder-zinc-500 text-zinc-100' : 'placeholder-zinc-400 text-zinc-900'
          }`}
        />
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 mr-2.5 animate-spin text-cyan-400 flex-shrink-0" />
        ) : query ? (
          <button
            onClick={handleClear}
            className={`p-1 mr-1.5 rounded-md flex-shrink-0 transition-colors ${
              isDarkMode ? 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200' : 'hover:bg-zinc-200 text-zinc-500'
            }`}
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd
            className={`hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 mr-2 text-[10px] font-mono rounded border ${
              isDarkMode
                ? 'bg-zinc-950/80 border-zinc-800 text-zinc-500'
                : 'bg-white border-zinc-200 text-zinc-400'
            }`}
          >
            /
          </kbd>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul
          className={`absolute left-0 right-0 mt-2 rounded-xl border shadow-2xl max-h-64 overflow-y-auto backdrop-blur-xl py-1.5 z-[1100] transition-all duration-200 ${
            isDarkMode
              ? 'bg-zinc-950/95 border-zinc-800 text-zinc-100 shadow-black/80'
              : 'bg-white/95 border-zinc-200 text-zinc-900'
          }`}
        >
          {suggestions.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelect(item)}
              className={`px-3.5 py-2.5 text-xs cursor-pointer text-left transition-colors duration-150 flex items-start justify-between gap-2 border-b last:border-b-0 ${
                isDarkMode
                  ? 'border-zinc-900 hover:bg-cyan-500/10'
                  : 'border-zinc-100 hover:bg-zinc-100'
              }`}
            >
              <div className="flex items-start gap-2 min-w-0">
                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-cyan-400" />
                <span className="line-clamp-2 font-medium leading-snug">{item.display_name}</span>
              </div>
              {item.lat && item.lon && (
                <span
                  className={`text-[10px] font-mono flex-shrink-0 px-1.5 py-0.5 rounded ${
                    isDarkMode ? 'bg-zinc-900 text-zinc-400' : 'bg-zinc-100 text-zinc-500'
                  }`}
                >
                  {Number(item.lat).toFixed(1)}°, {Number(item.lon).toFixed(1)}°
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
