import React, { useState, useEffect, useCallback } from 'react';
import Map from './components/Map.jsx';
import Header from './components/Header.jsx';
import SlideOverPanel from './components/SlideOverPanel.jsx';
import FloatingActionButton from './components/FloatingActionButton.jsx';
import ConflictPanel from './components/ConflictPanel.jsx';
import TelemetryBar from './components/TelemetryBar.jsx';
import { useRegionData, useNews } from './hooks/useRegionData.js';
import { useAppState } from './hooks/useAppState.js';
import { useTheme } from './contexts/ThemeContext.jsx';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');

const FALLBACK_CONFLICTS = [
  {
    id: 'fallback-1',
    lat: 48.3794,
    lng: 31.1656,
    name: 'Eastern Ukraine Sector',
    pubDate: new Date().toISOString(),
    tone: -8.2,
    url: 'https://www.reuters.com/world/europe/',
    category: 'ARMED_CONFLICT',
    themes: 'ARMEDCONFLICT;WAR;MILITARY;ARTILLERY;',
  },
  {
    id: 'fallback-2',
    lat: 31.3547,
    lng: 34.3088,
    name: 'Gaza / Levant Theater',
    pubDate: new Date().toISOString(),
    tone: -9.1,
    url: 'https://www.bbc.com/news/world/middle_east',
    category: 'ARMED_CONFLICT',
    themes: 'ARMEDCONFLICT;AIRSTRIKE;SECURITY;',
  },
  {
    id: 'fallback-3',
    lat: 15.3694,
    lng: 44.191,
    name: 'Sanaa / Red Sea Corridor, Yemen',
    pubDate: new Date().toISOString(),
    tone: -6.5,
    url: 'https://apnews.com/hub/yemen',
    category: 'ARMED_CONFLICT',
    themes: 'MARITIME;MILITARY;ARMEDCONFLICT;',
  },
  {
    id: 'fallback-4',
    lat: 15.5007,
    lng: 32.5599,
    name: 'Khartoum, Sudan',
    pubDate: new Date().toISOString(),
    tone: -7.8,
    url: 'https://www.aljazeera.com/where/sudan/',
    category: 'ARMED_CONFLICT',
    themes: 'CIVIL_WAR;ARMEDCONFLICT;HUMANITARIAN;',
  },
  {
    id: 'fallback-5',
    lat: 23.6978,
    lng: 120.9605,
    name: 'Taiwan Strait Maritime Zone',
    pubDate: new Date().toISOString(),
    tone: -4.6,
    url: 'https://www.reuters.com/world/asia-pacific/',
    category: 'GEOPOLITICAL_TENSION',
    themes: 'MILITARY;NAVAL_PATROL;SOVEREIGNTY;',
  },
  {
    id: 'fallback-6',
    lat: 30.0444,
    lng: 31.2357,
    name: 'Cairo, Egypt',
    pubDate: new Date().toISOString(),
    tone: -2.9,
    url: 'https://www.aljazeera.com/',
    category: 'CIVIL_UNREST',
    themes: 'PROTEST;DEMONSTRATION;ECONOMIC;',
  },
];

