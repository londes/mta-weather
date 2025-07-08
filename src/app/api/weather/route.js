// src/app/api/weather/route.js

// ZIP code to coordinates mapping for NYC boroughs
const zipCodeCoordinates = {
  // Manhattan
  '10009': { lat: 40.7282, lon: -73.9776, name: 'Manhattan (East Village)' },
  '10001': { lat: 40.7505, lon: -73.9934, name: 'Manhattan (Midtown)' },
  '10014': { lat: 40.7341, lon: -74.0064, name: 'Manhattan (West Village)' },
  '10019': { lat: 40.7648, lon: -73.9808, name: 'Manhattan (Hell\'s Kitchen)' },
  '10025': { lat: 40.7957, lon: -73.9667, name: 'Manhattan (Upper West Side)' },
  '10128': { lat: 40.7816, lon: -73.9509, name: 'Manhattan (Upper East Side)' },
  
  // Brooklyn
  '11222': { lat: 40.7272, lon: -73.9469, name: 'Brooklyn (Greenpoint)' },
  '11211': { lat: 40.7081, lon: -73.9571, name: 'Brooklyn (Williamsburg)' },
  '11215': { lat: 40.6694, lon: -73.9865, name: 'Brooklyn (Park Slope)' },
  '11201': { lat: 40.6928, lon: -73.9903, name: 'Brooklyn (Brooklyn Heights)' },
  '11226': { lat: 40.6464, lon: -73.9618, name: 'Brooklyn (Flatbush)' },
  '11235': { lat: 40.5795, lon: -73.9707, name: 'Brooklyn (Brighton Beach)' },
  
  // Queens
  '11367': { lat: 40.7282, lon: -73.8370, name: 'Queens (Flushing)' },
  '11101': { lat: 40.7505, lon: -73.9342, name: 'Queens (Long Island City)' },
  '11375': { lat: 40.7214, lon: -73.8370, name: 'Queens (Forest Hills)' },
  '11103': { lat: 40.7648, lon: -73.9137, name: 'Queens (Astoria)' },
  '11691': { lat: 40.6022, lon: -73.7594, name: 'Queens (Far Rockaway)' },
  '11385': { lat: 40.7011, lon: -73.8803, name: 'Queens (Ridgewood)' },
  
  // Bronx
  '10457': { lat: 40.8448, lon: -73.8956, name: 'Bronx (Mount Hope)' },
  '10451': { lat: 40.8210, lon: -73.9246, name: 'Bronx (Concourse)' },
  '10463': { lat: 40.8795, lon: -73.9095, name: 'Bronx (Riverdale)' },
  '10458': { lat: 40.8677, lon: -73.8901, name: 'Bronx (Fordham)' },
  '10467': { lat: 40.8735, lon: -73.8776, name: 'Bronx (Norwood)' },
  '10461': { lat: 40.8483, lon: -73.8370, name: 'Bronx (Westchester Square)' },
  
  // Staten Island
  '10314': { lat: 40.5795, lon: -74.1502, name: 'Staten Island (Sunnyside)' },
  '10301': { lat: 40.6323, lon: -74.0977, name: 'Staten Island (St. George)' },
  '10306': { lat: 40.5665, lon: -74.1204, name: 'Staten Island (Tottenville)' },
  '10312': { lat: 40.5447, lon: -74.1776, name: 'Staten Island (Annadale)' },
  '10304': { lat: 40.6095, lon: -74.0854, name: 'Staten Island (Stapleton)' },
  '10309': { lat: 40.5286, lon: -74.2090, name: 'Staten Island (Pleasant Plains)' }
};

