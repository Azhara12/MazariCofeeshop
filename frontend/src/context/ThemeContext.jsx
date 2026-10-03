import React, { createContext, useContext } from 'react';

// Theme is permanently LIGHT — no dark mode, no toggle.
// The html element never gets the `.dark` class.
const ThemeContext = createContext({ darkMode: false, toggleTheme: () => {} });

export const ThemeProvider = ({ children }) => {
  // Ensure .dark is always absent from <html>
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('theme');
  }

  return (
    <ThemeContext.Provider value={{ darkMode: false, toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);