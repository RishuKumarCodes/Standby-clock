import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "USER_WEATHER_LOCATION";

export interface WeatherLocation {
  lat: number;
  lon: number;
  cityName?: string;
  lastUpdated?: number;
}

const DEFAULT_LOCATION: WeatherLocation = {
  lat: 40.7128,
  lon: -74.006,
  cityName: "New York, USA",
};

export const weatherStorage = {
  async getLocation(): Promise<WeatherLocation> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.lat && parsed.lon) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn("Failed to load stored weather location:", error);
    }

    return DEFAULT_LOCATION;
  },

  async setLocation(location: WeatherLocation): Promise<void> {
    try {
      const locationWithTimestamp = {
        ...location,
        lastUpdated: Date.now(),
      };
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(locationWithTimestamp)
      );
    } catch (error) {
      console.error("Failed to save weather location:", error);
      throw error;
    }
  },

  async clearLocation(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear weather location:", error);
      throw error;
    }
  },

  getDefaultLocation(): WeatherLocation {
    return DEFAULT_LOCATION;
  },
};
