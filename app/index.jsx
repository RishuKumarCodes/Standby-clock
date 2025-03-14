// app/index.jsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useKeepAwake } from "expo-keep-awake";
import * as ScreenOrientation from "expo-screen-orientation";
import * as NavigationBar from "expo-navigation-bar";
import { Ionicons } from "@expo/vector-icons";

import { useClockStyle } from "./context/ClockStyleContext"; 
import { CLOCK_STYLES } from "./constants/clockStyles";

export default function ClockScreen() {
  const router = useRouter();
  useKeepAwake();

  // Force full-screen immersive mode (Android)
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    NavigationBar.setVisibilityAsync("immersive"); 
    NavigationBar.setBackgroundColorAsync("#000");
    NavigationBar.setButtonStyleAsync("light");

    return () => {
      // Cleanup on unmount
      ScreenOrientation.unlockAsync();
      NavigationBar.setVisibilityAsync("visible");
    };
  }, []);

  // Time logic
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  // Get the current style from context
  const { clockStyle } = useClockStyle();
  const selectedStyle = CLOCK_STYLES[clockStyle] || CLOCK_STYLES.default;

  return (
    <View style={styles.container}>
      {/* Hide the top status bar */}
      <StatusBar hidden />

      {/* Render the clock with the chosen style */}
      <Text style={[styles.timeTextBase, selectedStyle]}>
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </Text>

      {/* Settings icon in top-right */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => router.push("/settings")}
      >
        <Ionicons name="settings-sharp" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  timeTextBase: {
    // Base style for the clock
    // The style variant from CLOCK_STYLES merges with this
    textAlign: "center",
  },
  settingsButton: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 10,
  },
});
