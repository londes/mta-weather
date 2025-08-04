import { transit_realtime } from "gtfs-realtime-bindings";

// MTA Feed URL mapping
const FEED_MAPPING = {
  'G': 'nyct%2Fgtfs-g',
  'L': 'nyct%2Fgtfs-l',
  // Future lines can be added here:
  // '4-5-6': 'nyct%2Fgtfs-4-5-6',
  // 'N-Q-R-W': 'nyct%2Fgtfs-n-q-r-w',
};

// MTA Dynamic Train API endpoint
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const line = searchParams.get('line') || 'G'; // Default to G train
    
    // Get the appropriate feed URL
    const feedPath = FEED_MAPPING[line];
    if (!feedPath) {
      return Response.json(
        { error: `Unsupported train line: ${line}. Supported lines: ${Object.keys(FEED_MAPPING).join(', ')}` },
        { status: 400 }
      );
    }
    
    console.log(`Fetching ${line} train data from feed: ${feedPath}`);
    
    // Fetch the train real-time data
    const response = await fetch(`https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/${feedPath}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the binary protobuf data
    const buffer = await response.arrayBuffer();
    
    // Decode the GTFS-RT feed
    const feed = transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
    
    console.log(`${line} Train Feed decoded successfully:`, {
      entityCount: feed.entity.length,
      timestamp: new Date(feed.header.timestamp * 1000).toISOString()
    });

    // Let's explore the structure of trip updates
    const tripUpdates = feed.entity.filter(entity => entity.tripUpdate);
    const vehiclePositions = feed.entity.filter(entity => entity.vehicle);
    const alerts = feed.entity.filter(entity => entity.alert);

    // Separate trips with and without stop updates
    const tripsWithStops = [];
    const tripsWithoutStops = [];

    tripUpdates.forEach(entity => {
      const trip = entity.tripUpdate.trip;
      const stopTimeUpdates = entity.tripUpdate.stopTimeUpdate || [];
      
      const tripData = {
        tripId: trip.tripId,
        routeId: trip.routeId,
        direction: trip.nyctTripDescriptor?.direction,
        isAssigned: trip.nyctTripDescriptor?.isAssigned,
        trainId: trip.nyctTripDescriptor?.trainId,
        stopUpdates: stopTimeUpdates.map(stop => ({
          stopId: stop.stopId,
          arrivalTime: stop.arrival ? new Date(stop.arrival.time * 1000).toISOString() : null,
          departureTime: stop.departure ? new Date(stop.departure.time * 1000).toISOString() : null
        }))
      };

      if (stopTimeUpdates.length > 0) {
        tripsWithStops.push(tripData);
      } else {
        tripsWithoutStops.push(tripData);
      }
    });

    console.log(`${line} Train Trip Analysis:`, {
      totalTrips: tripUpdates.length,
      tripsWithStops: tripsWithStops.length,
      tripsWithoutStops: tripsWithoutStops.length
    });

    // Analyze stop patterns - handle different direction naming conventions
    const allStops = new Set();
    const direction1Stops = new Set(); // Northbound/Eastbound
    const direction2Stops = new Set(); // Southbound/Westbound

    tripsWithStops.forEach(trip => {
      trip.stopUpdates.forEach(stop => {
        allStops.add(stop.stopId);
        if (stop.stopId?.endsWith('N')) {
          direction1Stops.add(stop.stopId);
        } else if (stop.stopId?.endsWith('S')) {
          direction2Stops.add(stop.stopId);
        }
      });
    });

    // Sort stops to find the pattern
    const sortedDirection1 = Array.from(direction1Stops).sort();
    const sortedDirection2 = Array.from(direction2Stops).sort();

    // Direction labels based on line
    const directionLabels = line === 'G' 
      ? { direction1: 'northbound', direction2: 'southbound' }
      : { direction1: 'eastbound', direction2: 'westbound' };

    console.log(`${line} Train Stop Analysis:`, {
      totalUniqueStops: allStops.size,
      [`${directionLabels.direction1}Stops`]: sortedDirection1,
      [`${directionLabels.direction2}Stops`]: sortedDirection2,
      firstFew: sortedDirection1.slice(0, 6),
      lastFew: sortedDirection1.slice(-6)
    });

    // Filter trips for the requested line only
    const lineTrips = tripsWithStops.filter(trip => trip.routeId === line);

    // Return comprehensive info about the feed
    return Response.json({
      line,
      header: feed.header,
      timestamp: new Date(feed.header.timestamp * 1000).toISOString(),
      summary: {
        totalEntities: feed.entity.length,
        tripUpdates: tripUpdates.length,
        vehiclePositions: vehiclePositions.length,
        alerts: alerts.length,
        tripsWithStops: tripsWithStops.length,
        tripsWithoutStops: tripsWithoutStops.length,
        lineSpecificTrips: lineTrips.length
      },
      // Include actual alerts data for service disruptions
      alerts: alerts.map(entity => ({
        id: entity.id,
        alert: entity.alert
      })),
      stopAnalysis: {
        totalUniqueStops: allStops.size,
        [`${directionLabels.direction1}Stops`]: sortedDirection1,
        [`${directionLabels.direction2}Stops`]: sortedDirection2,
        terminalStops: {
          [`${directionLabels.direction1}Terminal`]: sortedDirection1.slice(-2), // Last stops
          [`${directionLabels.direction2}Terminal`]: sortedDirection2.slice(0, 2)  // First stops
        }
      },
      detailedTripUpdates: lineTrips.slice(0, 8),
      // All trips with stops for arrival analysis
      allTripsWithStops: lineTrips
    });
    
  } catch (error) {
    console.error(`Error fetching ${line || 'train'} data:`, error);
    return Response.json(
      { error: `Failed to fetch ${line || 'train'} data`, details: error.message }, 
      { status: 500 }
    );
  }
} 