import { fetchDetailedWeatherData } from "../api/weatherAPI";
import { DetailedWeatherData } from "../types/WeatherTypes";
import {
  weatherStorage,
  WeatherLocation,
} from "../storage/themesStorage/weather";

const CACHE_TTL_MS = 20 * 60 * 1000; // 20 minutes
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;
let currentLocation: WeatherLocation = weatherStorage.getDefaultLocation();

(async () => {
  try {
    currentLocation = await weatherStorage.getLocation();
  } catch {
    currentLocation = weatherStorage.getDefaultLocation();
  }
})();

interface CachedDetailedWeatherData {
  data: DetailedWeatherData;
  timestamp: number;
  coords: string; // lat,lon as key
}

let detailedCache: CachedDetailedWeatherData | null = null;

type LocationListener = () => void;
const locationListeners = new Set<LocationListener>();


export function onLocationChange(fn: LocationListener) {
  locationListeners.add(fn);
  return () => {
    locationListeners.delete(fn);
  };
}

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getFallbackCoords = async (
  lat?: number,
  lon?: number
): Promise<{ lat: number; lon: number }> => {
  if (lat !== undefined && lon !== undefined) {
    return { lat, lon };
  }

  // Try to get saved location
  try {
    const saved = await weatherStorage.getLocation();
    console.log(`Using saved location: ${saved.cityName || "Unknown"}`);
    return { lat: saved.lat, lon: saved.lon };
  } catch (error) {
    console.warn("Failed to get saved location:", error);
  }

  // Use default fallback
  const defaultLocation = weatherStorage.getDefaultLocation();
  console.warn(`Using default fallback location: ${defaultLocation.cityName}`);
  return { lat: defaultLocation.lat, lon: defaultLocation.lon };
};

async function fetchDetailedWithRetry(
  lat: number,
  lon: number,
  attempt: number = 1
): Promise<DetailedWeatherData> {
  try {
    console.log(
      `Attempt ${attempt} to fetch detailed weather data for coords:`,
      lat,
      lon
    );
    return await fetchDetailedWeatherData(lat, lon);
  } catch (error) {
    console.error(`Detailed weather fetch attempt ${attempt} failed:`, error);

    if (attempt < MAX_RETRY_ATTEMPTS) {
      const delay = RETRY_DELAY_MS * attempt; // Exponential backoff
      console.log(`Retrying in ${delay}ms...`);
      await sleep(delay);
      return fetchDetailedWithRetry(lat, lon, attempt + 1);
    }

    throw error;
  }
}

export async function getDetailedWeather(
  lat?: number,
  lon?: number
): Promise<DetailedWeatherData> {
  // Get valid coordinates
  const coords = await getFallbackCoords(lat, lon);
  const now = Date.now();
  const coordsKey = `${coords.lat},${coords.lon}`;

  // Return cache if fresh and for same location
  if (
    detailedCache &&
    detailedCache.coords === coordsKey &&
    now - detailedCache.timestamp < CACHE_TTL_MS
  ) {
    console.log("Returning cached detailed weather data for:", coordsKey);
    return detailedCache.data;
  }

  try {
    console.log(
      "Fetching new detailed weather data for coords:",
      coords.lat,
      coords.lon
    );
    const data = await fetchDetailedWithRetry(coords.lat, coords.lon);
    data.current.location = currentLocation.cityName ?? data.current.location;
    detailedCache = {
      data,
      timestamp: now,
      coords: coordsKey,
    };

    console.log("Successfully fetched and cached detailed weather data");
    return data;
  } catch (error) {
    console.error("All detailed weather fetch attempts failed:", error);

    // Return stale cache if available
    if (detailedCache && detailedCache.coords === coordsKey) {
      console.warn("Returning stale cached detailed data due to fetch error");
      return detailedCache.data;
    }

    // If no cache available, return mock data as last resort
    console.warn("No cache available, returning mock detailed data");
    return createMockDetailedWeatherData(coords.lat, coords.lon);
  }
}

export async function setUserLocation(
  location: WeatherLocation
): Promise<void> {
  try {
    currentLocation = location;
    await weatherStorage.setLocation(location);
    clearWeatherCache();
    console.log(`User location updated to: ${location.cityName || "Unknown"}`);
  } catch (error) {
    console.error("Failed to set user location:", error);
    throw error;
  } finally {
    for (const fn of locationListeners) fn();
  }
}