// Helper function to get coordinates from zip code
function getCoordinatesFromZip(zipCode) {
  const coords = zipCodeCoordinates[zipCode];
  if (coords) {
    return {
      lat: coords.lat.toString(),
      lon: coords.lon.toString(),
      name: coords.name
    };
  }
  return null;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Check for zip code first, then fall back to lat/lon
    const zipCode = searchParams.get('zip');
    let lat, lon, locationName;
    
    if (zipCode) {
      const coords = getCoordinatesFromZip(zipCode);
      if (coords) {
        lat = coords.lat;
        lon = coords.lon;
        locationName = coords.name;
        console.log(`\n=== ZIP CODE LOOKUP ===`);
        console.log(`ZIP Code: ${zipCode}`);
        console.log(`Location: ${locationName}`);
        console.log(`Coordinates: ${lat}, ${lon}`);
      } else {
        console.log(`\n=== UNKNOWN ZIP CODE ===`);
        console.log(`ZIP Code: ${zipCode} not found in mapping`);
        // Fall back to default NYC coordinates
        lat = '40.7128';
        lon = '-74.0060';
        locationName = 'NYC (Default)';
      }
    } else {
      // Use provided lat/lon or default to NYC
      lat = searchParams.get('lat') || '40.7128';
      lon = searchParams.get('lon') || '-74.0060';
      locationName = 'Custom Location';
    }
    
    // Use Brooklyn/NYC timezone explicitly
    const brooklynTimezone = 'America/New_York';
    
    // Get current time in Brooklyn timezone
    const now = new Date();
    const brooklynTime = new Date(now.toLocaleString("en-US", {timeZone: brooklynTimezone}));
    const currentHour = brooklynTime.getHours();
    
    console.log(`\n=== WEATHER REQUEST AT ${now.toISOString()} ===`);
    console.log(`Server time: ${now.toISOString()}`);
    console.log(`Brooklyn time: ${brooklynTime.toISOString()}`);
    console.log(`Brooklyn current hour: ${currentHour}`);
    console.log(`Location: ${locationName} (${lat}, ${lon})`);
    
    // Use explicit timezone in API request
    const url = `https://api.open-meteo.com/v1/forecast?` +
      `latitude=${lat}&longitude=${lon}&` +
      `hourly=precipitation_probability,precipitation,temperature_2m,weather_code&` +
      `daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,sunrise,sunset&` +
      `forecast_days=5&` +
      `temperature_unit=fahrenheit&` +
      `timezone=${encodeURIComponent(brooklynTimezone)}`;
    
    console.log(`API URL: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // DEBUGGING: Log the complete weather data structure
    console.log('\n=== COMPLETE WEATHER DATA ===');
    console.log('Location:', {
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone
    });
    
    console.log('\n=== DAILY FORECAST RAW DATA ===');
    data.daily.time.forEach((date, index) => {
      console.log(`Day ${index} (${date}):`);
      console.log(`  Weather Code: ${data.daily.weather_code[index]}`);
      console.log(`  Temperature Max: ${data.daily.temperature_2m_max[index]}°`);
      console.log(`  Temperature Min: ${data.daily.temperature_2m_min[index]}°`);
      console.log(`  Precipitation Sum: ${data.daily.precipitation_sum[index]}mm`);
      console.log(`  Precipitation Probability: ${data.daily.precipitation_probability_max[index]}%`);
      console.log('');
    });
    
    console.log('\n=== HOURLY DATA (First 12 hours from API) ===');
    for (let i = 0; i < Math.min(12, data.hourly.time.length); i++) {
      const hourTime = new Date(data.hourly.time[i]);
      console.log(`Hour ${i} (${data.hourly.time[i]} -> ${hourTime.toLocaleTimeString()}):`);
      console.log(`  Temperature: ${data.hourly.temperature_2m[i]}°`);
      console.log(`  Precipitation Probability: ${data.hourly.precipitation_probability[i]}%`);
      console.log(`  Precipitation Amount: ${data.hourly.precipitation[i]}mm`);
      console.log('');
    }
    
    // Find the current hour index in the hourly data using Brooklyn time
    // Look for the first hour that is >= current Brooklyn time
    const currentHourIndex = data.hourly.time.findIndex(time => {
      const hourDate = new Date(time);
      return hourDate >= brooklynTime;
    });
    
    console.log(`\n=== CURRENT HOUR CALCULATION ===`);
    console.log(`Server time: ${now.toISOString()}`);
    console.log(`Brooklyn time: ${brooklynTime.toISOString()}`);
    console.log(`Current hour index in data: ${currentHourIndex}`);
    console.log(`First available hour: ${data.hourly.time[0]}`);
    if (currentHourIndex >= 0) {
      console.log(`Current/next hour: ${data.hourly.time[currentHourIndex]}`);
    } else {
      console.log(`No future hours found, using all available data from start`);
    }
    
    // Get next 18 hours starting from current hour (or start of data if current hour not found)
    const startIndex = currentHourIndex >= 0 ? currentHourIndex : 0;
    const endIndex = Math.min(startIndex + 18, data.hourly.time.length);
    
    const next18Hours = {
      times: data.hourly.time.slice(startIndex, endIndex),
      precipitation_probability: data.hourly.precipitation_probability.slice(startIndex, endIndex),
      precipitation_mm: data.hourly.precipitation.slice(startIndex, endIndex),
      temperature: data.hourly.temperature_2m.slice(startIndex, endIndex),
      // Add metadata for debugging
      request_time: now.toISOString(),
      brooklyn_time: brooklynTime.toISOString(),
      first_forecast_hour: data.hourly.time[startIndex],
      timezone: data.timezone,
      start_index: startIndex,
      current_hour_index: currentHourIndex
    };
    
    console.log('\n=== PRECIPITATION FORECAST TIMES ===');
    console.log(`Server request time: ${now.toISOString()}`);
    console.log(`Brooklyn time: ${brooklynTime.toISOString()}`);
    console.log(`Using start index: ${startIndex} (current hour index: ${currentHourIndex})`);
    console.log(`First forecast hour: ${data.hourly.time[startIndex]}`);
    console.log(`Timezone: ${data.timezone}`);
    console.log('Next 6 hours:');
    for (let i = 0; i < Math.min(6, next18Hours.times.length); i++) {
      const time = new Date(next18Hours.times[i]);
      console.log(`  ${i}: ${next18Hours.times[i]} -> ${time.toLocaleTimeString()} (${next18Hours.precipitation_probability[i]}% rain)`);
    }
    
    // Helper function to determine weather type from WMO weather code and precipitation probability
    const getWeatherType = (weatherCode, precipProbability = 0) => {
      // For storm codes, only classify as stormy if there's a meaningful chance (>20%)
      if ([95, 96, 99].includes(weatherCode)) {
        if (precipProbability > 20) return 'stormy';
        // If low storm probability, fall back to cloud assessment
        if (weatherCode === 95) return 'partly_cloudy'; // Light thunderstorm risk = partly cloudy
      }
      
      // For rain codes, only classify as rainy if meaningful chance (>40%)
      if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
        if (precipProbability > 40) return 'rainy';
        // Light rain risk = cloudy conditions
        return 'cloudy';
      }
      
      // Standard classifications for non-precipitation codes
      if (weatherCode === 0) return 'sunny';
      if ([1, 2].includes(weatherCode)) return 'partly_cloudy';
      if (weatherCode === 3) return 'cloudy';
      if ([45, 48].includes(weatherCode)) return 'foggy';
      if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return 'snowy';
      
      return 'cloudy'; // default fallback
    };
    
    // Process daily forecast with weather types
    const dailyForecastWithTypes = data.daily.time.map((time, index) => {
      const weatherCode = data.daily.weather_code[index];
      const weatherType = getWeatherType(weatherCode, data.daily.precipitation_probability_max[index]);
      console.log(`\n=== WEATHER TYPE MAPPING ===`);
      console.log(`Date: ${time}`);
      console.log(`Weather Code: ${weatherCode}`);
      console.log(`Mapped Weather Type: ${weatherType}`);
      console.log(`WMO Code Reference:`);
      if (weatherCode === 0) console.log(`  Code 0 = Clear sky`);
      if ([1, 2].includes(weatherCode)) console.log(`  Code ${weatherCode} = ${weatherCode === 1 ? 'Mainly clear' : 'Partly cloudy'}`);
      if (weatherCode === 3) console.log(`  Code 3 = Overcast`);
      if ([95, 96, 99].includes(weatherCode)) console.log(`  Code ${weatherCode} = Thunderstorm${weatherCode > 95 ? ' with hail' : ''}`);
      console.log('');
      
      return {
        date: time,
        weather_type: weatherType,
        weather_code: weatherCode,
        temperature_max: data.daily.temperature_2m_max[index],
        temperature_min: data.daily.temperature_2m_min[index],
        precipitation_sum: data.daily.precipitation_sum[index],
        precipitation_probability_max: data.daily.precipitation_probability_max[index],
        sunrise: data.daily.sunrise[index],
        sunset: data.daily.sunset[index]
      };
    });
    
    console.log('\n=== FINAL PROCESSED FORECAST ===');
    dailyForecastWithTypes.forEach((day, index) => {
      console.log(`Day ${index}: ${day.date}`);
      console.log(`  Type: ${day.weather_type} (Code: ${day.weather_code})`);
      console.log(`  Temp: ${day.temperature_min}° - ${day.temperature_max}°`);
      console.log(`  Rain: ${day.precipitation_probability_max}% chance, ${day.precipitation_sum}mm total`);
      console.log('');
    });
    
    return Response.json({
      location: {
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone
      },
      precipitation: next18Hours,
      // Add current hour weather for "right now" emoji
      current_hour: {
        weather_code: data.hourly.weather_code[startIndex],
        temperature: data.hourly.temperature_2m[startIndex],
        precipitation_probability: data.hourly.precipitation_probability[startIndex],
        time: data.hourly.time[startIndex],
        weather_type: getWeatherType(data.hourly.weather_code[startIndex], data.hourly.precipitation_probability[startIndex])
      },
      daily_forecast: dailyForecastWithTypes,
      // Include raw daily data for backward compatibility
      daily_forecast_raw: {
        times: data.daily.time,
        weather_codes: data.daily.weather_code,
        temperature_max: data.daily.temperature_2m_max,
        temperature_min: data.daily.temperature_2m_min,
        precipitation_sum: data.daily.precipitation_sum,
        precipitation_probability_max: data.daily.precipitation_probability_max,
        sunrise: data.daily.sunrise,
        sunset: data.daily.sunset
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