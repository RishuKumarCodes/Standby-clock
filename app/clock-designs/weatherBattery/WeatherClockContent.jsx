import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import * as Battery from "expo-battery";
import ClockSection from "./components/ClockSection";
import InfoSection from "./components/InfoSection";

export default function WeatherClockContent({
  color = "#32CD32",
  previewMode = false,
}) {
  const [time, setTime] = useState(new Date());
  const [temperature, setTemperature] = useState("22");
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [batteryState, setBatteryState] = useState(null);

  // Update time exactly on the minute
  useEffect(() => {
    let intervalId;
    const updateTime = () => setTime(new Date());
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

  // Fetch weather data once on mount
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

  // Fetch battery info and subscribe to changes
  const fetchBatteryInfo = useCallback(async () => {
    try {
      const level = await Battery.getBatteryLevelAsync();
      const state = await Battery.getBatteryStateAsync();
      setBatteryLevel(level);
      setBatteryState(state);
    } catch (error) {
      console.warn("Battery fetch error:", error);
    }
  }, []);

  useEffect(() => {
    fetchBatteryInfo();
    const batteryLevelListener = Battery.addBatteryLevelListener(
      ({ batteryLevel }) => {
        setBatteryLevel(batteryLevel);
      }
    );
    const batteryStateListener = Battery.addBatteryStateListener(
      ({ batteryState }) => {
        setBatteryState(batteryState);
      }
    );
    return () => {
      batteryLevelListener?.remove();
      batteryStateListener?.remove();
    };
  }, [fetchBatteryInfo]);

  // Derived values
  const { hours12, minuteStr, amPm } = useMemo(() => {
    const hours24 = time.getHours();
    return {
      hours12: hours24 % 12 || 12,
      minuteStr:
        time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes(),
      amPm: hours24 < 12 ? "AM" : "PM",
    };
  }, [time]);

  const { dayName, dayNumber } = useMemo(
    () => ({
      dayName: time
        .toLocaleDateString("en-US", { weekday: "short" })
        .toUpperCase(),
      dayNumber: time.getDate(),
    }),
    [time]
  );

  const batteryPercentage =
    batteryLevel != null ? Math.round(batteryLevel * 100) : 0;
  const isCharging = batteryState === Battery.BatteryState.CHARGING;

  // Memoize preview container style
  const scaleFactor = 0.5;
  const previewScaleStyle = useMemo(
    () => ({
      transform: [{ scale: scaleFactor }],
      overflow: "visible",
    }),
    [scaleFactor]
  );

  if (previewMode) {
    return (
      <View style={styles.previewOuterContainer}>
        <View style={previewScaleStyle}>
          <View
            style={[
              styles.container,
              { flex: 0, justifyContent: "space-evenly", paddingHorizontal: 0 },
            ]}
          >
            <ClockSection
              hours12={hours12}
              minuteStr={minuteStr}
              color={color}
            />
            <View style={{ width: 50 }} />
            <InfoSection
              dayName={dayName}
              dayNumber={dayNumber}
              temperature={temperature}
              amPm={amPm}
              batteryPercentage={batteryPercentage}
              isCharging={isCharging}
              color={color}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ClockSection hours12={hours12} minuteStr={minuteStr} color={color} previewMode/>
      <InfoSection
        dayName={dayName}
        dayNumber={dayNumber}
        temperature={temperature}
        amPm={amPm}
        batteryPercentage={batteryPercentage}
        isCharging={isCharging}
        color={color}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  previewOuterContainer: {
    width: 400,
    height: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});