const App = () => {
  const { isDarkMode } = useTheme();
  const [basemap, setBasemap] = useState(isDarkMode ? 'dark' : 'light');
  const [selectedLayer, setSelectedLayer] = useState('none');
  const [showLayersControl, setShowLayersControl] = useState(false);
  const [showConflictsPanel, setShowConflictsPanel] = useState(false);
  const [showConflictPins, setShowConflictPins] = useState(true);
  const [showNewsPins, setShowNewsPins] = useState(true);
  const [conflicts, setConflicts] = useState([]);
  const [conflictsLoading, setConflictsLoading] = useState(false);
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [cursorCoords, setCursorCoords] = useState({ lat: 25.0, lng: 18.0, zoom: 2.5 });

  const {
    region,
    selectedOption,
    isOptionsOpen,
    setIsOptionsOpen,
    setSelectedOption,
    handleRegionSelect,
  } = useAppState();

  const { news } = useNews();
  const { countryCode, alpha3Code, countryName } = useRegionData(region);

  // Sync basemap between dark and light when UI theme toggles (unless user is viewing satellite)
  useEffect(() => {
    setBasemap((prev) => {
      if (prev === 'satellite') return 'satellite';
      return isDarkMode ? 'dark' : 'light';
    });
  }, [isDarkMode]);

  const fetchConflicts = useCallback(async () => {
    setConflictsLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/conflicts`);
      if (response.data && Array.isArray(response.data.conflicts) && response.data.conflicts.length > 0) {
        setConflicts(response.data.conflicts);
      } else {
        setConflicts(FALLBACK_CONFLICTS);
      }
    } catch (error) {
      console.error('Error fetching conflicts, using fallback telemetry:', error);
      setConflicts((prev) => (prev.length > 0 ? prev : FALLBACK_CONFLICTS));
    } finally {
      setConflictsLoading(false);
    }
  }, []);

  // Preload conflicts on startup so hotspots and live ticker populate immediately
  useEffect(() => {
    fetchConflicts();
  }, [fetchConflicts]);

  const pins = news
    .filter(
      (article) =>
        typeof article.lat === 'number' &&
        typeof article.lng === 'number' &&
        !isNaN(article.lat) &&
        !isNaN(article.lng)
    )
    .map((article) => ({
      position: [article.lat, article.lng],
      image: article.urlToImage,
      title: article.title,
      url: article.url,
      source: article.source?.name,
      category: 'Headline',
    }));

  const handleSelectConflictFromTicker = (conflict) => {
    setShowConflictPins(true);
    setSelectedConflict(conflict);
  };

  return (
    <div
      className={`flex flex-col h-screen text-center transition-colors duration-200 ${
        isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'
      }`}
    >
      <Header
        onSelectLocation={handleRegionSelect}
        onActivateLayers={() => {
          setShowLayersControl((prev) => !prev);
          setShowConflictsPanel(false);
        }}
        showLayersControl={showLayersControl}
        activeLayer={selectedLayer}
        onActivateConflicts={() => {
          setShowConflictsPanel((prev) => {
            const next = !prev;
            if (next) {
              setShowLayersControl(false);
              setShowConflictPins(true);
              if (conflicts.length === 0) fetchConflicts();
            }
            return next;
          });
        }}
        showConflictsPanel={showConflictsPanel}
        conflictsCount={conflicts.length}
        showConflictPins={showConflictPins}
        onToggleConflictPins={() => setShowConflictPins((prev) => !prev)}
        showNewsPins={showNewsPins}
        onToggleNewsPins={() => setShowNewsPins((prev) => !prev)}
        basemap={basemap}
        onChangeBasemap={setBasemap}
      />

      <div className="h-full">
        <Map
          region={region}
          setRegion={handleRegionSelect}
          pins={pins}
          showNewsPins={showNewsPins}
          selectedCountryId={alpha3Code}
          showLayersControl={showLayersControl}
          setShowLayersControl={setShowLayersControl}
          selectedLayer={selectedLayer}
          setSelectedLayer={setSelectedLayer}
          conflicts={conflicts}
          showConflicts={showConflictPins || showConflictsPanel}
          selectedConflict={selectedConflict}
          onSelectConflict={setSelectedConflict}
          basemap={basemap}
          onCursorMove={setCursorCoords}
        />
      </div>

      <FloatingActionButton
        isVisible={Boolean(region && !isOptionsOpen)}
        countryName={countryName}
        onClick={() => setIsOptionsOpen(true)}
      />

      <SlideOverPanel
        isOpen={isOptionsOpen}
        onClose={() => setIsOptionsOpen(false)}
        region={region}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        countryCode={countryCode}
        alpha3Code={alpha3Code}
        countryName={countryName}
      />

      <ConflictPanel
        isOpen={showConflictsPanel}
        onClose={() => {
          setShowConflictsPanel(false);
          setSelectedConflict(null);
        }}
        conflicts={conflicts}
        loading={conflictsLoading}
        selectedConflict={selectedConflict}
        onSelectConflict={(conflict) => {
          setShowConflictPins(true);
          setSelectedConflict(conflict);
        }}
      />

      <TelemetryBar
        conflicts={conflicts}
        pins={pins}
        cursorCoords={cursorCoords}
        onSelectConflict={handleSelectConflictFromTicker}
        onSelectPin={handleRegionSelect}
        onOpenConflictsPanel={() => {
          setShowConflictsPanel(true);
          setShowLayersControl(false);
        }}
      />
    </div>
  );
};

export default App;
