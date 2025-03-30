import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, AppState } from "react-native";
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

  // Define forward and tail lengths for each hand
  const hourForward = radius * 0.5;
  const hourTail = radius * -0.07;
  const minuteForward = radius * 0.77;
  const minuteTail = radius * -0.07;
  const secondForward = radius * 0.55;
  const secondTail = radius * 0.25;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Clock Ticks */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = center + Math.sin(angle) * (radius - 32);
        const y1 = center - Math.cos(angle) * (radius - 32);
        const x2 = center + Math.sin(angle) * radius;
        const y2 = center - Math.cos(angle) * radius;

        // Make 12, 3, 6, 9 thicker and white
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
        y1={center + hourTail}
        x2={center}
        y2={center - hourForward}
        stroke={color}
        strokeWidth="8"
        transform={`rotate(${hourAngle}, ${center}, ${center})`}
      />
      {/* Minute Hand */}
      <Line
        x1={center}
        y1={center + minuteTail}
        x2={center}
        y2={center - minuteForward}
        stroke={color}
        opacity={0.6}
        strokeWidth="4"
        transform={`rotate(${minuteAngle}, ${center}, ${center})`}
      />
      {/* Second Hand */}
      <Line
        x1={center}
        y1={center + secondTail}
        x2={center}
        y2={center - secondForward}
        stroke="#db1f14"
        strokeWidth="2"
        transform={`rotate(${secondAngle}, ${center}, ${center})`}
      />
      {/* Center Dot */}
      <Circle cx={center} cy={center} r="5.7" fill="#db1f14" />
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
  const cellWidth = calendarSize / 7.2;
  const { width } = Dimensions.get("window");
  const monthFontSize = width * 0.033;
  const dayTextFontSize = width * 0.02;
  const dateFontSize = width * 0.024;

  const monthName = date
    .toLocaleString("default", { month: "long" })
    .toUpperCase();

  // Create an array of dates including empty placeholders for days before the first day
  const totalCells = firstDayIndex + daysInMonth;
  const dateCells = Array.from({ length: totalCells }, (_, i) => {
    if (i < firstDayIndex) return null;
    return i - firstDayIndex + 1;
  });

  // Split the dateCells into rows of 7
  const rows = [];
  for (let i = 0; i < dateCells.length; i += 7) {
    rows.push(dateCells.slice(i, i + 7));
  }

  return (
    <View style={[styles.calendarContainer, { width: calendarSize }]}>
      <Text
        style={[
          styles.monthText,
          {
            color: "#db1f14",
            marginLeft: 12,
            marginTop: -10,
            fontSize: monthFontSize,
          },
        ]}
      >
        {monthName}
      </Text>
      {/* Weekday Row */}
      <View style={styles.weekRow}>
        {["S", "M", "T", "W", "T", "F", "S"].map((dayName, index) => (
          <Text
            key={index}
            style={[
              styles.dayText,
              {
                color: "#fff",
                opacity: 0.44,
                width: cellWidth,
                textAlign: "center",
                fontSize: dayTextFontSize,
                marginHorizontal: 4.5,
              },
            ]}
          >
            {dayName}
          </Text>
        ))}
      </View>
      {/* Dates Grid */}
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.weekRow}>
          {row.map((d, index) => (
            <Text
              key={index}
              style={[
                styles.dateText,
                {
                  width: cellWidth,
                  height: cellWidth,
                  lineHeight: cellWidth,
                  marginHorizontal: 4.5,
                  color,
                  textAlign: "center",
                  fontSize: dateFontSize,
                },
                d === day && styles.selectedDate,
              ]}
            >
              {d ? d : ""}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
});

/* ====================================================
   Main Component: ClockWithCalendar
   ==================================================== */
export default function ClockWithCalendar({
  color = "#FFF",
  previewMode = false,
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const appState = useRef(AppState.currentState);

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
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
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
        <Clock time={currentTime} size={clockSize} color={color} />
        <Calendar
          date={currentTime}
          calendarSize={calendarSize}
          color={color}
        />
      </View>
    </View>
  );
}

/* ====================================================
   Styles
   ==================================================== */
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
    marginVertical: 0.5,
    margin: 2,
  },
  dateText: {
    fontFamily: "Poppins-Regular",
    marginVertical: 0,
    margin: 2,
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
