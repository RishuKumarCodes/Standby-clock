import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Path,
  Rect,
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";
import { View, Text, StyleSheet } from "react-native";

const TemperatureGraph = ({ hourlyData, currentTemp }) => {
  if (!hourlyData || hourlyData.length === 0) return null;

  // Take first 12 hours for display
  const displayData = hourlyData.slice(0, 12);
  const temperatures = displayData.map((hour) => hour.temperature);
  const minTemp = Math.min(...temperatures);
  const maxTemp = Math.max(...temperatures);
  const tempRange = maxTemp - minTemp || 1; // Avoid division by zero

  const graphWidth = 250;
  const graphHeight = 80;
  const barWidth = graphWidth / displayData.length;
  const maxBarHeight = 50;

  // Generate smooth curve path
  const generateCurvePath = () => {
    if (displayData.length < 2) return "";

    let path = "";
    const points = displayData.map((hour, index) => ({
      x: index * barWidth + barWidth / 2,
      y:
        graphHeight -
        20 -
        ((hour.temperature - minTemp) / tempRange) * maxBarHeight,
    }));

    // Start path
    path += `M ${points[0].x} ${points[0].y}`;

    // Create smooth curves between points
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currentPoint = points[i];
      const controlPoint1X = prevPoint.x + (currentPoint.x - prevPoint.x) * 0.3;
      const controlPoint2X =
        currentPoint.x - (currentPoint.x - prevPoint.x) * 0.3;

      path += ` C ${controlPoint1X} ${prevPoint.y}, ${controlPoint2X} ${currentPoint.y}, ${currentPoint.x} ${currentPoint.y}`;
    }

    return path;
  };

  // Get color based on temperature
  const getTemperatureColor = (temp) => {
    if (temp <= 15) return "#4A90E2"; // Cold - Blue
    if (temp <= 25) return "#00BFFF"; // Cool - Light Blue
    if (temp <= 30) return "#FFD700"; // Warm - Yellow
    if (temp <= 35) return "#FF8C00"; // Hot - Orange
    return "#FF4500"; // Very Hot - Red
  };

  const trend =
    displayData.length > 1
      ? displayData[displayData.length - 1].temperature -
          displayData[0].temperature >
        0
        ? "Rising"
        : "Falling"
      : "Steady";

  return (
    <LinearGradient
      colors={["#530000ff", "#202a36ff"]}
      style={styles.widget}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.widgetTitle}>Temperature</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          marginVertical: "auto",
          paddingTop: 7,
        }}
      >
        <View
          style={{
            paddingHorizontal: 20,
          }}
        >
          <Text style={styles.temperatureValue}>{currentTemp}°</Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    trend === "Rising"
                      ? "#ff4747ff"
                      : trend === "Falling"
                      ? "#6b93ffff"
                      : "#FFA500",
                },
              ]}
            />
            <Text style={styles.statusText}>{trend}</Text>
          </View>
        </View>

        {/* Hourly Graph */}
        <View style={styles.graphContainer}>
          <Svg width={graphWidth} height={graphHeight}>
            <Defs>
              <SvgLinearGradient
                id="curveGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <Stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.8" />
                <Stop offset="100%" stopColor="#4ECDC4" stopOpacity="0.3" />
              </SvgLinearGradient>
            </Defs>

            {/* Temperature Bars */}
            {displayData.map((hour, index) => {
              const barHeight =
                ((hour.temperature - minTemp) / tempRange) * maxBarHeight;
              const x = index * barWidth + barWidth * 0.3;
              const y = graphHeight - 20 - barHeight;
              const color = getTemperatureColor(hour.temperature);

              return (
                <Rect
                  key={index}
                  x={x}
                  y={y}
                  width={barWidth * 0.4}
                  height={barHeight}
                  fill={color}
                  opacity={0.7}
                  rx={2}
                />
              );
            })}

            {/* Smooth Temperature Curve */}
            <Path
              d={generateCurvePath()}
              stroke="url(#curveGradient)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            {/* Data Points */}
            {displayData.map((hour, index) => {
              const x = index * barWidth + barWidth / 2;
              const y =
                graphHeight -
                20 -
                ((hour.temperature - minTemp) / tempRange) * maxBarHeight;

              return (
                <Circle
                  key={`point-${index}`}
                  cx={x}
                  cy={y}
                  r="4.5"
                  fill={getTemperatureColor(hour.temperature)}
                />
              );
            })}
          </Svg>

          {/* Time Labels */}
          <View style={styles.timeLabels}>
            {displayData.map((hour, index) => {
              if (index % 2 === 0) {
                // Show every other hour to avoid crowding
                const time = new Date(hour.time).getHours();
                return (
                  <Text
                    key={index}
                    style={[styles.timeLabel, { left: index * barWidth }]}
                  >
                    {time}:00
                  </Text>
                );
              }
              return null;
            })}
          </View>
        </View>
      </View>

      {/* Status Indicator */}

      <Text style={styles.widgetSubtext}>
        {trend} trend with peak at {maxTemp}° and low at {minTemp}°.
      </Text>
    </LinearGradient>
  );
};

export default TemperatureCard = ({ data }) => {
  return (
    <TemperatureGraph
      hourlyData={data?.hourly}
      currentTemp={data?.current?.temperature}
    />
  );
};

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
  graphContainer: {
    marginTop: -45,
    alignItems: "center",
    position: "relative",
  },
  timeLabels: {
    marginTop: -7,
    marginLeft: 22,

    flexDirection: "row",
    position: "relative",
    width: 280,
  },
  timeLabel: {
    position: "absolute",
    color: "white",
    fontSize: 10,
    opacity: 0.7,
    textAlign: "center",
    width: 40,
  },
  widgetSubtext: {
    padding: 10,
    color: "white",
    fontSize: 11,
    opacity: 0.7,
    lineHeight: 14,
    marginTop: 50,
  },
});
