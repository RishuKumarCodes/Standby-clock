import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Path } from "react-native-svg";

const UVCard = ({ data }) => {
  const uvValue = data?.daily?.[0]?.uvIndexMax ?? 0;

  const getUVColor = (value) => {
    if (value <= 2) return "#4CAF50";
    if (value <= 5) return "#FFEB3B";
    if (value <= 7) return "#FF9800";
    if (value <= 10) return "#F44336";
    return "#9C27B0";
  };

  const getUVStatus = (value) => {
    if (value <= 2) return "Low";
    if (value <= 5) return "Moderate";
    if (value <= 7) return "High";
    if (value <= 10) return "Very High";
    return "Extreme";
  };

  const getIndicatorPosition = (value) => {
    const maxValue = 12;
    const normalizedValue = Math.min(value, maxValue) / maxValue;

    const startAngle = -225;
    const arcSpan = 270;
    const angle = startAngle + normalizedValue * arcSpan;

    const radian = (angle * Math.PI) / 180;
    const radius = 45;
    const centerX = 50;
    const centerY = 50;

    const x = centerX + radius * Math.cos(radian);
    const y = centerY + radius * Math.sin(radian);

    return { x, y };
  };

  const createArcPath = (startAngle, endAngle, radius = 45) => {
    const centerX = 50;
    const centerY = 50;

    const startRadian = (startAngle * Math.PI) / 180;
    const endRadian = (endAngle * Math.PI) / 180;

    const startX = centerX + radius * Math.cos(startRadian);
    const startY = centerY + radius * Math.sin(startRadian);
    const endX = centerX + radius * Math.cos(endRadian);
    const endY = centerY + radius * Math.sin(endRadian);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  };

  const indicatorPos = getIndicatorPosition(uvValue);
  const currentColor = getUVColor(uvValue);
  const status = getUVStatus(uvValue);

  return (
    <LinearGradient
      colors={["#4b0053ff", "#300014ff"]}
      style={styles.widget}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.widgetTitle}>UV</Text>

      <View style={styles.uvContainer}>
        <View style={styles.svgContainer}>
          <Svg width={100} height={100} style={styles.svg}>
            <Path
              d={createArcPath(-225, -185.9)}
              fill="none"
              stroke="#4CAF50"
              strokeWidth="6"
              strokeLinecap="round"
            />

            <Path
              d={createArcPath(-175.9, -112.3)}
              fill="none"
              stroke="#FFEB3B"
              strokeWidth="6"
              strokeLinecap="round"
            />

            <Path
              d={createArcPath(-102.3, -63.2)}
              fill="none"
              stroke="#FF9800"
              strokeWidth="6"
              strokeLinecap="round"
            />

            <Path
              d={createArcPath(-53.2, 10.4)}
              fill="none"
              stroke="#F44336"
              strokeWidth="6"
              strokeLinecap="round"
            />

            <Path
              d={createArcPath(20.4, 45)}
              fill="none"
              stroke="#9C27B0"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Indicator dot */}
            <Circle
              cx={indicatorPos.x}
              cy={indicatorPos.y}
              r="6"
              fill={currentColor}
              stroke="white"
              strokeWidth="2"
            />
          </Svg>

          <Text style={styles.uvValue}>{uvValue}</Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: currentColor }]} />
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      <Text style={styles.widgetSubtext}>
        Maximum UV exposure for today will be {status.toLowerCase()}, expected
        at 11:00 am.
      </Text>
    </LinearGradient>
  );
};

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
  uvContainer: {
    alignItems: "center",
    marginVertical: "auto",
    paddingVertical: 10,
  },
  svgContainer: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  svg: {
    position: "absolute",
  },
  uvValue: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    zIndex: 1,
  },
});

export default UVCard;
