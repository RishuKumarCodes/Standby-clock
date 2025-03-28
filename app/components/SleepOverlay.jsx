import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";

export default function SleepOverlay({
  instructionText = "Double tap to wake",
  fadeTrigger,
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  useEffect(() => {
    // Stop any current animations and clear timers
    fadeAnim.stopAnimation();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Fade in over 300ms
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Fade out after 1700ms (total ~2 seconds including fade-in/out)
    timerRef.current = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 1700);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [fadeTrigger, fadeAnim]);

  return (
    // pointerEvents="none" ensures this overlay doesn’t block underlying touches.
    <View style={styles.overlay} pointerEvents="none">
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
    