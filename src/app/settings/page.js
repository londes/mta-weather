"use client";

import Link from "next/link";
import styles from './settings.module.css';
import { useTheme } from '../../contexts/ThemeContext';
import { useStation } from '../../contexts/StationContext';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { selectedLine, setSelectedLine, selectedStation, setSelectedStation, getAvailableStations } = useStation();

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
        { value: 'metropolitan-lorimer', label: 'Metropolitan Ave/Lorimer St' },
        { value: 'myrtle-willoughby', label: 'Myrtle-Willoughby Avs' },
        { value: 'bedford-nostrand', label: 'Bedford-Nostrand Avs' },
        { value: 'classon-ave', label: 'Classon Ave' },
        { value: 'clinton-washington', label: 'Clinton-Washington Avs' }
      ];
    } else if (selectedLine === 'L') {
      return [
        { value: '', label: 'Select a station' },
        // Manhattan stations
        { value: '8th-ave', label: '8 Av)' },
        { value: '6th-ave', label: '6 Av' },
        { value: 'union-square', label: '14 St-Union Sq' },
        { value: '3rd-ave', label: '3 Av' },
        { value: '1st-ave', label: '1 Av' },
        // Brooklyn stations
        { value: 'bedford-ave', label: 'Bedford Av' },
        { value: 'lorimer-st', label: 'Lorimer St' },
        { value: 'graham-ave', label: 'Graham Av' },
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
        { value: 'canarsie-rockaway', label: 'Canarsie-Rockaway Pkwy' }
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
                    <h4>Weather</h4>
                    <label htmlFor='zipCode'>Zip Code</label>
                    <input type="text" id="zipCode" name="zipCode" className={styles.inputField} />
                </div>
            </form>
        </div>
    </div>
  );
} 