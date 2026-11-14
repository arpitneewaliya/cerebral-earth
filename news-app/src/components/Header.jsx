import React from 'react';
import {
  Globe2,
  Layers,
  ShieldAlert,
  Radio,
  Sun,
  Moon,
  Satellite,
  Map as MapIcon,
  Eye,
  EyeOff,
} from 'lucide-react';
import SearchBox from './SearchBox.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

const LAYER_LABELS = {
  gdp: 'GDP',
  population: 'POP',
  fdi: 'FDI',
  inflation: 'CPI',
  unemployment: 'UNEMP',
  literacy: 'LIT',
};

const Header = ({
  onSelectLocation,
  onActivateLayers,
  showLayersControl = false,
  activeLayer = 'none',
  onActivateConflicts,
  showConflictsPanel = false,
  conflictsCount = 0,
  showConflictPins = true,
  onToggleConflictPins,
  showNewsPins = true,
  onToggleNewsPins,
  basemap = 'dark',
  onChangeBasemap,
}) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const shellClass = isDarkMode
    ? 'bg-zinc-950/88 border-zinc-800/90 text-zinc-100 shadow-[0_14px_38px_-10px_rgba(0,0,0,0.85)]'
    : 'bg-white/92 border-zinc-200/90 text-zinc-900 shadow-lg';

  return (
    <header className="fixed top-4 left-4 right-4 z-[1001] pointer-events-none flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
      {/* Left HUD Island: Brand + Global Search */}
      <div
        className={`pointer-events-auto flex items-center gap-3.5 px-4 py-2.5 rounded-2xl border backdrop-blur-xl transition-all duration-200 ${shellClass}`}
      >
        {/* Brand Identity */}
        <div className="flex items-center gap-3 pr-3.5 border-r border-zinc-500/20 flex-shrink-0">
          <div
            className={`relative w-10 h-10 rounded-xl flex items-center justify-center border ${
              isDarkMode
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                : 'bg-blue-500/10 border-blue-500/20 text-blue-600'
            }`}
          >
            <Globe2 className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>
          <div className="text-left hidden sm:block">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-extrabold tracking-wider uppercase leading-none">
                Cerebral Earth
              </h1>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-bold ${
                  isDarkMode
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                    : 'bg-blue-50 border-blue-200 text-blue-600'
                }`}
              >
                GEOINT
              </span>
            </div>
            <p
              className={`text-[11px] font-mono tracking-tight mt-1 leading-none ${
                isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
              }`}
            >
              GLOBAL TELEMETRY &amp; INTEL
            </p>
          </div>
        </div>

        {/* Integrated Search Input */}
        <div className="flex-1 min-w-0">
          <SearchBox embedded onSelectLocation={onSelectLocation} />
        </div>
      </div>

      {/* Right HUD Island: Basemaps, Overlays, Conflicts, Theme */}
      <div
        className={`pointer-events-auto flex items-center justify-between sm:justify-end gap-2 px-3.5 py-2 rounded-2xl border backdrop-blur-xl overflow-x-auto scrollbar-none transition-all duration-200 ${shellClass}`}
      >
        {/* Basemap Segmented Switcher */}
        <div
          className={`flex items-center p-1 rounded-xl border ${
            isDarkMode ? 'bg-zinc-900/90 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
          }`}
          title="Switch map basemap tiles"
        >
          {[
            { id: 'dark', label: 'Dark', icon: Moon },
            { id: 'satellite', label: 'Sat', icon: Satellite },
            { id: 'light', label: 'Light', icon: MapIcon },
          ].map((mode) => {
            const Icon = mode.icon;
            const active = basemap === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => onChangeBasemap && onChangeBasemap(mode.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  active
                    ? isDarkMode
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                      : 'bg-white text-zinc-900 shadow-xs border border-zinc-200/80'
                    : isDarkMode
                    ? 'text-zinc-400 hover:text-zinc-200'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{mode.label}</span>
              </button>
            );
          })}
        </div>

        <div className={`h-6 w-px mx-1 ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`} />

        {/* Choropleth Data Layers Button */}
        <button
          onClick={onActivateLayers}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer whitespace-nowrap ${
            showLayersControl || activeLayer !== 'none'
              ? isDarkMode
                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                : 'bg-blue-50 border-blue-300 text-blue-700'
              : isDarkMode
              ? 'bg-zinc-900/70 border-zinc-800 text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
              : 'bg-zinc-100/70 border-zinc-200 text-zinc-700 hover:bg-zinc-200/70'
          }`}
          title="Open Choropleth Heatmap Layers"
        >
          <Layers className="w-4 h-4" />
          <span>Layers</span>
          {activeLayer !== 'none' && (
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] font-mono uppercase ${
                isDarkMode ? 'bg-cyan-500/25 text-cyan-200' : 'bg-blue-600 text-white'
              }`}
            >
              {LAYER_LABELS[activeLayer] || activeLayer}
            </span>
          )}
        </button>

        {/* Conflict Tracker Drawer Button + Hotspot Visibility */}
        <div className="flex items-center">
          <button
            onClick={onActivateConflicts}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-l-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer whitespace-nowrap ${
              showConflictsPanel
                ? isDarkMode
                  ? 'bg-red-500/20 border-red-500/50 text-red-300 shadow-[0_0_14px_rgba(239,68,68,0.2)]'
                  : 'bg-red-50 border-red-300 text-red-700'
                : isDarkMode
                ? 'bg-zinc-900/70 border-zinc-800 text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                : 'bg-zinc-100/70 border-zinc-200 text-zinc-700 hover:bg-zinc-200/70'
            }`}
            title="Open Live Conflict & Security Incident Tracker"
          >
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <span>Conflicts</span>
            {conflictsCount > 0 && (
              <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                {conflictsCount}
              </span>
            )}
          </button>
          <button
            onClick={onToggleConflictPins}
            className={`px-2.5 py-2 rounded-r-xl border border-l-0 text-xs sm:text-sm transition-all cursor-pointer ${
              showConflictPins
                ? isDarkMode
                  ? 'bg-zinc-900/90 border-zinc-800 text-red-400 hover:bg-zinc-800'
                  : 'bg-zinc-100 border-zinc-200 text-red-600 hover:bg-zinc-200'
                : isDarkMode
                ? 'bg-zinc-950 border-zinc-800 text-zinc-600 hover:text-zinc-400'
                : 'bg-zinc-50 border-zinc-200 text-zinc-400 hover:text-zinc-600'
            }`}
            title={showConflictPins ? 'Hide conflict markers on map' : 'Show conflict markers on map'}
            aria-label="Toggle conflict markers"
          >
            {showConflictPins ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>

        {/* News Beacons Visibility Toggle */}
        <button
          onClick={onToggleNewsPins}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer whitespace-nowrap ${
            showNewsPins
              ? isDarkMode
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20'
                : 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100'
              : isDarkMode
              ? 'bg-zinc-900/60 border-zinc-800 text-zinc-500 hover:text-zinc-300'
              : 'bg-zinc-100/60 border-zinc-200 text-zinc-400 hover:text-zinc-700'
          }`}
          title={showNewsPins ? 'Hide global news beacons' : 'Show global news beacons'}
        >
          <Radio className="w-4 h-4" />
          <span className="hidden sm:inline">Beacons</span>
        </button>

        <div className={`h-6 w-px mx-1 ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`} />

        {/* UI Theme Toggle (Dark Tactical vs Clean Light) */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            isDarkMode
              ? 'bg-zinc-900/80 border-zinc-800 text-amber-400 hover:bg-zinc-800 hover:border-zinc-700'
              : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200'
          }`}
          title={isDarkMode ? 'Switch to Light UI Theme' : 'Switch to Dark Tactical UI Theme'}
          aria-label="Toggle UI Theme"
        >
          {isDarkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
        </button>
      </div>
    </header>
  );
};

export default Header;
