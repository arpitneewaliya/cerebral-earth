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
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[1001] transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`fixed top-0 right-0 h-full w-[720px] max-w-[90vw] z-[1002] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isDarkMode ? 'bg-gray-900/95 backdrop-blur-2xl border-l border-white/10' : 'bg-white/95 backdrop-blur-2xl border-l border-gray-200'
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
            scrollbarColor: isDarkMode ? '#4B5563 transparent' : '#9CA3AF transparent'
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
  <div className={`flex-shrink-0 p-6 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
    <div className="flex items-center justify-between">
      <div>
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          {countryName ? `Explore ${countryName}` : 'Explore Region'}
        </h3>
        {selectedOption && (
          <button
            className={`text-sm flex items-center gap-1 mt-2 transition-colors px-3 py-1.5 rounded-lg font-medium ${isDarkMode ? 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            onClick={() => setSelectedOption(null)}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}
      </div>
      <button
        className={`p-2 rounded-xl transition-all duration-200 ${isDarkMode
            ? 'hover:bg-white/10 text-gray-400 hover:text-gray-200'
            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
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