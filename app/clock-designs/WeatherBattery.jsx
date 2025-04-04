import React, { useState, useEffect, useMemo } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { useFonts } from "expo-font";
import { useClockStatus } from "../context/ClockStatusContext";
import { BatteryIcon, ChargingIcon } from "../components/BatteryComponents";

const { width } = Dimensions.get("window");

export default function WeatherBattery({
  color = "#32CD32",
  previewMode = false,
}) {
  const [fontsLoaded] = useFonts({
    "Oswald-Regular": require("../../assets/fonts/Oswald-Regular.ttf"),
  });

  const { hour, min, date, day, ampm, battery, chargingStatus } =
    useClockStatus();
  const computedFontSize = width * 0.67;
  const computedLineHeight = computedFontSize * 1.3;
  const minuteStr = useMemo(() => (min < 10 ? `0${min}` : min), [min]);
  const [temperature, setTemperature] = useState("22");
  const isCharging = chargingStatus === "Charging";

  useEffect(() => {
    async function fetchWeather() {
      try {
        const apiKey = "YOUR_OPENWEATHER_API_KEY";
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
    fetchWeather();
  }, []);

  if (!fontsLoaded) return null;

  const BatteryInfo = () => (
    <View style={styles.batteryContainer}>
      <BatteryIcon percentage={battery} color="#aaa" />
      <Text style={[styles.batteryText, { color: "#aaa" }]}>{battery}%</Text>
      {chargingStatus && <ChargingIcon style={styles.chargingIcon} />}
      {/* {console.log("charge refreshed", battery)} */}
    </View>
  );

  const InfoSection = () => (
    <View
      style={[
        styles.infoSection,
        previewMode && { height: "100%", transform: [{ scale: 0.7 }] },
      ]}
    >
      <View>
        <Text style={styles.dayText}>
          <Text style={{ color }}>{day.slice(0, 3).toUpperCase()}</Text>
          <Text style={{ color: "#aaa" }}> {date}</Text>
        </Text>
        <Text style={[styles.tempText, { color: "#aaa" }]}>{temperature}°</Text>
      </View>
      <View>
        <Text style={[styles.amPmText, { color }]}>{ampm}</Text>
        <BatteryInfo />
      </View>
    </View>
  );

  return (
    <View
      style={[styles.container, previewMode && { transform: [{ scale: 0.7 }] }]}
    >
      <View style={styles.clockSection}>
        <Text
          style={[
            styles.bigTime,
            {
              color,
              fontSize: previewMode
                ? computedFontSize * 0.28
                : computedFontSize * 0.6,
              lineHeight: previewMode
                ? computedLineHeight * 0.25
                : computedLineHeight * 0.6,
            },
          ]}
        >
          {hour}:{minuteStr}
        </Text>
      </View>
      <InfoSection />
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontFamily: "Oswald-Regular",
    letterSpacing: -8,
    textAlign: "center",
    includeFontPadding: false,
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
  batteryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  batteryText: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 5,
  },
  chargingIcon: {
    marginLeft: 4,
  },
});
