import React from 'react';
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
      <div className={`fixed top-0 right-0 h-full w-[720px] max-w-[90vw] z-[1002] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
        isDarkMode ? 'bg-black' : 'bg-white'
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
  <div className={`flex-shrink-0 p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
    <div className="flex items-center justify-between">
      <div>
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          {countryName ? `Explore ${countryName}` : 'Explore Region'}
        </h3>
        {selectedOption && (
          <button
            className={`text-lg flex items-center gap-1 mt-1 transition-colors border-2 p-1  ${
              isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
            }`}
            onClick={() => setSelectedOption(null)}
          >
            Back
          </button>
        )}
      </div>
      <button
        className={`p-2 rounded-lg transition-colors ${
          isDarkMode 
            ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' 
            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
        }`}
        onClick={onClose}
        aria-label="Close panel"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
);

export default SlideOverPanel;