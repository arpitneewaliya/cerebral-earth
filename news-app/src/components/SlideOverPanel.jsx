import React from 'react';
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
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1001] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`fixed top-0 right-0 h-full w-[720px] max-w-[90vw] z-[1002] shadow-[0_0_40px_rgba(0,0,0,0.1)] transform transition-transform duration-300 ease-out flex flex-col ${isDarkMode ? 'bg-zinc-950/95 backdrop-blur-xl border-l border-zinc-800 text-zinc-50' : 'bg-white/95 backdrop-blur-xl border-l border-zinc-200 text-zinc-950'
        }`}>
        {/* Panel Header */}
        <PanelHeader
          countryName={countryName}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          onClose={onClose}
          isDarkMode={isDarkMode}
        />

        {/* Panel Content - Scrollable Area */}
        <div className="flex-1 min-h-0 overflow-y-scroll"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: isDarkMode ? '#27272a transparent' : '#e4e4e7 transparent'
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
    </>
  );
};

const PanelHeader = ({
  countryName,
  selectedOption,
  setSelectedOption,
  onClose,
  isDarkMode
}) => (
  <div className={`flex-shrink-0 p-6 border-b ${isDarkMode ? 'border-zinc-800 bg-zinc-950/50' : 'border-zinc-200 bg-white/50'}`}>
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-1">
        <h3 className={`text-xl font-semibold tracking-tight ${isDarkMode ? 'text-zinc-50' : 'text-zinc-950'}`}>
          {countryName ? `Explore ${countryName}` : 'Explore Region'}
        </h3>
        {selectedOption && (
          <button
            className={`inline-flex items-center gap-1.5 mt-2 transition-colors px-3 py-1.5 rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 w-fit ${isDarkMode ? 'text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/80' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            onClick={() => setSelectedOption(null)}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}
      </div>
      <button
        className={`inline-flex items-center justify-center p-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 ${isDarkMode
            ? 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-50'
            : 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900'
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