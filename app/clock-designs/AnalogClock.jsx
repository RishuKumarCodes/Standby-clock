import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  AppState,
} from "react-native";
import Svg, { Line, Circle } from "react-native-svg";

/* ====================================================
   Clock Component (Memoized)
   ==================================================== */
const Clock = React.memo(({ time, size, color }) => {
  const center = size / 2;
  const radius = size / 2.1;
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Calculate angles for each hand
  const hourAngle = (360 / 12) * hours + (30 / 60) * minutes;
  const minuteAngle = (360 / 60) * minutes;
  const secondAngle = (360 / 60) * seconds;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Clock Ticks */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = center + Math.sin(angle) * (radius - 20);
        const y1 = center - Math.cos(angle) * (radius - 20);
        const x2 = center + Math.sin(angle) * radius;
        const y2 = center - Math.cos(angle) * radius;
        return (
          <Line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#999"
            strokeWidth="4"
          />
        );
      })}

      {/* Hour Hand */}
      <Line
        x1={center}
        y1={center}
        x2={center}
        y2={center - radius * 0.5}
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        transform={`rotate(${hourAngle}, ${center}, ${center})`}
      />
      {/* Minute Hand */}
      <Line
        x1={center}
        y1={center}
        x2={center}
        y2={center - radius * 0.7}
        stroke={color}
        opacity={0.6}
        strokeWidth="4"
        strokeLinecap="round"
        transform={`rotate(${minuteAngle}, ${center}, ${center})`}
      />
      {/* Second Hand */}
      <Line
        x1={center}
        y1={center}
        x2={center}
        y2={center - radius * 0.9}
        stroke="#db1f14"
        strokeWidth="2"
        strokeLinecap="round"
        transform={`rotate(${secondAngle}, ${center}, ${center})`}
      />
      {/* Center Dot */}
      <Circle cx={center} cy={center} r="6" fill={color} />
    </Svg>
  );
});

/* ====================================================
   Calendar Component (Memoized)
   ==================================================== */
const Calendar = React.memo(({ date, calendarSize, color }) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const monthName = date
    .toLocaleString("default", { month: "long" })
    .toUpperCase();

  return (
    <View style={[styles.calendarContainer, { width: calendarSize }]}>
      <Text style={[styles.monthText, { color: "#db1f14", marginLeft: 12 }]}>
        {monthName}
      </Text>
      <View style={styles.calendarGrid}>
        {["S", "M", "T", "W", "T", "F", "S"].map((dayName, index) => (
          <Text
            key={index}
            style={[styles.dayText, { color: "#fff", opacity: 0.44 }]}
          >
            {dayName}
          </Text>
        ))}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <Text key={`empty-${i}`} style={styles.emptyDate} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
          <Text
            key={d}
            style={[
              styles.dateText,
              { color },
              d === day && styles.selectedDate,
            ]}
          >
            {d}
          </Text>
        ))}
      </View>
    </View>
  );
});

/* ====================================================
   Main Component: ClockWithCalendar
   ==================================================== */
export default function ClockWithCalendar({ color = "#FFF", previewMode = false }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const appState = useRef(AppState.currentState);

  // Listen for app state changes to update time when active
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        setCurrentTime(new Date());
      }
      appState.current = nextAppState;
    };
    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => subscription.remove();
  }, []);

  // Update time every second (only if app is active)
  useEffect(() => {
    const interval = setInterval(() => {
      if (appState.current === "active") {
        setCurrentTime(new Date());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const { width } = Dimensions.get("window");

  // Compute sizes based on screen width
  const clockSize = width * 0.36;
  const calendarSize = width * 0.4;

  // If in preview mode, scale down the entire content
  const scaleFactor = previewMode ? 0.38 : 1;

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.container, { transform: [{ scale: scaleFactor }] }]}>
        <Clock time={currentTime} size={clockSize} color={color} />
        <Calendar date={currentTime} calendarSize={calendarSize} color={color} />
      </View>
    </View>
  );
}

/* ====================================================
   Styles
   ==================================================== */
const styles = StyleSheet.create({
  outerContainer: {
    // Center the scaled component in its parent
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
  },
  calendarContainer: {
    alignItems: "flex-start",
  },
  monthText: {
    fontSize: 26,
    fontWeight: "bold",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    justifyContent: "flex-start",
    marginTop: 5,
  },
  dayText: {
    fontSize: 18,
    fontWeight: "bold",
    width: 40,
    textAlign: "center",
    marginVertical: 0.5,
    margin: 3,
  },
  dateText: {
    fontSize: 18,
    width: 40,
    height: 40,
    textAlign: "center",
    textAlignVertical: "center",
    lineHeight: 40,
    marginVertical: 0.5,
    margin: 3,
  },
  selectedDate: {
    backgroundColor: "#db1f14",
    color: "white",
    borderRadius: 20,
    overflow: "hidden",
    paddingHorizontal: 8,
    fontWeight: "bold",
  },
  emptyDate: {
    width: 40,
    marginVertical: 0.5,
    margin: 3,
  },
});