export async function getUserLocation(): Promise<WeatherLocation> {
  try {
    return await weatherStorage.getLocation();
  } catch (error) {
    console.error("Failed to get user location:", error);
    return weatherStorage.getDefaultLocation();
  }
}

export async function clearUserLocation(): Promise<void> {
  try {
    await weatherStorage.clearLocation();
    clearWeatherCache();
    console.log("User location cleared");
    currentLocation = weatherStorage.getDefaultLocation();
  } catch (error) {
    console.error("Failed to clear user location:", error);
    throw error;
  } finally {
    for (const fn of locationListeners) fn();
  }
}

function createMockDetailedWeatherData(
  lat: number,
  lon: number
): DetailedWeatherData {
  const now = new Date();
  const sunrise = new Date(now);
  sunrise.setHours(6, 0, 0, 0);
  const sunset = new Date(now);
  sunset.setHours(18, 30, 0, 0);

  const mockHourly = Array.from({ length: 24 }, (_, i) => ({
    time: new Date(now.getTime() + i * 60 * 60 * 1000).toISOString(),
    temperature: 25 + Math.sin(i / 4) * 5,
    feelsLike: 27 + Math.sin(i / 4) * 5,
    humidity: 65,
    dewPoint: 18,
    precipitation: 0,
    rain: 0,
    showers: 0,
    snowfall: 0,
    cloudCover: 40,
    cloudCoverLow: 20,
    cloudCoverMid: 15,
    cloudCoverHigh: 5,
    windSpeed: 5.0,
    windDirection: 180,
    windGusts: 8.0,
    uvIndex: i > 6 && i < 18 ? 6.0 : 0,
    uvIndexClearSky: i > 6 && i < 18 ? 8.0 : 0,
    isDay: i > 6 && i < 18,
    weatherCode: 1,
    description: "Mainly clear",
    emoji: "🌤️",
    pressure: 1013,
    visibility: 10.0,
  }));

  const mockDaily = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(now.getTime() + i * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    temperatureMax: 30,
    temperatureMin: 20,
    feelsLikeMax: 32,
    feelsLikeMin: 22,
    sunrise: sunrise.toISOString(),
    sunset: sunset.toISOString(),
    precipitationSum: 0,
    rainSum: 0,
    showersSum: 0,
    snowfallSum: 0,
    precipitationHours: 0,
    windSpeedMax: 8.0,
    windGustsMax: 12.0,
    windDirectionDominant: 180,
    shortwaveRadiation: 25.0,
    evapotranspiration: 5.0,
    uvIndexMax: 6.0,
    weatherCode: 1,
    description: "Mainly clear",
    emoji: "🌤️",
  }));

  return {
    current: {
      temperature: 25,
      feelsLike: 27,
      humidity: 65,
      dewPoint: 18,
      pressure: 1013,
      windSpeed: 5.0,
      windDirection: 180,
      windGusts: 8.0,
      cloudCover: 40,
      cloudCoverLow: 20,
      cloudCoverMid: 15,
      cloudCoverHigh: 5,
      precipitation: 0,
      rain: 0,
      showers: 0,
      snowfall: 0,
      visibility: 10.0,
      uvIndex: 6.0,
      uvIndexClearSky: 8.0,
      isDay: true,
      weatherCode: 1,
      description: "Weather service temporarily unavailable",
      emoji: "🌤️",
      location: currentLocation.cityName ?? "Delhi",
    },
    airQuality: {
      aqi: 85,
      aqiLevel: "Moderate",
      pm25: 35,
      pm10: 50,
      no2: 25,
      o3: 120,
      co: 0.5,
      so2: 15,
      nh3: 10,
      dust: 20,
      aod: 0.3,
    },
    sun: {
      sunrise: sunrise.toISOString(),
      sunset: sunset.toISOString(),
    },
    hourly: mockHourly,
    daily: mockDaily,
    timezone: "Asia/Kolkata",
    elevation: 53,
    lastUpdated: now.toISOString(),
  };
}

export function clearWeatherCache(): void {
  detailedCache = null;
  console.log("Weather cache cleared");
}
