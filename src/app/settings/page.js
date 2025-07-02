"use client";

import Link from "next/link";
import styles from './settings.module.css';
import { useTheme } from '../../contexts/ThemeContext';

export default function Settings() {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
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
                    <h4>Subway Line & Station</h4>
                    <label htmlFor='subwayLine'>Subway Line</label>
                    <input type="dropdown" id="subwayLine" name="subwayLine" />
                    <label htmlFor="mtaStation">MTA Station</label>
                    <input type="dropdown" id="mtaStation" name="mtaStation" /> 
                </div>
                <div className={styles.formGroup}>
                    <h4>Weather</h4>
                    <label htmlFor='zipCode'>Zip Code</label>
                    <input type="text" id="zipCode" name="zipCode" />
                </div>
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
                <button type="submit" className={styles.submitButton}>Save</button>
            </form>
        </div>
    </div>
  );
} 