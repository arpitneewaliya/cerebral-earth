import React, { useState } from 'react';

const Header = ({ isDarkMode, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={`fixed top-0 left-0 right-0 z-[1001] backdrop-blur-md border-b transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-black border-gray-700 text-white' 
        : 'bg-white/90 border-gray-200 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            {/* <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
            }`}>
              <span className="text-white font-bold text-lg">🌍</span>
            </div> */}
            <div>
              <h1 className="text-xl font-bold tracking-tight">Cerebral Earth</h1>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Explore news and data worldwide
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700'
              }`}
            >
              Explore Map
            </a>
            <a 
              href="#" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700'
              }`}
            >
              Global News
            </a>
            <a 
              href="#" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700'
              }`}
            >
              Analytics
            </a>
          </nav>

          {/* Theme Toggle and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`md:hidden py-4 border-t ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <nav className="flex flex-col space-y-3">
              <a 
                href="#" 
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700'
                }`}
              >
                Explore Map
              </a>
              <a 
                href="#" 
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700'
                }`}
              >
                Global News
              </a>
              <a 
                href="#" 
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700'
                }`}
              >
                Analytics
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;