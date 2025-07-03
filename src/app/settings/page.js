"use client";

import Link from "next/link";
import styles from './settings.module.css';
import { useTheme } from '../../contexts/ThemeContext';
import { useState } from 'react';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [subwayLine, setSubwayLine] = useState('G'); // Default to G train
  const [mtaStation, setMtaStation] = useState('');

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const handleSubwayLineChange = (e) => {
    setSubwayLine(e.target.value);
    // Reset station when line changes
    setMtaStation('');
  };

  const handleStationChange = (e) => {
    setMtaStation(e.target.value);
  };

  // Station options based on selected line
  const getStationOptions = () => {
    if (subwayLine === 'G') {
      return [
        { value: '', label: 'Select a station...' },
        { value: 'greenpoint', label: 'Greenpoint Avenue' },
        { value: 'nassau', label: 'Nassau Avenue' },
        { value: 'metropolitan', label: 'Metropolitan Avenue' },
        { value: 'broadway', label: 'Broadway' },
        { value: 'flushing', label: 'Flushing Avenue' },
        { value: 'myrtle-willoughby', label: 'Myrtle-Willoughby' },
        { value: 'bedford-nostrand', label: 'Bedford-Nostrand' },
        { value: 'classon', label: 'Classon Avenue' },
        { value: 'clinton-washington', label: 'Clinton-Washington' },
        { value: 'fulton', label: 'Fulton Street' },
        { value: 'hoyt-schermerhorn', label: 'Hoyt-Schermerhorn' },
        { value: 'bergen', label: 'Bergen Street' },
        { value: 'carroll', label: 'Carroll Street' },
        { value: 'smith-9th', label: 'Smith-9th Streets' },
        { value: '4th-9th', label: '4th Avenue-9th Street' },
        { value: '7th-avenue', label: '7th Avenue' },
        { value: '15th-prospect', label: '15th Street-Prospect Park' },
        { value: 'fort-hamilton', label: 'Fort Hamilton Parkway' },
        { value: 'church', label: 'Church Avenue' }
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
                        value={mtaStation}
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