import { transit_realtime } from "gtfs-realtime-bindings";

// MTA G Train API endpoint
export async function GET(request) {
  try {
    // Fetch the G train real-time data (URL with %2F encoding - this is the fix!)
    const response = await fetch("https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g");
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the binary protobuf data
    const buffer = await response.arrayBuffer();
    
    // Decode the GTFS-RT feed
    const feed = transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
    
    console.log('Feed decoded successfully:', {
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

    console.log('Trip Analysis:', {
      totalTrips: tripUpdates.length,
      tripsWithStops: tripsWithStops.length,
      tripsWithoutStops: tripsWithoutStops.length
    });

    // Log some examples
    console.log('Sample trip WITHOUT stops:', tripsWithoutStops.slice(0, 2));
    console.log('Sample trip WITH stops:', tripsWithStops.slice(0, 2));

    // Analyze stop patterns to find northernmost stops
    const allStops = new Set();
    const northboundStops = new Set();
    const southboundStops = new Set();

    tripsWithStops.forEach(trip => {
      trip.stopUpdates.forEach(stop => {
        allStops.add(stop.stopId);
        if (stop.stopId?.endsWith('N')) {
          northboundStops.add(stop.stopId);
        } else if (stop.stopId?.endsWith('S')) {
          southboundStops.add(stop.stopId);
        }
      });
    });

    // Sort stops to find the pattern (assuming G## format where higher numbers = further north)
    const sortedNorthbound = Array.from(northboundStops).sort();
    const sortedSouthbound = Array.from(southboundStops).sort();

    console.log('Stop Analysis:', {
      totalUniqueStops: allStops.size,
      northboundStops: sortedNorthbound,
      southboundStops: sortedSouthbound,
      // Show first and last few to identify the pattern
      firstFewNorthbound: sortedNorthbound.slice(0, 6),
      lastFewNorthbound: sortedNorthbound.slice(-6),
      firstFewSouthbound: sortedSouthbound.slice(0, 6),
      lastFewSouthbound: sortedSouthbound.slice(-6)
    });

    // Return the first several trips that actually have stop data
    const detailedTripUpdates = tripsWithStops.slice(0, 8); // Get more trips with actual data
    
    // Return comprehensive info about the feed
    return Response.json({
      header: feed.header,
      timestamp: new Date(feed.header.timestamp * 1000).toISOString(),
      summary: {
        totalEntities: feed.entity.length,
        tripUpdates: tripUpdates.length,
        vehiclePositions: vehiclePositions.length,
        alerts: alerts.length,
        tripsWithStops: tripsWithStops.length,
        tripsWithoutStops: tripsWithoutStops.length
      },
      stopAnalysis: {
        totalUniqueStops: allStops.size,
        northboundStops: sortedNorthbound,
        southboundStops: sortedSouthbound,
        northmostStops: sortedNorthbound.slice(-4), // Last 4 = northernmost
        southmostStops: sortedSouthbound.slice(0, 4) // First 4 = southernmost
      },
      detailedTripUpdates,
      // All trips with stops for better arrival analysis
      allTripsWithStops: tripsWithStops,
      // Debug info about trips without stops
      tripsWithoutStopsDebug: tripsWithoutStops.slice(0, 3).map(trip => ({
        tripId: trip.tripId,
        routeId: trip.routeId,
        isAssigned: trip.isAssigned,
        trainId: trip.trainId,
        direction: trip.direction
      })),
      // Include some raw entities for debugging
      rawSampleEntities: feed.entity.slice(0, 2)
    });
    
  } catch (error) {
    console.error('Error fetching G train data:', error);
    return Response.json(
      { error: 'Failed to fetch G train data', details: error.message }, 
      { status: 500 }
    );
  }
} 