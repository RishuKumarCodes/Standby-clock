// api/weatherAPI.ts
import { DetailedWeatherData } from "../types/WeatherTypes";

// AQI calculation based on PM2.5 (US EPA standard)
const calculateAQI = (pm25: number): number => {
  if (pm25 <= 12) return Math.round(((50 - 0) / (12 - 0)) * pm25 + 0);
  if (pm25 <= 35.4) return Math.round(((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51);
  if (pm25 <= 55.4) return Math.round(((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101);
  if (pm25 <= 150.4) return Math.round(((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5) + 151);
  if (pm25 <= 250.4) return Math.round(((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201);
  return Math.round(((500 - 301) / (500 - 250.5)) * (pm25 - 250.5) + 301);
};

const getAQILevel = (aqi: number): string => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
};

// Map weather code to description and emoji
const mapWeatherCode = (code: number): { description: string; emoji: string } => {
  const weatherCodes: { [key: number]: { description: string; emoji: string } } = {
    0: { description: "Clear sky", emoji: "☀️" },
    1: { description: "Mainly clear", emoji: "🌤️" },
    2: { description: "Partly cloudy", emoji: "⛅" },
    3: { description: "Overcast", emoji: "☁️" },
    45: { description: "Fog", emoji: "🌫️" },
    48: { description: "Depositing rime fog", emoji: "🌫️" },
    51: { description: "Light drizzle", emoji: "🌦️" },
    53: { description: "Moderate drizzle", emoji: "🌦️" },
    55: { description: "Dense drizzle", emoji: "🌧️" },
    56: { description: "Light freezing drizzle", emoji: "🌨️" },
    57: { description: "Dense freezing drizzle", emoji: "🌨️" },
    61: { description: "Slight rain", emoji: "🌦️" },
    63: { description: "Moderate rain", emoji: "🌧️" },
    65: { description: "Heavy rain", emoji: "🌧️" },
    66: { description: "Light freezing rain", emoji: "🌨️" },
    67: { description: "Heavy freezing rain", emoji: "🌨️" },
    71: { description: "Slight snow", emoji: "❄️" },
    73: { description: "Moderate snow", emoji: "🌨️" },
    75: { description: "Heavy snow", emoji: "🌨️" },
    77: { description: "Snow grains", emoji: "❄️" },
    80: { description: "Slight rain showers", emoji: "🌦️" },
    81: { description: "Moderate rain showers", emoji: "🌧️" },
    82: { description: "Violent rain showers", emoji: "⛈️" },
    85: { description: "Slight snow showers", emoji: "🌨️" },
    86: { description: "Heavy snow showers", emoji: "🌨️" },
    95: { description: "Thunderstorm", emoji: "⛈️" },
    96: { description: "Thunderstorm with slight hail", emoji: "⛈️" },
    99: { description: "Thunderstorm with heavy hail", emoji: "⛈️" },
  };
  return weatherCodes[code] || { description: "Unknown", emoji: "❓" };
};

// Validate coordinates
const validateCoordinates = (lat: number, lon: number): boolean => {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
};

// Fetch comprehensive weather data
const fetchWeatherForecast = async (lat: number, lon: number) => {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    timezone: "auto",
    current_weather: "true",
    hourly: [
      "temperature_2m",
      "relative_humidity_2m", 
      "dew_point_2m",
      "apparent_temperature",
      "precipitation",
      "rain",
      "showers", 
      "snowfall",
      "cloud_cover",
      "cloud_cover_low",
      "cloud_cover_mid", 
      "cloud_cover_high",
      "wind_speed_10m",
      "wind_direction_10m",
      "wind_gusts_10m",
      "uv_index",
      "uv_index_clear_sky",
      "is_day",
      "weather_code",
      "surface_pressure",
      "visibility"
    ].join(","),
    daily: [
      "temperature_2m_max",
      "temperature_2m_min", 
      "apparent_temperature_max",
      "apparent_temperature_min",
      "sunrise",
      "sunset",
      "precipitation_sum",
      "rain_sum",
      "showers_sum", 
      "snowfall_sum",
      "precipitation_hours",
      "wind_speed_10m_max",
      "wind_gusts_10m_max",
      "wind_direction_10m_dominant", 
      "shortwave_radiation_sum",
      "et0_fao_evapotranspiration",
      "uv_index_max",
      "weather_code"
    ].join(","),
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Weather API error: ${res.status} ${res.statusText}`, errorText);
      throw new Error(`Weather API error: ${res.status} ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Weather request timed out');
    }
    throw error;
  }
};

// Fetch air quality data from separate endpoint
const fetchAirQuality = async (lat: number, lon: number) => {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    timezone: "auto",
    hourly: [
      "pm2_5",
      "pm10",
      "carbon_monoxide",
      "nitrogen_dioxide",
      "ozone",
      "sulphur_dioxide",
      "aerosol_optical_depth",
      "dust",
      "ammonia"
    ].join(","),
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${params}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    
    if (!res.ok) {
      console.warn(`Air quality API error: ${res.status} ${res.statusText}`);
      return null;
    }
    
    return await res.json();
  } catch (error) {
    console.warn('Air quality fetch failed:', error);
    return null;
  }
};

// Get location name
const getLocationName = (lat: number, lon: number): string => {
  const locations = [
    { lat: 25.6, lon: 85.1, name: "Patna, Bihar" },
    { lat: 28.6, lon: 77.2, name: "Delhi" },
    { lat: 19.1, lon: 72.9, name: "Mumbai, Maharashtra" },
    { lat: 13.1, lon: 80.3, name: "Chennai, Tamil Nadu" },
    { lat: 12.9, lon: 77.6, name: "Bengaluru, Karnataka" },
    { lat: 17.4, lon: 78.5, name: "Hyderabad, Telangana" },
    { lat: 22.6, lon: 88.4, name: "Kolkata, West Bengal" },
    { lat: 26.9, lon: 75.8, name: "Jaipur, Rajasthan" },
    { lat: 21.2, lon: 72.8, name: "Surat, Gujarat" },
    { lat: 23.0, lon: 72.6, name: "Ahmedabad, Gujarat" },
  ];

  let closestLocation = "Unknown Location";
  let minDistance = Infinity;

  for (const location of locations) {
    const distance = Math.sqrt(
      Math.pow(lat - location.lat, 2) + Math.pow(lon - location.lon, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestLocation = location.name;
    }
  }

  if (minDistance < 0.1) {
    return closestLocation;
  }

  return `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`;
};

export const fetchDetailedWeatherData = async (lat: number, lon: number): Promise<DetailedWeatherData> => {
  // Validate coordinates
  if (!validateCoordinates(lat, lon)) {
    throw new Error(`Invalid coordinates: lat=${lat}, lon=${lon}`);
  }

  // Round coordinates to avoid precision issues
  const roundedLat = Math.round(lat * 1000) / 1000;
  const roundedLon = Math.round(lon * 1000) / 1000;

  console.log('Fetching detailed weather data for:', roundedLat, roundedLon);

  try {
    // Fetch weather and air quality data in parallel
    const [weatherData, airQualityData] = await Promise.all([
      fetchWeatherForecast(roundedLat, roundedLon),
      fetchAirQuality(roundedLat, roundedLon),
    ]);

    console.log('Weather API response received');

    // Validate weather response structure
    if (!weatherData.current_weather || !weatherData.hourly || !weatherData.daily) {
      console.error('Invalid weather API response structure:', weatherData);
      throw new Error('Invalid weather data received from API');
    }

    // Extract air quality data safely
    let pm25 = 0;
    let pm10 = 0;
    let no2 = 0;
    let o3 = 0;
    let co = 0;
    let so2 = 0;
    let nh3 = 0;
    let dust = 0;
    let aod = 0;

    if (airQualityData && airQualityData.hourly) {
      pm25 = airQualityData.hourly.pm2_5?.[0] || 0;
      pm10 = airQualityData.hourly.pm10?.[0] || 0;
      no2 = airQualityData.hourly.nitrogen_dioxide?.[0] || 0;
      o3 = airQualityData.hourly.ozone?.[0] || 0;
      co = airQualityData.hourly.carbon_monoxide?.[0] || 0;
      so2 = airQualityData.hourly.sulphur_dioxide?.[0] || 0;
      nh3 = airQualityData.hourly.ammonia?.[0] || 0;
      dust = airQualityData.hourly.dust?.[0] || 0;
      aod = airQualityData.hourly.aerosol_optical_depth?.[0] || 0;
    }

    const aqi = calculateAQI(pm25);
    const currentWeatherCode = mapWeatherCode(weatherData.current_weather.weathercode || 0);

    // Process hourly data (next 24 hours)
    const hourlyData = [];
    for (let i = 0; i < Math.min(24, weatherData.hourly.time?.length || 0); i++) {
      const weatherCode = mapWeatherCode(weatherData.hourly.weather_code?.[i] || 0);
      hourlyData.push({
        time: weatherData.hourly.time[i],
        temperature: Math.round(weatherData.hourly.temperature_2m?.[i] || 0),
        feelsLike: Math.round(weatherData.hourly.apparent_temperature?.[i] || 0),
        humidity: weatherData.hourly.relative_humidity_2m?.[i] || 0,
        dewPoint: Math.round(weatherData.hourly.dew_point_2m?.[i] || 0),
        precipitation: weatherData.hourly.precipitation?.[i] || 0,
        rain: weatherData.hourly.rain?.[i] || 0,
        showers: weatherData.hourly.showers?.[i] || 0,
        snowfall: weatherData.hourly.snowfall?.[i] || 0,
        cloudCover: weatherData.hourly.cloud_cover?.[i] || 0,
        cloudCoverLow: weatherData.hourly.cloud_cover_low?.[i] || 0,
        cloudCoverMid: weatherData.hourly.cloud_cover_mid?.[i] || 0,
        cloudCoverHigh: weatherData.hourly.cloud_cover_high?.[i] || 0,
        windSpeed: Math.round((weatherData.hourly.wind_speed_10m?.[i] || 0) * 10) / 10,
        windDirection: weatherData.hourly.wind_direction_10m?.[i] || 0,
        windGusts: Math.round((weatherData.hourly.wind_gusts_10m?.[i] || 0) * 10) / 10,
        uvIndex: Math.round((weatherData.hourly.uv_index?.[i] || 0) * 10) / 10,
        uvIndexClearSky: Math.round((weatherData.hourly.uv_index_clear_sky?.[i] || 0) * 10) / 10,
        isDay: weatherData.hourly.is_day?.[i] === 1,
        weatherCode: weatherData.hourly.weather_code?.[i] || 0,
        description: weatherCode.description,
        emoji: weatherCode.emoji,
        pressure: Math.round(weatherData.hourly.surface_pressure?.[i] || 1013),
        visibility: Math.round((weatherData.hourly.visibility?.[i] || 10000) / 100) / 10,
      });
    }

    // Process daily data (next 7 days)
    const dailyData = [];
    for (let i = 0; i < Math.min(7, weatherData.daily.time?.length || 0); i++) {
      const weatherCode = mapWeatherCode(weatherData.daily.weather_code?.[i] || 0);
      dailyData.push({
        date: weatherData.daily.time[i],
        temperatureMax: Math.round(weatherData.daily.temperature_2m_max?.[i] || 0),
        temperatureMin: Math.round(weatherData.daily.temperature_2m_min?.[i] || 0),
        feelsLikeMax: Math.round(weatherData.daily.apparent_temperature_max?.[i] || 0),
        feelsLikeMin: Math.round(weatherData.daily.apparent_temperature_min?.[i] || 0),
        sunrise: weatherData.daily.sunrise?.[i] || "",
        sunset: weatherData.daily.sunset?.[i] || "",
        precipitationSum: weatherData.daily.precipitation_sum?.[i] || 0,
        rainSum: weatherData.daily.rain_sum?.[i] || 0,
        showersSum: weatherData.daily.showers_sum?.[i] || 0,
        snowfallSum: weatherData.daily.snowfall_sum?.[i] || 0,
        precipitationHours: weatherData.daily.precipitation_hours?.[i] || 0,
        windSpeedMax: Math.round((weatherData.daily.wind_speed_10m_max?.[i] || 0) * 10) / 10,
        windGustsMax: Math.round((weatherData.daily.wind_gusts_10m_max?.[i] || 0) * 10) / 10,
        windDirectionDominant: weatherData.daily.wind_direction_10m_dominant?.[i] || 0,
        shortwaveRadiation: Math.round((weatherData.daily.shortwave_radiation_sum?.[i] || 0) * 10) / 10,
        evapotranspiration: Math.round((weatherData.daily.et0_fao_evapotranspiration?.[i] || 0) * 10) / 10,
        uvIndexMax: Math.round((weatherData.daily.uv_index_max?.[i] || 0) * 10) / 10,
        weatherCode: weatherData.daily.weather_code?.[i] || 0,
        description: weatherCode.description,
        emoji: weatherCode.emoji,
      });
    }

    const detailedWeather: DetailedWeatherData = {
      // Current weather
      current: {
        temperature: Math.round(weatherData.current_weather.temperature || 0),
        feelsLike: Math.round(weatherData.hourly.apparent_temperature?.[0] || weatherData.current_weather.temperature || 0),
        humidity: weatherData.hourly.relative_humidity_2m?.[0] || 0,
        dewPoint: Math.round(weatherData.hourly.dew_point_2m?.[0] || 0),
        pressure: Math.round(weatherData.hourly.surface_pressure?.[0] || 1013),
        windSpeed: Math.round((weatherData.current_weather.windspeed || 0) * 10) / 10,
        windDirection: weatherData.current_weather.winddirection || 0,
        windGusts: Math.round((weatherData.hourly.wind_gusts_10m?.[0] || 0) * 10) / 10,
        cloudCover: weatherData.hourly.cloud_cover?.[0] || 0,
        cloudCoverLow: weatherData.hourly.cloud_cover_low?.[0] || 0,
        cloudCoverMid: weatherData.hourly.cloud_cover_mid?.[0] || 0,
        cloudCoverHigh: weatherData.hourly.cloud_cover_high?.[0] || 0,
        precipitation: weatherData.hourly.precipitation?.[0] || 0,
        rain: weatherData.hourly.rain?.[0] || 0,
        showers: weatherData.hourly.showers?.[0] || 0,
        snowfall: weatherData.hourly.snowfall?.[0] || 0,
        visibility: Math.round((weatherData.hourly.visibility?.[0] || 10000) / 100) / 10,
        uvIndex: Math.round((weatherData.hourly.uv_index?.[0] || 0) * 10) / 10,
        uvIndexClearSky: Math.round((weatherData.hourly.uv_index_clear_sky?.[0] || 0) * 10) / 10,
        isDay: weatherData.hourly.is_day?.[0] === 1,
        weatherCode: weatherData.current_weather.weathercode || 0,
        description: currentWeatherCode.description,
        emoji: currentWeatherCode.emoji,
        location: getLocationName(roundedLat, roundedLon),
      },
      
      // Air quality
      airQuality: {
        aqi: aqi,
        aqiLevel: getAQILevel(aqi),
        pm25: pm25,
        pm10: pm10,
        no2: no2,
        o3: o3,
        co: co,
        so2: so2,
        nh3: nh3,
        dust: dust,
        aod: aod,
      },

      // Today's sun times
      sun: {
        sunrise: weatherData.daily.sunrise?.[0] || "",
        sunset: weatherData.daily.sunset?.[0] || "",
      },

      // Hourly forecast
      hourly: hourlyData,
      
      // Daily forecast
      daily: dailyData,

      // Metadata
      timezone: weatherData.timezone || "UTC",
      elevation: weatherData.elevation || 0,
      lastUpdated: new Date().toISOString(),
    };

    console.log('Detailed weather data processed successfully');
    return detailedWeather;

  } catch (error) {
    console.error('Weather API fetch error:', error);
    throw error;
  }
};