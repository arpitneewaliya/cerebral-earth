import React from 'react';
import Map from './components/Map.jsx';
import Header from './components/Header.jsx';
import SlideOverPanel from './components/SlideOverPanel.jsx';
import FloatingActionButton from './components/FloatingActionButton.jsx';
import WelcomeOverlay from './components/WelcomeOverlay.jsx';
import { useTheme } from './contexts/ThemeContext.jsx';
import { useRegionData, useNews } from './hooks/useRegionData.js';
import { useAppState } from './hooks/useAppState.js';

const App = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  const {
    region,
    selectedOption,
    isOptionsOpen,
    setIsOptionsOpen,
    setSelectedOption,
    handleRegionSelect
  } = useAppState();

  const { news } = useNews();
  const { countryCode, alpha3Code, countryName } = useRegionData(region);

  const pins = news
    .filter(article => typeof article.lat === 'number' && typeof article.lng === 'number' && !isNaN(article.lat) && !isNaN(article.lng))
    .map(article => ({
      position: [article.lat, article.lng],
      image: article.urlToImage,
      title: article.title,
      url: article.url,
      category: 'Default'
    }));

  return (
    <div className={`flex flex-col h-screen text-center transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <div className="h-full">
        <Map
          region={region}
          setRegion={handleRegionSelect}
          pins={pins}
          isDarkMode={isDarkMode}
          selectedCountryId={alpha3Code}
        />
      </div>

      <FloatingActionButton 
        isVisible={region && !isOptionsOpen}
        onClick={() => setIsOptionsOpen(true)}
        isDarkMode={isDarkMode}
      />

      <SlideOverPanel
        isOpen={isOptionsOpen}
        onClose={() => setIsOptionsOpen(false)}
        region={region}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        countryCode={countryCode}
        countryName={countryName}
        isDarkMode={isDarkMode}
      />

      <WelcomeOverlay 
        isVisible={!region}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default App;
