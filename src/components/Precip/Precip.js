"use client";

import { useEffect, useState } from "react";    
import styles from './Precip.module.css';

export default function Precip() {
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        fetch("/api/weather")
            .then(res => res.json())
            .then(data => {
                console.log("data received:", data);
                setWeatherData(data)});
    }, []);

    return <div className={styles.container}>
        <div className={styles.precipitationChart}>
            {/* Chart content */}
        </div>
        <div className={styles.hourlyItem}>
            {weatherData?.precipitation.precipitation_probability.map((probability, idx) => <div key={idx}>{idx}:{probability}</div>)}
        </div>
    </div>;
}