import React from 'react';

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
          <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
            📍 Location Selected
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
      <div className={`mt-6 p-4 text-center border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className={`text-xs flex items-center justify-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <span>Scroll to see all options</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
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
      className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left group hover:scale-[1.02] ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700 hover:border-blue-500 hover:bg-gray-750' 
          : 'bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50'
      }`}
      onClick={() => setSelectedOption('news')}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          isDarkMode ? 'bg-red-600' : 'bg-red-500'
        }`}>
          📰
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
      className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left group hover:scale-[1.02] ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700 hover:border-green-500 hover:bg-gray-750' 
          : 'bg-white border-gray-200 hover:border-green-400 hover:bg-green-50'
      }`}
      onClick={() => setSelectedOption('country')}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          isDarkMode ? 'bg-green-600' : 'bg-green-500'
        }`}>
          🌍
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
  const chartOptions = [
    { key: 'chart', icon: '📈', title: 'GDP Trends', description: 'Economic growth over time', color: 'blue' },
    { key: 'population', icon: '👥', title: 'Population', description: 'Demographic trends', color: 'purple' },
    { key: 'fdi', icon: '💰', title: 'Foreign Investment', description: 'FDI trends', color: 'orange' },
    { key: 'inflation', icon: '📊', title: 'Inflation Rate', description: 'Price stability trends', color: 'red' },
    { key: 'unemployment', icon: '📉', title: 'Unemployment', description: 'Labor market trends', color: 'yellow' },
    { key: 'literacy', icon: '📚', title: 'Literacy Rate', description: 'Education indicators', color: 'indigo' },
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
            className={`w-full p-3 rounded-lg border transition-all duration-200 text-left hover:scale-[1.01] ${
              isDarkMode 
                ? `bg-gray-800 border-gray-700 hover:border-${option.color}-500` 
                : `bg-white border-gray-200 hover:border-${option.color}-400 hover:bg-${option.color}-25`
            }`}
            onClick={() => setSelectedOption(option.key)}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{option.icon}</span>
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