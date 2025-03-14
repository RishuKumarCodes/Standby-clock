// app/settings.jsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import { useClockStyle } from "./context/ClockStyleContext";
import { CLOCK_STYLES } from "./constants/clockStyles";

export default function SettingsScreen() {
  const router = useRouter();
  const { clockStyle, setClockStyle } = useClockStyle();

  // Generate a list of style names from CLOCK_STYLES
  const styleNames = Object.keys(CLOCK_STYLES); // ["default", "neonGreen", "retroDigital", ...]

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Back button in top-left */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      <Text style={styles.heading}>Settings</Text>
      <Text style={styles.subHeading}>Choose Clock Style:</Text>

      <ScrollView contentContainerStyle={styles.styleList}>
        {styleNames.map((styleName) => {
          const isSelected = clockStyle === styleName;
          return (
            <TouchableOpacity
              key={styleName}
              style={[
                styles.styleOption,
                isSelected && styles.selectedOption
              ]}
              onPress={() => setClockStyle(styleName)}
            >
              <Text style={styles.optionText}>{styleName}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    alignItems: "center",
    paddingTop: 40,
  },
  heading: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subHeading: {
    color: "#ccc",
    fontSize: 18,
    marginBottom: 16,
  },
  styleList: {
    alignItems: "center",
    paddingBottom: 50,
  },
  styleOption: {
    width: "80%",
    padding: 15,
    backgroundColor: "#222",
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedOption: {
    borderColor: "lime",
    borderWidth: 2,
  },
  optionText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    padding: 10,
  },
});
