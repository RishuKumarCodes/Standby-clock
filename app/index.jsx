// Index.js
import React, { useEffect, useState, useRef, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  GestureHandlerRootView,
  TapGestureHandler,
} from "react-native-gesture-handler";
import HomePage from "./screens/HomePage";
import AlternatingDimOverlay from "./components/AlternatingDimOverlay";
import { ScreenSettings, useScreenSettings } from "./context/ScreenSettingsContext.js";
import SleepOverlay from "./components/SleepOverlay";
import { useSleepOverlay } from "./context/SleepOverlayContext";

export default function Index() {
  const router = useRouter();
  const [isLandscape, setIsLandscape] = useState(false);
  const { sleepMode, isScreenBlack, toggleSleepOverlay } = useSleepOverlay();
  const { activeScreen } = useScreenSettings();
  const lastTapRef = useRef(null);
  const DOUBLE_TAP_DELAY = 300;

  const [fadeTrigger, setFadeTrigger] = useState(0);

  const handleSingleTap = useCallback(() => {
    setFadeTrigger((prev) => prev + 1);
  }, []);

  const handleDoubleTap = useCallback(() => {
    if (activeScreen === "home" && sleepMode) {
      toggleSleepOverlay();
    }
  }, [activeScreen, sleepMode, toggleSleepOverlay]);

  const onGestureEvent = useCallback(
    (event) => {
      const now = Date.now();
      if (lastTapRef.current && now - lastTapRef.current < DOUBLE_TAP_DELAY) {
        lastTapRef.current = null;
        handleDoubleTap();
      } else {
        lastTapRef.current = now;
        handleSingleTap();
      }
    },
    [handleDoubleTap, handleSingleTap]
  );

  useEffect(() => {
    const setupScreen = async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
        setIsLandscape(true);
      } catch (error) {
        console.error("Error setting up screen:", error);
      }
    };
    setupScreen();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TapGestureHandler onActivated={onGestureEvent}>
        <View style={styles.container}>
          <ScreenSettings />
          {activeScreen === "home" && sleepMode && isScreenBlack ? (
            <SleepOverlay fadeTrigger={fadeTrigger} />
          ) : (
            <HomePage />
          )}
          {isLandscape && <AlternatingDimOverlay />}
        </View>
      </TapGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
