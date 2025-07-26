import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Path, G } from "react-native-svg";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const WindCompass = ({ windDirection = 90 }) => {
  const arrowRotation = windDirection + 180;

  return (
    <View style={styles.compassContainer}>
      <Svg width={100} height={100} viewBox="0 0 100 100">
        <Circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#4a5568"
          strokeWidth="2"
          opacity="0.3"
        />

        <G transform={`rotate(${arrowRotation} 50 50)`}>
          <Path d="M50 20 L43 54 L50 48 L57 54 Z" fill="#4ade80" />
        </G>
      </Svg>

      {/* Compass Labels */}
      <Text style={[styles.compassLabel, styles.compassN]}>N</Text>
      <Text style={[styles.compassLabel, styles.compassE]}>E</Text>
      <Text style={[styles.compassLabel, styles.compassS]}>S</Text>
      <Text style={[styles.compassLabel, styles.compassW]}>W</Text>
    </View>
  );
};

const WindCard = ({ data }) => {
  const windDirection = data?.current?.windDirection || 90;

  const getDirectionText = (degrees) => {
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
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  return (
    <LinearGradient
      colors={["#3d3d3dff", "#210e33ff"]}
      style={styles.widget}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.widgetTitle}>Wind</Text>
      <View style={styles.windContainer}>
        <View>
          <WindCompass windDirection={windDirection} />
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: "#FFA500" }]} />
            <Text style={styles.statusText}>Force: 0 (Calm)</Text>
          </View>
        </View>
        <View style={styles.windDetails}>
          <Text style={styles.windDirection}>
            From {getDirectionText(windDirection)} ({windDirection}°)
          </Text>
          <Text style={styles.windSpeed}>
            {data?.current?.windSpeed || 1} km/h
          </Text>
          <Text style={styles.windSpeedLabel}>Wind Speed</Text>
          <Text style={styles.windGusts}>
            {data?.current?.windGusts || 23} km/h
          </Text>
          <Text style={styles.windGustsLabel}>Wind Gust</Text>
        </View>
      </View>

      <Text style={styles.widgetSubtext}>
        Steady with averages holding at 2 km/h (gusts to 17) expected from{" "}
        {getDirectionText(windDirection)} through morning.
      </Text>
    </LinearGradient>
  );
};

export default WindCard;

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
    marginTop: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFA500",
    marginRight: 8,
  },
  statusText: {
    color: "#ccc",
    fontSize: 12,
    fontWeight: "500",
  },
  windContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginVertical: "auto",
    paddingVertical: 7,
  },
  compassContainer: {
    position: "relative",
    width: 100,
    height: 100,
  },
  compassLabel: {
    position: "absolute",
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  compassN: {
    top: 4,
    left: "50%",
    marginLeft: -7,
  },
  compassE: {
    top: "50%",
    right: 4,
    marginTop: -9,
  },
  compassS: {
    bottom: 4,
    left: "50%",
    marginLeft: -7,
  },
  compassW: {
    top: "50%",
    left: 4,
    marginTop: -9,
  },
  windDetails: {
    marginLeft: 20,
  },
  windDirection: {
    color: "white",
    fontSize: 12,
    opacity: 0.8,
  },
  windSpeed: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 2,
  },
  windSpeedLabel: {
    color: "white",
    fontSize: 10,
    opacity: 0.7,
    marginBottom: 8,
  },
  windGusts: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  windGustsLabel: {
    color: "white",
    fontSize: 10,
    opacity: 0.7,
  },
});
