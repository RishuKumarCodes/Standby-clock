
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import { useClockStyle } from "./context/ClockStyleContext";
import { CLOCK_STYLES } from "./constants/clockStyles";

export default function SettingsScreen() {
  const router = useRouter();
  const { clockStyle, setClockStyle } = useClockStyle();

  const styleNames = Object.keys(CLOCK_STYLES);

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.heading}>Settings</Text>
      </View>

      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.styleList}>
          {styleNames.map((styleName) => {
            const isSelected = clockStyle === styleName;
            return (
              <TouchableOpacity
                key={styleName}
                style={[
                  styles.styleOption,
                  isSelected && styles.selectedOption,
                ]}
                onPress={() => setClockStyle(styleName)}
              >
                <Text style={styles.optionText}>{styleName}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  backButton: {
    padding: 15,
  },
  heading: {
    color: "white",
    fontSize: 24,
    padding: 10,
    fontWeight: "bold",
  },

  content: {
    flex: 1,
    alignItems: "center",
  },

  styleList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingBottom: 50,
  },

  styleOption: {
    width: "20%",
    height: 90,
    backgroundColor: "#111",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#222",
    margin: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  selectedOption: {
    borderColor: "white",
    borderWidth: 2,
  },
  optionText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
  },
});
