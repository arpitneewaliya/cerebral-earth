import React, { useState, useEffect } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');

const SearchBox = ({ onSelectLocation, isDarkMode }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`);
        setSuggestions(response.data);
      } catch (err) {
        console.error('Error fetching search results:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item) => {
    onSelectLocation({
      lat: item.lat,
      lng: item.lon,
      boundingbox: item.boundingbox,
      display_name: item.display_name
    });
    setQuery(item.display_name);
    setSuggestions([]);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div className="absolute top-4 left-16 z-[1000] w-80 max-w-[calc(100vw-2rem)]">
      {/* Search Input Container */}
      <div className={`relative flex items-center rounded-xl shadow-lg border transition-all duration-200 backdrop-blur-md ${
        isDarkMode 
          ? 'bg-zinc-950/80 border-zinc-800 text-zinc-50' 
          : 'bg-white/90 border-zinc-200 text-zinc-950'
      }`}>
        <Search className={`w-4 h-4 ml-3 flex-shrink-0 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
        <input
          type="text"
          placeholder="Search country, city, region..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full px-3 py-2.5 text-sm bg-transparent outline-none border-none placeholder-zinc-500"
        />
        {loading ? (
          <Loader2 className="w-4 h-4 mr-3 animate-spin text-blue-500 flex-shrink-0" />
        ) : query ? (
          <button onClick={handleClear} className="p-1 mr-2 rounded-md hover:bg-zinc-500/10 flex-shrink-0">
            <X className="w-4 h-4 text-zinc-400 hover:text-zinc-200" />
          </button>
        ) : null}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul className={`mt-2 rounded-xl border shadow-2xl max-h-60 overflow-y-auto backdrop-blur-md py-1.5 transition-all duration-200 ${
          isDarkMode 
            ? 'bg-zinc-950/95 border-zinc-800 text-zinc-50' 
            : 'bg-white/95 border-zinc-200 text-zinc-950'
        }`}>
          {suggestions.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelect(item)}
              className={`px-4 py-2.5 text-sm cursor-pointer text-left transition-colors duration-150 line-clamp-2 ${
                isDarkMode 
                  ? 'hover:bg-zinc-800/80' 
                  : 'hover:bg-zinc-100'
              }`}
            >
              {item.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
