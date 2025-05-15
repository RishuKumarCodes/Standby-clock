import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useClockStyle } from "../../context/ClockStyleContext";

import MinimalBold from "../../themes/date&Time/MinimalBold.jsx";
import MinimalThin from "../../themes/date&Time/MinimalThin.jsx";
import AnalogClock from "../../themes/date&Time/AnalogClock.jsx";
import WeatherBattery from "../../themes/date&Time/WeatherBattery.jsx";
import WindowsClock from "../../themes/date&Time/WindowsClock/WindowsClock.jsx";
import SegmentClock from "../../themes/date&Time/SegmentClock.jsx";
import CircleTheme from "../../themes/date&Time/circleTheme/CircleTheme.jsx";
import EarthClock from "../../themes/date&Time/EarthClock/EarthClock.jsx";

import { H1Txt, H2Txt, MdTxt } from "@/app/components/CustomText";

const clockComponents = {
  MinimalBold,
  MinimalThin,
  AnalogClock,
  WeatherBattery,
  WindowsClock,
  EarthClock,
  SegmentClock,
  CircleTheme,
};

const colorGroups = [
  {
    title: "Neutrals",
    colors: ["#FFFFFF", "#ffe0c4", "#d9d9ff", "#737373", "#6B5762", "#565C6A"],
  },
  {
    title: "Pastels",
    colors: [
      "#9AC78F",
      "#7DC4C9",
      "#B0E0E6",
      "#7AAAF1",
      "#8683FF",
      "#c78fc0",
      "#E683BD",
      "#FF788C",
      "#FF8D7B",
      "#FFA568",
      "#F8D175",
      "#b88d33",
    ],
  },
  {
    title: "Saturated",
    colors: ["#8e9e00", "#008080", "#2070ba", "#673AB7", "#ad174e", "#bf280d"],
  },
  {
    title: "Neon",
    colors: ["#00FFFF", "#39FF14", "#FFFF33", "#FF00FF", "#FF0000", "#001eff"],
  },
];

export default function ColorSettings() {
  const { userColor, setUserColor, clockStyle } = useClockStyle();
  const [tempColor, setTempColor] = useState(userColor);

  const generateRandomColor = () => {
    let color = "#";
    const letters = "0123456789ABCDEF";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleApplyColor = () => {
    setUserColor(tempColor);
  };

  const handleGenerateRandomColor = () => {
    const randomColor = generateRandomColor();
    setUserColor(randomColor);
    setTempColor(randomColor);
  };

  // Select the saved clock component (fallback to MinimalBold if not found)
  const PreviewComponent = clockComponents[clockStyle] || MinimalBold;

  return (
    <View style={styles.container}>
      <View style={styles.sectionsContainer}>
        {/* Left Section */}
        <ScrollView style={styles.leftSection}>
          <H1Txt>Select color:</H1Txt>
          {/* Clock Preview */}
          <View style={styles.clockPreviewContainer}>
            <PreviewComponent
              previewMode={true}
              color={userColor || "#9ac78f"}
            />
          </View>
          {/* Custom Color Input */}
          <View style={[styles.CustomColCard]}>
            <View style={styles.cardElement}>
              <TextInput
                style={styles.input}
                value={tempColor}
                onChangeText={setTempColor}
                placeholder="#FFFFFF"
                placeholderTextColor="#888"
              />
              <TouchableOpacity
                style={styles.cardBtn}
                onPress={handleApplyColor}
              >
                <Text style={styles.cardBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Random Color Generator */}
          <View style={[styles.CustomColCard]}>
            <View style={styles.cardElement}>
              <TouchableOpacity
                style={styles.cardBtn}
                onPress={handleGenerateRandomColor}
              >
                <Text style={styles.cardBtnText}>Randomise</Text>
              </TouchableOpacity>
              <View
                style={[
                  styles.randomColPreview,
                  { backgroundColor: userColor || "#000" },
                ]}
              />
            </View>
          </View>
        </ScrollView>

        {/* Right Section */}
        <ScrollView
          style={styles.rightSection}
          contentContainerStyle={styles.rightContent}
        >
          {colorGroups.map((group) => (
            <View key={group.title} style={styles.groupContainer}>
              <MdTxt style={styles.colorTitle}>{group.title}</MdTxt>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingLeft: 5,
  },
  sectionsContainer: {
    flex: 1,
    flexDirection: "row",
  },

  // -----------------------------------LEFT SIDE --------------------------
  leftSection: {
    flex: 1,
    paddingVertical: 36,
  },
  clockPreviewContainer: {
    alignItems: "center",
    aspectRatio: 19.5 / 9,
    marginBottom: 10,
    width: "100%",
  },
  CustomColCard: {
    backgroundColor: "#101413",
    borderRadius: 50,
    padding: 7,
    marginHorizontal: "auto",
    width: 250,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    color: "#fff",
    padding: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  cardElement: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardBtn: {
    backgroundColor: "#192823",
    paddingVertical: 9,
    paddingHorizontal: 25,
    borderRadius: 30,
  },

  cardBtnText: {
    color: "#fff",
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },

  randomColPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#000",
  },
  // -----------------------------------RIGHT SIDE --------------------------

  rightSection: {
    flex: 1,
  },
  rightContent: {
    paddingTop: 70,
    paddingBottom: 40,
    maxWidth: 340,
  },

  groupContainer: {
    marginBottom: 16,
  },
  colorTitle: {
    paddingLeft:5,
    color: "#aaa",
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
  },
  selectedSwatch: {
    borderColor: "#E6F904",
  },
});
