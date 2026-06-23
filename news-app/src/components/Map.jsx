import React, { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap, GeoJSON } from 'react-leaflet';
import { Info, Layers } from 'lucide-react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import Pin from './Pin';
import SearchBox from './SearchBox.jsx';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');

const COLOR_PALETTES = {
  gdp: ['#dcfce7', '#86efac', '#22c55e', '#16a34a', '#15803d'],
  population: ['#f3e8ff', '#d8b4fe', '#a855f7', '#7e22ce', '#581c87'],
  fdi: ['#ffedd5', '#fdba74', '#f97316', '#c2410c', '#7c2d12'],
  inflation: ['#fee2e2', '#fca5a5', '#ef4444', '#b91c1c', '#7f1d1d'],
  unemployment: ['#fef9c3', '#fde047', '#eab308', '#a16207', '#713f12'],
  literacy: ['#e0e7ff', '#93c5fd', '#3b82f6', '#1d4ed8', '#1e3a8a'],
};

// Formatting large numbers
const formatValue = (val) => {
  if (val === undefined || val === null || isNaN(val)) return 'N/A';
  if (Math.abs(val) >= 1e12) return `${(val / 1e12).toFixed(1)}T`;
  if (Math.abs(val) >= 1e9) return `${(val / 1e9).toFixed(1)}B`;
  if (Math.abs(val) >= 1e6) return `${(val / 1e6).toFixed(1)}M`;
  if (Math.abs(val) > 1000) return Math.round(val).toLocaleString();
  return val.toFixed(1);
};

