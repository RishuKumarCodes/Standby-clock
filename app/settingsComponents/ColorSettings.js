import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useClockStyle } from "../context/ClockStyleContext";

const colorGroups = [
  {
    title: "neutral Colors",
    colors: [
      "#FFFFFF",
      "#FFDAB9",
      "#E6E6FA",
      "#C0C0C0",
      "#808080",
      "#525252",
      "#2e2e2e",
      "#565C6A",
      "#6B5762",
      "#002244",
    ],
  },
  {
    title: "Pastels",
    colors: [
      "#9AC78F",
      "#7DC4C9",
      "#B0E0E6",
      "#7AAAF1",
      "#8683FF",
      "#E683BD",
      "#FF788C",
      "#FF8D7B",
      "#FFA568",
      "#F8D175",
    ],
  },
  {
    title: "Saturated Tones",
    colors: [
      "#c90000",
      "#0000a8",
      "#00ad00",
      "#008080",
      "#2196F3",
      "#673AB7",
      "#E91E63",
      "#B22222",
      "#800000",
    ],
  },
  {
    title: "Neon & Vibrant",
    colors: [
      "#FF00FF",
      "#FF1493",
      "#FF4500",
      "#FFD700",
      "#00FF00",
      "#00FFFF",
      "#1E90FF",
      "#8A2BE2",
    ],
  },
];

export default function ColorSettings() {
  const { userColor, setUserColor } = useClockStyle();

  // Local state for custom color
  const [tempColor, setTempColor] = useState(userColor);

  // Apply custom color
  const handleApplyColor = () => {
    setUserColor(tempColor);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Custom color input */}
      <Text style={styles.subheading}>Enter a Custom Color (Hex):</Text>
      <View style={styles.customSelector}>
        <TextInput
          style={styles.input}
          value={tempColor}
          onChangeText={setTempColor}
          placeholder="#FFFFFF"
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.applyButton} onPress={handleApplyColor}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>

      {/* Multiple color groups */}
      {colorGroups.map((group) => (
        <View key={group.title} style={styles.groupContainer}>
          <Text style={styles.groupTitle}>{group.title}</Text>
          <View style={styles.colorRow}>
            {group.colors.map((color) => {
              const isSelected =
                userColor?.toLowerCase() === color.toLowerCase();
              return (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.swatch,
                    { backgroundColor: color },
                    isSelected && styles.selectedSwatch,
                  ]}
                  onPress={() => setUserColor(color)}
                />
              );
            })}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    padding: 16,
  },
  subheading: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
  },
  customSelector: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "#222",
    color: "#fff",
    padding: 10,
    borderRadius: 5,
  },
  applyButton: {
    marginLeft: 10,
    backgroundColor: "#555",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
  },

  // Groups
  groupContainer: {
    marginBottom: 20,
  },
  groupTitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "bold",
  },

  // Color swatches
  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap", 
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 8,
    margin: 5,
    borderWidth: 2,
    borderColor: "#000",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  selectedSwatch: {
    borderColor: "#fff",
  },
});
