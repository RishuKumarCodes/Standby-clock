import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import * as NavigationBar from "expo-navigation-bar";
import HomePage from "./screens/HomePage";
import AlternatingDimOverlay from "./components/AlternatingDimOverlay";
import { useScreenSettings } from "./context/ScreenSettingsContext.js";

export default function Index() {
  const router = useRouter();
  const { navBarVisible, statusBarVisible } = useScreenSettings();
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const setupScreen = async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
        NavigationBar.setVisibilityAsync(navBarVisible ? "visible" : "hidden");
        NavigationBar.setBackgroundColorAsync("#000");
        setIsLandscape(true);
      } catch (error) {
        console.error("Error setting up screen:", error);
      }
    };
    setupScreen();

    return () => {
      NavigationBar.setVisibilityAsync("visible");
    };
  }, []);

  useEffect(() => {
    NavigationBar.setVisibilityAsync(navBarVisible ? "visible" : "hidden");
    NavigationBar.setBackgroundColorAsync("#000");
  }, [navBarVisible]);

  return (
    <View style={styles.container}>
      <StatusBar hidden={!statusBarVisible} style="light" />
      <HomePage />
      {isLandscape && <AlternatingDimOverlay />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
