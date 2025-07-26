import { LinearGradient } from "expo-linear-gradient";
import Svg, { G, Path, Circle } from "react-native-svg";
import { View, Text, StyleSheet } from "react-native";

const CloudLayerIcon = ({ size = 120, cloudCover = 0 }) => {
  // Calculate number of clouds based on cloud coverage (0-6 clouds)
  const getCloudCount = (coverage) => {
    if (coverage >= 90) return 6;
    if (coverage >= 75) return 5;
    if (coverage >= 60) return 4;
    if (coverage >= 45) return 3;
    if (coverage >= 30) return 2;
    if (coverage >= 15) return 1;
    return 0;
  };

  const cloudCount = getCloudCount(cloudCover);

  // Different cloud shapes
  const CloudShape1 = ({
    x,
    y,
    scale = 1,
    opacity = 1,
    color = "rgba(255,255,255,0.9)",
  }) => (
    <G transform={`translate(${x}, ${y}) scale(${scale})`}>
      <Path
        d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"
        fill={color}
        opacity={opacity}
      />
    </G>
  );

  const CloudShape2 = ({
    x,
    y,
    scale = 1,
    opacity = 1,
    color = "rgba(255,255,255,0.9)",
  }) => (
    <G transform={`translate(${x}, ${y}) scale(${scale})`}>
      <Path
        d="M20 12c0-1.1-.9-2-2-2-.3 0-.6.1-.8.2C16.4 8.8 15.3 8 14 8c-2.2 0-4 1.8-4 4 0 .2 0 .4.1.6C8.8 12.9 8 14 8 15.2c0 1.8 1.4 3.2 3.2 3.2h8.6c1.2 0 2.2-1 2.2-2.2 0-1-.7-1.9-1.6-2.1.4-.3.6-.8.6-1.1z"
        fill={color}
        opacity={opacity}
      />
    </G>
  );

  const CloudShape3 = ({
    x,
    y,
    scale = 1,
    opacity = 1,
    color = "rgba(255,255,255,0.9)",
  }) => (
    <G transform={`translate(${x}, ${y}) scale(${scale})`}>
      <Path
        d="
        M15 10 
        C10 10  8 13  8 15 
        H7 
        A3 3 0 0 0 7 21 
        H22 
        A3 3 0 0 0 22 15 
        C22 12 19 10 15 10 
        Z
      "
        fill={color}
        opacity={opacity}
      />
    </G>
  );

  const CloudShape4 = ({
    x,
    y,
    scale = 1,
    opacity = 1,
    color = "rgba(255,255,255,0.9)",
  }) => (
    <G transform={`translate(${x}, ${y}) scale(${scale})`}>
      <Path
        d="M25 15c0-2.8-2.2-5-5-5-1.5 0-2.8.7-3.7 1.7C15.5 10.7 14.3 10 13 10c-2.8 0-5 2.2-5 5 0 .3 0 .6.1.9C6.2 16.5 5 18.1 5 20c0 2.2 1.8 4 4 4h16c2.2 0 4-1.8 4-4 0-1.9-1.3-3.5-3.1-3.9.1-.4.1-.7.1-1.1z"
        fill={color}
        opacity={opacity}
      />
    </G>
  );

  const CloudShape5 = ({
    x,
    y,
    scale = 1,
    opacity = 1,
    color = "rgba(255,255,255,0.9)",
  }) => (
    <G transform={`translate(${x}, ${y}) scale(${scale})`}>
      <Path
        d={`
        M16,5
        C12,5  9,8   10,12
        C6,12   5,17   6,18
        C5,19   5,21   8,22 
        C11,24  16,23  19,21 
        C22,21  24,19  24,16
        C26,14  24,11  20,11
        C19,8   16,5   16,5
        Z
      `}
        fill={color}
        opacity={opacity}
      />
    </G>
  );
  const CloudShape6 = ({
    x,
    y,
    scale = 1,
    opacity = 1,
    color = "rgba(255,255,255,0.9)",
  }) => (
    <G transform={`translate(${x}, ${y}) scale(${scale})`}>
      <Path
        d={`
        M16,5
        C12,5  9,8   10,12
        C6,12   5,17   6,18
        C5,19   5,21   8,22 
        C11,24  16,23  19,21 
        C22,21  24,19  24,16
        C26,14  24,11  20,11
        C19,8   16,5   16,5
        Z
      `}
        fill={color}
        opacity={opacity}
      />
    </G>
  );

  // Array of cloud shapes for variety
  const cloudShapes = [
    CloudShape1,
    CloudShape2,
    CloudShape3,
    CloudShape4,
    CloudShape5,
    CloudShape6,
  ];

  // Generate random but consistent cloud positions and properties based on cloudCover
  const generateClouds = () => {
    const clouds = [];
    const seed = cloudCover; // Use cloudCover as seed for consistency

    // Pre-defined positions that look good and don't overflow
    const positions = [
      { x: -10, y: 15, minScale: 2.1, maxScale: 2.9 },
      { x: 35, y: 10, minScale: 2.8, maxScale: 3.2 },
      { x: 5, y: 35, minScale: 2.1, maxScale: 2.8 },
      { x: 0, y: -15, minScale: 1.9, maxScale: 2.3 },
      { x: 35, y: 40, minScale: 2.0, maxScale: 2.4 },
      { x: -14, y: 25, minScale: 2.2, maxScale: 2.7 },
    ];

    for (let i = 0; i < cloudCount; i++) {
      const pos = positions[i];
      // Simple pseudo-random based on seed and index
      const random1 = ((seed + i * 17) % 100) / 100;
      const random2 = ((seed + i * 23) % 100) / 100;
      const random3 = ((seed + i * 31) % 100) / 100;

      // Add slight position variation
      const x = pos.x + (random1 - 0.5) * 15;
      const y = pos.y + (random2 - 0.5) * 15;

      // Random scale within bounds
      const scale = pos.minScale + (pos.maxScale - pos.minScale) * random3;

      // Random shape
      const shapeIndex = i % cloudShapes.length;
      const CloudComponent = cloudShapes[shapeIndex];

      // Opacity based on cloud coverage and layer
      const baseOpacity = Math.min(cloudCover / 100 + 0.3, 0.9);
      const opacity = baseOpacity - i * 0.1; // Later clouds are slightly more transparent

      // Color variation
      const grayValue = 200 + random1 * 55; // 200-255
      const color = `rgba(${grayValue},${grayValue},${grayValue},${opacity})`;

      clouds.push(
        <CloudComponent
          key={i}
          x={x}
          y={y}
          scale={scale}
          opacity={opacity}
          color={color}
        />
      );
    }

    return clouds;
  };

  return (
    <View style={{ borderRadius: 400, overflow: "hidden" }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2}
          fill="rgba(135, 206, 235, 0.1)"
        />

        {/* Render clouds */}
        {generateClouds()}

        {/* Sun */}
        {cloudCover < 30 && (
          <>
            <Path
              d="M45 25 L45 17
              M65 25 L60 30
              M74 45 L65 45
              M65 65 L60 60
              M45 75 L45 65
              M25 65 L30 60
              M17 45 L25 45
              M25 25 L30 30"
              stroke="rgba(255,215,0,0.8)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            <Circle cx="45" cy="45" r="15" fill="rgba(255,215,0,0.6)" />
          </>
        )}
      </Svg>
    </View>
  );
};

