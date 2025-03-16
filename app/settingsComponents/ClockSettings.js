import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useClockStyle } from "../context/ClockStyleContext";

import MinimalBold from "../clock-designs/MinimalBold";
import MinimalThin from "../clock-designs/MinimalThin";
import AnalogClock from "../clock-designs/AnalogClock";
import weatherBattery from "../clock-designs/weatherBattery/WeatherBattery.jsx";
import NeonClock from "../clock-designs/NeonClock";
import SegmentClock from "../clock-designs/SegmentClock";
import CircleTheme from "../clock-designs/circleTheme/CircleTheme.jsx";

const ClockSettings = () => {
  const { clockStyle, setClockStyle } = useClockStyle();

  const clockComponents = {
    "Minimal bold": MinimalBold,
    "Minimal focus": MinimalThin,
    "Analog & Calendar": AnalogClock,
    weatherBattery: weatherBattery,
    "Segment display": SegmentClock,
    CircleTheme: CircleTheme,
    "Neon clock": NeonClock,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subheading}>Select Clock Style:</Text>
      <View style={styles.styleOptions}>
        {Object.keys(clockComponents).map((styleName) => {
          const PreviewComponent = clockComponents[styleName];
          return (
            <TouchableOpacity
              key={styleName}
              style={[
                styles.styleOption,
                clockStyle === styleName && styles.selectedOption,
              ]}
              onPress={() => setClockStyle(styleName)}
            >
              <View style={styles.previewContainer}>
                <PreviewComponent previewMode={true} color="#9ac78f" />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#000",
    flex: 1,
  },
  subheading: {
    color: "#fff",
    paddingBottom: 10,
    fontSize: 18,
    marginBottom: 10,
  },
  styleOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",

    gap: "24",
  },
  styleOption: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    width: "47.6%",
    height: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedOption: {
    borderColor: "#fff",
    borderWidth: 2,
  },
  previewContainer: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ClockSettings;
