import { transit_realtime } from "gtfs-realtime-bindings";

// MTA General Alerts API endpoint
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const line = searchParams.get('line'); // Optional: filter by specific line
    
    console.log(`Fetching MTA service alerts`);
    
    // Fetch the general subway alerts feed
    const response = await fetch('https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the binary protobuf data
    const buffer = await response.arrayBuffer();
    
    // Decode the GTFS-RT feed
    const feed = transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
    
    console.log(`Alerts feed decoded successfully:`, {
      entityCount: feed.entity.length,
      timestamp: new Date(feed.header.timestamp * 1000).toISOString()
    });

    // Extract all alerts
    const alerts = feed.entity
      .filter(entity => entity.alert)
      .map(entity => {
        const alert = entity.alert;
        
        // Extract affected routes
        const affectedRoutes = alert.informedEntity?.map(ie => ie.routeId).filter(Boolean) || [];
        
        // Parse alert text
        const headerText = alert.headerText?.translation?.[0]?.text || '';
        const descriptionText = alert.descriptionText?.translation?.[0]?.text || '';
        
        return {
          id: entity.id,
          headerText,
          descriptionText,
          affectedRoutes,
          activePeriods: alert.activePeriod?.map(period => ({
            start: period.start ? new Date(period.start * 1000).toISOString() : null,
            end: period.end ? new Date(period.end * 1000).toISOString() : null
          })) || [],
          severity: alert.severityLevel || 'UNKNOWN',
          cause: alert.cause || 'UNKNOWN_CAUSE',
          effect: alert.effect || 'UNKNOWN_EFFECT'
        };
      });

    // Filter by line if specified - be very strict about relevance
    const filteredAlerts = line 
      ? alerts.filter(alert => {
          // Must be in affected routes OR explicitly mentioned with brackets
          const inAffectedRoutes = alert.affectedRoutes.includes(line);
          const explicitMention = alert.headerText.includes(`[${line}]`) || 
                                 alert.descriptionText.includes(`[${line}]`);
          
          return inAffectedRoutes || explicitMention;
        })
      : alerts;

    console.log(`Found ${alerts.length} total alerts, ${filteredAlerts.length} relevant alerts`);

    return Response.json({
      timestamp: new Date(feed.header.timestamp * 1000).toISOString(),
      totalAlerts: alerts.length,
      filteredAlerts: filteredAlerts.length,
      line: line || 'all',
      alerts: filteredAlerts
    });
    
  } catch (error) {
    console.error('Alerts API error:', error);
    return Response.json(
      { error: 'Failed to fetch alerts data', details: error.message },
      { status: 500 }
    );
  }
} 