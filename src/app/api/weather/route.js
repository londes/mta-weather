// src/app/api/weather/route.js
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat') || '40.7128'; // Default to NYC
    const lon = searchParams.get('lon') || '-74.0060';
    
    // Get current time for better debugging
    const now = new Date();
    const currentHour = now.getHours();
    console.log(`\n=== WEATHER REQUEST AT ${now.toISOString()} ===`);
    console.log(`Current hour: ${currentHour}`);
    
    // Remove start_date parameter that was causing 400 error
    const url = `https://api.open-meteo.com/v1/forecast?` +
      `latitude=${lat}&longitude=${lon}&` +
      `hourly=precipitation_probability,precipitation,temperature_2m&` +
      `daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&` +
      `forecast_days=5&` +
      `temperature_unit=fahrenheit&` +
      `timezone=auto`;
    
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
    
    // Find the current hour index in the hourly data
    // Look for the first hour that is >= current time
    const currentHourIndex = data.hourly.time.findIndex(time => {
      const hourDate = new Date(time);
      return hourDate >= now;
    });
    
    console.log(`\n=== CURRENT HOUR CALCULATION ===`);
    console.log(`Current time: ${now.toISOString()}`);
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
      first_forecast_hour: data.hourly.time[startIndex],
      timezone: data.timezone,
      start_index: startIndex,
      current_hour_index: currentHourIndex
    };
    
    console.log('\n=== PRECIPITATION FORECAST TIMES ===');
    console.log(`Request made at: ${now.toISOString()}`);
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
      
      // For rain codes, only classify as rainy if meaningful chance (>15%)
      if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
        if (precipProbability > 15) return 'rainy';
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
        precipitation_probability_max: data.daily.precipitation_probability_max[index]
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
      daily_forecast: dailyForecastWithTypes,
      // Include raw daily data for backward compatibility
      daily_forecast_raw: {
        times: data.daily.time,
        weather_codes: data.daily.weather_code,
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