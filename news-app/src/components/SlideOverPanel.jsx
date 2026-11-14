import React, { useState, useEffect } from 'react';
import { X, Newspaper, BarChart3, Globe2, Crosshair, MapPin } from 'lucide-react';
import ContentRenderer from './ContentRenderer.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

const MACRO_KEYS = ['macro', 'chart', 'gdp', 'population', 'fdi', 'inflation', 'unemployment', 'literacy'];

const SlideOverPanel = ({
  isOpen,
  onClose,
  region,
  selectedOption,
  setSelectedOption,
  countryCode,
  alpha3Code,
  countryName,
}) => {
  const { isDarkMode } = useTheme();
  const [width, setWidth] = useState(460);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      if (window.innerWidth >= 640 && width > window.innerWidth - 32) {
        setWidth(window.innerWidth - 32);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width]);

  const handleResizeLeft = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const initialWidth = width;

    const handlePointerMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      let newWidth = initialWidth - deltaX;

      const minWidth = 360;
      const maxWidth = Math.min(820, window.innerWidth - 32);

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

  const activeTab = MACRO_KEYS.includes(selectedOption)
    ? 'macro'
    : selectedOption === 'country'
    ? 'country'
    : 'news';

  const tabs = [
    { id: 'news', label: 'Intel & News', icon: Newspaper },
    { id: 'macro', label: 'Macro Telemetry', icon: BarChart3 },
    { id: 'country', label: 'Country Profile', icon: Globe2 },
  ];

  return (
    <aside
      className={`fixed top-0 right-0 h-full z-[1002] shadow-2xl border-l flex flex-col transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } ${
        isDarkMode
          ? 'bg-zinc-950/92 backdrop-blur-2xl border-zinc-800/90 text-zinc-100 shadow-black/90'
          : 'bg-white/95 backdrop-blur-2xl border-zinc-200 text-zinc-950'
      }`}
      style={{
        width: isMobile ? '100%' : `${width}px`,
      }}
    >
      {/* Left Resize Handle (Desktop Only) */}
      {!isMobile && (
        <div
          onPointerDown={handleResizeLeft}
          className="absolute left-0 top-0 bottom-0 w-1.5 cursor-ew-resize hover:bg-cyan-500/50 active:bg-cyan-500/80 transition-colors z-[1003]"
          title="Drag to resize dossier width"
        />
      )}

      {/* Dossier Header */}
      <div
        className={`flex-shrink-0 px-5 pt-5 pb-3 border-b ${
          isDarkMode ? 'border-zinc-800/80 bg-zinc-950/60' : 'border-zinc-200 bg-zinc-50/70'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {countryCode ? (
              <img
                src={`https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`}
                alt={countryName || 'Flag'}
                className="w-10 h-7 object-cover rounded-md border border-zinc-500/30 shadow-sm flex-shrink-0"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div
                className={`w-10 h-7 rounded-md border flex items-center justify-center flex-shrink-0 ${
                  isDarkMode ? 'bg-zinc-900 border-zinc-800 text-cyan-400' : 'bg-zinc-100 border-zinc-200 text-blue-600'
                }`}
              >
                <Crosshair className="w-4 h-4" />
              </div>
            )}

            <div className="text-left min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold tracking-tight truncate">
                  {countryName || 'Sector Dossier'}
                </h2>
                {(alpha3Code || countryCode) && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border font-bold flex-shrink-0 ${
                      isDarkMode
                        ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                        : 'bg-blue-50 border-blue-200 text-blue-700'
                    }`}
                  >
                    {alpha3Code || countryCode}
                  </span>
                )}
              </div>

              {region && typeof region.lat === 'number' && typeof region.lng === 'number' && (
                <p
                  className={`text-[11px] font-mono mt-0.5 ${
                    isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                  }`}
                >
                  SECTOR COORDS: {region.lat.toFixed(3)}°N, {region.lng.toFixed(3)}°E
                </p>
              )}
            </div>
          </div>

          <button
            className={`p-2 rounded-xl border transition-colors cursor-pointer flex-shrink-0 ${
              isDarkMode
                ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                : 'bg-white border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
            onClick={onClose}
            aria-label="Close dossier panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Persistent Dossier Tab Bar */}
        <div
          className={`grid grid-cols-3 gap-1 p-1 mt-4 rounded-xl border ${
            isDarkMode ? 'bg-zinc-900/90 border-zinc-800' : 'bg-zinc-200/60 border-zinc-200'
          }`}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedOption(tab.id)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? isDarkMode
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'bg-white text-zinc-900 shadow-sm border border-zinc-200/80'
                    : isDarkMode
                    ? 'text-zinc-400 hover:text-zinc-200'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Dossier Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto relative pb-16">
        {!region ? (
          <div className="flex flex-col items-center justify-center h-64 p-6 text-center space-y-3">
            <MapPin className="w-10 h-10 opacity-40 text-cyan-400" />
            <p className="text-sm font-medium text-zinc-400">
              Select any country or sector on the globe to inspect live intelligence.
            </p>
          </div>
        ) : (
          <ContentRenderer
            selectedOption={selectedOption || 'news'}
            setSelectedOption={setSelectedOption}
            region={region}
            countryCode={countryCode}
            countryName={countryName}
          />
        )}
      </div>
    </aside>
  );
};

export default SlideOverPanel;
