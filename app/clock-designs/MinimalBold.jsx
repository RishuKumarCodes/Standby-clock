import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useClockStatus } from "../context/ClockStatusContext";

const pad = (num) => (num < 10 ? "0" + num : String(num));

export default function MinimalBold({ color, previewMode }) {
  const { hour, min } = useClockStatus();

  const baseWidth = previewMode ? 300 : Dimensions.get("window").width;
  const fontSize = baseWidth * (previewMode ? 0.15 : 0.23);

  return (
    <View style={styles.container}>
      <Text style={[styles.timeText, { color, fontSize }]}>
        {pad(hour)}:{pad(min)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    fontWeight: "bold",
    textAlign: "center",
  },
});
