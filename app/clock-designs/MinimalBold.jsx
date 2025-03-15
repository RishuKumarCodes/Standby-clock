import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

const pad = (num) => (num < 10 ? "0" + num : String(num));

const formatTime = (date) => {
  const hours = date.getHours();
  const hours12 = hours % 12 || 12;
  const minute = date.getMinutes();
  return `${pad(hours12)}:${pad(minute)}`;
};

export default function MinimalBold({ color, previewMode }) {
  const [timeString, setTimeString] = useState(() => formatTime(new Date()));
  const timerRef = useRef(null);

  const baseWidth = previewMode ? 300 : Dimensions.get("window").width;
  const fontSize = baseWidth * (previewMode ? 0.15 : 0.23);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeString(formatTime(now));
      const msToNextMinute =
        (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
      timerRef.current = setTimeout(updateClock, msToNextMinute);
    };

    const now = new Date();
    const msToNextMinute =
      (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    timerRef.current = setTimeout(updateClock, msToNextMinute);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={[styles.timeText, { color, fontSize }]}>{timeString}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "visible",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    fontWeight: "bold",
    textAlign: "center",
  },
});
