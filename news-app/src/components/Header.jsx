import React, { useState } from 'react';
import { Globe, Newspaper, LineChart, Menu, X, Sun, Moon } from 'lucide-react';

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
            <div>
              <h1 className="text-xl font-bold tracking-tight">Cerebral Earth</h1>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Explore news and data worldwide
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <a 
              href="#" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isDarkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Explore</span>
            </a>
            <a 
              href="#" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isDarkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>Global News</span>
            </a>
            <a 
              href="#" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isDarkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <LineChart className="w-4 h-4" />
              <span>Analytics</span>
            </a>
          </nav>

          {/* Theme Toggle and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-xl transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
                className={`flex items-center space-x-2 p-3 rounded-xl text-sm font-medium transition-all ${
                  isDarkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Explore</span>
              </a>
              <a 
                href="#" 
                className={`flex items-center space-x-2 p-3 rounded-xl text-sm font-medium transition-all ${
                  isDarkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Newspaper className="w-4 h-4" />
                <span>Global News</span>
              </a>
              <a 
                href="#" 
                className={`flex items-center space-x-2 p-3 rounded-xl text-sm font-medium transition-all ${
                  isDarkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <LineChart className="w-4 h-4" />
                <span>Analytics</span>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;