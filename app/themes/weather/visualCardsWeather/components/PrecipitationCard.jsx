import { LinearGradient } from "expo-linear-gradient";
import Svg, { G, Path, Circle, Defs, ClipPath } from "react-native-svg";
import { View, Text, StyleSheet } from "react-native";

const WaterLevelIcon = ({ size = 120, precipitation = 0 }) => {
  const getWaterLevel = (precip) => {
    const maxPrecip = 10;
    return Math.min((precip / maxPrecip) * 100, 100);
  };

  const waterLevel = getWaterLevel(precipitation);
  const circleRadius = size * 0.35;
  const centerX = size / 2;
  const centerY = size / 2;

  const waterHeight = (waterLevel / 100) * (circleRadius * 2);
  const waterY = centerY + circleRadius - waterHeight;

  const WaveShape = ({ offset = 0, opacity = 0.8 }) => {
    const waveY = waterY + offset;
    return (
      <Path
        d={`
          M ${centerX - circleRadius} ${waveY}
          Q ${centerX - circleRadius / 2} ${waveY - 3}
          ${centerX} ${waveY}
          Q ${centerX + circleRadius / 2} ${waveY + 3}
          ${centerX + circleRadius} ${waveY}
          L ${centerX + circleRadius} ${centerY + circleRadius}
          L ${centerX - circleRadius} ${centerY + circleRadius}
          Z
        `}
        fill={`rgba(0, 123, 191, ${opacity})`}
      />
    );
  };

  return (
    <View style={{ borderRadius: 400, overflow: "hidden" }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <ClipPath id="circleClip">
            <Circle cx={centerX} cy={centerY} r={circleRadius} />
          </ClipPath>
        </Defs>

        {/* Background circle */}
        <Circle
          cx={centerX}
          cy={centerY}
          r={circleRadius}
          fill="rgba(30, 60, 100, 0.1)"
          stroke="rgba(100, 150, 200, 0.3)"
          strokeWidth="1"
        />

        {/* Water level */}
        {waterLevel > 0 && (
          <G clipPath="url(#circleClip)">
            <WaveShape offset={0} opacity={0.6} />
            <WaveShape offset={-2} opacity={0.4} />
            <WaveShape offset={2} opacity={0.3} />
          </G>
        )}
      </Svg>
    </View>
  );
};

const PrecipitationCard = ({ data }) => {
  const precipitation = data?.current?.precipitation || 0;

  // Determine precipitation condition based on amount
  const getPrecipitationCondition = (precip) => {
    if (precip >= 8) return { text: "Heavy rain", color: "#1E40AF" };
    if (precip >= 5) return { text: "Moderate rain", color: "#3B82F6" };
    if (precip >= 2) return { text: "Light rain", color: "#60A5FA" };
    if (precip >= 0.5) return { text: "Light drizzle", color: "#93C5FD" };
    if (precip > 0) return { text: "Very light", color: "#DBEAFE" };
    return { text: "No precipitation", color: "#FFA500" };
  };

  const condition = getPrecipitationCondition(precipitation);

  const getPrecipitationDescription = (precip) => {
    if (precip >= 8)
      return "Heavy rainfall expected. Consider staying indoors and avoid travel.";
    if (precip >= 5)
      return "Moderate rainfall expected. Carry an umbrella if going out.";
    if (precip >= 2)
      return "Light rain expected. Perfect weather for a cozy day indoors.";
    if (precip >= 0.5)
      return "Light drizzle expected. A light jacket should be sufficient.";
    if (precip > 0)
      return "Very light precipitation expected. Barely noticeable rainfall.";
    return "Clear skies with no rain expected. Perfect weather for outdoor activities.";
  };

  return (
    <LinearGradient
      colors={["#0b5855ff", "#031f25ff"]}
      style={styles.widget}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.widgetTitle}>Precipitation</Text>

      <View style={styles.contentContainer}>
        <View style={styles.precipitationContainer}>
          <View style={styles.precipitationCircle}>
            <WaterLevelIcon size={130} precipitation={precipitation} />
            <View style={styles.textOverlay}>
              <Text style={styles.precipitationValue}>{precipitation}</Text>
              <Text style={styles.precipitationUnit}>cm</Text>
              <Text style={styles.precipitationPeriod}>in next 24h</Text>
            </View>
          </View>
          <View style={styles.statusContainer}>
            <View
              style={[styles.statusDot, { backgroundColor: condition.color }]}
            />
            <Text style={styles.statusText}>{condition.text}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.widgetSubtext}>
        {getPrecipitationDescription(precipitation)}
      </Text>
    </LinearGradient>
  );
};

export default PrecipitationCard;

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
    marginVertical: "auto",
  },
  precipitationContainer: {
    alignItems: "center",
    marginVertical: "auto",
  },
  precipitationCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  textOverlay: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  precipitationValue: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  precipitationUnit: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
  precipitationPeriod: {
    color: "white",
    fontSize: 10,
    opacity: 0.8,
    textAlign: "center",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
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

  widgetSubtext: {
    marginTop: 20,
    color: "white",
    fontSize: 11,
    opacity: 0.7,
    lineHeight: 14,
  },
});
