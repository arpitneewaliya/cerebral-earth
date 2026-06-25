// components/ConflictPanel.jsx
import React, { useState, useEffect } from 'react';
import { ShieldAlert, ChevronLeft, ArrowLeft, Flame, Landmark, Users, Search, ExternalLink } from 'lucide-react';

const ConflictPanel = ({
  isOpen,
  onClose,
  conflicts,
  loading,
  selectedConflict,
  onSelectConflict,
  isDarkMode
}) => {
  const [width, setWidth] = useState(420); // Wider default desktop width (420px)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && width > window.innerWidth - 32) {
        setWidth(window.innerWidth - 32);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width]);

  // Pointer handler for resizing from the right edge (desktop only)
  const handleResizeRight = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const initialWidth = width;

    const handlePointerMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      let newWidth = initialWidth + deltaX;

      const minWidth = 360; // Wider minimum width
      const maxWidth = Math.min(700, window.innerWidth - 32);

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

  // Filter & Search logic
  const filteredConflicts = conflicts.filter(c => {
    const matchesFilter = filter === 'ALL' || c.category === filter;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (c.themes && c.themes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'ARMED_CONFLICT':
        return <Flame className="w-4 h-4 text-red-500" />;
      case 'CIVIL_UNREST':
        return <Users className="w-4 h-4 text-orange-500" />;
      case 'GEOPOLITICAL_TENSION':
      default:
        return <Landmark className="w-4 h-4 text-yellow-500" />;
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
        return 'bg-red-500/15 text-red-500 border-red-500/30';
      case 'CIVIL_UNREST':
        return 'bg-orange-500/15 text-orange-500 border-orange-500/30';
      case 'GEOPOLITICAL_TENSION':
        return 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30';
      default:
        return 'bg-zinc-500/15 text-zinc-500 border-zinc-500/30';
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
      .map(t => t.trim())
      .filter(t => t && !t.startsWith('WB_') && t.length > 2);
  };

  return (
    <div
      className={`fixed z-[1001] flex flex-col transition-transform duration-300 ease-in-out ${
        isMobile
          ? 'bottom-0 left-0 w-full h-[40vh] border-t rounded-t-[1.5rem]'
          : 'top-0 left-0 h-screen border-r rounded-r-[1.2rem]'
      } ${
        isOpen
          ? isMobile ? 'translate-y-0' : 'translate-x-0'
          : isMobile ? 'translate-y-full' : '-translate-x-full'
      } ${
        isDarkMode
          ? 'bg-zinc-950/90 backdrop-blur-xl border-zinc-800 text-zinc-50 shadow-2xl'
          : 'bg-white/90 backdrop-blur-xl border-zinc-200 text-zinc-900 shadow-2xl'
      }`}
      style={{
        width: isMobile ? '100%' : `${width}px`
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

      {/* Swipe Indicator for Mobile Bottom Sheet */}
      {isMobile && (
        <div className="w-full flex justify-center pt-2.5 pb-1 flex-shrink-0">
          <div className={`w-12 h-1 rounded-full ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
        </div>
      )}

      {/* Panel Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          {/* Back to map/list button */}
          {selectedConflict ? (
            <button
              onClick={() => onSelectConflict(null)}
              className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-xs font-bold transition-colors ${
                isDarkMode ? 'hover:bg-zinc-900 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-700'
              }`}
              title="Back to conflict list"
            >
              <ArrowLeft className="w-4.5 h-4.5" />
              <span>List</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-xs font-bold transition-colors ${
                isDarkMode ? 'hover:bg-zinc-900 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-700'
              }`}
              title="Back to standard map"
            >
              <ChevronLeft className="w-4.5 h-4.5" />
              <span>Map</span>
            </button>
          )}

          {/* Title */}
          {(!isMobile || !selectedConflict) && (
            <div className="flex items-center gap-1.5 ml-2">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span className="font-bold text-xs sm:text-sm tracking-tight">Conflicts</span>
            </div>
          )}
        </div>

        {/* Live Indicator Badge */}
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">Live</span>
        </div>
      </div>

      {/* Detail Sub-View (When a specific conflict is selected) */}
      {selectedConflict ? (
        <div
          className="flex-1 overflow-y-auto p-5 text-left space-y-4"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: isDarkMode ? '#27272a transparent' : '#e4e4e7 transparent'
          }}
        >
          {/* Category Badge & Sentiment */}
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold border ${getCategoryColor(selectedConflict.category)}`}>
              {getCategoryIcon(selectedConflict.category)}
              <span>{getCategoryLabel(selectedConflict.category)}</span>
            </div>
            <span className={`text-[10px] font-bold ${
              selectedConflict.tone < -5
                ? 'text-red-500'
                : selectedConflict.tone < 0
                ? 'text-orange-500'
                : 'text-green-500'
            }`}>
              Tone: {selectedConflict.tone.toFixed(1)}
            </span>
          </div>

          {/* Location Title */}
          <div>
            <h3 className="text-lg font-bold tracking-tight">{selectedConflict.name}</h3>
            <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Reported: {new Date(selectedConflict.pubDate).toLocaleString()}
            </p>
          </div>

          {/* Divider */}
          <div className={`border-t ${isDarkMode ? 'border-zinc-900' : 'border-zinc-100'}`} />

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Description
            </h4>
            <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
              Active security event or unrest alert detected in {selectedConflict.name}. This indicator is flagged due to themes in global media coverage. Refer to the original news publisher for granular reports.
            </p>
          </div>

          {/* Key Themes List */}
          {getThemesArray(selectedConflict.themes).length > 0 && (
            <div className="space-y-2">
              <h4 className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                Associated Themes
              </h4>
              <div className="flex flex-wrap gap-1.5 max-h-[80px] overflow-y-auto">
                {getThemesArray(selectedConflict.themes).map((theme, i) => (
                  <span
                    key={i}
                    className={`px-2 py-0.5 rounded text-[9px] font-medium border ${
                      isDarkMode
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-400'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-500'
                    }`}
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <a
              href={selectedConflict.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 shadow-md shadow-blue-500/10"
            >
              <span>Read Full Source Article</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      ) : (
        /* Full List View (Standard Search + Filter + Cards) */
        <>
          {/* Description (Hide on mobile to save vertical height) */}
          {!isMobile && (
            <p className={`text-xs px-5 pb-3 text-left ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Live-monitored geopolitical events, security incidents, and civil unrest parsed from global media.
            </p>
          )}

          {/* Search Input */}
          <div className="px-4 pb-2.5 flex-shrink-0">
            <div className="relative">
              <Search className={`absolute left-3 top-2 w-3.5 h-3.5 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
              <input
                type="text"
                placeholder="Search location or theme..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full text-xs pl-8.5 pr-4 py-1.5 rounded-lg border focus:outline-none transition-colors ${
                  isDarkMode
                    ? 'bg-zinc-900 border-zinc-800 focus:border-zinc-700 text-zinc-100'
                    : 'bg-zinc-50 border-zinc-200 focus:border-zinc-300 text-zinc-900'
                }`}
              />
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex gap-1 px-4 pb-3 overflow-x-auto scrollbar-none flex-shrink-0">
            {['ALL', 'ARMED_CONFLICT', 'CIVIL_UNREST', 'GEOPOLITICAL_TENSION'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap border transition-all duration-200 ${
                  filter === cat
                    ? isDarkMode
                      ? 'bg-zinc-100 text-zinc-950 border-zinc-100'
                      : 'bg-zinc-900 text-white border-zinc-900'
                    : isDarkMode
                    ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {cat === 'ALL' ? 'All' : getCategoryLabel(cat)}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className={`mx-4 border-t flex-shrink-0 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`} />

          {/* Conflicts List */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-2.5"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: isDarkMode ? '#27272a transparent' : '#e4e4e7 transparent'
            }}
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-2.5">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                <span className={`text-[10px] ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Parsing global media reports...
                </span>
              </div>
            ) : filteredConflicts.length === 0 ? (
              <div className="text-center py-8">
                <ShieldAlert className={`w-6 h-6 mx-auto mb-1.5 opacity-40 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
                <p className={`text-[10px] ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  No active conflict alerts found matching criteria.
                </p>
              </div>
            ) : (
              filteredConflicts.map((conflict) => {
                const isSelected = selectedConflict && selectedConflict.id === conflict.id;
                return (
                  <div
                    key={conflict.id}
                    onClick={() => onSelectConflict(conflict)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
                      isSelected
                        ? isDarkMode
                          ? 'bg-zinc-900 border-zinc-700 shadow-md ring-1 ring-zinc-700'
                          : 'bg-zinc-100 border-zinc-300 shadow-md ring-1 ring-zinc-300'
                        : isDarkMode
                        ? 'bg-zinc-900/40 border-zinc-900 hover:bg-zinc-900/80 hover:border-zinc-800'
                        : 'bg-zinc-50/50 border-zinc-100 hover:bg-zinc-100/50 hover:border-zinc-200'
                    }`}
                  >
                    {/* Location and Date */}
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs truncate max-w-[160px] sm:max-w-[200px]">
                        {conflict.name}
                      </span>
                      <span className={`text-[9px] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        {formatPubDate(conflict.pubDate)}
                      </span>
                    </div>

                    {/* Category Badge & Sentiment */}
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border ${getCategoryColor(conflict.category)}`}>
                        {getCategoryIcon(conflict.category)}
                        <span>{getCategoryLabel(conflict.category)}</span>
                      </div>
                      {conflict.tone !== 0 && (
                        <span className={`text-[9px] font-bold ${
                          conflict.tone < -5
                            ? 'text-red-500'
                            : conflict.tone < 0
                            ? 'text-orange-500'
                            : 'text-green-500'
                        }`}>
                          Tone: {conflict.tone > 0 ? `+${conflict.tone.toFixed(1)}` : conflict.tone.toFixed(1)}
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
