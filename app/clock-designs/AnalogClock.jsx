import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, AppState, Text } from "react-native";
import { useClockStatus, useSeconds } from "../context/ClockStatusContext";
import Svg, { Line, Circle } from "react-native-svg";
import BatteryCharging from "../components/BatteryCharging";

// Clock Component (Memoized)
const Clock = React.memo(({ size, color }) => {
  const { hour, min } = useClockStatus();
  const seconds = useSeconds();

  const center = size / 2;
  const radius = size / 2.1;

  const hourAngle = (360 / 12) * hour + (30 / 60) * min;
  const minuteAngle = (360 / 60) * min;
  const secondAngle = (360 / 60) * seconds;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = center + Math.sin(angle) * (radius - 32);
        const y1 = center - Math.cos(angle) * (radius - 32);
        const x2 = center + Math.sin(angle) * radius;
        const y2 = center - Math.cos(angle) * radius;
        const isMainTick = i % 3 === 0;

        return (
          <Line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={isMainTick ? "#ccc" : "#777"}
            strokeWidth={isMainTick ? "4" : "2"}
          />
        );
      })}

      {/* Hour Hand */}
      <Line
        x1={center}
        y1={center - radius * 0.07}
        x2={center}
        y2={center - radius * 0.5}
        stroke={color}
        strokeWidth="8"
        transform={`rotate(${hourAngle}, ${center}, ${center})`}
      />
      {/* Minute Hand */}
      <Line
        x1={center}
        y1={center - radius * 0.07}
        x2={center}
        y2={center - radius * 0.77}
        stroke={color}
        opacity={0.6}
        strokeWidth="4"
        transform={`rotate(${minuteAngle}, ${center}, ${center})`}
      />
      {/* Second Hand */}
      <Line
        x1={center}
        y1={center + radius * 0.25}
        x2={center}
        y2={center - radius * 0.55}
        stroke="#db1f14"
        strokeWidth="2"
        transform={`rotate(${secondAngle}, ${center}, ${center})`}
      />
      {/* Center Dot */}
      <Circle cx={center} cy={center} r="5.7" fill="#db1f14" />
    </Svg>
  );
});

//  Calendar Component (Memoized)
const Calendar = React.memo(({ size, color }) => {
  const { date, month, day } = useClockStatus();
  const year = new Date().getFullYear();
  const firstDayIndex = new Date(year, new Date().getMonth(), 1).getDay();
  const daysInMonth = new Date(year, new Date().getMonth() + 1, 0).getDate();
  const cellWidth = size / 6.8;

  const { width } = Dimensions.get("window");
  const monthFontSize = width * 0.033;
  const dayTextFontSize = width * 0.02;
  const dateFontSize = width * 0.024;

  const totalCells = firstDayIndex + daysInMonth;
  const dateCells = Array.from({ length: totalCells }, (_, i) =>
    i < firstDayIndex ? null : i - firstDayIndex + 1
  );

  return (
    <View style={[styles.calendarContainer, { width: size }]}>
      <Text
        style={[
          styles.monthText,
          { color: "#db1f14", marginLeft: 12, fontSize: monthFontSize },
        ]}
      >
        {month.toUpperCase()}
      </Text>
      {/* Weekday Row */}
      <View style={styles.weekRow}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <Text
            key={i}
            style={[
              styles.dayText,
              {
                fontSize: dayTextFontSize,
                color: "#fff",
                opacity: 0.4,
                width: cellWidth,
              },
            ]}
          >
            {d}
          </Text>
        ))}
      </View>
      {/* Dates Grid */}
      {Array.from({ length: Math.ceil(totalCells / 7) }, (_, row) => (
        <View key={row} style={styles.weekRow}>
          {dateCells.slice(row * 7, row * 7 + 7).map((d, i) => (
            <Text
              key={i}
              style={[
                styles.dateText,
                {
                  fontSize: dateFontSize,
                  width: cellWidth,
                  height: cellWidth,
                  lineHeight: cellWidth,
                  color,
                },
                d === date && styles.selectedDate,
              ]}
            >
              {d || ""}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
});

//  Main Component
export default function ClockWithCalendar({
  color = "#FFF",
  previewMode = false,
}) {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription.remove();
  }, []);

  const { width } = Dimensions.get("window");
  const clockSize = width * 0.36;
  const calendarSize = width * 0.35;
  const scaleFactor = previewMode ? 0.37 : 1;

  return (
    <View style={styles.outerContainer}>
      <View
        style={[
          styles.container,
          { transform: [{ scale: scaleFactor }] },
          previewMode && { gap: 40 },
        ]}
      >
        <Clock size={clockSize} color={color} />
        <Calendar size={calendarSize} color={color} />
      </View>
      <BatteryCharging />
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingRight: "6%",
    paddingLeft: "3%",
    alignItems: "center",
    width: "100%",
  },
  calendarContainer: {
    alignItems: "flex-start",
  },
  monthText: {
    fontFamily: "Poppins-SemiBold",
  },
  weekRow: {
    flexDirection: "row",
  },
  dayText: {
    fontWeight: "bold",
    width: 40,
    textAlign: "center",
    marginTop: 0.5,
    marginBottom: "3%",
    margin: 3.5,
  },
  dateText: {
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    marginVertical: 0,
    margin: 3.5,
  },
  selectedDate: {
    backgroundColor: "#db1f14",
    fontFamily: "Poppins-SemiBold",
    paddingTop: 2,
    color: "white",
    borderRadius: 30,
    overflow: "hidden",
  },
  emptyDate: {
    width: 40,
    marginVertical: 0,
    margin: 2,
  },
});
