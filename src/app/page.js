"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

export default function Home() {
  const [mtaData, setMtaData] = useState(null);

  useEffect(() => {
    console.log("fetching mta data");
    fetch("/api/mta")
      .then((res) => res.json())
      .then((data) => {
        console.log("MTA data received:", data);
        setMtaData(data);
      })
      .catch((error) => {
        console.error("Error fetching MTA data:", error);
      });
  }, []);

  // Helper function to determine direction from stop ID
  const getDirection = (stopId) => {
    if (stopId?.endsWith('N')) return 'North';
    if (stopId?.endsWith('S')) return 'South';
    return 'Unknown';
  };

  // Helper function to filter trips by direction and station
  const filterTrips = (trips, direction, stationPrefix = null) => {
    if (!trips) return [];
    
    return trips.filter(trip => {
      // Filter out non-G train routes (like F train)
      if (trip.routeId !== 'G') return false;
      
      // Check if any stop matches our criteria
      const hasMatchingStop = trip.stopUpdates?.some(stop => {
        const stopDirection = getDirection(stop.stopId);
        const matchesDirection = stopDirection === direction;
        
        // If stationPrefix is specified, also check for that station
        if (stationPrefix) {
          return matchesDirection && stop.stopId?.startsWith(stationPrefix);
        }
        
        return matchesDirection;
      });
      
      return hasMatchingStop;
    });
  };

  // Helper function to get Greenpoint Ave arrivals
  const getGreenpointArrivals = (trips, direction) => {
    if (!trips) return [];
    
    const arrivals = [];
    
    trips.forEach(trip => {
      if (trip.routeId !== 'G') return;
      
      trip.stopUpdates?.forEach(stop => {
        // Look for Greenpoint Ave station - trying different possible codes
        const isGreenpoint = stop.stopId?.match(/^G2[0-3][NS]$/); // G20N, G21N, G22N, G23N, etc.
        const stopDirection = getDirection(stop.stopId);
        
        if (isGreenpoint && stopDirection === direction && stop.arrivalTime) {
          arrivals.push({
            tripId: trip.tripId,
            trainId: trip.trainId,
            stopId: stop.stopId,
            arrivalTime: stop.arrivalTime,
            minutesAway: Math.round((new Date(stop.arrivalTime) - new Date()) / 60000)
          });
        }
      });
    });
    
    // Sort by arrival time
    return arrivals.sort((a, b) => new Date(a.arrivalTime) - new Date(b.arrivalTime));
  };

  const northboundTrips = filterTrips(mtaData?.detailedTripUpdates, 'North');
  const southboundTrips = filterTrips(mtaData?.detailedTripUpdates, 'South');
  
  const greenpointNorthbound = getGreenpointArrivals(mtaData?.detailedTripUpdates, 'North');
  const greenpointSouthbound = getGreenpointArrivals(mtaData?.detailedTripUpdates, 'South');

  return (
    <div className={styles.page}>
      <div className={styles.mta}>
        {mtaData ? (
          <div>
            <h1>G Train - Greenpoint Avenue</h1>
            <p><strong>Last Updated:</strong> {new Date(mtaData.timestamp).toLocaleTimeString()}</p>
            
            <div style={{display: 'flex', gap: '20px', marginTop: '20px'}}>
              
              {/* Northbound Section */}
              <div style={{
                flex: 1,
                border: '2px solid #00933c',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: '#f0f8f0'
              }}>
                <h2 style={{color: '#00933c', margin: '0 0 15px 0'}}>
                  🚇 Northbound (to Queens/Court Sq)
                </h2>
                
                {greenpointNorthbound.length > 0 ? (
                  <div>
                    <h3>Next Arrivals at Greenpoint Ave:</h3>
                    {greenpointNorthbound.slice(0, 3).map((arrival, index) => (
                      <div key={index} style={{
                        backgroundColor: 'white',
                        padding: '10px',
                        margin: '5px 0',
                        borderRadius: '5px',
                        border: '1px solid #00933c'
                      }}>
                        <div style={{fontSize: '18px', fontWeight: 'bold'}}>
                          {arrival.minutesAway <= 0 ? 'Arriving' : `${arrival.minutesAway} min`}
                        </div>
                        <div style={{fontSize: '12px', color: '#666'}}>
                          Train: {arrival.trainId || 'N/A'} | Stop: {arrival.stopId}
                        </div>
                        <div style={{fontSize: '12px', color: '#666'}}>
                          {new Date(arrival.arrivalTime).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No upcoming northbound trains found for Greenpoint Ave</p>
                )}
                
                <details style={{marginTop: '15px'}}>
                  <summary>All Northbound Trips ({northboundTrips.length})</summary>
                  {northboundTrips.map((trip, index) => (
                    <div key={index} style={{
                      backgroundColor: 'white',
                      padding: '8px',
                      margin: '5px 0',
                      borderRadius: '3px',
                      fontSize: '12px'
                    }}>
                      <strong>Trip:</strong> {trip.tripId} | <strong>Train:</strong> {trip.trainId || 'N/A'}
                    </div>
                  ))}
                </details>
              </div>

              {/* Southbound Section */}
              <div style={{
                flex: 1,
                border: '2px solid #ff6319',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: '#fff8f0'
              }}>
                <h2 style={{color: '#ff6319', margin: '0 0 15px 0'}}>
                  🚇 Southbound (to Brooklyn/Church Ave)
                </h2>
                
                {greenpointSouthbound.length > 0 ? (
                  <div>
                    <h3>Next Arrivals at Greenpoint Ave:</h3>
                    {greenpointSouthbound.slice(0, 3).map((arrival, index) => (
                      <div key={index} style={{
                        backgroundColor: 'white',
                        padding: '10px',
                        margin: '5px 0',
                        borderRadius: '5px',
                        border: '1px solid #ff6319'
                      }}>
                        <div style={{fontSize: '18px', fontWeight: 'bold'}}>
                          {arrival.minutesAway <= 0 ? 'Arriving' : `${arrival.minutesAway} min`}
                        </div>
                        <div style={{fontSize: '12px', color: '#666'}}>
                          Train: {arrival.trainId || 'N/A'} | Stop: {arrival.stopId}
                        </div>
                        <div style={{fontSize: '12px', color: '#666'}}>
                          {new Date(arrival.arrivalTime).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No upcoming southbound trains found for Greenpoint Ave</p>
                )}
                
                <details style={{marginTop: '15px'}}>
                  <summary>All Southbound Trips ({southboundTrips.length})</summary>
                  {southboundTrips.map((trip, index) => (
                    <div key={index} style={{
                      backgroundColor: 'white',
                      padding: '8px',
                      margin: '5px 0',
                      borderRadius: '3px',
                      fontSize: '12px'
                    }}>
                      <strong>Trip:</strong> {trip.tripId} | <strong>Train:</strong> {trip.trainId || 'N/A'}
                    </div>
                  ))}
                </details>
              </div>
            </div>

            {/* Debug Section */}
            <details style={{marginTop: '20px'}}>
              <summary>Debug Info</summary>
              <div style={{fontSize: '12px', backgroundColor: '#f5f5f5', padding: '10px', marginTop: '10px'}}>
                <p><strong>Total Entities:</strong> {mtaData.summary?.totalEntities}</p>
                <p><strong>Trip Updates:</strong> {mtaData.summary?.tripUpdates}</p>
                <p><strong>Sample Stop IDs:</strong></p>
                <ul>
                  {mtaData.detailedTripUpdates?.slice(0, 2).map((trip, i) => (
                    <li key={i}>
                      Trip {trip.tripId}: {trip.stopUpdates?.slice(0, 3).map(s => s.stopId).join(', ')}
                    </li>
                  ))}
                </ul>
              </div>
            </details>

            {mtaData.error && <p style={{color: 'red'}}>Error: {mtaData.error}</p>}
          </div>
        ) : (
          <p>Loading G train data...</p>
        )}
      </div>
      <div className={styles.precip}></div>
      <div className={styles.tempSun}></div>
    </div>
  );
}
