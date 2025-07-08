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
  // G Train stations (North to South: Court Square to Metropolitan Ave/Lorimer St)
  'court-square': {
    displayName: 'Court Square',
    northboundId: 'G22N',
    southboundId: 'G22S'
  },
  '21st-st': {
    displayName: '21st St-Queensbridge',
    northboundId: 'G24N',
    southboundId: 'G24S'
  },
  'greenpoint-ave': {
    displayName: 'Greenpoint Ave',
    northboundId: 'G26N',
    southboundId: 'G26S'
  },
  'nassau-ave': {
    displayName: 'Nassau Ave', 
    northboundId: 'G28N',
    southboundId: 'G28S'
  },
  'manhattan-ave': {
    displayName: 'Manhattan Ave',
    northboundId: 'G29N',
    southboundId: 'G29S'
  },
  'graham-ave': {
    displayName: 'Graham Ave',
    northboundId: 'G30N',
    southboundId: 'G30S'
  },
  'grand-st-g': {
    displayName: 'Grand St',
    northboundId: 'G31N',
    southboundId: 'G31S'
  },
  'metropolitan-lorimer': {
    displayName: 'Metropolitan Ave/Lorimer St',
    northboundId: 'G32N',
    southboundId: 'G32S'
  },

  // L Train stations - Manhattan (5 stations)
  '8th-ave': {
    displayName: '8 Av',
    eastboundId: 'L01N',
    westboundId: 'L01S'
  },
  '6th-ave': {
    displayName: '6 Av',
    eastboundId: 'L02N',
    westboundId: 'L02S'
  },
  'union-square': {
    displayName: '14 St-Union Sq',
    eastboundId: 'L03N',
    westboundId: 'L03S'
  },
  '3rd-ave': {
    displayName: '3 Av',
    eastboundId: 'L05N',
    westboundId: 'L05S'
  },
  '1st-ave': {
    displayName: '1 Av',
    eastboundId: 'L06N',
    westboundId: 'L06S'
  },

  // L Train stations - Brooklyn (19 stations)
  'bedford-ave': {
    displayName: 'Bedford Av',
    eastboundId: 'L08N',
    westboundId: 'L08S'
  },
  'lorimer-st': {
    displayName: 'Lorimer St',
    eastboundId: 'L10N',
    westboundId: 'L10S'
  },
  'graham-ave-l': {
    displayName: 'Graham Av',
    eastboundId: 'L11N',
    westboundId: 'L11S'
  },
  'grand-st': {
    displayName: 'Grand St',
    eastboundId: 'L12N',
    westboundId: 'L12S'
  },
  'montrose-ave': {
    displayName: 'Montrose Av',
    eastboundId: 'L13N',
    westboundId: 'L13S'
  },
  'morgan-ave': {
    displayName: 'Morgan Av',
    eastboundId: 'L14N',
    westboundId: 'L14S'
  },
  'jefferson-st': {
    displayName: 'Jefferson St',
    eastboundId: 'L15N',
    westboundId: 'L15S'
  },
  'dekalb-ave': {
    displayName: 'DeKalb Av',
    eastboundId: 'L16N',
    westboundId: 'L16S'
  },
  'myrtle-wyckoff': {
    displayName: 'Myrtle-Wyckoff Avs',
    eastboundId: 'L17N',
    westboundId: 'L17S'
  },
  'halsey-st': {
    displayName: 'Halsey St',
    eastboundId: 'L19N',
    westboundId: 'L19S'
  },
  'wilson-ave': {
    displayName: 'Wilson Av',
    eastboundId: 'L20N',
    westboundId: 'L20S'
  },
  'bushwick-aberdeen': {
    displayName: 'Bushwick Av-Aberdeen St',
    eastboundId: 'L21N',
    westboundId: 'L21S'
  },
  'broadway-junction': {
    displayName: 'Broadway Junction',
    eastboundId: 'L22N',
    westboundId: 'L22S'
  },
  'atlantic-ave': {
    displayName: 'Atlantic Av',
    eastboundId: 'L24N',
    westboundId: 'L24S'
  },
  'sutter-ave': {
    displayName: 'Sutter Av',
    eastboundId: 'L25N',
    westboundId: 'L25S'
  },
  'livonia-ave': {
    displayName: 'Livonia Av',
    eastboundId: 'L26N',
    westboundId: 'L26S'
  },
  'new-lots-ave': {
    displayName: 'New Lots Av',
    eastboundId: 'L27N',
    westboundId: 'L27S'
  },
  'east-105th-st': {
    displayName: 'East 105 St',
    eastboundId: 'L28N',
    westboundId: 'L28S'
  },
  'canarsie-rockaway': {
    displayName: 'Canarsie-Rockaway Pkwy',
    eastboundId: 'L29N',
    westboundId: 'L29S'
  }
};

export function StationProvider({ children }) {
  const [selectedLine, setSelectedLine] = useState('G'); // Default to G train
  const [selectedStation, setSelectedStation] = useState('greenpoint-ave'); // Default to Greenpoint Ave

  // Load saved selections from localStorage on mount
  useEffect(() => {
    const savedLine = localStorage.getItem('selectedLine');
    const savedStation = localStorage.getItem('selectedStation');
    
    if (savedLine) {
      setSelectedLine(savedLine);
    }
    
    if (savedStation && stationMapping[savedStation]) {
      setSelectedStation(savedStation);
    } else if (savedLine === 'L') {
      // Default to 8th Avenue for L train
      setSelectedStation('8th-ave');
    } else {
      // Default to Greenpoint Ave for G train or if no valid saved station
      setSelectedStation('greenpoint-ave');
    }
  }, []);

  // Save selections to localStorage when they change
  useEffect(() => {
    localStorage.setItem('selectedLine', selectedLine);
  }, [selectedLine]);

  useEffect(() => {
    localStorage.setItem('selectedStation', selectedStation);
  }, [selectedStation]);

  useEffect(() => {
    // Set default station when line changes
    if (selectedLine && !selectedStation) {
      if (selectedLine === 'G') {
        setSelectedStation('greenpoint-ave'); // Default G train station
      } else if (selectedLine === 'L') {
        setSelectedStation('8th-ave'); // Default L train station (Manhattan terminal)
      }
    }
  }, [selectedLine, selectedStation]);

  // Get current station info
  const getCurrentStation = () => {
    if (!selectedStation || !selectedLine) {
      return null;
    }
    
    return stationMapping[selectedStation] || null;
  };

  // Get available stations for the current line
  const getAvailableStations = (line = selectedLine) => {
    return stationMapping[line] || {};
  };

  const value = {
    selectedLine,
    setSelectedLine,
    selectedStation,
    setSelectedStation,
    getCurrentStation,
    getAvailableStations,
    stationMapping
  };

  return (
    <StationContext.Provider value={value}>
      {children}
    </StationContext.Provider>
  );
} 