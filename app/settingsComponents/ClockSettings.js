import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useClockStyle } from "../context/ClockStyleContext";

// Import clock components
import MinimalBold from "../clock-designs/MinimalBold";
import MinimalThin from "../clock-designs/MinimalThin";
import AnalogClock from "../clock-designs/AnalogClock";
import WeatherClock from "../clock-designs/WeatherClock";
import NeonClock from "../clock-designs/NeonClock";
import SegmentClock from "../clock-designs/SegmentClock";

const ClockSettings = () => {
  const { clockStyle, setClockStyle } = useClockStyle();

  // Map style names to their corresponding components
  const clockComponents = {
    "Minimal bold": MinimalBold,
    "Minimal focus": MinimalThin,
    "Analog & Calendar": AnalogClock,
    "weather & battery": WeatherClock,
    "Segment display": SegmentClock,
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
                <View style={styles.scaledWrapper}>
                  <PreviewComponent previewMode={true} color="#9ac78f" />
                </View>
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
    paddingTop: 30,
    paddingBottom: 10,
    fontSize: 18,
    marginBottom: 10,
  },
  styleOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  styleOption: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    marginBottom: 20,
    width: "45%",
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

    // borderWidth:1,
    // borderColor:"#fff",
  },
  scaledWrapper: {
    // transform: [
    //   { scale: 1 },
    //   { translateX: 0 },
    //   { translateY: 0 },
    // ],
  },
});

export default ClockSettings;
