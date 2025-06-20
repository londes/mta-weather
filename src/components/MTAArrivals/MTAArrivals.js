"use client";

import { useEffect, useState } from "react";

export default function MTAArrivals() {
  const [mtaData, setMtaData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchMTAData = () => {
    console.log("fetching mta data");
    fetch("/api/mta")
      .then((res) => res.json())
      .then((data) => {
        console.log("MTA data received:", data);
        setMtaData(data);
        setLastUpdated(new Date());
      })
      .catch((error) => {
        console.error("Error fetching MTA data:", error);
      });
  };

  useEffect(() => {
    // Fetch data immediately on component mount
    fetchMTAData();

    // Set up interval to fetch data every 60 seconds
    const interval = setInterval(fetchMTAData, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Helper function to get soonest arrivals for any station
  const getSoonestArrivals = (allTrips, stationId) => {
    if (!allTrips || !stationId) return [];
    
    const arrivals = [];
    
    allTrips.forEach(trip => {
      if (trip.routeId !== 'G') return;
      
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

  // Using G28 as Greenpoint Avenue (updated from G34)
  const greenpointNorth = "G28N";
  const greenpointSouth = "G28S";

  const northboundArrivals = getSoonestArrivals(mtaData?.allTripsWithStops, greenpointNorth);
  const southboundArrivals = getSoonestArrivals(mtaData?.allTripsWithStops, greenpointSouth);

  return (
    <div>
      <h1>G Train - Greenpoint Avenue (G28)</h1>
      <p>
        Last Updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Loading...'} 
        {lastUpdated && <span> (auto-refreshes every minute)</span>}
      </p>
      
      {mtaData ? (
        <div>
          <h2>NORTHBOUND (to Queens)</h2>
          {northboundArrivals.length > 0 ? (
            northboundArrivals.map((arrival, i) => (
              <div key={i}>
                {arrival.minutesAway <= 0 ? 'Arriving now' : `${arrival.minutesAway} minutes`} - {new Date(arrival.arrivalTime).toLocaleTimeString()}
              </div>
            ))
          ) : (
            <div>No upcoming northbound trains</div>
          )}

          <h2>SOUTHBOUND (to Brooklyn)</h2>
          {southboundArrivals.length > 0 ? (
            southboundArrivals.map((arrival, i) => (
              <div key={i}>
                {arrival.minutesAway <= 0 ? 'Arriving now' : `${arrival.minutesAway} minutes`} - {new Date(arrival.arrivalTime).toLocaleTimeString()}
              </div>
            ))
          ) : (
            <div>No upcoming southbound trains</div>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
} 