import { StatusBar } from "expo-status-bar";
import React, { useRef, useEffect, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SleepOverlay({
  instructionText = "Double tap to wake",
  fadeTrigger,
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);
  const [navBarVisible, setNavBarVisible] = useState(false);

  // Load the initial navigation bar visibility state
  useEffect(() => {
    const loadNavBarState = async () => {
      try {
        const storedNavBar = await AsyncStorage.getItem("navBarVisible");
        if (storedNavBar !== null) {
          setNavBarVisible(storedNavBar === "true");
        }
      } catch (error) {
        console.error("Error loading navigation bar state:", error);
      }
    };
    loadNavBarState();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const manageNavigationBar = async () => {
      try {
        // Hide the navigation bar and set its behavior to prevent it from reappearing on touch
        await NavigationBar.setVisibilityAsync("hidden");
        await NavigationBar.setBehaviorAsync("overlay-swipe");

        fadeAnim.stopAnimation();

        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();

        timerRef.current = setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }, 1700);
      } catch (error) {
        console.error("Error managing navigation bar:", error);
      }
    };

    if (isMounted) {
      manageNavigationBar();
    }

    return () => {
      if (isMounted) {
        // Restore the navigation bar visibility state and reset its behavior
        NavigationBar.setVisibilityAsync(navBarVisible ? "visible" : "hidden").catch((err) =>
          console.error("Error restoring navigation bar state:", err)
        );
        NavigationBar.setBehaviorAsync("inset-swipe").catch((err) =>
          console.error("Error resetting navigation bar behavior:", err)
        );
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      isMounted = false;
    };
  }, [fadeTrigger, fadeAnim, navBarVisible]);

  return (
    <View style={styles.overlay} pointerEvents="none">
      <StatusBar hidden={true} />
      <Animated.Text style={[styles.instruction, { opacity: fadeAnim }]}>
        {instructionText}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  instruction: {
    color: "#fff",
    fontSize: 16,
  },
});
