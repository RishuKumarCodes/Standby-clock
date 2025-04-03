import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import { useClockStatus } from "../context/ClockStatusContext";

const pad = (num) => (num < 10 ? "0" + num : String(num));
const formatTime = (hour, min) => `${pad(hour)}:${pad(min)}`;

export default function MinimalThin({ color = "#32CD32" }) {
  const { hour, min, ampm, date, day, month } = useClockStatus();
  const [clockTime, setClockTime] = useState(formatTime(hour, min));
  const [dateText, setDateText] = useState(day + "  " + date + "  " + month);
  const [parentDimensions, setParentDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [fontsLoaded] = useFonts({
    Sacramento: require("../../assets/fonts/Sacramento-Regular.ttf"),
  });

  const onLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setParentDimensions({ width, height });
  };

  const ampmFontSize = parentDimensions.width
    ? parentDimensions.width * 0.09
    : 1;
  const clockFontSize = parentDimensions.width
    ? parentDimensions.width * 0.19
    : 1;
  const dateFontSize = parentDimensions.width
    ? parentDimensions.width * 0.045
    : 1;

  useEffect(() => {
    setClockTime(formatTime(hour, min));
    setDateText(day + "  " + date + "  " + month);
  }, [hour, min]);

  if (!fontsLoaded || parentDimensions.width === 0) {
    return <View style={styles.outerContainer} onLayout={onLayout} />;
  }

  return (
    <View style={styles.outerContainer} onLayout={onLayout}>
      <View style={styles.container}>
        <View style={styles.clockTextContainer}>
          <Text style={[styles.ampm, { color, fontSize: ampmFontSize }]}>
            {ampm.toLowerCase()}
          </Text>
          <Text style={[styles.clockText, { color, fontSize: clockFontSize }]}>
            {clockTime}
          </Text>
        </View>
        <Text style={[styles.dateText, { fontSize: dateFontSize }]}>
          {dateText}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
  clockTextContainer: {
    textAlign: "center",
    fontFamily: "Sacramento",
    position: "absolute",
    flexDirection: "row",
    alignItems: "flex-end",
    right: "8%",
    bottom: 0,
  },
  ampm: {
    fontFamily: "Sacramento",
    marginBottom: "4.2%",
    opacity: 0.95,
  },
  clockText: {
    fontFamily: "Sacramento",
  },
  dateText: {
    position: "absolute",
    top: "12%",
    left: "6.5%",
    textAlign: "center",
    fontFamily: "Sacramento",
    color: "#aaa",
  },
});
