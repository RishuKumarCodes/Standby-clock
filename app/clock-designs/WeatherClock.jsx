import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import * as Battery from "expo-battery";
import Svg, { Rect, Path } from "react-native-svg";

// -------------------
// SVG Icon Components
// -------------------

// Memoized BatteryIcon
const BatteryIcon = memo(
  ({
    percentage,
    color = "#aaa",
    dimColor = "#999",
    width = 30,
    height = 14,
  }) => {
    const strokeWidth = 2;
    const cornerRadius = 5;
    const innerCornerRadius = Math.max(0, cornerRadius - strokeWidth);
    const capWidth = 2;
    const capSpacing = 2;
    const batteryBodyWidth = width - capWidth - capSpacing;
    const batteryBodyHeight = height;
    const fillableWidth = batteryBodyWidth - strokeWidth * 2;
    const fillableHeight = batteryBodyHeight - strokeWidth * 2;
    const fillWidth = Math.max(0, (percentage / 100) * fillableWidth);

    return (
      <Svg width={width} height={height}>
        <Rect
          x={0}
          y={0}
          width={batteryBodyWidth}
          height={batteryBodyHeight}
          rx={cornerRadius}
          ry={cornerRadius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Rect
          x={batteryBodyWidth + capSpacing}
          y={batteryBodyHeight * 0.25}
          width={capWidth}
          height={batteryBodyHeight * 0.5}
          fill={color}
          rx={1}
          ry={1}
        />
        <Rect
          x={strokeWidth}
          y={strokeWidth}
          width={fillWidth}
          height={fillableHeight}
          fill={dimColor}
          rx={innerCornerRadius}
          ry={innerCornerRadius}
        />
      </Svg>
    );
  }
);

// Memoized ChargingIcon
const ChargingIcon = memo(({ width = 16, height = 16, color = "#FFD700" }) => (
  <Svg width={width} height={height} viewBox="0 0 100 100">
    <Path
      d="M63.3 9.5 21.8 52.2c-.7.7-.2 1.8.7 1.8h24c.8 0 1.3.8 1 1.5L32.4 89.4c-.5 1.1.9 2 1.7 1.1l43.8-49.6c.6-.7.1-1.8-.8-1.8H51.7c-.8 0-1.3-.8-.9-1.5l14.1-26.9c.6-1-.8-2-1.6-1.2z"
      fill={color}
    />
  </Svg>
));

// -------------------
// Battery Info Component
// -------------------

const BatteryInfo = memo(({ batteryPercentage, isCharging }) => (
  <View style={styles.batteryContainer}>
    <BatteryIcon percentage={batteryPercentage} color="#aaa" />
    <Text style={[styles.batteryText, { color: "#aaa" }]}>
      {batteryPercentage}%
    </Text>
    {isCharging && <ChargingIcon style={styles.chargingIcon} />}
  </View>
));

// -------------------
// Clock & Info Sub-Components
// -------------------

const ClockSection = memo(({ hours12, minuteStr, color }) => (
  <View style={styles.clockSection}>
    <Text style={[styles.bigTime, { color }]}>
      {hours12}:{minuteStr}
    </Text>
  </View>
));

const InfoSection = memo(
  ({
    dayName,
    dayNumber,
    temperature,
    amPm,
    batteryPercentage,
    isCharging,
    color,
  }) => (
    <View style={styles.infoSection}>
      <View>
        <Text style={styles.dayText}>
          <Text style={{ color }}>{dayName}</Text>
          <Text style={{ color: "#aaa" }}> {dayNumber}</Text>
        </Text>
        <Text style={[styles.tempText, { color: "#aaa" }]}>{temperature}°</Text>
      </View>
      <View>
        <Text style={[styles.amPmText, { color }]}>{amPm}</Text>
        <BatteryInfo
          batteryPercentage={batteryPercentage}
          isCharging={isCharging}
        />
      </View>
    </View>
  )
);

// -------------------
// Main WeatherClock Component
// -------------------

export default function WeatherClock({
  color = "#32CD32",
  previewMode = false,
}) {
  const [time, setTime] = useState(new Date());
  const [temperature, setTemperature] = useState("22");
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [batteryState, setBatteryState] = useState(null);
  const [fontsLoaded] = useFonts({
    "Oswald-Regular": require("../../assets/fonts/Oswald-Regular.ttf"),
  });

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

  // Use battery listeners plus an initial fetch
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

  if (!fontsLoaded) return null;

  // Memoize time/date derived values
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
  const scaleFactor = 0.35;
  const previewScaleStyle = useMemo(
    () => ({
      transform: [{ scale: scaleFactor }],
      overflow: "visible",
    }),
    [scaleFactor]
  );

  // Layout for preview mode
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

  // Layout for full-screen UI
  return (
    <View style={styles.container}>
      <ClockSection hours12={hours12} minuteStr={minuteStr} color={color} />
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
