import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFonts } from "expo-font";

// Helper function to pad numbers with a leading zero.
const pad = (num) => (num < 10 ? "0" + num : String(num));

// Formats the time into a 12-hour "hh:mm" format.
const formatTime = (date) => {
  const hours = date.getHours();
  const hours12 = hours % 12 || 12;
  const minutes = date.getMinutes();
  return `${pad(hours12)}:${pad(minutes)}`;
};

// Formats the date into "Tuesday 13 June".
const formatDate = (date) => {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const weekday = weekdays[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  return `${weekday} ${day} ${month}`;
};

export default function ClockOnly({ color = "#32CD32" }) {
  const [clockTime, setClockTime] = useState(formatTime(new Date()));
  const [dateText, setDateText] = useState(formatDate(new Date()));
  const [parentDimensions, setParentDimensions] = useState({
    width: 0,
    height: 0,
  });
  const timerRef = useRef(null);

  // Load the custom font using expo-font.
  const [fontsLoaded] = useFonts({
    Sacramento: require("../../assets/fonts/Sacramento-Regular.ttf"),
  });

  // onLayout callback to get parent's dimensions.
  const onLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setParentDimensions({ width, height });
  };

  // Only calculate font sizes if width is available (non-zero)
  const ampm = parentDimensions.width > 0 ? parentDimensions.width * 0.09 : 1;
  const clockFontSize =
    parentDimensions.width > 0 ? parentDimensions.width * 0.19 : 1;
  const dateFontSize =
    parentDimensions.width > 0 ? parentDimensions.width * 0.045 : 1;

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClockTime(formatTime(now));
      setDateText(formatDate(now));
      const msToNextMinute =
        (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
      timerRef.current = setTimeout(updateClock, msToNextMinute);
    };

    updateClock();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Don't render inner content until parent's dimensions and fonts are ready.
  if (!fontsLoaded || parentDimensions.width === 0) {
    return <View style={styles.outerContainer} onLayout={onLayout} />;
  }

  // Render the date with simulated word spacing.
  const renderDateWithSpacing = (text) => {
    const words = text.split(" ");
    return (
      <Text style={[styles.dateText, { fontSize: dateFontSize }]}>
        {words.map((word, index) => (
          <Text
            key={index}
            style={index !== words.length - 1 ? { marginRight: 8 } : {}}
          >
            {word}
            {index !== words.length - 1 ? "  " : ""}
          </Text>
        ))}
      </Text>
    );
  };

  return (
    <View style={styles.outerContainer} onLayout={onLayout}>
      <View style={styles.container}>
        <View style={styles.clockTextContainer}>
          <Text style={[styles.ampm, { color, fontSize: ampm }]}>am</Text>
          <Text style={[styles.clockText, { color, fontSize: clockFontSize }]}>
            {clockTime}
          </Text>
        </View>

        {renderDateWithSpacing(dateText)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
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
