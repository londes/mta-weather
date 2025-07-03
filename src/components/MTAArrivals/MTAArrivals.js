"use client";

import { useEffect, useState } from "react";
import { useStation } from "../../contexts/StationContext";
import styles from "./MTAArrivals.module.css";

export default function MTAArrivals() {
  const [mtaData, setMtaData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { selectedLine, getCurrentStation } = useStation();

  const fetchMTAData = () => {
    console.log(`Fetching ${selectedLine} train data`);
    fetch(`/api/mta?line=${selectedLine}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(`${selectedLine} train data received:`, data);
        setMtaData(data);
        setLastUpdated(new Date());
      })
      .catch((error) => {
        console.error(`Error fetching ${selectedLine} train data:`, error);
      });
  };

  useEffect(() => {
    // Fetch data immediately on component mount
    fetchMTAData();

    // Set up interval to fetch data every 29 seconds
    const interval = setInterval(fetchMTAData, 29000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [selectedLine]); // Re-fetch when line changes

  // Helper function to get soonest arrivals for any station
  const getSoonestArrivals = (allTrips, stationId) => {
    if (!allTrips || !stationId) return [];
    
    const arrivals = [];
    
    allTrips.forEach(trip => {
      if (trip.routeId !== selectedLine) return;
      
      trip.stopUpdates?.forEach(stop => {
        if (stop.stopId === stationId && stop.arrivalTime) {
          const arrivalTime = new Date(stop.arrivalTime);
          const now = new Date();
          const minutesAway = Math.round((arrivalTime - now) / 60000);
          
          // Only include future arrivals
          if (minutesAway >= 0) {
            arrivals.push({
              tripId: trip.tripId,
              trainId: trip.trainId,
              stopId: stop.stopId,
              arrivalTime: stop.arrivalTime,
              minutesAway: minutesAway
            });
          }
        }
      });
    });
    
    // Sort by arrival time and return the 2 soonest
    return arrivals
      .sort((a, b) => new Date(a.arrivalTime) - new Date(b.arrivalTime))
      .slice(0, 2);
  };

  // Get current station info from context
  const currentStation = getCurrentStation();
  
  if (!currentStation) {
    return <div>Loading station information...</div>;
  }

  // Get direction IDs based on train line
  const getDirectionIds = () => {
    if (selectedLine === 'G') {
      return {
        direction1Id: currentStation.northboundId,
        direction2Id: currentStation.southboundId,
        direction1Label: 'Court Square (Queens)',
        direction2Label: 'Church Ave (Brooklyn)'
      };
    } else if (selectedLine === 'L') {
      return {
        direction1Id: currentStation.eastboundId,
        direction2Id: currentStation.westboundId,
        direction1Label: 'Canarsie (Brooklyn)',
        direction2Label: '8th Avenue (Manhattan)'
      };
    }
    return {
      direction1Id: null,
      direction2Id: null,
      direction1Label: 'Direction 1',
      direction2Label: 'Direction 2'
    };
  };

  const { direction1Id, direction2Id, direction1Label, direction2Label } = getDirectionIds();
  const direction1Arrivals = getSoonestArrivals(mtaData?.allTripsWithStops, direction1Id);
  const direction2Arrivals = getSoonestArrivals(mtaData?.allTripsWithStops, direction2Id);

  // Get train icon based on line
  const getTrainIcon = () => {
    if (selectedLine === 'G') {
      return "/NYCS-bull-trans-G-Std.svg";
    } else if (selectedLine === 'L') {
      return "/NYCS-bull-trans-L-Std.svg.png"; // Use the PNG file you added
    }
    return "/NYCS-bull-trans-G-Std.svg"; // fallback
  };

  return (
    <div>
      <h1>{selectedLine} Train - {currentStation.displayName}</h1>
      <p>
        Last Updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Loading...'} 
      </p>
      
      {mtaData ? (
        <div>
          <div className={styles.trainsContainer}>
            <div className={styles.arrivalContainer}>
              {direction1Arrivals.length > 0 ? (
                direction1Arrivals.map((arrival, i) => (
                <div key={i} className={styles.trainArrival}>
                  <div>
                    <img src={getTrainIcon()} alt={`${selectedLine} Train`} />
                    <div><h2>{direction1Label}</h2></div>
                  </div>
                  <div>
                    <div><h3>{arrival.minutesAway <= 0 ? 'Arriving now' : `${arrival.minutesAway} minutes`}</h3></div>
                    <div>{new Date(arrival.arrivalTime).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))
              ) : (
                <div>No upcoming trains to {direction1Label}</div>
              )}
            </div>
            <div className={styles.arrivalContainer}>
            {direction2Arrivals.length ? ( 
              direction2Arrivals.map((arrival, i) => (
              <div key={i} className={styles.trainArrival}>
                <div>
                  <img src={getTrainIcon()} alt={`${selectedLine} Train`} />
                  <div><h2>{direction2Label}</h2></div>
                </div>
                <div>
                  <div><h3>{arrival.minutesAway <= 0 ? 'Arriving now' : `${arrival.minutesAway} minutes`}</h3></div>
                  <div>{new Date(arrival.arrivalTime).toLocaleTimeString()}</div>
                </div>
              </div>
            ))
            ) : (
              <div>No upcoming trains to {direction2Label}</div>
            )}
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
} 