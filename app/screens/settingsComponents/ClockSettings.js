import React, { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useClockStyle } from "../../context/ClockStyleContext.js";
import { H1Txt } from "../../components/CustomText.jsx";

import MinimalBold from "../../clock-designs/MinimalBold";
import MinimalThin from "../../clock-designs/MinimalThin";
import AnalogClock from "../../clock-designs/AnalogClock";
import WeatherBattery from "../../clock-designs/weatherBattery/WeatherBattery.jsx";
import NeonClock from "../../clock-designs/NeonClock";
import SegmentClock from "../../clock-designs/SegmentClock";
import CircleTheme from "../../clock-designs/circleTheme/CircleTheme.jsx";
import EarthClock from "../../clock-designs/EarthClock/EarthClock.jsx";

const ClockSettings = () => {
  const { clockStyle, setClockStyle, userColor, setUserColor } =
    useClockStyle();

  useEffect(() => {
    const loadColor = async () => {
      try {
        const savedColor = await AsyncStorage.getItem("clockColor");
        if (savedColor) {
          setUserColor(savedColor);
        }
      } catch (error) {
        console.error("Error loading saved color:", error);
      }
    };

    loadColor();
  }, []);

  const clockComponents = {
    MinimalBold: MinimalBold,
    MinimalThin: MinimalThin,
    AnalogClock: AnalogClock,
    WeatherBattery: WeatherBattery,
    SegmentClock: SegmentClock,
    CircleTheme: CircleTheme,
    EarthClock: EarthClock,
    NeonClock: NeonClock,
  };

  return (
    <View style={styles.container}>
      <H1Txt style={styles.heading}>Select Clock Style:</H1Txt>
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
                <PreviewComponent
                  previewMode={true}
                  color={userColor || "#9ac78f"}
                />
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
    paddingTop: 35,
    paddingLeft: 5,
    backgroundColor: "#000",
    flex: 1,
  },
  heading: {
    paddingBottom: 20,
  },
  styleOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 24,
  },
  styleOption: {
    backgroundColor: "#141a18",
    borderRadius: 20,
    width: "47.6%",
    aspectRatio: 19.5 / 9,
    alignItems: "center",
    justifyContent: "center",
  },

  selectedOption: {
    borderColor: "#E6F904",
    borderWidth: 3.4,
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
