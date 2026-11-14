import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ArrowLeft,
  Flame,
  Landmark,
  Users,
  Search,
  ExternalLink,
  X,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext.jsx';

const ConflictPanel = ({
  isOpen,
  onClose,
  conflicts = [],
  loading,
  selectedConflict,
  onSelectConflict,
}) => {
  const { isDarkMode } = useTheme();
  const [width, setWidth] = useState(400);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile drawer resizable states
  const [mobileHeight, setMobileHeight] = useState(window.innerHeight * 0.45);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && width > window.innerWidth - 32) {
        setWidth(window.innerWidth - 32);
      }
      if (mobile) {
        setMobileHeight(window.innerHeight * 0.45);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width]);

  useEffect(() => {
    if (isOpen && isMobile) {
      setMobileHeight(window.innerHeight * 0.45);
    }
  }, [isOpen, isMobile]);

  const handleDragStart = (pointerDownEvent) => {
    pointerDownEvent.preventDefault();
    pointerDownEvent.stopPropagation();

    setIsDragging(true);
    const startY = pointerDownEvent.clientY;
    const initialHeight = mobileHeight;

    const handleDragMove = (moveEvent) => {
      const currentY = moveEvent.clientY;
      const deltaY = currentY - startY;
      let newHeight = initialHeight - deltaY;

      const minHeight = 100;
      const maxHeight = window.innerHeight - 60;

      if (newHeight < minHeight) newHeight = minHeight;
      if (newHeight > maxHeight) newHeight = maxHeight;

      setMobileHeight(newHeight);
    };

    const handleDragEnd = () => {
      setIsDragging(false);
      document.removeEventListener('pointermove', handleDragMove);
      document.removeEventListener('pointerup', handleDragEnd);

      setMobileHeight((current) => {
        const snapTop = window.innerHeight * 0.85;
        const snapMid = window.innerHeight * 0.45;
        const snapBot = 100;

        const candidates = [
          { val: snapBot, dist: Math.abs(current - snapBot) },
          { val: snapMid, dist: Math.abs(current - snapMid) },
          { val: snapTop, dist: Math.abs(current - snapTop) },
        ];

        candidates.sort((a, b) => a.dist - b.dist);
        return candidates[0].val;
      });
    };

    document.addEventListener('pointermove', handleDragMove);
    document.addEventListener('pointerup', handleDragEnd);
  };

  const handleResizeRight = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const initialWidth = width;

    const handlePointerMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      let newWidth = initialWidth + deltaX;

      const minWidth = 340;
      const maxWidth = Math.min(680, window.innerWidth - 32);

      if (newWidth < minWidth) newWidth = minWidth;
      if (newWidth > maxWidth) newWidth = maxWidth;

      setWidth(newWidth);
    };

    const handlePointerUp = () => {
      document.body.style.cursor = '';
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    document.body.style.cursor = 'ew-resize';
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  const filteredConflicts = conflicts.filter((c) => {
    const matchesFilter = filter === 'ALL' || c.category === filter;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.themes && c.themes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'ARMED_CONFLICT':
        return <Flame className="w-3.5 h-3.5 text-red-500" />;
      case 'CIVIL_UNREST':
        return <Users className="w-3.5 h-3.5 text-orange-500" />;
      case 'GEOPOLITICAL_TENSION':
      default:
        return <Landmark className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'ARMED_CONFLICT':
        return 'Armed Conflict';
      case 'CIVIL_UNREST':
        return 'Civil Unrest';
      case 'GEOPOLITICAL_TENSION':
        return 'Geopolitical';
      default:
        return category;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'ARMED_CONFLICT':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      case 'CIVIL_UNREST':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      case 'GEOPOLITICAL_TENSION':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default:
        return 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30';
    }
  };

  const formatPubDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const seconds = Math.floor((new Date() - date) / 1000);
      let interval = Math.floor(seconds / 31536000);

      if (interval >= 1) return `${interval}y ago`;
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) return `${interval}mo ago`;
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) return `${interval}d ago`;
      interval = Math.floor(seconds / 3600);
      if (interval >= 1) return `${interval}h ago`;
      interval = Math.floor(seconds / 60);
      if (interval >= 1) return `${interval}m ago`;
      return 'Just now';
    } catch (e) {
      return 'Recent';
    }
  };

  const getThemesArray = (themesStr) => {
    if (!themesStr) return [];
    return themesStr
      .split(';')
      .map((t) => t.trim())
      .filter((t) => t && !t.startsWith('WB_') && t.length > 2);
  };

  return (
    <div
      className={`fixed z-[1002] flex flex-col ${
        isDragging ? 'transition-none' : 'transition-[transform,height] duration-300 ease-in-out'
      } ${
        isMobile
          ? 'bottom-0 left-0 w-full border-t rounded-t-3xl'
          : 'top-0 left-0 h-screen border-r'
      } ${
        isOpen
          ? isMobile
            ? 'translate-y-0'
            : 'translate-x-0'
          : isMobile
          ? 'translate-y-full'
          : '-translate-x-full'
      } ${
        isDarkMode
          ? 'bg-zinc-950/92 backdrop-blur-2xl border-zinc-800/90 text-zinc-100 shadow-black/90'
          : 'bg-white/95 backdrop-blur-2xl border-zinc-200 text-zinc-900'
      } shadow-2xl`}
      style={{
        width: isMobile ? '100%' : `${width}px`,
        height: isMobile ? `${mobileHeight}px` : '100%',
      }}
    >
      {/* Right Resize Handle (Desktop Only) */}
      {!isMobile && (
        <div
          onPointerDown={handleResizeRight}
          className="absolute right-0 top-0 bottom-0 w-1.5 cursor-ew-resize hover:bg-red-500/50 active:bg-red-500/70 transition-colors z-[1003]"
          title="Drag to resize width"
        />
      )}

      {/* Header */}
      <div
        onPointerDown={isMobile ? handleDragStart : undefined}
        className={`flex-shrink-0 px-5 pt-4 pb-3 border-b ${
          isMobile ? 'cursor-ns-resize select-none touch-none' : ''
        } ${isDarkMode ? 'border-zinc-800/80' : 'border-zinc-200'}`}
      >
        {isMobile && (
          <div className="w-full flex justify-center pb-2">
            <div
              className={`w-12 h-1 rounded-full ${
                isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'
              }`}
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selectedConflict && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectConflict(null);
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  isDarkMode
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                    : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200'
                }`}
                title="Back to conflict list"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Incidents</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight">
                    Conflict Monitor
                  </span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-red-500/15 text-red-400 border border-red-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                    GDELT LIVE
                  </span>
                </div>
                <p
                  className={`text-[10px] font-mono ${
                    isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                  }`}
                >
                  {conflicts.length} ACTIVE SECURITY HOTSPOTS
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              isDarkMode
                ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                : 'bg-zinc-100 border-zinc-200 text-zinc-500 hover:text-zinc-900'
            }`}
            title="Close Conflict Monitor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Detail Sub-View (When a specific conflict is selected) */}
      {selectedConflict ? (
        <div className="flex-1 overflow-y-auto p-5 text-left space-y-4 pb-16">
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase border ${getCategoryColor(
                selectedConflict.category
              )}`}
            >
              {getCategoryIcon(selectedConflict.category)}
              <span>{getCategoryLabel(selectedConflict.category)}</span>
            </div>
            <span
              className={`text-xs font-mono font-bold ${
                selectedConflict.tone < -5
                  ? 'text-red-400'
                  : selectedConflict.tone < 0
                  ? 'text-orange-400'
                  : 'text-emerald-400'
              }`}
            >
              TONE: {selectedConflict.tone.toFixed(1)}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-extrabold tracking-tight">
              {selectedConflict.name}
            </h3>
            <p
              className={`text-[11px] font-mono mt-1 ${
                isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
              }`}
            >
              COORDS: {selectedConflict.lat?.toFixed(3)}°N, {selectedConflict.lng?.toFixed(3)}°E •{' '}
              {new Date(selectedConflict.pubDate).toLocaleString()}
            </p>
          </div>

          <div
            className={`border-t ${
              isDarkMode ? 'border-zinc-800' : 'border-zinc-200'
            }`}
          />

          <div className="space-y-1.5">
            <h4
              className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
              }`}
            >
              Intelligence Assessment
            </h4>
            <p
              className={`text-xs leading-relaxed ${
                isDarkMode ? 'text-zinc-300' : 'text-zinc-600'
              }`}
            >
              Active security event or civil unrest alert detected in{' '}
              <strong>{selectedConflict.name}</strong>. Flagged via automated GDELT global media
              theme extraction.
            </p>
          </div>

          {getThemesArray(selectedConflict.themes).length > 0 && (
            <div className="space-y-2">
              <h4
                className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                  isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                }`}
              >
                Extracted GDELT Themes
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {getThemesArray(selectedConflict.themes).map((theme, i) => (
                  <span
                    key={i}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                      isDarkMode
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-300'
                        : 'bg-zinc-100 border-zinc-200 text-zinc-600'
                    }`}
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <a
              href={selectedConflict.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white transition-colors duration-200 shadow-lg shadow-red-500/20"
            >
              <span>Open Primary Source Dispatch</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      ) : (
        <>
          {/* Search Input */}
          <div className="px-4 pt-3 pb-2.5 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Filter by sector, city, or GDELT theme..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full text-xs pl-8.5 pr-4 py-2 rounded-xl border focus:outline-none transition-colors ${
                  isDarkMode
                    ? 'bg-zinc-900 border-zinc-800 focus:border-red-500/50 text-zinc-100 placeholder-zinc-500'
                    : 'bg-zinc-50 border-zinc-200 focus:border-zinc-400 text-zinc-900'
                }`}
              />
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex gap-1.5 px-4 pb-3 overflow-x-auto scrollbar-none flex-shrink-0">
            {['ALL', 'ARMED_CONFLICT', 'CIVIL_UNREST', 'GEOPOLITICAL_TENSION'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase whitespace-nowrap border transition-all duration-150 cursor-pointer ${
                  filter === cat
                    ? isDarkMode
                      ? 'bg-red-500/20 text-red-300 border-red-500/50'
                      : 'bg-zinc-900 text-white border-zinc-900'
                    : isDarkMode
                    ? 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {cat === 'ALL' ? 'All Events' : getCategoryLabel(cat)}
              </button>
            ))}
          </div>

          <div
            className={`mx-4 border-t flex-shrink-0 ${
              isDarkMode ? 'border-zinc-800' : 'border-zinc-200'
            }`}
          />

          {/* Conflicts List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5 pb-16">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-2.5">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500" />
                <span className="text-[11px] font-mono text-zinc-400">
                  SYNCHRONIZING GDELT SECURITY STREAM...
                </span>
              </div>
            ) : filteredConflicts.length === 0 ? (
              <div className="text-center py-10">
                <ShieldAlert className="w-6 h-6 mx-auto mb-2 opacity-40 text-zinc-400" />
                <p className="text-xs font-mono text-zinc-400">
                  No active conflict alerts matching filter.
                </p>
              </div>
            ) : (
              filteredConflicts.map((conflict) => {
                const isSelected = selectedConflict && selectedConflict.id === conflict.id;
                return (
                  <div
                    key={conflict.id}
                    onClick={() => onSelectConflict(conflict)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all duration-150 hover:-translate-y-0.5 ${
                      isSelected
                        ? isDarkMode
                          ? 'bg-zinc-900 border-red-500/50 shadow-md ring-1 ring-red-500/30'
                          : 'bg-zinc-100 border-zinc-300 shadow-md'
                        : isDarkMode
                        ? 'bg-zinc-900/50 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700'
                        : 'bg-zinc-50/70 border-zinc-200/80 hover:bg-zinc-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs truncate max-w-[220px]">
                        {conflict.name}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {formatPubDate(conflict.pubDate)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div
                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${getCategoryColor(
                          conflict.category
                        )}`}
                      >
                        {getCategoryIcon(conflict.category)}
                        <span>{getCategoryLabel(conflict.category)}</span>
                      </div>
                      {conflict.tone !== 0 && (
                        <span
                          className={`text-[10px] font-mono font-bold ${
                            conflict.tone < -5
                              ? 'text-red-400'
                              : conflict.tone < 0
                              ? 'text-orange-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          TONE: {conflict.tone > 0 ? `+${conflict.tone.toFixed(1)}` : conflict.tone.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ConflictPanel;
