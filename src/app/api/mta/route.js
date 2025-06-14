import { NextResponse } from "next/server";
import { transit_realtime } from "gtfs-realtime-bindings";

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

        // Get detailed info about first few trip updates
        const detailedTripUpdates = tripUpdates.slice(0, 3).map(entity => {
            const trip = entity.tripUpdate.trip;
            const stopTimeUpdates = entity.tripUpdate.stopTimeUpdate || [];
            
            return {
                tripId: trip.tripId,
                routeId: trip.routeId,
                direction: trip.nyctTripDescriptor?.direction,
                isAssigned: trip.nyctTripDescriptor?.isAssigned,
                trainId: trip.nyctTripDescriptor?.trainId,
                stopUpdates: stopTimeUpdates.slice(0, 5).map(stop => ({
                    stopId: stop.stopId,
                    arrivalTime: stop.arrival ? new Date(stop.arrival.time * 1000).toISOString() : null,
                    departureTime: stop.departure ? new Date(stop.departure.time * 1000).toISOString() : null
                }))
            };
        });
        
        // Return comprehensive info about the feed
        return NextResponse.json({
            header: feed.header,
            timestamp: new Date(feed.header.timestamp * 1000).toISOString(),
            summary: {
                totalEntities: feed.entity.length,
                tripUpdates: tripUpdates.length,
                vehiclePositions: vehiclePositions.length,
                alerts: alerts.length
            },
            detailedTripUpdates,
            // Include some raw entities for debugging
            rawSampleEntities: feed.entity.slice(0, 2)
        });
        
    } catch (error) {
        console.error('Error fetching G train data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch G train data', details: error.message }, 
            { status: 500 }
        );
    }
}