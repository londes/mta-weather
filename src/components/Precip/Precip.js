"use client";

import { useEffect, useState } from "react";
import { useStation } from "../../contexts/StationContext";
import styles from './Precip.module.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Precip() {
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);
    const { selectedZipCode } = useStation();

    const fetchPrecipitationData = () => {
        console.log("🌧️ Fetching precipitation data...");
        console.log(`🌧️ Using ZIP code: ${selectedZipCode}`);
        console.log(`🌧️ Current time: ${new Date().toISOString()}`);
        
        const apiUrl = selectedZipCode ? `/api/weather?zip=${selectedZipCode}` : '/api/weather';
        
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                console.log("🌧️ Precipitation data received:", data);
                console.log(`🌧️ API request time: ${data.precipitation?.request_time}`);
                console.log(`🌧️ First forecast hour: ${data.precipitation?.first_forecast_hour}`);
                console.log(`🌧️ Current hour index: ${data.precipitation?.current_hour_index}`);
                console.log(`🌧️ Start index: ${data.precipitation?.start_index}`);
                
                if (data.error) {
                    console.error("🌧️ API returned error:", data.error);
                    setError(data.error);
                    return;
                }
                
                console.log("🌧️ Precipitation times:", data.precipitation?.times);
                setWeatherData(data);
                setError(null);
            })
            .catch(error => {
                console.error("🌧️ Error fetching precipitation data:", error);
                setError(error.message);
            });
    };

    useEffect(() => {
        // Initial fetch
        fetchPrecipitationData();
        
        // Set up 30-minute interval for precipitation updates
        const precipInterval = setInterval(() => {
            console.log("🌧️ 30-minute precipitation refresh triggered");
            fetchPrecipitationData();
        }, 30 * 60 * 1000); // 30 minutes in milliseconds
        
        // Cleanup interval on component unmount
        return () => {
            console.log("🌧️ Clearing precipitation interval");
            clearInterval(precipInterval);
        };
    }, [selectedZipCode]); // Re-fetch when zip code changes

    // Show error state if there's an error
    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.precipitationChart}>
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
            </div>
        );
    }

    // Show loading state
    if (!weatherData || !weatherData.precipitation || !weatherData.precipitation.times) {
        return (
            <div className={styles.container}>
                <div className={styles.precipitationChart}>
                    <div style={{ 
                        padding: '40px', 
                        textAlign: 'center', 
                        color: '#6b7280',
                        fontSize: '16px'
                    }}>
                        Loading precipitation chart...
                    </div>
                </div>
            </div>
        );
    }

    // Prepare chart data
    const chartData = {
        labels: weatherData.precipitation.times.map((time, index) => {
            const date = new Date(time);
            // Use Brooklyn timezone for consistent display
            const formattedTime = date.toLocaleTimeString('en-US', { 
                hour: 'numeric',
                hour12: true,
                timeZone: 'America/New_York'
            });
            
            // Enhanced debugging for timing issues
            if (index < 6) {
                console.log(`🌧️ Time ${index}: ${time} -> ${formattedTime}`);
                console.log(`  Full date: ${date.toISOString()}`);
                console.log(`  Local time: ${date.toLocaleString()}`);
                console.log(`  Brooklyn time: ${date.toLocaleString('en-US', { timeZone: 'America/New_York' })}`);
                console.log(`  Hours since epoch: ${Math.floor(date.getTime() / (1000 * 60 * 60))}`);
            }
            
            return formattedTime;
        }),
        datasets: [
            {
                label: 'Precipitation Chance (%)',
                data: weatherData.precipitation.precipitation_probability,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 4,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: `🌧️ Chance of Precipitation Next ${weatherData.precipitation.times.length} Hours (Updated: ${new Date(weatherData.precipitation?.request_time || Date.now()).toLocaleTimeString()})`,
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.parsed.y}% chance of rain`;
                    },
                    title: function(context) {
                        const originalTime = weatherData.precipitation.times[context[0].dataIndex];
                        const date = new Date(originalTime);
                        return date.toLocaleString('en-US', {
                            weekday: 'short',
                            hour: 'numeric',
                            hour12: true,
                            timeZone: 'America/New_York'
                        });
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    }
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.precipitationChart}>
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}