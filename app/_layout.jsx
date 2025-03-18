import React from "react";
import { Stack } from "expo-router";
import { GridSettingsProvider } from "./context/GridSettingsContext.js";
import { ScreenSettingsProvider } from "./context/ScreenSettingsContext.js";
import { ClockStyleProvider } from "./context/ClockStyleContext.js";

export default function Layout() {
  return (
    <GridSettingsProvider>
      <ScreenSettingsProvider>
        <ClockStyleProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </ClockStyleProvider>
      </ScreenSettingsProvider>
    </GridSettingsProvider>
  );
}