const MapLayerControl = ({ selectedLayer, setSelectedLayer, isDarkMode }) => {
  const layers = [
    { id: 'none', name: 'Default Map' },
    { id: 'gdp', name: 'GDP Heatmap' },
    { id: 'population', name: 'Population Heatmap' },
    { id: 'fdi', name: 'FDI Heatmap' },
    { id: 'inflation', name: 'Inflation Heatmap' },
    { id: 'unemployment', name: 'Unemployment Heatmap' },
    { id: 'literacy', name: 'Literacy Heatmap' }
  ];

  return (
    <div className={`absolute top-24 left-4 z-[1000] p-2.5 rounded-xl border shadow-lg ${
      isDarkMode ? 'bg-zinc-900/90 border-zinc-800 text-zinc-50' : 'bg-white/90 border-zinc-200 text-zinc-900'
    } backdrop-blur-md flex items-center gap-3`}>
      <Layers className={`w-5 h-5 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
      <select 
        value={selectedLayer} 
        onChange={(e) => setSelectedLayer(e.target.value)}
        className={`text-sm font-medium rounded-lg px-2 py-1.5 focus:outline-none cursor-pointer transition-colors ${
          isDarkMode ? 'bg-zinc-800 text-zinc-100 border-zinc-700 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-800 border-zinc-200 hover:bg-zinc-200'
        }`}
      >
        {layers.map(l => (
          <option key={l.id} value={l.id}>{l.name}</option>
        ))}
      </select>
    </div>
  );
};

const MapLegend = ({ selectedLayer, layerStats, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (selectedLayer === 'none' || !layerStats || layerStats.sortedValues.length === 0) return null;

  const palette = COLOR_PALETTES[selectedLayer] || COLOR_PALETTES.gdp;
  const values = layerStats.sortedValues;

  const p20 = values[Math.floor(values.length * 0.2)];
  const p40 = values[Math.floor(values.length * 0.4)];
  const p60 = values[Math.floor(values.length * 0.6)];
  const p80 = values[Math.floor(values.length * 0.8)];

  const ranges = [
    `< ${formatValue(p20)}`,
    `${formatValue(p20)} - ${formatValue(p40)}`,
    `${formatValue(p40)} - ${formatValue(p60)}`,
    `${formatValue(p60)} - ${formatValue(p80)}`,
    `> ${formatValue(p80)}`
  ];

  return (
    <div className={`absolute bottom-8 left-4 z-[1000] flex flex-col gap-2 items-start`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2.5 rounded-full shadow-lg border transition-colors flex items-center justify-center ${
          isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700' : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
        }`}
        title="Toggle Legend"
      >
        <Info className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className={`p-4 rounded-xl border shadow-xl ${
          isDarkMode ? 'bg-zinc-900/95 border-zinc-800 text-zinc-50' : 'bg-white/95 border-zinc-200 text-zinc-900'
        } backdrop-blur-md text-sm min-w-[180px] animate-in slide-in-from-bottom-2 fade-in duration-200`}>
          <h4 className="font-semibold mb-3 capitalize">{selectedLayer} Legend</h4>
          <div className="flex flex-col gap-2.5">
            {palette.map((color, idx) => (
              <div key={color} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded border shadow-sm" style={{ backgroundColor: color, borderColor: isDarkMode ? '#3f3f46' : '#e4e4e7' }} />
                <span className={`text-xs font-medium ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>{ranges[idx]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MapAutofocus = ({ region }) => {
  const map = useMap();
  useEffect(() => {
    if (region && region.lat && region.lng) {
      if (region.boundingbox && region.boundingbox.length === 4) {
        const [minLat, maxLat, minLng, maxLng] = region.boundingbox;
        map.fitBounds([
          [minLat, minLng],
          [maxLat, maxLng]
        ], { animate: true, duration: 1.5, maxZoom: 8 });
      } else {
        map.flyTo([region.lat, region.lng], 6, { animate: true, duration: 1.5 });
      }
    }
  }, [region, map]);
  return null;
};

const MapClickHandler = ({ setRegion }) => {
  useMapEvents({
    click: (e) => {
      setRegion({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

const Map = ({ region, setRegion, pins, isDarkMode, selectedCountryId }) => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const geoJsonRef = useRef(null);

  const [selectedLayer, setSelectedLayer] = useState('none');
  const [layerData, setLayerData] = useState({});
  const [layerStats, setLayerStats] = useState({ sortedValues: [] });

  useEffect(() => {
    fetch('/countries.geojson')
      .then((res) => res.json())
      .then((data) => setGeoJsonData(data))
      .catch((err) => console.error('Error loading country borders:', err));
  }, []);

  // Fetch Global Choropleth Data
  useEffect(() => {
    if (selectedLayer === 'none') {
      setLayerData({});
      setLayerStats({ sortedValues: [] });
      return;
    }
    
    const fetchLayerData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/charts/global/${selectedLayer}`);
        const data = res.data;
        
        const values = Object.values(data).filter(v => v !== null && !isNaN(v)).sort((a,b) => a - b);
        setLayerData(data);
        setLayerStats({ sortedValues: values });
      } catch(e) {
        console.error("Error fetching layer data", e);
      }
    };
    fetchLayerData();
  }, [selectedLayer]);

  // Compute the styling rule for a feature (country)
  const getFeatureStyle = (feature) => {
    const isSelected = selectedCountryId && selectedCountryId === feature.id;
    
    if (selectedLayer === 'none' || !layerData[feature.id]) {
      // Default map style
      return {
        color: isSelected ? (isDarkMode ? '#60a5fa' : '#2563eb') : 'transparent',
        weight: isSelected ? 2.0 : 0,
        fillColor: isSelected ? (isDarkMode ? '#60a5fa' : '#2563eb') : 'transparent',
        fillOpacity: isSelected ? 0.08 : 0,
      };
    }

    // Choropleth style
    const value = layerData[feature.id];
    const palette = COLOR_PALETTES[selectedLayer] || COLOR_PALETTES.gdp;
    
    const index = layerStats.sortedValues.findIndex(v => v >= value);
    const percentile = layerStats.sortedValues.length > 0 ? (index / layerStats.sortedValues.length) : 0;
    
    let colorIndex = Math.floor(percentile * palette.length);
    if (colorIndex >= palette.length) colorIndex = palette.length - 1;
    
    const fillColor = palette[colorIndex];

    return {
      color: isSelected ? (isDarkMode ? '#ffffff' : '#000000') : (isDarkMode ? '#27272a' : '#d4d4d8'),
      weight: isSelected ? 2.5 : 0.5,
      fillColor: fillColor,
      fillOpacity: isSelected ? 0.95 : 0.7,
    };
  };

  // Re-apply style when selectedCountryId, isDarkMode, or layerData changes
  useEffect(() => {
    if (geoJsonRef.current) {
      geoJsonRef.current.setStyle(getFeatureStyle);

      if (selectedCountryId) {
        geoJsonRef.current.eachLayer((layer) => {
          if (layer.feature && layer.feature.id === selectedCountryId) {
            layer.bringToFront();
          }
        });
      }
    }
  }, [selectedCountryId, isDarkMode, geoJsonData, layerData, selectedLayer]);

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: (e) => {
        setRegion({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
  };

  // Adjust base map brightness based on dark mode and layer
  const tileUrl = isDarkMode 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <>
      <SearchBox onSelectLocation={setRegion} isDarkMode={isDarkMode} />
      
      <MapLayerControl 
        selectedLayer={selectedLayer} 
        setSelectedLayer={setSelectedLayer} 
        isDarkMode={isDarkMode} 
      />
      
      <MapLegend 
        selectedLayer={selectedLayer} 
        layerStats={layerStats} 
        isDarkMode={isDarkMode} 
      />

      <MapContainer
        center={[28.7, 77.1]}
        zoom={2.5}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0
        }}
        worldCopyJump={false}
        maxBounds={[
          [-90, -180],
          [90, 180],
        ]}
        maxBoundsViscosity={1.0}
        minZoom={1}
        maxZoom={18}
      >
        <TileLayer
          key={isDarkMode ? 'dark' : 'light'}
          url={tileUrl}
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        <MapClickHandler setRegion={setRegion} />
        <MapAutofocus region={region} />
        
        {geoJsonData && (
          <GeoJSON
            ref={geoJsonRef}
            data={geoJsonData}
            style={getFeatureStyle}
            onEachFeature={onEachFeature}
          />
        )}

        {pins.map((pin, index) => (
          <Pin
            key={index}
            position={pin.position}
            image={pin.image}
            title={pin.title}
            url={pin.url}
            category={pin.category}
          />
        ))}
      </MapContainer>
    </>
  );
};

export default Map;
