export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const stationId = searchParams.get('id');
    
    // G Train station mapping - could be extended to fetch from external APIs
    const gTrainStations = {
      'G22N': { id: 'G22N', name: 'Court Sq', direction: 'Northbound' },
      'G22S': { id: 'G22S', name: 'Court Sq', direction: 'Southbound' },
      'G24N': { id: 'G24N', name: '21 St-Queensbridge', direction: 'Northbound' },
      'G24S': { id: 'G24S', name: '21 St-Queensbridge', direction: 'Southbound' },
      'G26N': { id: 'G26N', name: 'Greenpoint Ave', direction: 'Northbound' },
      'G26S': { id: 'G26S', name: 'Greenpoint Ave', direction: 'Southbound' },
      'G28N': { id: 'G28N', name: 'Nassau Ave', direction: 'Northbound' },
      'G28S': { id: 'G28S', name: 'Nassau Ave', direction: 'Southbound' },
      'G29N': { id: 'G29N', name: 'Manhattan Ave', direction: 'Northbound' },
      'G29S': { id: 'G29S', name: 'Manhattan Ave', direction: 'Southbound' },
      'G30N': { id: 'G30N', name: 'Graham Ave', direction: 'Northbound' },
      'G30S': { id: 'G30S', name: 'Graham Ave', direction: 'Southbound' },
      'G31N': { id: 'G31N', name: 'Grand St', direction: 'Northbound' },
      'G31S': { id: 'G31S', name: 'Grand St', direction: 'Southbound' },
      'G32N': { id: 'G32N', name: 'Metropolitan Ave', direction: 'Northbound' },
      'G32S': { id: 'G32S', name: 'Metropolitan Ave', direction: 'Southbound' },
      'G33N': { id: 'G33N', name: 'Broadway', direction: 'Northbound' },
      'G33S': { id: 'G33S', name: 'Broadway', direction: 'Southbound' },
      'G34N': { id: 'G34N', name: 'Flushing Ave', direction: 'Northbound' },
      'G34S': { id: 'G34S', name: 'Flushing Ave', direction: 'Southbound' },
      'G35N': { id: 'G35N', name: 'Myrtle-Willoughby Aves', direction: 'Northbound' },
      'G35S': { id: 'G35S', name: 'Myrtle-Willoughby Aves', direction: 'Southbound' },
      'G36N': { id: 'G36N', name: 'Bedford-Nostrand Aves', direction: 'Northbound' },
      'G36S': { id: 'G36S', name: 'Bedford-Nostrand Aves', direction: 'Southbound' }
    };
    
    if (stationId) {
      // Return specific station info
      const station = gTrainStations[stationId];
      if (station) {
        return Response.json({ station });
      } else {
        return Response.json({ error: 'Station not found' }, { status: 404 });
      }
    } else {
      // Return all stations
      const stations = Object.values(gTrainStations);
      return Response.json({ stations });
    }
    
  } catch (error) {
    console.error('Stations API error:', error);
    return Response.json(
      { error: 'Failed to fetch station data', details: error.message },
      { status: 500 }
    );
  }
} 