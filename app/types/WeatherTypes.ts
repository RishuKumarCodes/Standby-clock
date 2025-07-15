// types/WeatherTypes.ts

// Legacy interface for backward compatibility
export interface CurrentWeather {
  temperature: number;         // °C
  feelsLike: number;           // °C
  humidity: number;            // %
  pressure: number;            // hPa or mb
  windSpeed: number;           // km/h or m/s
  windGust: number;            // km/h or m/s
  windDir: number;             // degrees (0–360)
  cloudCover: number;          // %
  precipitation: number;       // mm
  visibility: number;          // km
  uvIndex: number;             // 0–11+
  aqi: number;                 // 0–500 AQI
  aqiLevel: string;            // "Good", "Moderate", etc.
  pm25: number;                // μg/m³
  pm10: number;                // μg/m³
  no2: number;                 // μg/m³
  o3: number;                  // μg/m³
  co: number;                  // mg/m³
  so2: number;                 // μg/m³
  nh3: number;                 // μg/m³
  sunrise: string;
  sunset: string;
  description: string;         // e.g. "Mostly Sunny"
  location?: string;           // Location name or coordinates
}

// New comprehensive weather data structure
export interface DetailedWeatherData {
  current: CurrentWeatherDetailed;
  airQuality: AirQualityData;
  sun: SunData;
  hourly: HourlyWeatherData[];
  daily: DailyWeatherData[];
  timezone: string;
  elevation: number;
  lastUpdated: string;
}

export interface CurrentWeatherDetailed {
  temperature: number;         // °C
  feelsLike: number;           // °C
  humidity: number;            // %
  dewPoint: number;            // °C
  pressure: number;            // hPa
  windSpeed: number;           // km/h
  windDirection: number;       // degrees (0–360)
  windGusts: number;           // km/h
  cloudCover: number;          // %
  cloudCoverLow: number;       // %
  cloudCoverMid: number;       // %
  cloudCoverHigh: number;      // %
  precipitation: number;       // mm
  rain: number;                // mm
  showers: number;             // mm
  snowfall: number;            // mm
  visibility: number;          // km
  uvIndex: number;             // 0–11+
  uvIndexClearSky: number;     // 0–11+
  isDay: boolean;              // true if daytime
  weatherCode: number;         // WMO weather code
  description: string;         // Weather description
  emoji: string;               // Weather emoji
  location: string;            // Location name
}

export interface AirQualityData {
  aqi: number;                 // 0–500 AQI
  aqiLevel: string;            // "Good", "Moderate", etc.
  pm25: number;                // μg/m³
  pm10: number;                // μg/m³
  no2: number;                 // μg/m³ - Nitrogen Dioxide
  o3: number;                  // μg/m³ - Ozone
  co: number;                  // mg/m³ - Carbon Monoxide
  so2: number;                 // μg/m³ - Sulfur Dioxide
  nh3: number;                 // μg/m³ - Ammonia
  dust: number;                // μg/m³ - Dust particles
  aod: number;                 // Aerosol Optical Depth
}

export interface SunData {
  sunrise: string;             // ISO time string
  sunset: string;              // ISO time string
}

export interface HourlyWeatherData {
  time: string;                // ISO time string
  temperature: number;         // °C
  feelsLike: number;           // °C
  humidity: number;            // %
  dewPoint: number;            // °C
  precipitation: number;       // mm
  rain: number;                // mm
  showers: number;             // mm
  snowfall: number;            // mm
  cloudCover: number;          // %
  cloudCoverLow: number;       // %
  cloudCoverMid: number;       // %
  cloudCoverHigh: number;      // %
  windSpeed: number;           // km/h
  windDirection: number;       // degrees
  windGusts: number;           // km/h
  uvIndex: number;             // 0–11+
  uvIndexClearSky: number;     // 0–11+
  isDay: boolean;              // true if daytime
  weatherCode: number;         // WMO weather code
  description: string;         // Weather description
  emoji: string;               // Weather emoji
  pressure: number;            // hPa
  visibility: number;          // km
}

export interface DailyWeatherData {
  date: string;                // ISO date string
  temperatureMax: number;      // °C
  temperatureMin: number;      // °C
  feelsLikeMax: number;        // °C
  feelsLikeMin: number;        // °C
  sunrise: string;             // ISO time string
  sunset: string;              // ISO time string
  precipitationSum: number;    // mm
  rainSum: number;             // mm
  showersSum: number;          // mm
  snowfallSum: number;         // mm
  precipitationHours: number;  // hours
  windSpeedMax: number;        // km/h
  windGustsMax: number;        // km/h
  windDirectionDominant: number; // degrees
  shortwaveRadiation: number;  // MJ/m²
  evapotranspiration: number;  // mm
  uvIndexMax: number;          // 0–11+
  weatherCode: number;         // WMO weather code
  description: string;         // Weather description
  emoji: string;               // Weather emoji
}

// Utility types for UI components
export interface WeatherDisplayData {
  current: CurrentWeatherDetailed;
  hourly: HourlyWeatherData[];
  daily: DailyWeatherData[];
  airQuality: AirQualityData;
  sun: SunData;
}

export interface WeatherWidgetProps {
  previewMode?: boolean;
  variant?: 'full' | 'compact' | 'minimal';
  color?: string;
  lat?: number;
  lon?: number;
  showHourly?: boolean;
  showDaily?: boolean;
  showAirQuality?: boolean;
  maxHours?: number;
  maxDays?: number;
}