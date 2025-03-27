// GeneralSettings.jsx
import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useGridSettings } from "../../context/GridSettingsContext.js";
import { useScreenSettings } from "../../context/ScreenSettingsContext.js";
import * as NavigationBar from "expo-navigation-bar";
import { DimTxt, H1Txt, MdTxt } from "@/app/components/CustomText.jsx";
import ToggleButton from "@/app/components/ToggleButton";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const OptimizedSlider = React.memo(
  ({ value, onValueChange, onSlidingComplete }) => {
    return (
      <Slider
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
  }
);

export default function GeneralSettings() {
  const {
    gridOverlayEnabled,
    setGridOverlayEnabled,
    gridOpacity,
    setGridOpacity,
  } = useGridSettings();

  const {
    navBarVisible,
    setNavBarVisible,
    statusBarVisible,
    setStatusBarVisible,
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

  const handleValueChange = useCallback((value) => {
    setSliderValue(value);
  }, []);

  useEffect(() => {
    NavigationBar.setVisibilityAsync(navBarVisible ? "visible" : "hidden");
    NavigationBar.setBackgroundColorAsync("#000");
  }, [navBarVisible]);

  useEffect(() => {
    StatusBar.setHidden(!statusBarVisible, "fade");
  }, [statusBarVisible]);

  const toggleGridOverlay = (value) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setGridOverlayEnabled(value);
  };

  return (
    <View style={styles.container}>
      <H1Txt style={styles.heading}>General Settings</H1Txt>

      <View style={styles.cardsContainer}>
        {/* Left side card */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View>
              <MdTxt>Burn-in protection</MdTxt>
              {gridOverlayEnabled ? (
                <View style={styles.cardRow}>
                  <MdTxt style={{ opacity: 0.5 }}>
                    Grid Opacity: {Math.round(sliderValue * 100)}%
                  </MdTxt>
                </View>
              ) : (
                <View>
                  <DimTxt>- Adds grid to prevent display burn-in</DimTxt>
                  <DimTxt>- Overlay inverts every minute</DimTxt>
                  <DimTxt>- Only beneficial for OLED displays</DimTxt>
                </View>
              )}
            </View>
            <ToggleButton
              value={gridOverlayEnabled}
              onValueChange={toggleGridOverlay}
            />
          </View>
          {gridOverlayEnabled && (
            <View>
              <OptimizedSlider
                value={sliderValue}
                onValueChange={handleValueChange}
                onSlidingComplete={handleSlidingComplete}
              />
            </View>
          )}
        </View>

        {/* Right side card */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <MdTxt>Show navigation bar</MdTxt>
            <ToggleButton
              value={navBarVisible}
              onValueChange={setNavBarVisible}
            />
          </View>
          <View style={styles.cardRow}>
            <MdTxt>Show status bar</MdTxt>
            <ToggleButton
              value={statusBarVisible}
              onValueChange={setStatusBarVisible}
            />
          </View>
        </View>
      </View>
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View>
              <MdTxt>Disable Notifications</MdTxt>
              <DimTxt>- Enables DND while app is active</DimTxt>
            </View>
            <ToggleButton
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View>
              <MdTxt>Double tap to sleep</MdTxt>
              <DimTxt>- Turns the display black</DimTxt>
            </View>
            <ToggleButton
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 36,
    paddingHorizontal: 5,
    flex: 1,
    backgroundColor: "#000",
  },
  heading: {
    paddingBottom: 20,
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 20,
  },
  card: {
    backgroundColor: "#161c1a",
    borderRadius: 20,
    padding: 20,
    gap: 15,
    flex: 1,
  },
  cardRow: {
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "space-between",
  },
});
