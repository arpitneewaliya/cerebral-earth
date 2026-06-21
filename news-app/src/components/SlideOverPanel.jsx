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
  const [position, setPosition] = React.useState({ x: null, y: 80 });
  const [size, setSize] = React.useState({ width: 460, height: 600 });

  // Initialize position to the top-right on open
  React.useEffect(() => {
    if (isOpen && position.x === null) {
      const defaultWidth = Math.min(460, window.innerWidth - 32);
      const defaultHeight = Math.min(600, window.innerHeight - 100);
      setPosition({
        x: window.innerWidth - defaultWidth - 16,
        y: 80
      });
      setSize({
        width: defaultWidth,
        height: defaultHeight
      });
    }
  }, [isOpen, position.x]);

  // Keep panel within screen bounds on window resize
  React.useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        if (prev.x === null) return prev;
        const maxX = window.innerWidth - size.width - 8;
        const maxY = window.innerHeight - 50;
        const newX = Math.max(8, Math.min(prev.x, maxX));
        const newY = Math.max(72, Math.min(prev.y, maxY));
        return { x: newX, y: newY };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [size.width]);

  if (!isOpen) return null;

  // Pointer drag handler for moving the panel via its header
  const handleDragStart = (e) => {
    if (e.button !== 0) return; // Only allow drag with left/primary click
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) {
      return; // Ignore drag if interacting with buttons/inputs
    }

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = position.x ?? (window.innerWidth - size.width - 16);
    const initialY = position.y;

    const handlePointerMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newX = initialX + deltaX;
      let newY = initialY + deltaY;

      const maxX = window.innerWidth - size.width - 8;
      const maxY = window.innerHeight - 50;

      newX = Math.max(8, Math.min(newX, maxX));
      newY = Math.max(72, Math.min(newY, maxY));

      setPosition({ x: newX, y: newY });
    };

    const handlePointerUp = () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  // Pointer handler for resizing from the left edge (width adjustment)
  const handleResizeLeft = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const initialWidth = size.width;
    const initialX = position.x ?? (window.innerWidth - size.width - 16);

    const handlePointerMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      let newWidth = initialWidth - deltaX;

      const minWidth = 360;
      const maxWidth = Math.min(800, window.innerWidth - 32);

      if (newWidth < minWidth) newWidth = minWidth;
      if (newWidth > maxWidth) newWidth = maxWidth;

      const actualDeltaX = initialWidth - newWidth;
      const newX = initialX + actualDeltaX;

      setSize((prev) => ({ ...prev, width: newWidth }));
      setPosition((prev) => ({ ...prev, x: newX }));
    };

    const handlePointerUp = () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  // Pointer handler for resizing from the bottom edge (height adjustment)
  const handleResizeBottom = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const startY = e.clientY;
    const initialHeight = size.height;

    const handlePointerMove = (moveEvent) => {
      const deltaY = moveEvent.clientY - startY;
      let newHeight = initialHeight + deltaY;

      const minHeight = 350;
      const maxHeight = window.innerHeight - (position.y ?? 80) - 16;

      if (newHeight < minHeight) newHeight = minHeight;
      if (newHeight > maxHeight) newHeight = maxHeight;

      setSize((prev) => ({ ...prev, height: newHeight }));
    };

    const handlePointerUp = () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  // Pointer handler for resizing from the bottom-left corner (both width & height)
  const handleResizeBottomLeft = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const initialWidth = size.width;
    const initialHeight = size.height;
    const initialX = position.x ?? (window.innerWidth - size.width - 16);

    const handlePointerMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      // Width & X
      let newWidth = initialWidth - deltaX;
      const minWidth = 360;
      const maxWidth = Math.min(800, window.innerWidth - 32);
      if (newWidth < minWidth) newWidth = minWidth;
      if (newWidth > maxWidth) newWidth = maxWidth;

      const actualDeltaX = initialWidth - newWidth;
      const newX = initialX + actualDeltaX;

      // Height
      let newHeight = initialHeight + deltaY;
      const minHeight = 350;
      const maxHeight = window.innerHeight - (position.y ?? 80) - 16;
      if (newHeight < minHeight) newHeight = minHeight;
      if (newHeight > maxHeight) newHeight = maxHeight;

      setSize({ width: newWidth, height: newHeight });
      setPosition((prev) => ({ ...prev, x: newX }));
    };

    const handlePointerUp = () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <>
      {/* Floating Card Panel */}
      <div 
        className={`fixed z-[1002] shadow-2xl rounded-2xl border flex flex-col ${
          isDarkMode 
            ? 'bg-zinc-950/90 backdrop-blur-xl border-zinc-800 text-zinc-50' 
            : 'bg-white/90 backdrop-blur-xl border-zinc-200 text-zinc-950'
        }`}
        style={{
          left: position.x !== null ? `${position.x}px` : undefined,
          top: position.y !== null ? `${position.y}px` : '80px',
          width: `${size.width}px`,
          height: `${size.height}px`,
          right: position.x === null ? '16px' : undefined,
        }}
      >
        {/* Left Resize Handle */}
        <div 
          onPointerDown={handleResizeLeft}
          className="absolute left-0 top-0 bottom-0 w-1.5 cursor-ew-resize hover:bg-zinc-500/20 active:bg-zinc-500/40 transition-colors z-[1003]"
          title="Drag to resize width"
        />

        {/* Bottom Resize Handle */}
        <div 
          onPointerDown={handleResizeBottom}
          className="absolute left-0 right-0 bottom-0 h-1.5 cursor-ns-resize hover:bg-zinc-500/20 active:bg-zinc-500/40 transition-colors z-[1003]"
          title="Drag to resize height"
        />

        {/* Bottom-Left Corner Resize Handle */}
        <div 
          onPointerDown={handleResizeBottomLeft}
          className="absolute left-0 bottom-0 w-4 h-4 cursor-nesw-resize z-[1004] flex items-end justify-start p-0.5"
          title="Drag to resize width and height"
        >
          <svg className={`w-2.5 h-2.5 opacity-40 hover:opacity-100 transition-opacity ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`} viewBox="0 0 10 10">
            <line x1="0" y1="10" x2="10" y2="0" stroke="currentColor" strokeWidth="1.5" />
            <line x1="3" y1="10" x2="10" y2="3" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Panel Header */}
        <PanelHeader
          countryName={countryName}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          onClose={onClose}
          isDarkMode={isDarkMode}
          onPointerDown={handleDragStart}
        />

        {/* Panel Content - Scrollable Area */}
        <div className="flex-1 min-h-0 overflow-y-scroll relative"
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
  isDarkMode,
  onPointerDown
}) => (
  <div 
    onPointerDown={onPointerDown}
    className={`flex-shrink-0 p-6 border-b cursor-grab active:cursor-grabbing select-none touch-none ${
      isDarkMode ? 'border-zinc-800 bg-zinc-950/50' : 'border-zinc-200 bg-white/50'
    }`}
  >
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