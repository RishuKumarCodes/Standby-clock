import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useKeepAwake } from "expo-keep-awake";
import * as ScreenOrientation from "expo-screen-orientation";
import * as NavigationBar from "expo-navigation-bar";
import { Ionicons } from "@expo/vector-icons";

import MinimalBold from "./clock-designs/MinimalBold.jsx";
import MinimalThin from "./clock-designs/MinimalThin.jsx";
import AnalogClock from "./clock-designs/AnalogClock.jsx";
import WeatherClock from "./clock-designs/WeatherClock.jsx";
import NeonClock from "./clock-designs/NeonClock.jsx";
import SagmentClock from "./clock-designs/SegmentClock.jsx";
import { useClockStyle } from "./context/ClockStyleContext";

export default function ClockScreen() {
  const router = useRouter();
  useKeepAwake();

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    NavigationBar.setVisibilityAsync("immersive");
    NavigationBar.setBackgroundColorAsync("#000");
    NavigationBar.setButtonStyleAsync("light");

    return () => {
      ScreenOrientation.unlockAsync();
      NavigationBar.setVisibilityAsync("visible");
    };
  }, []);

  const { clockStyle, userColor } = useClockStyle();

  let ClockComponent;
  switch (clockStyle) {
    case "Minimal bold":
      ClockComponent = MinimalBold;
      break;
    case "Minimal focus":
      ClockComponent = MinimalThin;
      break;
    case "Analog & Calendar":
      ClockComponent = AnalogClock;
      break;
    case "Neon clock":
      ClockComponent = NeonClock;
      break;
    case "Segment display":
      ClockComponent = SagmentClock;
      break;
    case "weather & battery":
      ClockComponent = WeatherClock;
      break;
    default:
      ClockComponent = MinimalBold;
      break;
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <ClockComponent color={userColor} />

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => router.push("/settings")}
      >
        <Ionicons
          name="pencil-outline"
          size={28}
          color={userColor}
          style={{ opacity: 0.7 }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  settingsButton: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 10,
  },
});
