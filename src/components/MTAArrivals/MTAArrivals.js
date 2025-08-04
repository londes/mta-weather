"use client";

import { useEffect, useState } from "react";
import { useStation } from "../../contexts/StationContext";
import styles from "./MTAArrivals.module.css";

export default function MTAArrivals() {
  const [mtaData, setMtaData] = useState(null);
  const [alertsData, setAlertsData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isContextLoaded, setIsContextLoaded] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
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

  const fetchAlertsData = () => {
    console.log(`Fetching ${selectedLine} line service alerts`);
    fetch(`/api/alerts?line=${selectedLine}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(`${selectedLine} alerts received:`, data);
        setAlertsData(data);
      })
      .catch((error) => {
        console.error(`Error fetching ${selectedLine} alerts:`, error);
      });
  };

  // Check if context is fully loaded
  useEffect(() => {
    const currentStation = getCurrentStation();
    if (selectedLine && currentStation) {
      setIsContextLoaded(true);
    } else {
      setIsContextLoaded(false);
      setMtaData(null); // Clear stale data when context changes
      setAlertsData(null); // Clear stale alerts when context changes
    }
  }, [selectedLine, getCurrentStation]);

  useEffect(() => {
    // Only fetch data when context is fully loaded
    if (!isContextLoaded) return;

    // Fetch data immediately on component mount
    fetchMTAData();
    fetchAlertsData();

    // Set up interval to fetch data every 29 seconds
    const interval = setInterval(() => {
      fetchMTAData();
      fetchAlertsData();
    }, 29000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [selectedLine, isContextLoaded]);

  // Helper function to get soonest arrivals for any station
  const getSoonestArrivals = (allTrips, stationId) => {
    if (!allTrips || !stationId) return [];
    
    const arrivals = [];

    allTrips.forEach(trip => {
      trip.stopUpdates.forEach(stop => {
        if (stop.stopId === stationId && stop.arrivalTime) {
          const arrivalTime = new Date(stop.arrivalTime);
          const now = new Date();
          const minutesAway = Math.round((arrivalTime - now) / (1000 * 60));
          
          // Only include future arrivals (or arriving very soon)
          if (minutesAway >= -1) {
            arrivals.push({
              tripId: trip.tripId,
              arrivalTime: stop.arrivalTime,
              minutesAway: minutesAway,
              trainId: trip.trainId
            });
          }
        }
      });
    });

    // Sort by arrival time and return the first 2
    return arrivals
      .sort((a, b) => new Date(a.arrivalTime) - new Date(b.arrivalTime))
      .slice(0, 2);
  };

  // Get relevant alerts for the current line
  const getRelevantAlerts = () => {
    if (!alertsData || alertsData.filteredAlerts === 0) {
      return [];
    }

    return alertsData.alerts.filter(alert => {
      const mentionsLineInRoutes = alert.affectedRoutes.includes(selectedLine);
      const explicitlyMentionsLine = alert.headerText.includes(`[${selectedLine}]`) || 
                                     alert.descriptionText.includes(`[${selectedLine}]`);
      
      return mentionsLineInRoutes || explicitlyMentionsLine;
    });
  };

  // Show loading state while context is loading
  if (!isContextLoaded) {
    return (
      <div>
        <h1>Loading station information...</h1>
        <p>Initializing {selectedLine} train data...</p>
      </div>
    );
  }

  // Get current station info from context
  const currentStation = getCurrentStation();
  
  if (!currentStation) {
    return <div>Error: Station information not available</div>;
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

  const relevantAlerts = getRelevantAlerts();

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <h1>{selectedLine} Train - {currentStation.displayName}</h1>
        {relevantAlerts.length > 0 && (
          <div 
            className={styles.alertIndicator}
            onClick={() => setShowAlertModal(true)}
            title="Service alerts - tap for details"
          >
            <span>⚠️</span>
            <div className={styles.alertBadge}>{relevantAlerts.length}</div>
          </div>
        )}
      </div>
      
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
            {direction2Arrivals.length > 0 ? ( 
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

      {/* Alert Modal */}
      {showAlertModal && (
        <div className={styles.alertModal} onClick={() => setShowAlertModal(false)}>
          <div className={styles.alertModalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.alertModalHeader}>
              <h2>⚠️ {selectedLine} Line Service Alerts</h2>
              <button 
                className={styles.alertModalClose}
                onClick={() => setShowAlertModal(false)}
              >
                ×
              </button>
            </div>
            {relevantAlerts.map((alert, index) => (
              <div key={alert.id || index} className={styles.serviceAlert}>
                <div className={styles.alertHeader}>
                  <strong>{alert.headerText}</strong>
                </div>
                {alert.descriptionText && (
                  <div className={styles.alertDescription}>
                    {alert.descriptionText}
                  </div>
                )}
                {alert.activePeriods && alert.activePeriods.length > 0 && (
                  <div className={styles.alertPeriod}>
                    Active: {new Date(alert.activePeriods[0].start).toLocaleDateString()} - 
                    {alert.activePeriods[0].end && alert.activePeriods[0].end !== "1970-01-01T00:00:00.000Z" 
                      ? new Date(alert.activePeriods[0].end).toLocaleDateString()
                      : "Until further notice"}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 