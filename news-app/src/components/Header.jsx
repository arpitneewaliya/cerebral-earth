import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Sun, Moon, Layers } from 'lucide-react';

const Header = ({ isDarkMode, toggleTheme, onActivateLayers }) => {
  const [isDockOpen, setIsDockOpen] = useState(false);
  const panelRef = useRef(null);

  // Close dock on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isDockOpen) {
        setIsDockOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDockOpen]);

  return (
    <>
      {/* Hamburger Trigger Button — always visible when dock is closed */}
      {!isDockOpen && (
        <button
          onClick={() => setIsDockOpen(true)}
          className={`fixed top-4 left-4 z-[1001] w-10 h-10 flex items-center justify-center rounded-xl shadow-lg border transition-all duration-200 backdrop-blur-md ${
            isDarkMode
              ? 'bg-zinc-900/80 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white'
              : 'bg-white/80 border-zinc-200 text-zinc-600 hover:bg-white hover:text-zinc-900'
          }`}
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Backdrop — transparent click-catcher to close dock */}
      {isDockOpen && (
        <div
          className="fixed inset-0 z-[1000]"
          onClick={() => setIsDockOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Left Dock Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 left-0 h-screen w-[280px] z-[1001] flex flex-col border-r transition-transform duration-300 ease-in-out ${
          isDockOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isDarkMode
            ? 'bg-zinc-950/90 backdrop-blur-xl border-zinc-800 text-zinc-50'
            : 'bg-white/90 backdrop-blur-xl border-zinc-200 text-zinc-900'
        }`}
        style={{ borderTopRightRadius: '1rem', borderBottomRightRadius: '1rem' }}
      >
        {/* Panel Header — Close Button */}
        <div className={`flex items-center justify-between px-5 pt-5 pb-3`}>
          <div />
          <button
            onClick={() => setIsDockOpen(false)}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDarkMode
                ? 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-50'
                : 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900'
            }`}
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* App Branding */}
        <div className="px-6 pb-5">
          <h1 className="text-xl font-bold tracking-tight">Cerebral Earth</h1>
          <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Explore news and data worldwide
          </p>
        </div>

        {/* Divider */}
        <div className={`mx-5 border-t ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`} />

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 px-4 pt-4">
          <NavLink 
            icon={Layers} 
            label="Activate Layers" 
            isDarkMode={isDarkMode} 
            onClick={() => {
              onActivateLayers();
              setIsDockOpen(false);
            }} 
          />
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Section — Theme Toggle */}
        <div className={`mx-5 border-t ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`} />
        <div className="px-4 py-4">
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isDarkMode
                ? 'text-zinc-300 hover:text-white hover:bg-zinc-800/80'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </div>
    </>
  );
};

const NavLink = ({ icon: Icon, label, isDarkMode, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left ${
      isDarkMode
        ? 'text-zinc-300 hover:text-white hover:bg-white/10'
        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
    }`}
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </button>
);

export default Header;