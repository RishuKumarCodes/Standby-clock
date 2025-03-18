import React, { useEffect, useState } from "react";
import { StyleSheet, Pressable, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useKeepAwake } from "expo-keep-awake";
import * as ScreenOrientation from "expo-screen-orientation";
import * as NavigationBar from "expo-navigation-bar";
import { useScreenSettings } from "./context/ScreenSettingsContext.js";

import MinimalBold from "./clock-designs/MinimalBold";
import MinimalThin from "./clock-designs/MinimalThin";
import AnalogClock from "./clock-designs/AnalogClock";
import weatherBattery from "./clock-designs/weatherBattery/WeatherBattery";
import NeonClock from "./clock-designs/NeonClock";
import SagmentClock from "./clock-designs/SegmentClock";
import CircleTheme from "./clock-designs/circleTheme/CircleTheme";
import AlternatingDimOverlay from "./components/AlternatingDimOverlay";

import { useClockStyle } from "./context/ClockStyleContext.js";

export default function ClockScreen() {
  const router = useRouter();
  useKeepAwake();
  const { clockStyle, userColor } = useClockStyle();
  const { navBarVisible, statusBarVisible } = useScreenSettings();
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const setupScreen = async () => {
      try {
        // ✅ Lock orientation to LANDSCAPE ONCE
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

        // ✅ Change Navigation Bar visibility & background color
        NavigationBar.setVisibilityAsync(navBarVisible ? "visible" : "hidden");
        NavigationBar.setBackgroundColorAsync("#000"); // Set black background
        
        setIsLandscape(true);
      } catch (error) {
        console.error("Error setting up screen:", error);
      }
    };

    setupScreen();

    return () => {
      // ✅ Don't unlock orientation to avoid switching back to portrait
      NavigationBar.setVisibilityAsync("visible");
    };
  }, []);

  // ✅ Toggle navigation bar without affecting screen orientation
  useEffect(() => {
    NavigationBar.setVisibilityAsync(navBarVisible ? "visible" : "hidden");
    NavigationBar.setBackgroundColorAsync("#000"); // Keep it black
  }, [navBarVisible]);

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
    case "weatherBattery":
      ClockComponent = weatherBattery;
      break;
    case "CircleTheme":
      ClockComponent = CircleTheme;
      break;
    default:
      ClockComponent = MinimalBold;
      break;
  }

  return (
    <Pressable
      style={styles.container}
      onLongPress={() => router.push("/settings")}
      delayLongPress={250}
    >
      <StatusBar hidden={!statusBarVisible} style="light" />

      {/* Render selected clock component */}
      <ClockComponent color={userColor} />

      {/* Overlay in landscape mode */}
      {isLandscape && <AlternatingDimOverlay />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
