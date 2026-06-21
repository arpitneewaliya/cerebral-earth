import React from 'react';
import { MapPin, Newspaper, Globe, TrendingUp, Users, CircleDollarSign, BarChart3, TrendingDown, BookOpen, ChevronDown } from 'lucide-react';
import { IoNewspaperOutline } from "react-icons/io5";
import { FaGlobeAmericas } from "react-icons/fa";

const RegionOptionsPanel = ({ 
  region, 
  selectedOption, 
  setSelectedOption, 
  countryName, 
  isDarkMode 
}) => {
  if (!region) {
    return <p>Click on a region on the map to get started.</p>;
  }

  if (selectedOption) {
    return null; // Content will be handled by ContentRenderer
  }

  return (
    <div className="space-y-6 p-6">
      {/* Information Section */}
      <div className="space-y-3">
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
          <h4 className={`font-semibold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
            <MapPin className="w-5 h-5" />
            Location Selected
          </h4>
          <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
            {countryName ? `Exploring ${countryName}` : 'Loading location info...'}
          </p>
        </div>
      </div>

      {/* Main Options */}
      <MainOptions 
        setSelectedOption={setSelectedOption} 
        isDarkMode={isDarkMode} 
      />

      {/* Charts Section */}
      <ChartsOptions 
        setSelectedOption={setSelectedOption} 
        isDarkMode={isDarkMode} 
      />

      {/* Scroll hint */}
      <div className={`mt-6 p-4 text-center border-t ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <div className={`text-xs flex items-center justify-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <span>Scroll to see all options</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </div>
    </div>
  );
};

const MainOptions = ({ setSelectedOption, isDarkMode }) => (
  <div className="space-y-3">
    <h4 className={`font-semibold text-lg mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
      What would you like to explore?
    </h4>
    
    <button 
      className={`w-full p-4 rounded-xl border transition-all duration-200 text-left group hover:scale-[1.02] ${
        isDarkMode 
          ? 'bg-white/5 border-white/10 hover:border-red-500/50 hover:bg-white/10' 
          : 'bg-white border-gray-200 hover:border-red-400 hover:bg-red-50/50 shadow-sm'
      }`}
      onClick={() => setSelectedOption('news')}
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
          isDarkMode ? 'bg-gradient-to-br from-red-500 to-red-600 text-white' : 'bg-gradient-to-br from-red-400 to-red-500 text-white'
        }`}>
          <IoNewspaperOutline className="w-5 h-5" />
        </div>
        <div>
          <h5 className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Latest News
          </h5>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Get recent news from this region
          </p>
        </div>
      </div>
    </button>

    <button 
      className={`w-full p-4 rounded-xl border transition-all duration-200 text-left group hover:scale-[1.02] ${
        isDarkMode 
          ? 'bg-white/5 border-white/10 hover:border-green-500/50 hover:bg-white/10' 
          : 'bg-white border-gray-200 hover:border-green-400 hover:bg-green-50/50 shadow-sm'
      }`}
      onClick={() => setSelectedOption('country')}
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
          isDarkMode ? 'bg-gradient-to-br from-green-500 to-green-600 text-white' : 'bg-gradient-to-br from-green-400 to-green-500 text-white'
        }`}>
          <FaGlobeAmericas className="w-5 h-5" />
        </div>
        <div>
          <h5 className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Country Information
          </h5>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Basic facts and statistics
          </p>
        </div>
      </div>
    </button>
  </div>
);

const ChartsOptions = ({ setSelectedOption, isDarkMode }) => {
  const hoverStyles = {
    blue: isDarkMode ? 'hover:border-blue-500/50 hover:bg-white/10' : 'hover:border-blue-400 hover:bg-blue-50/50',
    purple: isDarkMode ? 'hover:border-purple-500/50 hover:bg-white/10' : 'hover:border-purple-400 hover:bg-purple-50/50',
    orange: isDarkMode ? 'hover:border-orange-500/50 hover:bg-white/10' : 'hover:border-orange-400 hover:bg-orange-50/50',
    red: isDarkMode ? 'hover:border-red-500/50 hover:bg-white/10' : 'hover:border-red-400 hover:bg-red-50/50',
    yellow: isDarkMode ? 'hover:border-yellow-500/50 hover:bg-white/10' : 'hover:border-yellow-400 hover:bg-yellow-50/50',
    indigo: isDarkMode ? 'hover:border-indigo-500/50 hover:bg-white/10' : 'hover:border-indigo-400 hover:bg-indigo-50/50',
  };

  const chartOptions = [
    { key: 'chart', icon: <TrendingUp className="w-5 h-5 text-blue-500" />, title: 'GDP Trends', description: 'Economic growth over time', color: 'blue' },
    { key: 'population', icon: <Users className="w-5 h-5 text-purple-500" />, title: 'Population', description: 'Demographic trends', color: 'purple' },
    { key: 'fdi', icon: <CircleDollarSign className="w-5 h-5 text-orange-500" />, title: 'Foreign Investment', description: 'FDI trends', color: 'orange' },
    { key: 'inflation', icon: <BarChart3 className="w-5 h-5 text-red-500" />, title: 'Inflation Rate', description: 'Price stability trends', color: 'red' },
    { key: 'unemployment', icon: <TrendingDown className="w-5 h-5 text-yellow-500" />, title: 'Unemployment', description: 'Labor market trends', color: 'yellow' },
    { key: 'literacy', icon: <BookOpen className="w-5 h-5 text-indigo-500" />, title: 'Literacy Rate', description: 'Education indicators', color: 'indigo' },
  ];

  return (
    <div className="space-y-3">
      <h4 className={`font-semibold text-lg mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        Economic & Social Data
      </h4>
      
      <div className="grid grid-cols-1 gap-3">
        {chartOptions.map((option) => (
          <button 
            key={option.key}
            className={`w-full p-4 rounded-xl border transition-all duration-200 text-left hover:scale-[1.01] ${
              isDarkMode 
                ? 'bg-white/5 border-white/10' 
                : 'bg-white border-gray-200 shadow-sm'
            } ${hoverStyles[option.color] || ''}`}
            onClick={() => setSelectedOption(option.key)}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                {option.icon}
              </div>
              <div>
                <h6 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {option.title}
                </h6>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {option.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RegionOptionsPanel;