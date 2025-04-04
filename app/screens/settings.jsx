import React, { useEffect, useCallback, useState, useMemo } from "react";
import { View, StyleSheet, BackHandler } from "react-native";
import Sidebar from "./settingsComponents/sidebar.js";
import ClockSettings from "./settingsComponents/ClockSettings.js";
import ColorSettings from "./settingsComponents/ColorSettings.js";
import GeneralSettings from "./settingsComponents/GeneralSettings.jsx";
import RateUs from "./settingsComponents/RateUs.jsx";
import { useScreenSettings } from "../context/ScreenSettingsContext";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
  runOnJS,
} from "react-native-reanimated";

export default function SettingsScreen({ onClose }) {
  const [activeTab, setActiveTab] = useState("clock");
  const { statusBarVisible } = useScreenSettings();

  const scale = useSharedValue(1.2);
  const opacity = useSharedValue(0);

  const tabComponents = {
    clock: ClockSettings,
    colors: ColorSettings,
    general: GeneralSettings,
    rateUs: RateUs,
  };

  const ActiveComponent = useMemo(
    () => tabComponents[activeTab] || null,
    [activeTab]
  );

  // Function to trigger animations
  const animateIn = () => {
    opacity.value = withTiming(1, {
      duration: 350,
      easing: Easing.out(Easing.cubic),
    });
    scale.value = withTiming(1, {
      duration: 350,
      easing: Easing.out(Easing.cubic),
    });
  };

  const animateOut = useCallback(() => {
    opacity.value = withTiming(0, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
    scale.value = withTiming(
      1.5,
      { duration: 300, easing: Easing.out(Easing.cubic) },
      () => {
        runOnJS(onClose)();
      }
    );
  }, [onClose]);

  useEffect(() => {
    animateIn();

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        animateOut();
        return true;
      }
    );

    return () => backHandler.remove();
  }, [animateOut]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        { paddingLeft: statusBarVisible ? 10 : 45 },
        animatedStyle,
      ]}
    >
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onClose={animateOut}
      />
      <View style={styles.mainContent}>
        {ActiveComponent && <ActiveComponent />}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 45,
    paddingLeft: 0,
    flexDirection: "row",
    backgroundColor: "#000",
  },
  mainContent: {
    flex: 1,
    backgroundColor: "#000",
    paddingLeft: 24,
  },
});
