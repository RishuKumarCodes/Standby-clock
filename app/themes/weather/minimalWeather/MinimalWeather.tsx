import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  getDetailedWeather,
  onLocationChange,
} from "../../../utils/weatherService";
import {
  AirQualityData,
  CurrentWeatherDetailed,
  DetailedWeatherData,
} from "@/app/types/WeatherTypes";
import { H1Txt, MdTxt } from "@/app/components/ui/CustomText";
import { TouchEditContainer } from "../Common/TouchEditContainer";
import PreviewScreen from "./components/PreviewScreen";
import { ThemeProps } from "@/app/types/ThemesTypes";
import { useClockStatus } from "@/app/context/ClockStatusContext";
import BatteryCharging from "../../../components/commmon/CircleChargingProgressBar";

const MinimalWeather = ({ color, variant = "full" }: ThemeProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<CurrentWeatherDetailed | null>(
    null
  );
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(
    null
  );
  const { hour, min, day, ampm } = useClockStatus();

  const getAQIColor = (aqi: number): string => {
    if (aqi <= 50) return "#10B981";
    if (aqi <= 100) return "#F59E0B";
    if (aqi <= 150) return "#F97316";
    if (aqi <= 200) return "#EF4444";
    return "#8B5CF6";
  };

  const fetchWeatherData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const detailedWeather: DetailedWeatherData = await getDetailedWeather();

      setWeatherData(detailedWeather.current);
      setAirQualityData(detailedWeather.airQuality);
    } catch (err: any) {
      setError(err.message);
      console.error("Minimal weather fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    const unsubscribe = onLocationChange(() => fetchWeatherData());
    return () => unsubscribe();
  }, []);

  if (variant !== "full")
    return <PreviewScreen color={color} variant={variant} />;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <MdTxt style={[styles.loadingText, { color }]}>
          Loading weather...
        </MdTxt>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <MdTxt style={[styles.errorText, { color }]}>Weather unavailable</MdTxt>
        <TouchableOpacity onPress={fetchWeatherData} style={styles.retryButton}>
          <MdTxt style={[styles.retryText, { color }]}>Retry</MdTxt>
        </TouchableOpacity>
      </View>
    );
  }

  if (!weatherData || !airQualityData) {
    return (
      <View style={styles.container}>
        <MdTxt style={[styles.errorText, { color }]}>No weather data</MdTxt>
      </View>
    );
  }

  return (
    <TouchEditContainer>
      <View style={styles.container}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <H1Txt
            style={{
              color: "#aaa",
              fontSize: 22,
              marginBottom: -8,
            }}
          >
            {weatherData.location}
          </H1Txt>
          <H1Txt style={{ color, opacity: 0.8 }}>
            {day}, {hour}:{min} {ampm}
          </H1Txt>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: "4%" }}>
          <Text style={{ fontSize: 120 }}>{weatherData.emoji}</Text>
          <MdTxt style={{ fontSize: 110, color, height: 150 }}>
            {weatherData.temperature}
          </MdTxt>
          <MdTxt
            style={{ fontSize: 40, color, height: 100, marginLeft: "-4%" }}
          >
            °C
          </MdTxt>
          <View style={{ marginLeft: 4 }}>
            <MdTxt style={{ color: "#fff", fontSize: 24 }}>
              {weatherData.description}
            </MdTxt>
            <MdTxt style={{ color: "#999", fontSize: 22 }}>
              Feels like: {weatherData.feelsLike}°
            </MdTxt>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={styles.statRow}>
            <MdTxt style={[styles.statLabel]}>AQI:</MdTxt>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <View
                style={{
                  height: 13,
                  width: 13,
                  borderRadius: 13,
                  marginBottom: 3,
                  backgroundColor: getAQIColor(airQualityData.aqi),
                }}
              ></View>
              <MdTxt style={[styles.statValue]}>{airQualityData.aqi}</MdTxt>
            </View>
          </View>

          <View style={styles.statRow}>
            <MdTxt style={[styles.statLabel]}>Humidity:</MdTxt>
            <MdTxt style={styles.statValue}>{weatherData.humidity}%</MdTxt>
          </View>
          <View style={styles.statRow}>
            <MdTxt style={[styles.statLabel]}>Wind:</MdTxt>
            <MdTxt style={styles.statValue}>{weatherData.windSpeed} km/h</MdTxt>
          </View>
          <View style={styles.statRow}>
            <MdTxt style={[styles.statLabel]}>Visibility:</MdTxt>
            <MdTxt style={styles.statValue}>{weatherData.visibility} km</MdTxt>
          </View>
          <View style={styles.statRow}>
            <MdTxt style={[styles.statLabel]}>Pressure:</MdTxt>
            <MdTxt style={styles.statValue}>{weatherData.pressure} mb</MdTxt>
          </View>
          <View style={styles.statRow}>
            <MdTxt style={[styles.statLabel]}>precipitation:</MdTxt>
            <MdTxt style={styles.statValue}>
              {weatherData.precipitation} mm
            </MdTxt>
          </View>
        </View>
      </View>
      <BatteryCharging />
    </TouchEditContainer>
  );
};

export default MinimalWeather;

const styles = StyleSheet.create({
  container: {
    padding: "6.5%",
    paddingVertical: "4.5%",
    justifyContent: "space-between",
    flex: 1,
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  retryButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginTop: 8,
  },
  retryText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },

  statRow: {
    alignItems: "center",
  },
  statLabel: {
    color: "#999",
    fontSize: 17,
  },
  statValue: {
    fontSize: 24,
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
});
