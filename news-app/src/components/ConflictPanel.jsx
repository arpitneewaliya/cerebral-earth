// components/ConflictPanel.jsx
import React, { useState } from 'react';
import { ShieldAlert, X, Flame, Landmark, Users, Search, ExternalLink } from 'lucide-react';

const ConflictPanel = ({
  isOpen,
  onClose,
  conflicts,
  loading,
  selectedConflict,
  onSelectConflict,
  isDarkMode
}) => {
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

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
      // Relative time calculation
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

  return (
    <div
      className={`fixed top-0 left-0 h-screen w-[320px] sm:w-[360px] z-[1001] flex flex-col border-r transition-transform duration-300 ease-in-out translate-x-0 ${
        isDarkMode
          ? 'bg-zinc-950/90 backdrop-blur-xl border-zinc-800 text-zinc-50'
          : 'bg-white/90 backdrop-blur-xl border-zinc-200 text-zinc-900'
      }`}
      style={{ borderTopRightRadius: '1.2rem', borderBottomRightRadius: '1.2rem' }}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-base tracking-tight">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <span>Conflict Tracker</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className={`p-1.5 rounded-lg transition-colors duration-200 ${
            isDarkMode
              ? 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-50'
              : 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900'
          }`}
          aria-label="Close panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Description */}
      <p className={`text-xs px-5 pb-4 text-left ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
        Live-monitored geopolitical events, security incidents, and civil unrest parsed from global media.
      </p>

      {/* Search Input */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className={`absolute left-3 top-2.5 w-4 h-4 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
          <input
            type="text"
            placeholder="Search location or theme..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full text-xs pl-9 pr-4 py-2 rounded-lg border focus:outline-none transition-colors ${
              isDarkMode
                ? 'bg-zinc-900 border-zinc-800 focus:border-zinc-700 text-zinc-100'
                : 'bg-zinc-50 border-zinc-200 focus:border-zinc-300 text-zinc-900'
            }`}
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-1 px-4 pb-4 overflow-x-auto scrollbar-none">
        {['ALL', 'ARMED_CONFLICT', 'CIVIL_UNREST', 'GEOPOLITICAL_TENSION'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all duration-200 ${
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
      <div className={`mx-4 border-t ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`} />

      {/* Conflicts List */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-3"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: isDarkMode ? '#27272a transparent' : '#e4e4e7 transparent'
        }}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
            <span className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Parsing global media reports...
            </span>
          </div>
        ) : filteredConflicts.length === 0 ? (
          <div className="text-center py-16">
            <ShieldAlert className={`w-8 h-8 mx-auto mb-2 opacity-40 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
            <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
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
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
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
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs truncate max-w-[160px] sm:max-w-[200px]">
                    {conflict.name}
                  </span>
                  <span className={`text-[10px] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    {formatPubDate(conflict.pubDate)}
                  </span>
                </div>

                {/* Category Badge & Sentiment */}
                <div className="flex items-center justify-between mb-2">
                  <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${getCategoryColor(conflict.category)}`}>
                    {getCategoryIcon(conflict.category)}
                    <span>{getCategoryLabel(conflict.category)}</span>
                  </div>
                  {conflict.tone !== 0 && (
                    <span className={`text-[10px] font-bold ${
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

                {/* Headline (if available, parse domain from url as headline source) */}
                <div className="flex items-start justify-between gap-2 mt-2">
                  <p className={`text-[11px] leading-relaxed line-clamp-2 ${
                    isDarkMode ? 'text-zinc-300' : 'text-zinc-600'
                  }`}>
                    Incident reported near {conflict.name}. Check the source for detailed media coverage.
                  </p>
                  <a
                    href={conflict.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`p-1 rounded hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-colors flex-shrink-0 ${
                      isDarkMode ? 'text-zinc-400 hover:text-zinc-100' : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                    title="View Media Source"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConflictPanel;
