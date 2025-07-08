"use client";

import Link from "next/link";
import styles from './settings.module.css';
import { useTheme } from '../../contexts/ThemeContext';
import { useStation } from '../../contexts/StationContext';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { selectedLine, setSelectedLine, selectedStation, setSelectedStation, selectedZipCode, setSelectedZipCode, getAvailableStations } = useStation();

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const handleSubwayLineChange = (e) => {
    const newLine = e.target.value;
    setSelectedLine(newLine);
    
    // Set appropriate default station for each line
    if (newLine === 'G') {
      setSelectedStation('greenpoint-ave'); // OG Greenpoint Ave station
    } else if (newLine === 'L') {
      setSelectedStation('8th-ave'); // Manhattan terminal
    } else {
      setSelectedStation('');
    }
  };

  const handleStationChange = (e) => {
    setSelectedStation(e.target.value);
  };

  const handleZipCodeChange = (e) => {
    setSelectedZipCode(e.target.value);
  };

  // Predefined borough zip codes
  const boroughZipCodes = [
    { value: '', label: 'Select a borough' },
    { value: '10009', label: '🗽 Manhattan' },
    { value: '11222', label: '🌉 Brooklyn' },
    { value: '11367', label: '🏙️ Queens' },
    { value: '10457', label: '🏟️ Bronx' },
    { value: '10314', label: '🚢 Staten Island' },
    { value: 'custom', label: '✏️ Custom ZIP Code' }
  ];

  // Station options based on selected line
  const getStationOptions = () => {
    if (selectedLine === 'G') {
      return [
        { value: '', label: 'Select a station' },
        { value: 'court-square', label: 'Court Square' },
        { value: '21st-st', label: '21st St-Queensbridge' },
        { value: 'greenpoint-ave', label: 'Greenpoint Ave' },
        { value: 'nassau-ave', label: 'Nassau Ave' },
        { value: 'manhattan-ave', label: 'Manhattan Ave' },
        { value: 'graham-ave', label: 'Graham Ave' },
        { value: 'grand-st-g', label: 'Grand St' },
        { value: 'metropolitan-lorimer', label: 'Metropolitan Ave/Lorimer St' }
      ];
    } else if (selectedLine === 'L') {
      return [
        { value: '', label: 'Select a station' },
        // Manhattan stations
        { value: '8th-ave', label: '8 Av (Manhattan Terminal)' },
        { value: '6th-ave', label: '6 Av' },
        { value: 'union-square', label: '14 St-Union Sq' },
        { value: '3rd-ave', label: '3 Av' },
        { value: '1st-ave', label: '1 Av' },
        // Brooklyn stations
        { value: 'bedford-ave', label: 'Bedford Av' },
        { value: 'lorimer-st', label: 'Lorimer St' },
        { value: 'graham-ave-l', label: 'Graham Av' },
        { value: 'grand-st', label: 'Grand St' },
        { value: 'montrose-ave', label: 'Montrose Av' },
        { value: 'morgan-ave', label: 'Morgan Av' },
        { value: 'jefferson-st', label: 'Jefferson St' },
        { value: 'dekalb-ave', label: 'DeKalb Av' },
        { value: 'myrtle-wyckoff', label: 'Myrtle-Wyckoff Avs' },
        { value: 'halsey-st', label: 'Halsey St' },
        { value: 'wilson-ave', label: 'Wilson Av' },
        { value: 'bushwick-aberdeen', label: 'Bushwick Av-Aberdeen St' },
        { value: 'broadway-junction', label: 'Broadway Junction' },
        { value: 'atlantic-ave', label: 'Atlantic Av' },
        { value: 'sutter-ave', label: 'Sutter Av' },
        { value: 'livonia-ave', label: 'Livonia Av' },
        { value: 'new-lots-ave', label: 'New Lots Av' },
        { value: 'east-105th-st', label: 'East 105 St' },
        { value: 'canarsie-rockaway', label: 'Canarsie-Rockaway Pkwy (Brooklyn Terminal)' }
      ];
    }
    return [{ value: '', label: 'Select a line first' }];
  };

  return (
    <div className={styles.container}>
        <Link href="/" className={styles.backButton}>
            ←
        </Link>
        <div className={styles.header}>
            <h3 className={styles.title}>NYC Companion</h3>
            <h2 className={styles.subtitle}>Settings</h2>
        </div>
        <div className={styles.settingsContainer}>
            <form>
                <div className={styles.formGroup}>
                    <h4>Theme</h4>
                    <div className={styles.radioGroup}>
                        <label className={styles.radioLabel}>
                            <input 
                                type="radio" 
                                name="theme" 
                                value="light" 
                                checked={theme === 'light'}
                                onChange={handleThemeChange}
                            />
                            Light
                        </label>
                        <label className={styles.radioLabel}>
                            <input 
                                type="radio" 
                                name="theme" 
                                value="dark" 
                                checked={theme === 'dark'}
                                onChange={handleThemeChange}
                            />
                            Dark
                        </label>
                        <label className={styles.radioLabel}>
                            <input 
                                type="radio" 
                                name="theme" 
                                value="auto" 
                                checked={theme === 'auto'}
                                onChange={handleThemeChange}
                            />
                            Auto (Sunrise/Sunset)
                        </label>
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <h4>Subway Line & Station</h4>
                    <label htmlFor='subwayLine'>Subway Line</label>
                    <select 
                        id="subwayLine" 
                        name="subwayLine" 
                        value={selectedLine}
                        onChange={handleSubwayLineChange}
                        className={styles.selectField}
                    >
                        <option value="G">🟢 G Train (Crosstown)</option>
                        <option value="L">🔵 L Train (14th Street-Canarsie)</option>
                    </select>
                    <label htmlFor="mtaStation">MTA Station</label>
                    <select 
                        id="mtaStation" 
                        name="mtaStation"
                        value={selectedStation}
                        onChange={handleStationChange}
                        className={styles.selectField}
                        disabled={!selectedLine}
                    >
                        {getStationOptions().map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <h4>Weather Location</h4>
                    <label htmlFor='borough'>Borough</label>
                    <select 
                        id="borough" 
                        name="borough" 
                        value={boroughZipCodes.find(b => b.value === selectedZipCode) ? selectedZipCode : 'custom'}
                        onChange={(e) => {
                            if (e.target.value === 'custom') {
                                // Don't change selectedZipCode, just let user type
                            } else {
                                setSelectedZipCode(e.target.value);
                            }
                        }}
                        className={styles.selectField}
                    >
                        {boroughZipCodes.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <label htmlFor='zipCode'>ZIP Code</label>
                    <input 
                        type="text" 
                        id="zipCode" 
                        name="zipCode" 
                        value={selectedZipCode}
                        onChange={handleZipCodeChange}
                        className={styles.inputField}
                        placeholder="Enter ZIP code (e.g., 11222)"
                        maxLength="5"
                        pattern="[0-9]{5}"
                    />
                </div>
            </form>
        </div>
    </div>
  );
} 