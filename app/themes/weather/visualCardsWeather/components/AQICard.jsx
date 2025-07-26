import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

const AQICard = ({ data }) => {
  const aqiValue = data?.airQuality?.aqi || 23;

  const getAQIInfo = (aqi) => {
    if (aqi <= 50)
      return { color: "#4CAF50", status: "Good", textColor: "#4CAF50" };
    if (aqi <= 100)
      return { color: "#FFEB3B", status: "Moderate", textColor: "#F57C00" };
    if (aqi <= 150)
      return {
        color: "#FF9800",
        status: "Unhealthy for Sensitive",
        textColor: "#FF9800",
      };
    if (aqi <= 200)
      return { color: "#F44336", status: "Unhealthy", textColor: "#F44336" };
    if (aqi <= 300)
      return {
        color: "#9C27B0",
        status: "Very Unhealthy",
        textColor: "#9C27B0",
      };
    return { color: "#8B0000", status: "Hazardous", textColor: "#8B0000" };
  };

  const aqiInfo = getAQIInfo(aqiValue);

  const maxAQI = 300;
  const normalizedValue = Math.min(aqiValue, maxAQI);

  const startAngle = -225;
  const sweepAngle = 270;
  const angle = startAngle + (normalizedValue / maxAQI) * sweepAngle;

  const angleRad = (angle * Math.PI) / 180;
  const radius = 43.75;
  const centerX = 55;
  const centerY = 55;

  const indicatorX = centerX + radius * Math.cos(angleRad);
  const indicatorY = centerY + radius * Math.sin(angleRad);

  const circumference = 2 * Math.PI * 43.75;
  const arcLength = (270 / 360) * circumference;

  return (
    <LinearGradient
      colors={["#202847ff", "#0c0c1dff"]}
      style={styles.widget}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.widgetTitle}>AQI</Text>
      <View style={styles.aqiContainer}>
        <View style={styles.aqiCircleContainer}>
          <Svg width="110" height="110" viewBox="0 0 110 110">
            <G>
              {/* Background arc */}
              <Circle
                cx="55"
                cy="55"
                r="43.75"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="6.25"
                fill="none"
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeDashoffset="0"
                transform="rotate(-225 55 55)"
                strokeLinecap="round"
              />

              {/* Progress arc*/}
              <Circle
                cx="55"
                cy="55"
                r="43.75"
                stroke={aqiInfo.color}
                strokeWidth="6.25"
                fill="none"
                strokeDasharray={`${
                  (normalizedValue / maxAQI) * arcLength
                } ${circumference}`}
                strokeDashoffset="0"
                transform="rotate(-225 55 55)"
                strokeLinecap="round"
              />

              {/* indicator dot */}
              <Circle cx={indicatorX} cy={indicatorY} r="7.5" fill="#fff" />
              <Circle
                cx={indicatorX}
                cy={indicatorY}
                r="5.75"
                fill={aqiInfo.color}
                opacity="0.8"
              />
            </G>
          </Svg>
          <Text style={styles.aqiValue}>{aqiValue}</Text>
          <View style={styles.statusContainer}>
            <View
              style={[styles.statusDot, { backgroundColor: aqiInfo.textColor }]}
            />
            <Text style={styles.statusText}>{aqiInfo.status}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.widgetSubtext}>
        Air quality with primary pollutant: PM10 90 μg/m³.
      </Text>
    </LinearGradient>
  );
};

export default AQICard;

const styles = StyleSheet.create({
  widget: {
    overflow: "hidden",
    width: "100%",
    height: "100%",
    borderRadius: 20,
    padding: 20,
  },
  widgetTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.9,
  },
  widgetSubtext: {
    color: "white",
    fontSize: 11,
    opacity: 0.7,
    lineHeight: 14,
    marginTop: 20,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -5,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  aqiContainer: {
    alignItems: "center",
    marginVertical: "auto",
    paddingVertical: 10,
  },
  aqiCircleContainer: {
    width: 110,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  aqiValue: {
    position: "absolute",
    color: "white",
    top: "25%",
    fontSize: 35,
    fontWeight: "bold",
  },
});
