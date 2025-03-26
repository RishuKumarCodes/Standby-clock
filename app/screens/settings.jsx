import React, { useState, useEffect } from "react";
import {
  Animated,
  View,
  ScrollView,
  StyleSheet,
  Easing,
  BackHandler,
} from "react-native";
import Sidebar from "./settingsComponents/sidebar.js";
import ClockSettings from "./settingsComponents/ClockSettings.js";
import ColorSettings from "./settingsComponents/ColorSettings.js";
import GeneralSettings from "./settingsComponents/GeneralSettings.jsx";

export default function SettingsScreen({ onClose }) {
  const [activeTab, setActiveTab] = useState("clock");
  const [opacityAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(1.2));

  useEffect(() => {
    // Animate in settings screen
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const backAction = () => {
      handleClose();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const handleClose = () => {
    // Reverse the settings animation before closing
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.5,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose(); // Notify parent to remove the overlay
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: opacityAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      {/* Pass handleClose as the onClose prop to Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onClose={handleClose}
      />
      <ScrollView
        style={styles.mainContent}
        contentContainerStyle={styles.mainContentContainer}
      >
        {activeTab === "clock" ? (
          <ClockSettings />
        ) : activeTab === "colors" ? (
          <ColorSettings />
        ) : activeTab === "general" ? (
          <GeneralSettings />
        ) : null}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute", // Render as overlay
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal:45,
    flexDirection: "row",
    backgroundColor: "#000", // Adjust as needed
  },
  mainContent: {
    flex: 1,
    backgroundColor: "#000",
    paddingLeft: 24,
  },
  mainContentContainer: { paddingBottom: 40 },
});
