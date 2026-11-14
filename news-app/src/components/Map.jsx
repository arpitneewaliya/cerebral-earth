import React, { useEffect, useState, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  useMap,
  GeoJSON,
  Pane,
  Marker,
  Popup,
} from 'react-leaflet';
import {
  Info,
  Layers,
  X,
  Coins,
  Users,
  Landmark,
  Flame,
  Briefcase,
  BookOpen,
  Map as MapIcon,
  Crosshair,
} from 'lucide-react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Pin from './Pin';
import { useTheme } from '../contexts/ThemeContext.jsx';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');

const COLOR_PALETTES_LIGHT = {
  gdp: ['#dcfce7', '#86efac', '#22c55e', '#16a34a', '#15803d'],
  population: ['#f3e8ff', '#d8b4fe', '#a855f7', '#7e22ce', '#581c87'],
  fdi: ['#ffedd5', '#fdba74', '#f97316', '#c2410c', '#7c2d12'],
  inflation: ['#fee2e2', '#fca5a5', '#ef4444', '#b91c1c', '#7f1d1d'],
  unemployment: ['#fef9c3', '#fde047', '#eab308', '#a16207', '#713f12'],
  literacy: ['#e0e7ff', '#93c5fd', '#3b82f6', '#1d4ed8', '#1e3a8a'],
};

const COLOR_PALETTES_DARK = {
  gdp: ['#052e16', '#14532d', '#16a34a', '#22c55e', '#4ade80'],
  population: ['#2e1065', '#4c1d95', '#7c3aed', '#a855f7', '#c084fc'],
  fdi: ['#431407', '#7c2d12', '#ea580c', '#f97316', '#fb923c'],
  inflation: ['#450a0a', '#7f1d1d', '#dc2626', '#ef4444', '#f87171'],
  unemployment: ['#422006', '#713f12', '#ca8a04', '#eab308', '#facc15'],
  literacy: ['#172554', '#1e3a8a', '#2563eb', '#3b82f6', '#60a5fa'],
};

const LAYER_META = {
  gdp: { label: 'GDP (USD)', prefix: '$', suffix: '' },
  population: { label: 'Population', prefix: '', suffix: '' },
  fdi: { label: 'FDI Inflows', prefix: '$', suffix: '' },
  inflation: { label: 'Inflation Rate', prefix: '', suffix: '%' },
  unemployment: { label: 'Unemployment', prefix: '', suffix: '%' },
  literacy: { label: 'Literacy Rate', prefix: '', suffix: '%' },
};

// Formatting large numbers
const formatValue = (val, layerId = '') => {
  if (val === undefined || val === null || isNaN(val)) return 'N/A';
  const meta = LAYER_META[layerId] || { prefix: '', suffix: '' };
  let formatted;
  if (Math.abs(val) >= 1e12) formatted = `${(val / 1e12).toFixed(2)}T`;
  else if (Math.abs(val) >= 1e9) formatted = `${(val / 1e9).toFixed(2)}B`;
  else if (Math.abs(val) >= 1e6) formatted = `${(val / 1e6).toFixed(2)}M`;
  else if (Math.abs(val) > 1000) formatted = Math.round(val).toLocaleString();
  else formatted = Number(val).toFixed(1);
  return `${meta.prefix}${formatted}${meta.suffix}`;
};

