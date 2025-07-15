import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { DetailedWeatherData } from "../../types/WeatherTypes";
import { getDetailedWeather } from "../../utils/weatherService";

import EditIcon from "@/assets/icons/EditIcon";
import { EditPage } from "./Common/EditPage";

interface WeatherWidgetProps {
  previewMode?: boolean;
  variant?: string;
  color?: string;
  lat?: number;
  lon?: number;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  previewMode = false,
  variant = "full",
  color = "#fff",
  lat,
  lon,
}) => {
  const [weather, setWeather] = useState<DetailedWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    fetchWeatherData();
  }, [lat, lon]);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(
        `Fetching detailed weather for coordinates: ${lat || "auto"}, ${
          lon || "auto"
        }`
      );
      const data = await getDetailedWeather(lat, lon);
      setWeather(data);
      console.log(
        `Weather data received for location: ${data.current.location}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load weather");
      console.error("Weather fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getWindDirection = (degrees: number): string => {
    const directions = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  const getUVLevel = (uv: number): string => {
    if (uv <= 2) return "Low";
    if (uv <= 5) return "Moderate";
    if (uv <= 7) return "High";
    if (uv <= 10) return "Very High";
    return "Extreme";
  };

  const getAQIColor = (aqi: number): string => {
    if (aqi <= 50) return "#00e400";
    if (aqi <= 100) return "#ffff00";
    if (aqi <= 150) return "#ff7e00";
    if (aqi <= 200) return "#ff0000";
    if (aqi <= 300) return "#8f3f97";
    return "#7e0023";
  };

  const formatTime = (timeString: string): string => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timeString;
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={color} />
        <Text style={[styles.loadingText, { color }]}>Loading weather...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={[styles.errorText, { color }]}>Weather unavailable</Text>
        {!previewMode && <Text style={styles.errorSubtext}>{error}</Text>}
        <TouchableOpacity onPress={fetchWeatherData} style={styles.retryButton}>
          <Text style={[styles.retryText, { color }]}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={[styles.errorText, { color }]}>No weather data</Text>
      </View>
    );
  }

  if (previewMode) {
    return (
      <View style={styles.previewContainer}>
        <View style={styles.previewContent}>
          <Text
            style={[styles.previewLocation, { color: color, opacity: 0.7 }]}
          >
            📍 {weather.current.location}
          </Text>
          <Text style={[styles.previewTemp, { color }]}>
            {weather.current.temperature}°C
          </Text>
          <Text style={[styles.previewDesc, { color: color, opacity: 0.8 }]}>
            {weather.current.description} {weather.current.emoji}
          </Text>
          <Text style={[styles.previewDetail, { color: color, opacity: 0.6 }]}>
            💨 {weather.current.windSpeed} km/h • 💧 {weather.current.humidity}%
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Location Management */}
        <View style={styles.headerSection}>
          <View style={styles.locationHeader}>
            <Text style={[styles.locationText, { color: color, opacity: 0.8 }]}>
              📍 {weather.current.location}
            </Text>
          </View>
          <Text style={[styles.lastUpdated, { color: color, opacity: 0.6 }]}>
            Last updated: {formatTime(weather.lastUpdated)}
          </Text>
        </View>

        {/* Main Weather Display */}
        <View style={styles.mainSection}>
          <Text style={[styles.temperature, { color }]}>
            {weather.current.temperature}°C
          </Text>
          <Text style={[styles.description, { color }]}>
            {weather.current.description} {weather.current.emoji}
          </Text>
          <Text style={[styles.feelsLike, { color }]}>
            Feels like {weather.current.feelsLike}°C
          </Text>
          <Text style={[styles.dayNight, { color: color, opacity: 0.7 }]}>
            {weather.current.isDay ? "☀️ Day" : "🌙 Night"}
          </Text>
        </View>

        {/* Current Conditions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color }]}>
            Current Conditions
          </Text>
          <View style={styles.dataGrid}>
            <View style={styles.dataItem}>
              <Text style={[styles.dataLabel, { color }]}>💧 Humidity</Text>
              <Text style={[styles.dataValue, { color }]}>
                {weather.current.humidity}%
              </Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={[styles.dataLabel, { color }]}>🌡️ Dew Point</Text>
              <Text style={[styles.dataValue, { color }]}>
                {weather.current.dewPoint}°C
              </Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={[styles.dataLabel, { color }]}>🌬️ Wind Speed</Text>
              <Text style={[styles.dataValue, { color }]}>
                {weather.current.windSpeed} km/h{" "}
                {getWindDirection(weather.current.windDirection)}
              </Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={[styles.dataLabel, { color }]}>💨 Wind Gusts</Text>
              <Text style={[styles.dataValue, { color }]}>
                {weather.current.windGusts} km/h
              </Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={[styles.dataLabel, { color }]}>📊 Pressure</Text>
              <Text style={[styles.dataValue, { color }]}>
                {weather.current.pressure} hPa
              </Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={[styles.dataLabel, { color }]}>👁️ Visibility</Text>
              <Text style={[styles.dataValue, { color }]}>
                {weather.current.visibility} km
              </Text>
            </View>
          </View>
        </View>

        {/* Cloud Cover Details */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color }]}>Cloud Cover</Text>
          <View style={styles.dataGrid}>
            <View style={styles.dataItem}>
              <Text style={[styles.dataLabel, { color }]}>☁️ Total Cover</Text>
              <Text style={[styles.dataValue, { color }]}>
                {weather.current.cloudCover}%
              </Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={[styles.dataLabel, { color }]}>🌫️ Low Clouds</Text>
              <Text style={[styles.dataValue, { color }]}>
                {weather.current.cloudCoverLow}%
              </Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={[styles.dataLabel, { color }]}>☁️ Mid Clouds</Text>
              <Text style={[styles.dataValue, { color }]}>
                {weather.current.cloudCoverMid}%
              </Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={[styles.dataLabel, { color }]}>⛅ High Clouds</Text>
              <Text style={[styles.dataValue, { color }]}>
                {weather.current.cloudCoverHigh}%
              </Text>
            </View>
          </View>
        </View>

        {/* Precipitation */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color }]}>Precipitation</Text>
          <View style={styles.dataGrid}>
            <View style={styles.dataItem}>
              <Text style={[styles.dataLabel, { color }]}>🌧️ Total</Text>
              <Text style={[styles.dataValue, { color }]}>
                {weather.current.precipitation} mm
              </Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={[styles.dataLabel, { color }]}>🌦️ Rain</Text>
              <Text style={[styles.dataValue, { color }]}>
                {weather.current.rain} mm
              </Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={[styles.dataLabel, { color }]}>⛈️ Showers</Text>
              <Text style={[styles.dataValue, { color }]}>
                {weather.current.showers} mm
              </Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={[styles.dataLabel, { color }]}>❄️ Snowfall</Text>
              <Text style={[styles.dataValue, { color }]}>
                {weather.current.snowfall} mm
              </Text>
            </View>
          </View>
        </View>

        {/* UV & Air Quality */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color }]}>UV & Air Quality</Text>
          <View style={styles.dataGrid}>
            <View style={styles.dataItem}>
              <Text style={[styles.dataLabel, { color }]}>☀️ UV Index</Text>
              <Text style={[styles.dataValue, { color }]}>
                {weather.current.uvIndex} ({getUVLevel(weather.current.uvIndex)}
                )
              </Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={[styles.dataLabel, { color }]}>🌞 UV Clear Sky</Text>
              <Text style={[styles.dataValue, { color }]}>
                {weather.current.uvIndexClearSky}
              </Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={[styles.dataLabel, { color }]}>🏭 AQI</Text>
              <Text
                style={[
                  styles.dataValue,
                  { color: getAQIColor(weather.airQuality.aqi) },
                ]}
              >
                {weather.airQuality.aqi} ({weather.airQuality.aqiLevel})
              </Text>
            </View>
          </View>
        </View>

        {/* Air Pollutants */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color }]}>Air Pollutants</Text>
          <View style={styles.dataGrid}>
            <View style={styles.dataItem}>
              <Text style={[styles.dataLabel, { color }]}>PM2.5</Text>
              <Text style={[styles.dataValue, { color }]}>
                {Math.round(weather.airQuality.pm25)} μg/m³
              </Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={[styles.dataLabel, { color }]}>PM10</Text>
              <Text style={[styles.dataValue, { color }]}>
                {Math.round(weather.airQuality.pm10)} μg/m³
              </Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={[styles.dataLabel, { color }]}>NO₂</Text>
              <Text style={[styles.dataValue, { color }]}>
                {Math.round(weather.airQuality.no2)} μg/m³
              </Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={[styles.dataLabel, { color }]}>O₃</Text>
              <Text style={[styles.dataValue, { color }]}>
                {Math.round(weather.airQuality.o3)} μg/m³
              </Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={[styles.dataLabel, { color }]}>CO</Text>
              <Text style={[styles.dataValue, { color }]}>
                {Math.round(weather.airQuality.co * 100) / 100} mg/m³
              </Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={[styles.dataLabel, { color }]}>SO₂</Text>
              <Text style={[styles.dataValue, { color }]}>
                {Math.round(weather.airQuality.so2)} μg/m³
              </Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={[styles.dataLabel, { color }]}>NH₃</Text>
              <Text style={[styles.dataValue, { color }]}>
                {Math.round(weather.airQuality.nh3)} μg/m³
              </Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={[styles.dataLabel, { color }]}>Dust</Text>
              <Text style={[styles.dataValue, { color }]}>
                {Math.round(weather.airQuality.dust)} μg/m³
              </Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={[styles.dataLabel, { color }]}>AOD</Text>
              <Text style={[styles.dataValue, { color }]}>
                {Math.round(weather.airQuality.aod * 1000) / 1000}
              </Text>
            </View>
          </View>
        </View>

        {/* Sun Times */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color }]}>Sun</Text>
          <View style={styles.dataGrid}>
            <View style={styles.dataItem}>
              <Text style={[styles.dataLabel, { color }]}>🌅 Sunrise</Text>
              <Text style={[styles.dataValue, { color }]}>
                {formatTime(weather.sun.sunrise)}
              </Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={[styles.dataLabel, { color }]}>🌇 Sunset</Text>
              <Text style={[styles.dataValue, { color }]}>
                {formatTime(weather.sun.sunset)}
              </Text>
            </View>
          </View>
        </View>

        {/* 24-Hour Forecast */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color }]}>24-Hour Forecast</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.hourlyScroll}
          >
            {weather.hourly.slice(0, 12).map((hour, index) => (
              <View key={index} style={styles.hourlyItem}>
                <Text
                  style={[styles.hourlyTime, { color: color, opacity: 0.7 }]}
                >
                  {formatTime(hour.time)}
                </Text>
                <Text style={[styles.hourlyEmoji, { color }]}>
                  {hour.emoji}
                </Text>
                <Text style={[styles.hourlyTemp, { color }]}>
                  {hour.temperature}°C
                </Text>
                <Text
                  style={[styles.hourlyDetail, { color: color, opacity: 0.6 }]}
                >
                  {hour.precipitation}mm
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 7-Day Forecast */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color }]}>7-Day Forecast</Text>
          {weather.daily.map((day, index) => (
            <View key={index} style={styles.dailyItem}>
              <View style={styles.dailyHeader}>
                <Text style={[styles.dailyDate, { color }]}>
                  {formatDate(day.date)}
                </Text>
                <Text style={[styles.dailyEmoji, { color }]}>{day.emoji}</Text>
              </View>
              <View style={styles.dailyContent}>
                <Text style={[styles.dailyTemp, { color }]}>
                  {day.temperatureMax}°/{day.temperatureMin}°C
                </Text>
                <Text
                  style={[styles.dailyDesc, { color: color, opacity: 0.8 }]}
                >
                  {day.description}
                </Text>
                <Text
                  style={[styles.dailyDetail, { color: color, opacity: 0.6 }]}
                >
                  💧 {day.precipitationSum}mm • 💨 {day.windSpeedMax}km/h • ☀️{" "}
                  {day.uvIndexMax}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Enhanced Location Modal */}
      <EditPage
        showLocationModal={showLocationModal}
        setShowLocationModal={setShowLocationModal}
        onLocationUpdate={fetchWeatherData}
        lat={lat}
        lon={lon}
      />

      <TouchableOpacity
        onPress={() => setShowLocationModal(true)}
        style={styles.editButton}
      >
        <EditIcon />
      </TouchableOpacity>
    </View>
  );
};
export default WeatherWidget;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerSection: {
    marginBottom: 16,
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  locationText: {
    fontSize: 16,
    flex: 1,
  },
  lastUpdated: {
    fontSize: 12,
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  previewContent: {
    alignItems: "center",
  },
  previewLocation: {
    fontSize: 10,
    marginBottom: 4,
  },
  previewTemp: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  previewDesc: {
    fontSize: 12,
    marginBottom: 4,
  },
  previewDetail: {
    fontSize: 10,
  },
  mainSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  temperature: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 18,
    marginBottom: 4,
  },
  feelsLike: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 4,
  },
  dayNight: {
    fontSize: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  dataGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  dataItem: {
    width: "48%",
    marginBottom: 8,
  },
  dataLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 2,
  },
  dataValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  hourlyScroll: {
    paddingVertical: 8,
  },
  hourlyItem: {
    alignItems: "center",
    marginRight: 16,
    minWidth: 60,
  },
  hourlyTime: {
    fontSize: 10,
    marginBottom: 4,
  },
  hourlyEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  hourlyTemp: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 2,
  },
  hourlyDetail: {
    fontSize: 10,
  },
  dailyItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  dailyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  dailyDate: {
    fontSize: 14,
    fontWeight: "500",
  },
  dailyEmoji: {
    fontSize: 20,
  },
  dailyContent: {
    paddingLeft: 8,
  },
  dailyTemp: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  dailyDesc: {
    fontSize: 12,
    marginBottom: 2,
  },
  dailyDetail: {
    fontSize: 10,
  },
  editButton: {
    backgroundColor: "#121212",
    aspectRatio: 1,
    position: "absolute",
    bottom: 25,
    right: 25,
    padding: 15,
    borderRadius: 50,
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 4,
  },
  errorSubtext: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  retryText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