const CloudCoverCard = ({ data }) => {
  const cloudCover = data?.current?.cloudCover || 88;

  const getCloudCondition = (coverage) => {
    if (coverage >= 90) return { text: "Overcast", color: "#6B7280" };
    if (coverage >= 70) return { text: "Mostly cloudy", color: "#9CA3AF" };
    if (coverage >= 50) return { text: "Partly cloudy", color: "#60A5FA" };
    if (coverage >= 30) return { text: "Partly sunny", color: "#FBBF24" };
    if (coverage >= 10) return { text: "Mostly sunny", color: "#F59E0B" };
    return { text: "Clear", color: "#EAB308" };
  };

  const condition = getCloudCondition(cloudCover);

  return (
    <LinearGradient
      colors={["#041420ff", "#043133ff"]}
      style={styles.widget}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.widgetTitle}>Cloud cover</Text>

      <View style={styles.contentContainer}>
        <View style={styles.cloudSection}>
          <Text style={styles.cloudPercentage}>{cloudCover}%</Text>
          <View style={styles.statusContainer}>
            <View
              style={[styles.statusDot, { backgroundColor: condition.color }]}
            />
            <Text style={styles.statusText}>{condition.text}</Text>
          </View>
        </View>

        <View style={styles.cloudVisualization}>
          <CloudLayerIcon size={90} cloudCover={cloudCover} />
        </View>
      </View>

      <Text style={styles.widgetSubtext}>
        {cloudCover > 70
          ? "Heavy cloud coverage with limited sunshine"
          : cloudCover > 40
          ? "Partly cloudy with some sunny intervals"
          : "Mostly clear skies with minimal cloud coverage"}
      </Text>
    </LinearGradient>
  );
};

export default CloudCoverCard;

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
  cloudSection: {
    paddingVertical: 12,
  },
  cloudPercentage: {
    color: "white",
    fontSize: 48,
    lineHeight: 47,
    fontWeight: "bold",
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
  cloudVisualization: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  widgetSubtext: {
    color: "white",
    fontSize: 11,
    opacity: 0.7,
    lineHeight: 14,
  },
});
