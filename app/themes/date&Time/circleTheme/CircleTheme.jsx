import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import AnalogClock from "./_components/AnalogClock";
import QuoteCard from "./_components/QuoteCard.jsx";
import DayDate from "./_components/DayDate";
import Battery from "./_components/Battery";
import { useClockStatus } from "../../../context/ClockStatusContext";

const hexToRgba = (hex, opacity, intensity = 0.8) => {
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  r = Math.round(r + (255 - r) * (1 - opacity) * intensity);
  g = Math.round(g + (255 - g) * (1 - opacity) * intensity);
  b = Math.round(b + (255 - b) * (1 - opacity) * intensity);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default function CircleTheme({ color = "#000", previewMode }) {
  const elementGap = previewMode ? 6 : 20;
  const { hour, min, battery, chargingStatus, day, date, month } =
    useClockStatus();

  const backgroundColor = useMemo(() => hexToRgba(color, 0.155), [color]);

  return (
    <View
      style={[styles.container, { gap: elementGap, margin: elementGap * 1.65 }]}
    >
      <View style={{ aspectRatio: 1 }}>
        <AnalogClock hour={hour} min={min} color={color} bgCol={backgroundColor}/>
      </View>

      <View style={{ flex: 1, gap: elementGap }}>
        <QuoteCard color={color} bgCol={backgroundColor} />

        <View style={{ flexDirection: "row", height: "50%", gap: elementGap }}>
          <DayDate
            day={day}
            month={month}
            date={date}
            color={color}
            bgCol={backgroundColor}
            gap={elementGap}
          />
          <Battery
            battery={battery}
            chargingStatus={chargingStatus}
            color={color}
            bgCol={backgroundColor}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: "6%",
    flexDirection: "row",
  },
});
