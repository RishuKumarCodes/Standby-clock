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
    title: "Neutral Colors",
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
      "#008080",
      "#2196F3",
      "#673AB7",
      "#E91E63",
      "#B22222",
      "#800000",
      "#c90000",
      "#0000a8",
      "#00ad00",
    ],
  },
  {
    title: "Neon & Vibrant",
    colors: [
      "#00FF00",
      "#00FFFF",
      "#1E90FF",
      "#8A2BE2",
      "#FF00FF",
      "#FF1493",
      "#FF4500",
      "#FFD700",
    ],
  },
];

export default function ColorSettings() {
  const { userColor, setUserColor } = useClockStyle();

  // Local state for custom color
  const [tempColor, setTempColor] = useState(userColor);

  // Function to generate a random hex color
  const generateRandomColor = () => {
    let color = "#";
    const letters = "0123456789ABCDEF";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Apply custom color from text input
  const handleApplyColor = () => {
    setUserColor(tempColor);
  };

  // Handle random color generation
  const handleGenerateRandomColor = () => {
    const randomColor = generateRandomColor();
    setUserColor(randomColor);
    setTempColor(randomColor);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Choose your favorite color:</Text>

      {/* Cards container */}
      <View style={styles.cardRow}>
        {/* Custom color card */}
        <View style={[styles.card, styles.cardLeft]}>
          <Text style={styles.cardTitle}>Enter a Custom Color (Hex):</Text>
          <View style={styles.customSelector}>
            <TextInput
              style={styles.input}
              value={tempColor}
              onChangeText={setTempColor}
              placeholder="#FFFFFF"
              placeholderTextColor="#888"
            />
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyColor}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Random color generator card */}
        <View style={[styles.card, styles.cardRight]}>
          <Text style={styles.cardTitle}>Generate Random Color</Text>
          <View style={styles.randomRow}>
            <View
              style={[
                styles.randomPreview,
                { backgroundColor: userColor || "#000" },
              ]}
            />
            <TouchableOpacity
              style={styles.generateButton}
              onPress={handleGenerateRandomColor}
            >
              <Text style={styles.generateButtonText}>Randomise</Text>
            </TouchableOpacity>
          </View>
        </View>
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
                  onPress={() => {
                    setUserColor(color);
                    setTempColor(color);
                  }}
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
    padding: 20,
    paddingHorizontal: 5,
  },
  heading: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 25,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  card: {
    backgroundColor: "#222",
    padding: 25,
    paddingHorizontal: 20,
    borderRadius: 15,
    flex: 1,
  },
  cardLeft: {
    marginRight: 10,
  },
  cardRight: {
    marginLeft: 10,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 15,
  },
  customSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    color: "#fff",
    padding: 10,
    paddingHorizontal:18,
    borderRadius: 20,
  },
  applyButton: {
    marginLeft: 10,
    backgroundColor: "#363636",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  randomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  generateButton: {
    backgroundColor: "#363636",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginLeft: 10,
  },
  generateButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  randomPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#000",
  },
  groupContainer: {
    marginBottom: 20,
  },
  groupTitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "bold",
  },
  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
