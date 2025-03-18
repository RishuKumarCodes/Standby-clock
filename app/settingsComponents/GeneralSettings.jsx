import React, { useState, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, Switch, StatusBar } from "react-native";
import Slider from "@react-native-community/slider";
import { useGridSettings } from "../context/GridSettingsContext.js";
import { useScreenSettings } from "../context/ScreenSettingsContext.js";
import * as NavigationBar from "expo-navigation-bar";

const OptimizedSlider = React.memo(({ value, onValueChange, onSlidingComplete }) => {
  return (
    <Slider
      style={styles.slider}
      minimumValue={0.3}
      maximumValue={1}
      value={value}
      onValueChange={onValueChange}
      onSlidingComplete={onSlidingComplete}
      minimumTrackTintColor="#fff"
      maximumTrackTintColor="#444"
      thumbTintColor="#fff"
    />
  );
});

export default function GeneralSettings() {
  const { notificationBarVisible, setNotificationBarVisible } = useScreenSettings();
  const { gridOverlayEnabled, setGridOverlayEnabled, gridOpacity, setGridOpacity } = useGridSettings();
  const {
    navBarVisible,
    setNavBarVisible,
    statusBarVisible,
    setStatusBarVisible,
    notificationsBarVisible,
    setNotificationsBarVisible,
    notificationsEnabled,
    setNotificationsEnabled,
  } = useScreenSettings();

  const [sliderValue, setSliderValue] = useState(gridOpacity);

  const handleSlidingComplete = useCallback(
    (value) => {
      setGridOpacity(value);
    },
    [setGridOpacity]
  );

  const handleValueChange = useCallback(
    (value) => {
      setSliderValue(value);
    },
    []
  );

  // Handle Navigation Bar Visibility
  useEffect(() => {
    NavigationBar.setVisibilityAsync(navBarVisible ? "visible" : "hidden");
    NavigationBar.setBackgroundColorAsync("#000");
  }, [navBarVisible]);

  // Handle Notification Bar (Status Bar UI)
  useEffect(() => {
    StatusBar.setHidden(!notificationsBarVisible, "fade");
  }, [notificationsBarVisible]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>General Settings</Text>

      {/* Container for the two cards side by side */}
      <View style={styles.cardsContainer}>
        {/* Burn-in Protection & Grid Opacity Card */}
        <View style={[styles.card, styles.cardHalf]}>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Burn-in protection</Text>
            <Switch value={gridOverlayEnabled} onValueChange={setGridOverlayEnabled} />
          </View>
          <Text style={styles.infoText}>
            - Applies grid overlay to protect against display burn-in. Inverts every minute.
          </Text>
          <View style={styles.cardRow}>
            <Text style={styles.label}>
              Grid Opacity: {Math.round(sliderValue * 100)}%
            </Text>
          </View>
          {/* Slider moved to the next line */}
          <View style={styles.sliderRow}>
            <OptimizedSlider
              value={sliderValue}
              onValueChange={handleValueChange}
              onSlidingComplete={handleSlidingComplete}
            />
          </View>
        </View>

        {/* Navigation, Status, and Notification Bar Card */}
        <View style={[styles.card, styles.cardHalf]}>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Navigation Bar</Text>
            <Switch value={navBarVisible} onValueChange={setNavBarVisible} />
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Status Bar (Notch Area)</Text>
            <Switch value={statusBarVisible} onValueChange={setStatusBarVisible} />
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Notification Bar</Text>
            <Switch value={notificationBarVisible} onValueChange={setNotificationsBarVisible} />
          </View>
        </View>
      </View>

      {/* Enable Notifications remains separate */}
      <View style={styles.settingRow}>
        <Text style={styles.label}>Enable Notifications </Text>
        <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingHorizontal: 5,
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 20,
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 20,
  },
  card: {
    backgroundColor: "#222",
    borderRadius: 15,
    padding: 10,
    paddingHorizontal: 20,
    flex: 1,
  },
  cardHalf: {
    // Additional adjustments if needed
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: -5, // Decreased spacing between rows
  },
  sliderRow: {
    marginTop: 5,
  },
  infoText: {
    color: "#636363",
    fontSize: 12,
    marginBottom: 10, 
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#222",
    padding: 10,
    paddingHorizontal:20,
    borderRadius: 15,
  },
  label: {
    color: "#fff",
    fontSize: 16,
  },
  slider: {
    flex: 1,
    height: 40,
  },
});
