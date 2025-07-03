"use client";

import Link from "next/link";
import styles from './settings.module.css';
import { useTheme } from '../../contexts/ThemeContext';
import { useStation } from '../../contexts/StationContext';
import { useState } from 'react';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { selectedStation, setSelectedStation } = useStation();
  const [subwayLine, setSubwayLine] = useState('G'); // Default to G train

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const handleSubwayLineChange = (e) => {
    setSubwayLine(e.target.value);
    // Reset station when line changes
    setSelectedStation('');
  };

  const handleStationChange = (e) => {
    setSelectedStation(e.target.value);
  };

  // Station options based on selected line
  const getStationOptions = () => {
    if (subwayLine === 'G') {
      return [
        { value: '', label: 'Select a station...' },
        { value: 'court-sq', label: 'Court Square' },
        { value: '21st-st', label: '21st St-Queensbridge' },
        { value: 'greenpoint', label: 'Greenpoint Avenue' },
        { value: 'nassau', label: 'Nassau Avenue' },
        { value: 'manhattan', label: 'Manhattan Avenue' },
        { value: 'graham', label: 'Graham Avenue' },
        { value: 'grand-st', label: 'Grand Street' },
        { value: 'metropolitan', label: 'Metropolitan Avenue' }
      ];
    } else if (subwayLine === 'L') {
      return [
        { value: '', label: 'Select a station...' },
        { value: 'coming-soon', label: 'L train stations - Coming Soon!' }
      ];
    }
    return [{ value: '', label: 'Select a line first...' }];
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
                        value={subwayLine}
                        onChange={handleSubwayLineChange}
                        className={styles.selectField}
                    >
                        <option value="G">🟢 G Train (Crosstown)</option>
                        <option value="L">🔵 L Train (14th Street-Canarsie) - Coming Soon!</option>
                    </select>
                    <label htmlFor="mtaStation">MTA Station</label>
                    <select 
                        id="mtaStation" 
                        name="mtaStation"
                        value={selectedStation}
                        onChange={handleStationChange}
                        className={styles.selectField}
                        disabled={!subwayLine}
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