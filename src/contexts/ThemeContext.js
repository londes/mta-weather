"use client";

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('system'); // 'light', 'dark', or 'system'

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    
    if (theme === 'system') {
      // Remove data-theme attribute to use system preference
      root.removeAttribute('data-theme');
    } else {
      // Set explicit theme
      root.setAttribute('data-theme', theme);
    }
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const value = {
    theme,
    setTheme,
    toggleTheme: () => {
      setTheme(current => {
        if (current === 'light') return 'dark';
        if (current === 'dark') return 'system';
        return 'light';
      });
    }
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 