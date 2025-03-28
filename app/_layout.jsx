import React, { useEffect, useState } from "react";
import * as Font from "expo-font";
import { Stack } from "expo-router";
import { GridSettingsProvider } from "./context/GridSettingsContext.js";
import { ScreenSettingsProvider } from "./context/ScreenSettingsContext.js";
import { ClockStyleProvider } from "./context/ClockStyleContext.js";
import { SleepOverlayProvider } from "./context/SleepOverlayContext.js";
import { View, ActivityIndicator } from "react-native";

export default function Layout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
      "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    })
      .then(() => setFontsLoaded(true))
      .catch((err) => console.error("Error loading fonts:", err));
  }, []);

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <GridSettingsProvider>
      <ScreenSettingsProvider>
        <SleepOverlayProvider>
          <ClockStyleProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </ClockStyleProvider>
        </SleepOverlayProvider>
      </ScreenSettingsProvider>
    </GridSettingsProvider>
  );
}
