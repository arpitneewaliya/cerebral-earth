import React, { useState } from 'react';
import Map from './components/Map.jsx';
import Header from './components/Header.jsx';
import SlideOverPanel from './components/SlideOverPanel.jsx';
import FloatingActionButton from './components/FloatingActionButton.jsx';
import WelcomeOverlay from './components/WelcomeOverlay.jsx';
import ConflictPanel from './components/ConflictPanel.jsx';
import { useTheme } from './contexts/ThemeContext.jsx';
import { useRegionData, useNews } from './hooks/useRegionData.js';
import { useAppState } from './hooks/useAppState.js';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');

const App = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [showLayersControl, setShowLayersControl] = useState(false);
  const [showConflictsPanel, setShowConflictsPanel] = useState(false);
  const [conflicts, setConflicts] = useState([]);
  const [conflictsLoading, setConflictsLoading] = useState(false);
  const [selectedConflict, setSelectedConflict] = useState(null);

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

  const fetchConflicts = async () => {
    setConflictsLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/conflicts`);
      if (response.data && Array.isArray(response.data.conflicts)) {
        setConflicts(response.data.conflicts);
      }
    } catch (error) {
      console.error("Error fetching conflicts:", error);
    } finally {
      setConflictsLoading(false);
    }
  };

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
      <Header 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        onActivateLayers={() => {
          setShowLayersControl(true);
          setShowConflictsPanel(false);
        }}
        onActivateConflicts={() => {
          setShowConflictsPanel(true);
          setShowLayersControl(false);
          fetchConflicts();
        }}
      />

      <div className="h-full">
        <Map
          region={region}
          setRegion={handleRegionSelect}
          pins={pins}
          isDarkMode={isDarkMode}
          selectedCountryId={alpha3Code}
          showLayersControl={showLayersControl}
          setShowLayersControl={setShowLayersControl}
          conflicts={conflicts}
          showConflicts={showConflictsPanel}
          selectedConflict={selectedConflict}
          onSelectConflict={setSelectedConflict}
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

      <ConflictPanel
        isOpen={showConflictsPanel}
        onClose={() => setShowConflictsPanel(false)}
        conflicts={conflicts}
        loading={conflictsLoading}
        selectedConflict={selectedConflict}
        onSelectConflict={setSelectedConflict}
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
