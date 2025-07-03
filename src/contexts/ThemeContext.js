"use client";

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('auto'); // 'light', 'dark', or 'auto'
  const [sunriseTime, setSunriseTime] = useState(null);
  const [sunsetTime, setSunsetTime] = useState(null);

  // Fetch sunrise/sunset times from weather API
  const fetchSunriseSunset = async () => {
    try {
      const response = await fetch('/api/weather');
      const data = await response.json();
      
      if (data.daily_forecast && data.daily_forecast[0]) {
        const today = data.daily_forecast[0];
        setSunriseTime(new Date(today.sunrise));
        setSunsetTime(new Date(today.sunset));
        
        console.log('Sunrise/Sunset updated:', {
          sunrise: today.sunrise,
          sunset: today.sunset
        });
      }
    } catch (error) {
      console.error('Failed to fetch sunrise/sunset:', error);
    }
  };

  // Determine theme based on current time vs sunrise/sunset
  const determineAutoTheme = () => {
    if (!sunriseTime || !sunsetTime) return 'light'; // fallback
    
    const now = new Date();
    const isDay = now >= sunriseTime && now < sunsetTime;
    
    console.log('Auto theme calculation:', {
      now: now.toLocaleTimeString(),
      sunrise: sunriseTime.toLocaleTimeString(),
      sunset: sunsetTime.toLocaleTimeString(),
      isDay,
      selectedTheme: isDay ? 'light' : 'dark'
    });
    
    return isDay ? 'light' : 'dark';
  };

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'auto';
    setTheme(savedTheme);
    
    // Fetch initial sunrise/sunset data
    fetchSunriseSunset();
  }, []);

  useEffect(() => {
    // Set up interval to refresh sunrise/sunset data every 30 minutes
    // (matches weather data refresh interval)
    const interval = setInterval(fetchSunriseSunset, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    
    let actualTheme;
    if (theme === 'auto') {
      actualTheme = determineAutoTheme();
    } else {
      actualTheme = theme;
    }
    
    root.setAttribute('data-theme', actualTheme);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme, sunriseTime, sunsetTime]);

  // Set up interval to re-evaluate auto theme every minute
  useEffect(() => {
    if (theme === 'auto') {
      const interval = setInterval(() => {
        const root = document.documentElement;
        const actualTheme = determineAutoTheme();
        root.setAttribute('data-theme', actualTheme);
      }, 60000); // Check every minute
      
      return () => clearInterval(interval);
    }
  }, [theme, sunriseTime, sunsetTime]);

  const value = {
    theme,
    setTheme,
    sunriseTime,
    sunsetTime,
    toggleTheme: () => {
      setTheme(current => {
        if (current === 'light') return 'dark';
        if (current === 'dark') return 'auto';
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