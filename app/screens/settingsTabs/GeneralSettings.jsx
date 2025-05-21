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
import { useSleepOverlay } from "../../context/SleepOverlayContext.js";
import { PageSettings } from "../../context/PageSettingsContext.js";
import * as NavigationBar from "expo-navigation-bar";
import { DimTxt, H1Txt, MdTxt } from "@/app/components/ui/CustomText.jsx";
import ToggleButton from "@/app/components/ui/ToggleButton.jsx";
import { ScrollView } from "react-native-gesture-handler";

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

  const { sleepMode, setSleepMode } = useSleepOverlay();

  const { showChargingStatus, setShowChargingStatus } = PageSettings();

  const {
    navBarVisible,
    setNavBarVisible,
    statusBarVisible,
    setStatusBarVisible,
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
    <ScrollView contentContainerStyle={styles.container}>
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
                  <DimTxt>- Protects against display burn-in.</DimTxt>
                  <DimTxt>- Adds grid overlay, flips per minute.</DimTxt>
                  <DimTxt>- Only beneficial for OLED displays.</DimTxt>
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
          <View style={[styles.cardRow, styles.marginTop]}>
            <MdTxt>Show status bar</MdTxt>
            <ToggleButton
              value={statusBarVisible}
              onValueChange={setStatusBarVisible}
            />
          </View>
          <View style={styles.cardRow}>
            <MdTxt>Show navigation bar</MdTxt>
            <ToggleButton
              value={navBarVisible}
              onValueChange={setNavBarVisible}
            />
          </View>
        </View>
      </View>
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View>
              <MdTxt>Double tap to sleep</MdTxt>
              <DimTxt>- Turns the display black</DimTxt>
            </View>
            <ToggleButton value={sleepMode} onValueChange={setSleepMode} />
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View>
              <MdTxt>Show charging status </MdTxt>
              <DimTxt>- Display battery % while charging</DimTxt>
            </View>
            <ToggleButton
              value={showChargingStatus}
              onValueChange={setShowChargingStatus}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 36,
    paddingHorizontal: 5,
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
  marginTop: {
    marginTop: 8,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
