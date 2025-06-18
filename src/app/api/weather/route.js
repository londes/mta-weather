// src/app/api/weather/route.js
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat') || '40.7128'; // Default to NYC
    const lon = searchParams.get('lon') || '-74.0060';
    
    const url = `https://api.open-meteo.com/v1/forecast?` +
      `latitude=${lat}&longitude=${lon}&` +
      `hourly=precipitation_probability,precipitation,temperature_2m&` +
      `daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&` +
      `forecast_days=4&` +
      `timezone=auto`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Get next 18 hours of precipitation data
    const next18Hours = {
      times: data.hourly.time.slice(0, 18),
      precipitation_probability: data.hourly.precipitation_probability.slice(0, 18),
      precipitation_mm: data.hourly.precipitation.slice(0, 18),
      temperature: data.hourly.temperature_2m.slice(0, 18)
    };
    
    console.dir(data);
    
    return Response.json({
      location: {
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone
      },
      precipitation: next18Hours,
      daily_forecast: {
        times: data.daily.time,
        temperature_max: data.daily.temperature_2m_max,
        temperature_min: data.daily.temperature_2m_min,
        precipitation_sum: data.daily.precipitation_sum,
        precipitation_probability_max: data.daily.precipitation_probability_max
      }
    });
    
  } catch (error) {
    console.error('Weather API error:', error);
    return Response.json(
      { error: 'Failed to fetch weather data', details: error.message },
      { status: 500 }
    );
  }
}