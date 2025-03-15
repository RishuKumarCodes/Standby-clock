import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFonts } from "expo-font";

export default function WeatherClock({
  color = "#32CD32",
  previewMode = false,
}) {
  const [time, setTime] = useState(new Date());
  const [temperature, setTemperature] = useState("76"); // Fallback temp
  const [fontsLoaded] = useFonts({
    "Oswald-Regular": require("../../assets/fonts/Oswald-Regular.ttf"),
  });

  // Update clock only on minute changes.
  useEffect(() => {
    let intervalId;
    const updateTime = () => setTime(new Date());
    // Calculate delay until next minute boundary.
    const now = new Date();
    const delay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

    const timeoutId = setTimeout(() => {
      updateTime();
      intervalId = setInterval(updateTime, 60000);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // Fetch weather data only once on mount.
  useEffect(() => {
    fetchWeather();
  }, []);

  async function fetchWeather() {
    try {
      const apiKey = "YOUR_OPENWEATHER_API_KEY"; // Replace with your API key.
      const city = "New York";
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();
      if (data?.main?.temp) {
        setTemperature(Math.round(data.main.temp));
      }
    } catch (error) {
      console.warn("Weather fetch error:", error);
    }
  }

  if (!fontsLoaded) return null;

  // Format time (hours, minutes, AM/PM) since only minutes are displayed.
  const hours24 = time.getHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = time.getMinutes();
  const minuteStr = minutes < 10 ? `0${minutes}` : minutes;
  const amPm = hours24 < 12 ? "AM" : "PM";

  const dayName = time
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase();
  const dayNumber = time.getDate();

  // -------------------------------
  // Preview Mode: Scale and add spacing
  // -------------------------------
  if (previewMode) {
    const scaleFactor = 0.2; // Scale inner content to 20%
    return (
      <View style={styles.previewOuterContainer}>
        <View
          style={{ transform: [{ scale: scaleFactor }], overflow: "visible" }}
        >
          <View
            style={[
              styles.container,
              {
                flex: 0,
                justifyContent: "space-evenly",
                paddingHorizontal: 30,
              },
            ]}
          >
            {/* Clock Section */}
            <View style={styles.clockSection}>
              <Text style={[styles.bigTime, { color }]}>
                {hours12}:{minuteStr}
              </Text>
            </View>
            {/* Info Section */}
            <View style={[styles.infoSection, { marginLeft: 30 }]}>
              <View>
                <Text style={styles.dayText}>
                  <Text style={{ color }}>{dayName}</Text>
                  <Text style={{ color: "#aaa" }}> {dayNumber}</Text>
                </Text>
                <Text style={[styles.tempText, { color: "#aaa" }]}>
                  {temperature}°
                </Text>
              </View>
              <Text style={[styles.amPmText, { color: "#aaa" }]}>{amPm}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // -------------------------------
  // Full-Screen UI (unchanged)
  // -------------------------------
  return (
    <View style={styles.container}>
      {/* Clock Section */}
      <View style={styles.clockSection}>
        <Text style={[styles.bigTime, { color }]}>
          {hours12}:{minuteStr}
        </Text>
      </View>
      {/* Info Section */}
      <View style={styles.infoSection}>
        <View>
          <Text style={styles.dayText}>
            <Text style={{ color }}>{dayName}</Text>
            <Text style={{ color: "#aaa" }}> {dayNumber}</Text>
          </Text>
          <Text style={[styles.tempText, { color: "#aaa" }]}>
            {temperature}°
          </Text>
        </View>
        <Text style={[styles.amPmText, { color: "#aaa" }]}>{amPm}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  previewOuterContainer: {
    width: 400,
    height: 400,
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  clockSection: {
    alignItems: "center",
    justifyContent: "center",
  },
  bigTime: {
    fontSize: 290,
    fontFamily: "Oswald-Regular",
    letterSpacing: -8,
    textAlign: "center",
    includeFontPadding: false,
    lineHeight: 400,
  },
  infoSection: {
    paddingRight: 50,
    height: "60%",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  dayText: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
  },
  tempText: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
  },
  amPmText: {
    fontSize: 26,
    fontWeight: "700",
  },
});
