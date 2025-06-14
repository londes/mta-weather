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
        
        // Return basic info about the feed for now
        return NextResponse.json({
            header: feed.header,
            entityCount: feed.entity.length,
            timestamp: new Date(feed.header.timestamp * 1000).toISOString(),
            // Include first few entities for exploration
            sampleEntities: feed.entity.slice(0, 3)
        });
        
    } catch (error) {
        console.error('Error fetching G train data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch G train data', details: error.message }, 
            { status: 500 }
        );
    }
}