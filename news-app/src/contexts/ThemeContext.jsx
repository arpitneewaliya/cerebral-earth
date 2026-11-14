import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  isDarkMode: true,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('cerebral_theme');
      if (saved !== null) {
        return saved === 'dark';
      }
      const legacy = localStorage.getItem('darkMode');
      if (legacy !== null) {
        return legacy === 'true';
      }
    } catch (e) {
      // ignore storage errors
    }
    return true; // Default to Dark Tactical Mode
  });

  useEffect(() => {
    try {
      localStorage.setItem('cerebral_theme', isDarkMode ? 'dark' : 'light');
      localStorage.setItem('darkMode', String(isDarkMode));
    } catch (e) {
      // ignore storage errors
    }

    if (isDarkMode) {
      document.body.classList.add('dark');
      document.documentElement.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
