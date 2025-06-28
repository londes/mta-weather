"use client";

import { useEffect, useState } from "react";
import styles from './WeatherForecast.module.css';

const weatherIcons = {
  sunny: '☀️',
  partly_cloudy: '⛅',
  cloudy: '☁️',
  rainy: '🌧️',
  stormy: '⛈️',
  snowy: '❄️',
  foggy: '🌫️'
};

export default function WeatherForecast() {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWeatherData = () => {
    console.log('🌤️ Fetching weather forecast data...');
    fetch('/api/weather')
      .then(response => response.json())
      .then(data => {
        console.log('🌤️ Weather forecast data received:', data);
        
        if (data.error) {
          console.error('🌤️ Weather API returned error:', data.error);
          setError(data.error);
          setLoading(false);
          return;
        }
        
        setWeatherData(data);
        setError(null);
        setLoading(false);
      })
      .catch(error => {
        console.error('🌤️ Error fetching weather forecast data:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    // Initial fetch
    fetchWeatherData();
    
    // Set up 30-minute interval for weather updates
    const weatherInterval = setInterval(() => {
      console.log('🌤️ 30-minute weather refresh triggered');
      fetchWeatherData();
    }, 30 * 60 * 1000); // 30 minutes in milliseconds
    
    // Cleanup interval on component unmount
    return () => {
      console.log('🌤️ Clearing weather forecast interval');
      clearInterval(weatherInterval);
    };
  }, []);

  // Show error state
  if (error) {
    return (
      <div className={styles.forecastContainer}>
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          color: '#ef4444',
          fontSize: '16px'
        }}>
          <div>⚠️ Weather data unavailable</div>
          <div style={{ fontSize: '14px', marginTop: '8px', color: '#6b7280' }}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading || !weatherData || !weatherData.daily_forecast) {
    return (
      <div className={styles.forecastContainer}>
        <div className={styles.loading}>Loading weather forecast...</div>
      </div>
    );
  }

  // Get today's weather (first item in daily forecast)
  const today = weatherData.daily_forecast[0];
  const forecast = weatherData.daily_forecast.slice(1, 5); // Next 4 days
  
  // Use current hour weather for the emoji (reflects right now)
  const currentWeather = weatherData.current_hour;

  return (
    <div className={styles.forecastContainer}>
      {/* Today's Weather Section */}
      <div className={styles.todaySection}>
        <div className={styles.todayMain}>
          <div className={styles.todayContent}>
            <div className={styles.currentTemp}>
              {Math.round(today.temperature_max)}°
            </div>
            <div className={styles.todayDetails}>
              <div className={styles.highLow}>
                {Math.round(today.temperature_min)}° / {Math.round(today.temperature_max)}°
              </div>
              <div className={styles.weatherType}>
                {currentWeather.weather_type.replace('_', ' ')}
              </div>
              <div className={styles.rainChance}>
                {today.precipitation_probability_max}% chance of rain today
              </div>
            </div>
          </div>
          <div className={styles.weatherIcon}>
            {weatherIcons[currentWeather.weather_type] || weatherIcons.cloudy}
          </div>
        </div>
      </div>

      {/* 4-Day Forecast Section */}
      <div className={styles.forecastSection}>
        <h3 className={styles.forecastTitle}>4-Day Forecast</h3>
        <div className={styles.forecastGrid}>
          {forecast.map((day, index) => {
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            return (
              <div key={index} className={styles.forecastDay}>
                <div className={styles.dayName}>{dayName}</div>
                <div className={styles.dayIcon}>
                  {weatherIcons[day.weather_type] || weatherIcons.cloudy}
                </div>
                <div className={styles.dayTemp}>
                  {Math.round(day.temperature_max)}°
                </div>
                <div className={styles.dayRain}>
                  {day.precipitation_probability_max}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 