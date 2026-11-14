import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldAlert,
  Radio,
  Crosshair,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Flame,
  Users,
  Landmark,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext.jsx';

const TelemetryBar = ({
  conflicts = [],
  pins = [],
  cursorCoords = { lat: 28.7, lng: 77.1, zoom: 2.5 },
  onSelectConflict,
  onSelectPin,
  onOpenConflictsPanel,
}) => {
  const { isDarkMode } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Merge conflicts and geolocated headlines into a live intelligence stream
  const feedItems = useMemo(() => {
    const conflictItems = conflicts.slice(0, 25).map((c) => ({
      id: `conflict-${c.id}`,
      type: 'conflict',
      category: c.category,
      title: c.name,
      subtitle:
        c.category === 'ARMED_CONFLICT'
          ? 'ARMED CONFLICT'
          : c.category === 'CIVIL_UNREST'
          ? 'CIVIL UNREST'
          : 'GEOPOLITICAL',
      lat: c.lat,
      lng: c.lng,
      tone: c.tone,
      raw: c,
    }));

    const newsItems = pins.slice(0, 15).map((p, idx) => ({
      id: `news-${idx}`,
      type: 'news',
      category: 'HEADLINE',
      title: p.title,
      subtitle: p.source || 'GLOBAL INTEL',
      lat: p.position?.[0],
      lng: p.position?.[1],
      raw: p,
    }));

    // Interleave conflicts and news for a rich ticker
    const combined = [];
    const maxLen = Math.max(conflictItems.length, newsItems.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < conflictItems.length) combined.push(conflictItems[i]);
      if (i < newsItems.length) combined.push(newsItems[i]);
    }
    return combined;
  }, [conflicts, pins]);

  useEffect(() => {
    if (isPaused || feedItems.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % feedItems.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, feedItems.length]);

  const currentItem = feedItems[activeIndex] || null;

  const handleItemClick = () => {
    if (!currentItem) return;
    if (currentItem.type === 'conflict' && onSelectConflict) {
      onSelectConflict(currentItem.raw);
    } else if (currentItem.type === 'news' && onSelectPin) {
      onSelectPin({
        lat: currentItem.lat,
        lng: currentItem.lng,
        display_name: currentItem.title,
      });
    }
  };

  const getBadgeStyle = (category) => {
    switch (category) {
      case 'ARMED_CONFLICT':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'CIVIL_UNREST':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'GEOPOLITICAL_TENSION':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return isDarkMode
          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
          : 'bg-blue-500/15 text-blue-600 border-blue-500/30';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'ARMED_CONFLICT':
        return <Flame className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />;
      case 'CIVIL_UNREST':
        return <Users className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />;
      case 'GEOPOLITICAL_TENSION':
        return <Landmark className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />;
      default:
        return <Radio className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[999] pointer-events-none flex items-center justify-between gap-3">
      <div
        className={`pointer-events-auto w-full flex items-center justify-between gap-4 px-4 py-2.5 rounded-2xl border backdrop-blur-xl transition-all duration-200 ${
          isDarkMode
            ? 'bg-zinc-950/90 border-zinc-800/90 text-zinc-200 shadow-[0_12px_34px_rgba(0,0,0,0.85)]'
            : 'bg-white/92 border-zinc-200/90 text-zinc-800 shadow-lg'
        }`}
      >
        {/* Left Pod: Live Feed Status & Counters */}
        <div className="flex items-center gap-3.5 pr-3.5 border-r border-zinc-500/20 flex-shrink-0">
          <button
            onClick={onOpenConflictsPanel}
            className="flex items-center gap-2 group cursor-pointer"
            title="Open Security & Conflict Monitor"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400 group-hover:underline">
              {conflicts.length} HOTSPOTS
            </span>
          </button>

          <span className="hidden sm:inline text-zinc-600">•</span>

          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono font-semibold text-cyan-400">
            <Radio className="w-3.5 h-3.5" />
            <span>{pins.length} BEACONS</span>
          </div>
        </div>

        {/* Center Pod: Interactive Breaking Intelligence Ticker */}
        <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
          {currentItem ? (
            <button
              onClick={handleItemClick}
              className="flex-1 min-w-0 flex items-center gap-2.5 text-left group cursor-pointer py-0.5"
              title="Click to center map on this event"
            >
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold uppercase border flex-shrink-0 ${getBadgeStyle(
                  currentItem.category
                )}`}
              >
                {getCategoryIcon(currentItem.category)}
                <span className="hidden md:inline">{currentItem.subtitle}</span>
              </span>

              <span
                className={`text-sm font-semibold truncate transition-colors ${
                  isDarkMode
                    ? 'text-zinc-100 group-hover:text-cyan-300'
                    : 'text-zinc-800 group-hover:text-blue-600'
                }`}
              >
                {currentItem.title}
              </span>

              {typeof currentItem.lat === 'number' && typeof currentItem.lng === 'number' && (
                <span
                  className={`hidden xl:inline-block text-xs font-mono flex-shrink-0 px-2 py-0.5 rounded-md ${
                    isDarkMode ? 'bg-zinc-900 text-zinc-400' : 'bg-zinc-100 text-zinc-500'
                  }`}
                >
                  [{currentItem.lat.toFixed(1)}°, {currentItem.lng.toFixed(1)}°]
                </span>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-mono text-zinc-500">
              <ShieldAlert className="w-4 h-4 animate-pulse text-cyan-400" />
              <span>SYNCHRONIZING GLOBAL TELEMETRY STREAM...</span>
            </div>
          )}

          {/* Ticker Micro-Controls */}
          {feedItems.length > 1 && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() =>
                  setActiveIndex((prev) => (prev - 1 + feedItems.length) % feedItems.length)
                }
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDarkMode
                    ? 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                    : 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800'
                }`}
                aria-label="Previous alert"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsPaused((p) => !p)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDarkMode
                    ? 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                    : 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800'
                }`}
                aria-label={isPaused ? 'Resume ticker' : 'Pause ticker'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setActiveIndex((prev) => (prev + 1) % feedItems.length)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDarkMode
                    ? 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                    : 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800'
                }`}
                aria-label="Next alert"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right Pod: Live Cursor Coordinates & Zoom Telemetry */}
        <div
          className={`hidden md:flex items-center gap-3 pl-3.5 border-l border-zinc-500/20 flex-shrink-0 text-xs font-mono ${
            isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
          }`}
        >
          <Crosshair className="w-4 h-4 text-cyan-400" />
          <span>
            LAT <strong className={isDarkMode ? 'text-zinc-100' : 'text-zinc-800'}>{cursorCoords.lat.toFixed(2)}°</strong>
          </span>
          <span>
            LNG <strong className={isDarkMode ? 'text-zinc-100' : 'text-zinc-800'}>{cursorCoords.lng.toFixed(2)}°</strong>
          </span>
          <span
            className={`px-2 py-0.5 rounded-md border font-semibold ${
              isDarkMode ? 'bg-zinc-900 border-zinc-800 text-cyan-400' : 'bg-zinc-100 border-zinc-200 text-blue-600'
            }`}
          >
            Z:{cursorCoords.zoom.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TelemetryBar;
