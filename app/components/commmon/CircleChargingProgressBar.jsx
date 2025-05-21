import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Svg, Circle } from "react-native-svg";
import { useClockStatus } from "../../context/ClockStatusContext";
import { PageSettings } from "../../context/PageSettingsContext";

const CircleChargingProgressBar = () => {
  const { batteryLevelWhileCharging } = useClockStatus();
  const [containerSize, setContainerSize] = useState(null);
  const { showChargingStatus } = PageSettings();
  
  const onLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    const size = Math.min(width, height);
    setContainerSize(size);
  };

  if (showChargingStatus === false || batteryLevelWhileCharging === null || containerSize === null) {
    return <View style={styles.container} onLayout={onLayout} />;
  }

  const size = containerSize;
  const strokeWidth = size * 0.11;
  const center = size / 2.05;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = batteryLevelWhileCharging;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#333"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#32CD32"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      <View style={[styles.textContainer, { width: size, height: size }]}>
        <Text style={[styles.percentageText, { fontSize: size * 0.22 }]}>
          {batteryLevelWhileCharging}%
        </Text>
      </View>
    </View>
  );
};

export default CircleChargingProgressBar;

const styles = StyleSheet.create({
  container: {
    height: "15%",
    aspectRatio: 1,
    position: "absolute",
    left: 15,
    bottom: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  percentageText: {
    fontWeight: "bold",
    color: "#999",
  },
});
