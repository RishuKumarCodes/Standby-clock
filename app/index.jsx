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

  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const { clockStyle } = useClockStyle();
  const selectedStyle = CLOCK_STYLES[clockStyle] || CLOCK_STYLES.default;

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <Text style={[styles.timeTextBase, selectedStyle]}>
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </Text>

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
    textAlign: "center",
  },
  settingsButton: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 10,
  },
});