const MapLayerControl = ({
  selectedLayer,
  setSelectedLayer,
  showLayersControl,
  setShowLayersControl,
  isDarkMode,
}) => {
  if (!showLayersControl) return null;

  const layers = [
    {
      id: 'none',
      name: 'Standard Geoint Map',
      desc: 'Tactical political boundaries only',
      icon: MapIcon,
      color: '#38bdf8',
    },
    {
      id: 'gdp',
      name: 'GDP Heatmap',
      desc: 'Gross Domestic Product in USD',
      icon: Coins,
      color: '#22c55e',
    },
    {
      id: 'population',
      name: 'Population Heatmap',
      desc: 'Total demographic count',
      icon: Users,
      color: '#a855f7',
    },
    {
      id: 'fdi',
      name: 'FDI Heatmap',
      desc: 'Foreign Direct Investment inflows',
      icon: Landmark,
      color: '#f97316',
    },
    {
      id: 'inflation',
      name: 'Inflation Heatmap',
      desc: 'Consumer price inflation rate (%)',
      icon: Flame,
      color: '#ef4444',
    },
    {
      id: 'unemployment',
      name: 'Unemployment Heatmap',
      desc: 'Unemployment share of labor force',
      icon: Briefcase,
      color: '#eab308',
    },
    {
      id: 'literacy',
      name: 'Literacy Heatmap',
      desc: 'Adult literacy rate (%)',
      icon: BookOpen,
      color: '#3b82f6',
    },
  ];

  return (
    <div
      className={`fixed top-28 right-3 left-14 sm:left-auto sm:top-16 sm:right-3 sm:w-80 z-[1000] p-4 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all duration-300 ${
        isDarkMode
          ? 'bg-zinc-950/90 border-zinc-800 text-zinc-100 shadow-black/80'
          : 'bg-white/95 border-zinc-200 text-zinc-950'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-zinc-500/20">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-xs uppercase tracking-wider font-mono">
            Macro Choropleth Overlays
          </h3>
        </div>
        <button
          onClick={() => setShowLayersControl(false)}
          className={`p-1 rounded-lg transition-colors cursor-pointer ${
            isDarkMode
              ? 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              : 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800'
          }`}
          title="Close layers panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Layers List */}
      <div className="flex flex-col gap-1 max-h-[360px] overflow-y-auto pr-1">
        {layers.map((layer) => {
          const IconComponent = layer.icon;
          const isActive = selectedLayer === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => setSelectedLayer(layer.id)}
              className={`flex items-center text-left gap-3 p-2 rounded-xl transition-all duration-150 border w-full group cursor-pointer ${
                isActive
                  ? isDarkMode
                    ? 'bg-zinc-900 border-cyan-500/40 shadow-inner'
                    : 'bg-zinc-100 border-zinc-300 shadow-inner'
                  : isDarkMode
                  ? 'bg-transparent border-transparent hover:bg-zinc-900/60 hover:border-zinc-800'
                  : 'bg-transparent border-transparent hover:bg-zinc-50 hover:border-zinc-200'
              }`}
            >
              <div
                className="p-2 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: isActive
                    ? `${layer.color}25`
                    : isDarkMode
                    ? '#18181b'
                    : '#f4f4f5',
                  color: layer.color,
                }}
              >
                <IconComponent className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs font-bold truncate leading-tight ${
                    isActive ? (isDarkMode ? 'text-cyan-300' : 'text-blue-600') : ''
                  }`}
                >
                  {layer.name}
                </p>
                <p
                  className={`text-[11px] truncate mt-0.5 ${
                    isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                  }`}
                >
                  {layer.desc}
                </p>
              </div>

              {isActive && (
                <div
                  className="w-2 h-2 rounded-full ring-4"
                  style={{
                    backgroundColor: layer.color,
                    '--tw-ring-color': `${layer.color}30`,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const MapLegend = ({ selectedLayer, layerStats, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (selectedLayer === 'none' || !layerStats || layerStats.sortedValues.length === 0) return null;

  const palettes = isDarkMode ? COLOR_PALETTES_DARK : COLOR_PALETTES_LIGHT;
  const palette = palettes[selectedLayer] || palettes.gdp;
  const values = layerStats.sortedValues;

  const p20 = values[Math.floor(values.length * 0.2)];
  const p40 = values[Math.floor(values.length * 0.4)];
  const p60 = values[Math.floor(values.length * 0.6)];
  const p80 = values[Math.floor(values.length * 0.8)];

  const ranges = [
    `< ${formatValue(p20, selectedLayer)}`,
    `${formatValue(p20, selectedLayer)} – ${formatValue(p40, selectedLayer)}`,
    `${formatValue(p40, selectedLayer)} – ${formatValue(p60, selectedLayer)}`,
    `${formatValue(p60, selectedLayer)} – ${formatValue(p80, selectedLayer)}`,
    `> ${formatValue(p80, selectedLayer)}`,
  ];

  return (
    <div className="fixed bottom-16 left-3 z-[998] flex flex-col gap-2 items-start">
      {isOpen ? (
        <div
          className={`p-3 rounded-2xl border shadow-2xl backdrop-blur-xl text-xs min-w-[200px] transition-all duration-200 ${
            isDarkMode
              ? 'bg-zinc-950/90 border-zinc-800 text-zinc-100'
              : 'bg-white/95 border-zinc-200 text-zinc-900'
          }`}
        >
          <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-zinc-500/20">
            <span className="font-mono font-bold text-[10px] uppercase tracking-wider text-cyan-400">
              {LAYER_META[selectedLayer]?.label || selectedLayer} SCALE
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-zinc-200 cursor-pointer"
              title="Minimize legend"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex flex-col gap-1.5">
            {palette.map((color, idx) => (
              <div key={color} className="flex items-center gap-2.5">
                <div
                  className="w-4 h-3 rounded-sm border"
                  style={{
                    backgroundColor: color,
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.15)' : '#e4e4e7',
                  }}
                />
                <span
                  className={`text-[11px] font-mono ${
                    isDarkMode ? 'text-zinc-300' : 'text-zinc-600'
                  }`}
                >
                  {ranges[idx]}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className={`px-3 py-2 rounded-xl shadow-lg border transition-colors flex items-center gap-1.5 text-xs font-mono font-bold cursor-pointer ${
            isDarkMode
              ? 'bg-zinc-950/90 border-zinc-800 text-cyan-400 hover:bg-zinc-900'
              : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
          }`}
          title="Show Choropleth Scale"
        >
          <Info className="w-3.5 h-3.5" />
          <span>SCALE</span>
        </button>
      )}
    </div>
  );
};

const CountryHoverHUD = ({ hoveredCountry, selectedLayer, layerData, layerStats, isDarkMode }) => {
  if (!hoveredCountry) return null;

  const rawValue =
    selectedLayer !== 'none' && layerData ? layerData[hoveredCountry.id] : undefined;

  let percentileRank = null;
  if (
    selectedLayer !== 'none' &&
    rawValue !== undefined &&
    rawValue !== null &&
    layerStats?.sortedValues?.length > 0
  ) {
    const idx = layerStats.sortedValues.findIndex((v) => v >= rawValue);
    if (idx !== -1) {
      percentileRank = Math.round(((idx + 1) / layerStats.sortedValues.length) * 100);
    }
  }

  return (
    <div
      className={`fixed top-28 sm:top-[76px] left-14 z-[998] pointer-events-none px-3.5 py-2.5 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-150 ${
        isDarkMode
          ? 'bg-zinc-950/90 border-cyan-500/30 text-zinc-100 shadow-black/80'
          : 'bg-white/95 border-zinc-200 text-zinc-900 shadow-lg'
      }`}
    >
      <div className="flex items-center gap-2">
        <Crosshair className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
        <span className="font-bold text-xs tracking-tight">{hoveredCountry.name}</span>
        <span
          className={`text-[10px] font-mono px-1.5 py-0.2 rounded border font-semibold ${
            isDarkMode
              ? 'bg-zinc-900 border-zinc-700 text-cyan-300'
              : 'bg-zinc-100 border-zinc-300 text-zinc-700'
          }`}
        >
          {hoveredCountry.id}
        </span>
      </div>

      {selectedLayer !== 'none' && (
        <div className="mt-1.5 pt-1.5 border-t border-zinc-500/20 flex items-center justify-between gap-4 text-[11px] font-mono">
          <span className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}>
            {LAYER_META[selectedLayer]?.label || selectedLayer.toUpperCase()}:
          </span>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-cyan-400">
              {formatValue(rawValue, selectedLayer)}
            </span>
            {percentileRank !== null && (
              <span className="text-[9px] px-1 rounded bg-cyan-500/15 text-cyan-300">
                P{percentileRank}
              </span>
            )}
          </div>
        </div>
      )}

      <p
        className={`text-[9px] font-mono uppercase tracking-wider mt-1 ${
          isDarkMode ? 'text-zinc-500' : 'text-zinc-400'
        }`}
      >
        Click sector to open intelligence dossier
      </p>
    </div>
  );
};

const MapAutofocus = ({ region }) => {
  const map = useMap();
  useEffect(() => {
    if (region && typeof region.lat === 'number' && typeof region.lng === 'number') {
      if (region.boundingbox && region.boundingbox.length === 4) {
        const [minLat, maxLat, minLng, maxLng] = region.boundingbox;
        map.fitBounds(
          [
            [Number(minLat), Number(minLng)],
            [Number(maxLat), Number(maxLng)],
          ],
          { animate: true, duration: 1.4, maxZoom: 7 }
        );
      } else {
        map.flyTo([region.lat, region.lng], 5, { animate: true, duration: 1.4 });
      }
    }
  }, [region, map]);
  return null;
};

const MapConflictsAutofocus = ({ selectedConflict }) => {
  const map = useMap();
  useEffect(() => {
    if (
      selectedConflict &&
      typeof selectedConflict.lat === 'number' &&
      typeof selectedConflict.lng === 'number'
    ) {
      map.flyTo([selectedConflict.lat, selectedConflict.lng], 6, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [selectedConflict, map]);
  return null;
};

// Create custom pulsing marker for conflicts (Follows AGENTS.md)
const createConflictIcon = (category) => {
  let colorClass = 'yellow';
  if (category === 'ARMED_CONFLICT') colorClass = 'red';
  else if (category === 'CIVIL_UNREST') colorClass = 'orange';

  return L.divIcon({
    className: 'custom-conflict-icon',
    html: `
      <div class="conflict-marker-container">
        <div class="conflict-marker-ring ${colorClass}"></div>
        <div class="conflict-marker-dot ${colorClass}"></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const MapTelemetryEvents = ({ setRegion, onCursorMove }) => {
  const map = useMapEvents({
    click: (e) => {
      setRegion({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
    mousemove: (e) => {
      if (onCursorMove) {
        onCursorMove({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          zoom: map.getZoom(),
        });
      }
    },
    zoomend: () => {
      if (onCursorMove) {
        const center = map.getCenter();
        onCursorMove((prev) => ({
          lat: prev?.lat ?? center.lat,
          lng: prev?.lng ?? center.lng,
          zoom: map.getZoom(),
        }));
      }
    },
  });
  return null;
};

const BASEMAP_CONFIGS = {
  dark: {
    base: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    labels:
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
  },
  satellite: {
    base: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    labels:
      'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
  },
  light: {
    base: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    labels:
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
  },
};

const Map = ({
  region,
  setRegion,
  pins = [],
  showNewsPins = true,
  selectedCountryId,
  showLayersControl,
  setShowLayersControl,
  selectedLayer: externalSelectedLayer,
  setSelectedLayer: externalSetSelectedLayer,
  conflicts = [],
  showConflicts = true,
  selectedConflict = null,
  onSelectConflict,
  basemap = 'dark',
  onCursorMove,
}) => {
  const { isDarkMode } = useTheme();
  const [geoJsonData, setGeoJsonData] = useState(null);
  const geoJsonRef = useRef(null);

  const [internalLayer, setInternalLayer] = useState('none');
  const selectedLayer =
    externalSelectedLayer !== undefined ? externalSelectedLayer : internalLayer;
  const setSelectedLayer = externalSetSelectedLayer || setInternalLayer;

  const [layerData, setLayerData] = useState({});
  const [layerStats, setLayerStats] = useState({ sortedValues: [] });
  const [hoveredCountry, setHoveredCountry] = useState(null);

  const isDarkMapSurface = basemap === 'dark' || basemap === 'satellite';

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

        const values = Object.values(data)
          .filter((v) => v !== null && !isNaN(v))
          .sort((a, b) => a - b);
        setLayerData(data);
        setLayerStats({ sortedValues: values });
      } catch (e) {
        console.error('Error fetching layer data', e);
      }
    };
    fetchLayerData();
  }, [selectedLayer]);

  // Compute the styling rule for a country feature
  const getFeatureStyle = (feature) => {
    const isSelected = selectedCountryId && selectedCountryId === feature.id;
    const isHovered = hoveredCountry && hoveredCountry.id === feature.id;

    if (selectedLayer === 'none' || layerData[feature.id] === undefined) {
      if (isDarkMapSurface) {
        return {
          color: isSelected ? '#06b6d4' : isHovered ? '#38bdf8' : '#3f3f46',
          weight: isSelected ? 2.2 : isHovered ? 1.8 : 0.8,
          fillColor: isSelected ? '#06b6d4' : isHovered ? '#38bdf8' : '#090d16',
          fillOpacity: isSelected ? 0.25 : isHovered ? 0.14 : 0.05,
        };
      }
      return {
        color: isSelected ? '#2563eb' : isHovered ? '#0284c7' : '#d4d4d8',
        weight: isSelected ? 2.2 : isHovered ? 1.5 : 0.8,
        fillColor: isSelected ? '#2563eb' : isHovered ? '#0284c7' : '#f4f4f5',
        fillOpacity: isSelected ? 0.15 : isHovered ? 0.08 : 0.05,
      };
    }

    // Choropleth style
    const value = layerData[feature.id];
    const palettes = isDarkMapSurface ? COLOR_PALETTES_DARK : COLOR_PALETTES_LIGHT;
    const palette = palettes[selectedLayer] || palettes.gdp;

    const index = layerStats.sortedValues.findIndex((v) => v >= value);
    const percentile =
      layerStats.sortedValues.length > 0 ? index / layerStats.sortedValues.length : 0;

    let colorIndex = Math.floor(percentile * palette.length);
    if (colorIndex >= palette.length) colorIndex = palette.length - 1;
    if (colorIndex < 0) colorIndex = 0;

    const fillColor = palette[colorIndex];

    return {
      color: isSelected
        ? '#38bdf8'
        : isHovered
        ? '#ffffff'
        : isDarkMapSurface
        ? '#18181b'
        : '#d4d4d8',
      weight: isSelected ? 2.5 : isHovered ? 1.8 : 0.6,
      fillColor,
      fillOpacity: isSelected ? 0.92 : isHovered ? 0.85 : 0.72,
    };
  };

  // Re-apply style when selection, hover, basemap, or layerData changes
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
  }, [selectedCountryId, hoveredCountry, geoJsonData, layerData, selectedLayer, basemap]);

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: (e) => {
        setRegion({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
      mouseover: (e) => {
        setHoveredCountry({
          id: feature.id,
          name: feature.properties?.name || feature.id,
        });
        e.target.bringToFront();
      },
      mouseout: () => {
        setHoveredCountry((prev) => (prev?.id === feature.id ? null : prev));
      },
    });
  };

  const activeTiles = BASEMAP_CONFIGS[basemap] || BASEMAP_CONFIGS.dark;

  return (
    <>
      <MapLayerControl
        selectedLayer={selectedLayer}
        setSelectedLayer={setSelectedLayer}
        showLayersControl={showLayersControl}
        setShowLayersControl={setShowLayersControl}
        isDarkMode={isDarkMode}
      />

      <MapLegend
        selectedLayer={selectedLayer}
        layerStats={layerStats}
        isDarkMode={isDarkMode}
      />

      <CountryHoverHUD
        hoveredCountry={hoveredCountry}
        selectedLayer={selectedLayer}
        layerData={layerData}
        layerStats={layerStats}
        isDarkMode={isDarkMode}
      />

      <MapContainer
        center={[25.0, 18.0]}
        zoom={2.5}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
        }}
        worldCopyJump={false}
        maxBounds={[
          [-85, -180],
          [85, 180],
        ]}
        maxBoundsViscosity={1.0}
        minZoom={2}
        maxZoom={18}
      >
        {/* Base Map tiles without labels (Dynamic key per AGENTS.md rule #1) */}
        <TileLayer
          key={`base-${basemap}-${isDarkMode ? 'dark' : 'light'}`}
          url={activeTiles.base}
          attribution={activeTiles.attribution}
        />

        <MapTelemetryEvents setRegion={setRegion} onCursorMove={onCursorMove} />
        <MapAutofocus region={region} />
        <MapConflictsAutofocus selectedConflict={selectedConflict} />

        {geoJsonData && (
          <GeoJSON
            ref={geoJsonRef}
            data={geoJsonData}
            style={getFeatureStyle}
            onEachFeature={onEachFeature}
          />
        )}

        {/* Labels Overlay Pane - sits on top of GeoJSON overlays (zIndex 450) with pointerEvents: none (AGENTS.md rule #2) */}
        <Pane name="map-labels" style={{ zIndex: 450, pointerEvents: 'none' }}>
          <TileLayer
            key={`labels-${basemap}-${isDarkMode ? 'dark' : 'light'}`}
            url={activeTiles.labels}
            attribution={activeTiles.attribution}
          />
        </Pane>

        {/* Tactical News Beacons */}
        {showNewsPins &&
          pins.map((pin, index) => (
            <Pin
              key={index}
              position={pin.position}
              image={pin.image}
              title={pin.title}
              url={pin.url}
              category={pin.category}
              source={pin.source}
            />
          ))}

        {/* Pulsing Conflict Markers */}
        {showConflicts &&
          conflicts.map((conflict) => (
            <Marker
              key={conflict.id}
              position={[conflict.lat, conflict.lng]}
              icon={createConflictIcon(conflict.category)}
              eventHandlers={{
                click: () => onSelectConflict(conflict),
              }}
            />
          ))}

        {/* Global Conflict Popup */}
        {showConflicts && selectedConflict && (
          <Popup
            position={[selectedConflict.lat, selectedConflict.lng]}
            onClose={() => onSelectConflict(null)}
            className="conflict-popup"
          >
            <div className="text-left text-xs font-semibold select-none min-w-[220px]">
              <div className="flex items-center justify-between gap-4 font-bold border-b pb-1.5 mb-2 border-zinc-500/20 pr-5">
                <span
                  className={`font-mono text-[10px] uppercase tracking-wider ${
                    selectedConflict.category === 'ARMED_CONFLICT'
                      ? 'text-red-500'
                      : selectedConflict.category === 'CIVIL_UNREST'
                      ? 'text-orange-500'
                      : 'text-amber-400'
                  }`}
                >
                  {selectedConflict.category === 'ARMED_CONFLICT'
                    ? 'Armed Conflict'
                    : selectedConflict.category === 'CIVIL_UNREST'
                    ? 'Civil Unrest'
                    : 'Geopolitical Alert'}
                </span>
                <span className="text-[10px] font-mono opacity-80">
                  Tone: {selectedConflict.tone.toFixed(1)}
                </span>
              </div>
              <p className="font-bold my-1 text-sm">{selectedConflict.name}</p>
              <p className="font-normal opacity-75 mb-2.5 leading-relaxed text-[11px]">
                Active security incident flagged via GDELT telemetry stream.
              </p>
              <a
                href={selectedConflict.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Open Source Dispatch &rarr;
              </a>
            </div>
          </Popup>
        )}
      </MapContainer>
    </>
  );
};

export default Map;
