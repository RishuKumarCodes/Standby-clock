import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { useClockStyle } from "../../context/ClockStyleContext.js";
import { H1Txt } from "../../components/CustomText.jsx";

import MinimalBold from "../../clock-designs/MinimalBold";
import MinimalThin from "../../clock-designs/MinimalThin";
import AnalogClock from "../../clock-designs/AnalogClock";
import WeatherBattery from "../../clock-designs/WeatherBattery.jsx";
import WindowsClock from "../../clock-designs/WindowsClock/WindowsClock.jsx";
import SegmentClock from "../../clock-designs/SegmentClock";
import CircleTheme from "../../clock-designs/circleTheme/CircleTheme.jsx";
import EarthClock from "../../clock-designs/EarthClock/EarthClock.jsx";
import { ScrollView } from "react-native-gesture-handler";

const ClockSettings = () => {
  const { clockStyle, setClockStyle, userColor } = useClockStyle();

  const clockComponents = {
    MinimalBold: MinimalBold,
    MinimalThin: MinimalThin,
    AnalogClock: AnalogClock,
    WeatherBattery: WeatherBattery,
    SegmentClock: SegmentClock,
    CircleTheme: CircleTheme,
    EarthClock: EarthClock,
    WindowsClock: WindowsClock,
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <H1Txt style={styles.heading}>Select Clock Style:</H1Txt>
        <View style={styles.styleOptions}>
          {Object.keys(clockComponents).map((styleName) => {
            const PreviewComponent = clockComponents[styleName];
            return (
              <Pressable
                key={styleName}
                style={[
                  styles.styleOption,
                  clockStyle === styleName && styles.selectedOption,
                ]}
                onPress={() => setClockStyle(styleName)}
              >
                <View style={styles.previewContainer} pointerEvents="none">
                  <PreviewComponent
                    previewMode={true}
                    color={userColor || "#fff"}
                  />
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 35,
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
    overflow: "hidden",
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
