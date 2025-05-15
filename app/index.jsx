import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, View, Animated } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import Onboarding from "./screens/Onboarding";
import SettingsScreen from "./screens/settings";
import { useScreenSettings } from "./context/ScreenSettingsContext";
import { useKeepAwake } from "expo-keep-awake";
import HomePage from "./screens/HomePage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const { setActiveScreen } = useScreenSettings();
  useKeepAwake();

  // HomePage animation values
  const [homeScale] = useState(() => new Animated.Value(1));
  const [homeOpacity] = useState(() => new Animated.Value(1));

  // SettingsScreen animation values
  const [settingsScale] = useState(() => new Animated.Value(1.5));
  const [settingsOpacity] = useState(() => new Animated.Value(0));

  const [showSettings, setShowSettings] = useState(false);
  const animateToSettings = useCallback(() => {
    if (showSettings) return;
    setShowSettings(true);
    setActiveScreen("settings");

    Animated.parallel([
      // Home shrinks & fades
      Animated.timing(homeScale, {
        toValue: 0.8,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(homeOpacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),

      // Settings scales down from 1.5→1 & fades in 0→1
      Animated.timing(settingsScale, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.timing(settingsOpacity, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    showSettings,
    homeScale,
    homeOpacity,
    settingsScale,
    settingsOpacity,
    setShowSettings,
    setActiveScreen,
  ]);

  // Animate Settings OUT (scale 1→1.5, opacity 1→0)
  const animateSettingsOut = useCallback(
    (cb) => {
      Animated.parallel([
        Animated.timing(settingsScale, {
          toValue: 1.5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(settingsOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(cb);
    },
    [settingsScale, settingsOpacity]
  );

  // Animate Home back IN (scale 0.8→1, opacity 0→1)
  const animateBackHome = useCallback(
    (cb) => {
      Animated.parallel([
        Animated.timing(homeScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(homeOpacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(cb);
    },
    [homeScale, homeOpacity]
  );

  // Handler to close Settings: animate Settings OUT → unmount → animate Home IN
  const handleSettingsClose = useCallback(() => {
    animateSettingsOut(() => {
      setShowSettings(false);
      setActiveScreen("home");
      animateBackHome();
    });
  }, [animateSettingsOut, setShowSettings, setActiveScreen, animateBackHome]);

  // gesture controlls to open the settings page. ---------------------------------
  const longPress = Gesture.LongPress()
    .minDuration(300)
    .onStart(() => {
      "worklet";
      runOnJS(animateToSettings)();
    });
  const pinch = Gesture.Pinch().onEnd(({ scale }) => {
    "worklet";
    if (scale < 0.8) runOnJS(animateToSettings)();
  });

  // first time screen open onboarding popup screen code: --------------------------
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("hasSeenOnboarding").then((val) => {
      setShowOnboarding(val === "true" ? false : true);
    });
  }, []);

  const finishOnboarding = useCallback(() => {
    AsyncStorage.setItem("hasSeenOnboarding", "true");
    setShowOnboarding(false);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <Onboarding visible={showOnboarding} onDone={finishOnboarding} />
      <View style={styles.container}>
        <GestureDetector gesture={Gesture.Simultaneous(longPress, pinch)}>
          <Animated.View
            style={[
              styles.container,
              { transform: [{ scale: homeScale }], opacity: homeOpacity },
            ]}
          >
            <HomePage />
          </Animated.View>
        </GestureDetector>
        {showSettings && (
          <Animated.View
            style={[
              styles.container2,
              {
                transform: [{ scale: settingsScale }],
                opacity: settingsOpacity,
              },
            ]}
          >
            <SettingsScreen onClose={handleSettingsClose} />
          </Animated.View>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  container2: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
  },
  pagerView: { flex: 1 },
  page: { flex: 1 },
});
