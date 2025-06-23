"use client";

import { useEffect, useState } from "react";
import styles from './WeatherForecast.module.css';

export default function WeatherForecast() {
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        fetch("/api/weather")
            .then(res => res.json())
            .then(data => {
                console.log("Weather data received:", data);
                setWeatherData(data);
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
            });
    }, []);

    // Helper function to get weather icon/emoji
    const getWeatherIcon = (weatherType) => {
        switch (weatherType) {
            case 'sunny': return '☀️';
            case 'partly_cloudy': return '⛅';
            case 'cloudy': return '☁️';
            case 'rainy': return '🌧️';
            case 'snowy': return '❄️';
            case 'stormy': return '⛈️';
            case 'foggy': return '🌫️';
            default: return '☁️';
        }
    };

    // Helper function to format day name
    const getDayName = (dateString, index) => {
        if (index === 0) return 'Today';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    if (!weatherData) {
        return <div className={styles.loading}>Loading weather...</div>;
    }

    const today = weatherData.daily_forecast[0];
    const upcomingDays = weatherData.daily_forecast.slice(1);

    // Get current temperature from hourly data (first entry is current/nearest hour)
    const currentTemp = weatherData.precipitation.temperature[0];

    return (
        <div className={styles.forecastContainer}>
            {/* Today's Weather */}
            <div className={styles.todaySection}>
                <div className={styles.todayMain}>
                    <div className={styles.currentTemp}>
                        {Math.round(currentTemp)}°
                    </div>
                    <div className={styles.weatherIcon}>
                        {getWeatherIcon(today.weather_type)}
                    </div>
                </div>
                
                <div className={styles.todayDetails}>
                    <div className={styles.highLow}>
                        H: {Math.round(today.temperature_max)}° L: {Math.round(today.temperature_min)}°
                    </div>
                    <div className={styles.weatherType}>
                        {today.weather_type.charAt(0).toUpperCase() + today.weather_type.slice(1)}
                    </div>
                    <div className={styles.rainChance}>
                        {today.precipitation_probability_max}% chance of rain
                    </div>
                </div>
            </div>

            {/* 4-Day Forecast */}
            <div className={styles.forecastSection}>
                {/* <h3 className={styles.forecastTitle}>4-Day Forecast</h3> */}
                <div className={styles.forecastGrid}>
                    {weatherData.daily_forecast.map((day, index) => (
                        <div key={index} className={styles.forecastDay}>
                            <div className={styles.dayName}>
                                {getDayName(day.date, index)}
                            </div>
                            <div className={styles.dayIcon}>
                                {getWeatherIcon(day.weather_type)}
                            </div>
                            <div className={styles.dayTemp}>
                                {Math.round(day.temperature_max)}°
                            </div>
                            <div className={styles.dayRain}>
                                {day.precipitation_probability_max}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 