import React, { useState, useEffect } from 'react';
import { ChevronLeft, X } from 'lucide-react';
import RegionOptionsPanel from './RegionOptionsPanel.jsx';
import ContentRenderer from './ContentRenderer.jsx';

const SlideOverPanel = ({
  isOpen,
  onClose,
  region,
  selectedOption,
  setSelectedOption,
  countryCode,
  countryName,
  isDarkMode
}) => {
  const [width, setWidth] = useState(420);
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

  // Pointer handler for resizing from the left edge (width adjustment)
  const handleResizeLeft = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const initialWidth = width;

    const handlePointerMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      let newWidth = initialWidth - deltaX;

      const minWidth = 320;
      const maxWidth = Math.min(800, window.innerWidth - 32);

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

  return (
    <div 
      className={`fixed top-0 right-0 h-full z-[1002] shadow-2xl border-l flex flex-col transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } ${
        isDarkMode 
          ? 'bg-zinc-950/90 backdrop-blur-2xl border-zinc-800/50 text-zinc-50' 
          : 'bg-white/90 backdrop-blur-2xl border-zinc-200/50 text-zinc-950'
      }`}
      style={{
        width: isMobile ? '100%' : `${width}px`,
      }}
    >
      {/* Left Resize Handle (Desktop Only) */}
      {!isMobile && (
        <div 
          onPointerDown={handleResizeLeft}
          className="absolute left-0 top-0 bottom-0 w-1.5 cursor-ew-resize hover:bg-red-500/50 active:bg-red-500/70 transition-colors z-[1003]"
          title="Drag to resize width"
        />
      )}

      {/* Panel Header */}
      <PanelHeader
        countryName={countryName}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        onClose={onClose}
        isDarkMode={isDarkMode}
      />

      {/* Panel Content - Scrollable Area */}
      <div className="flex-1 min-h-0 overflow-y-auto relative p-0"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: isDarkMode ? '#3f3f46 transparent' : '#d4d4d8 transparent'
        }}>
        <RegionOptionsPanel
          region={region}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          countryName={countryName}
          isDarkMode={isDarkMode}
        />
        <ContentRenderer
          selectedOption={selectedOption}
          region={region}
          countryCode={countryCode}
          countryName={countryName}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};

const PanelHeader = ({
  countryName,
  selectedOption,
  setSelectedOption,
  onClose,
  isDarkMode
}) => (
  <div 
    className={`sticky top-0 z-10 flex-shrink-0 p-6 border-b transition-colors ${
      isDarkMode 
        ? 'border-zinc-800 bg-zinc-950/80 backdrop-blur-md' 
        : 'border-zinc-200 bg-white/80 backdrop-blur-md'
    }`}
  >
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-1">
        <h3 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-zinc-50' : 'text-zinc-900'}`}>
          {countryName ? countryName : 'Explore Region'}
        </h3>
        {selectedOption && (
          <button
            className={`inline-flex items-center gap-1.5 mt-3 transition-all px-3 py-1.5 rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 w-fit shadow-sm ${
              isDarkMode 
                ? 'bg-zinc-800 text-zinc-300 hover:text-zinc-50 hover:bg-zinc-700 border border-zinc-700' 
                : 'bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 border border-zinc-200'
            }`}
            onClick={() => setSelectedOption(null)}
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Options
          </button>
        )}
      </div>
      <button
        className={`inline-flex items-center justify-center p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
          isDarkMode
            ? 'bg-zinc-800/50 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-50'
            : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900'
        }`}
        onClick={onClose}
        aria-label="Close panel"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  </div>
);

export default SlideOverPanel;