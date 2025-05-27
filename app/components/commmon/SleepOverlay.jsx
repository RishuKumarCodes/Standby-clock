import { StatusBar } from "expo-status-bar";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { StyleSheet, Animated, Pressable } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SleepOverlay({
  instructionText = "Double tap to wake",
  fadeTrigger,
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);
  const [navBarVisible, setNavBarVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("navBarVisible")
      .then((value) => {
        if (value !== null) setNavBarVisible(value === "true");
      })
      .catch(console.error);
  }, []);

  useEffect(() => { 
    let mounted = true;
    async function setupNavBar() {
      await NavigationBar.setVisibilityAsync("hidden");
      await NavigationBar.setBehaviorAsync("overlay-swipe");
      triggerFade();
    }
    if (mounted) setupNavBar();
    return () => {
      mounted = false;
      clearTimeout(timerRef.current);
      NavigationBar.setVisibilityAsync(
        navBarVisible ? "visible" : "hidden"
      ).catch(console.error);
      NavigationBar.setBehaviorAsync("inset-swipe").catch(console.error);
    };
  }, [navBarVisible]);

  useEffect(() => {
    if (fadeTrigger !== undefined) {
      triggerFade();
    }
  }, [fadeTrigger]);

  const triggerFade = useCallback(() => {
    clearTimeout(timerRef.current);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      timerRef.current = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 1700);
    });
  }, [fadeAnim]);

  return (
    <Pressable style={styles.overlay} onPressIn={triggerFade}>
      <StatusBar hidden />
      <Animated.Text style={[styles.instruction, { opacity: fadeAnim }]}>
        {instructionText}
      </Animated.Text>
    </Pressable>
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
