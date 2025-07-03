"use client";

import { createContext, useContext, useEffect, useState } from 'react';

const StationContext = createContext();

export function useStation() {
  const context = useContext(StationContext);
  if (!context) {
    throw new Error('useStation must be used within a StationProvider');
  }
  return context;
}

// Station mapping from dropdown values to MTA station IDs and display names
const stationMapping = {
  'court-sq': {
    displayName: 'Court Square',
    northboundId: 'G22N',
    southboundId: 'G22S'
  },
  '21st-st': {
    displayName: '21st St-Queensbridge',
    northboundId: 'G24N',
    southboundId: 'G24S'
  },
  'greenpoint': {
    displayName: 'Greenpoint Avenue',
    northboundId: 'G26N',
    southboundId: 'G26S'
  },
  'nassau': {
    displayName: 'Nassau Avenue',
    northboundId: 'G28N',
    southboundId: 'G28S'
  },
  'manhattan': {
    displayName: 'Manhattan Avenue',
    northboundId: 'G29N',
    southboundId: 'G29S'
  },
  'graham': {
    displayName: 'Graham Avenue',
    northboundId: 'G30N',
    southboundId: 'G30S'
  },
  'grand-st': {
    displayName: 'Grand Street',
    northboundId: 'G31N',
    southboundId: 'G31S'
  },
  'metropolitan': {
    displayName: 'Metropolitan Avenue',
    northboundId: 'G32N',
    southboundId: 'G32S'
  }
};

export function StationProvider({ children }) {
  const [selectedStation, setSelectedStation] = useState('greenpoint'); // Default to Greenpoint

  // Load saved station from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('selectedStation');
    if (saved && stationMapping[saved]) {
      setSelectedStation(saved);
    }
  }, []);

  // Save station to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('selectedStation', selectedStation);
  }, [selectedStation]);

  // Get current station info
  const getCurrentStation = () => {
    return stationMapping[selectedStation] || stationMapping['greenpoint'];
  };

  const value = {
    selectedStation,
    setSelectedStation,
    getCurrentStation,
    stationMapping
  };

  return (
    <StationContext.Provider value={value}>
      {children}
    </StationContext.Provider>
  );
} 