import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path, Rect, Circle } from "react-native-svg";
import { View, Text, StyleSheet } from "react-native";

const FeelsLikeCard = ({ data }) => {
  const feelsLike = data?.current?.feelsLike || 32;
  const temperature = data?.current?.temperature || 28;
  const difference = feelsLike - temperature;

  // Get trend based on difference
  const getTrend = () => {
    if (difference > 2) return "Much Warmer";
    if (difference > 0) return "Warmer";
    if (difference < -2) return "Much Cooler";
    if (difference < 0) return "Cooler";
    return "Same";
  };

  const trend = getTrend();

  // Get trend color
  const getTrendColor = () => {
    if (difference > 1) return "#ff4747ff"; // Red for warmer
    if (difference < -1) return "#6b93ffff"; // Blue for cooler
    return "#FFA500"; // Orange for same/slight difference
  };

  // Thermometer SVG component
  const ThermometerSvg = () => (
    <Svg width="40" height="80" viewBox="0 0 40 80">
      {/* Thermometer tube */}
      <Rect
        x="15"
        y="10"
        width="10"
        height="50"
        fill="rgba(255,255,255,0.3)"
        rx="5"
      />

      {/* Mercury/fluid */}
      <Rect
        x="17"
        y="15"
        width="6"
        height={30 + (feelsLike / 50) * 20} // Dynamic height based on temperature
        fill="#FF6B6B"
        rx="3"
      />

      {/* Thermometer bulb */}
      <Circle cx="20" cy="65" r="12" fill="#FF6B6B" />

      {/* Temperature markings */}
      <Path
        d="M 28 20 L 32 20 M 28 30 L 30 30 M 28 40 L 32 40 M 28 50 L 30 50"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1"
      />
    </Svg>
  );

  return (
    <LinearGradient
      colors={["#44410fff", "#2b2906ff"]}
      style={styles.widget}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.widgetTitle}>Feels like</Text>

      <View style={styles.contentContainer}>
        <View style={styles.temperatureSection}>
          <Text style={styles.temperatureValue}>{feelsLike}°</Text>
          <View style={styles.statusContainer}>
            <View
              style={[styles.statusDot, { backgroundColor: getTrendColor() }]}
            />
            <Text style={styles.statusText}>{trend}</Text>
          </View>
        </View>

        {/* Thermometer Visual */}
        <View style={styles.thermometerContainer}>
          <ThermometerSvg />
        </View>
      </View>

      {/* Comparison Display */}
      <View style={styles.comparisonContainer}>
        <View style={styles.differenceContainer}>
          <Text
            style={[
              styles.difference,
              { color: difference > 0 ? "#FF6B6B" : "#4ECDC4" },
            ]}
          >
            {difference > 0 ? "+" : ""}
            {difference.toFixed(1)}°
          </Text>
        </View>
      </View>

      <Text style={styles.widgetSubtext}>
        {difference > 0
          ? "Feels warmer"
          : difference < 0
          ? "Feels cooler"
          : "Feels the same"}{" "}
        than actual temperature.
      </Text>
    </LinearGradient>
  );
};

export default FeelsLikeCard;

const styles = StyleSheet.create({
  widget: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    padding: 20,
    overflow: "hidden",
  },
  widgetTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.9,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    paddingTop: 8,
    marginVertical: "auto",
  },
  temperatureSection: {
    paddingHorizontal: 20,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: "#ccc",
    fontSize: 12,
    fontWeight: "500",
  },
  temperatureValue: {
    color: "white",
    fontSize: 48,
    lineHeight: 47,
    fontWeight: "bold",
  },
  thermometerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  comparisonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10,
  },
  actualTemp: {
    color: "white",
    fontSize: 16,
    opacity: 0.8,
  },
  differenceContainer: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difference: {
    fontSize: 14,
    fontWeight: "600",
  },
  widgetSubtext: {
    color: "white",
    fontSize: 11,
    opacity: 0.7,
    lineHeight: 14,
  },
});
