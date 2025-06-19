"use client";

import { useEffect, useState } from "react";    
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

    useEffect(() => {
        fetch("/api/weather")
            .then(res => res.json())
            .then(data => {
                console.log("data received:", data);
                setWeatherData(data);
            });
    }, []);

    // Prepare chart data
    const chartData = weatherData ? {
        labels: weatherData.precipitation.times.map(time => {
            const date = new Date(time);
            return date.toLocaleTimeString('en-US', { 
                hour: 'numeric',
                hour12: true 
            });
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
    } : null;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: '',
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.parsed.y}% chance of rain`;
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
                {weatherData && chartData ? (
                    <Line data={chartData} options={chartOptions} />
                ) : (
                    <div>Loading precipitation chart...</div>
                )}
            </div>
            
            <div className={styles.precipitationSummary}>
                {/* {weatherData && (
                    <>
                        <h3>Hourly Details</h3>
                        <div className={styles.hourlyGrid}>
                            {weatherData.precipitation.precipitation_probability.slice(0, 6).map((probability, idx) => (
                                <div key={idx} className={styles.hourlyItem}>
                                    <span className={styles.time}>
                                        {new Date(weatherData.precipitation.times[idx]).toLocaleTimeString('en-US', { 
                                            hour: 'numeric',
                                            hour12: true 
                                        })}
                                    </span>
                                    <span className={styles.chance}>{probability}%</span>
                                    <span className={styles.amount}>
                                        {weatherData.precipitation.precipitation_mm[idx]}mm
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )} */}
            </div>
        </div>
    );
}