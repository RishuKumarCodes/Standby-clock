import React, { useMemo, memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { hexToRgba } from "../_helpers";

const PillDateDisplay = ({
  time,
  bgColor,
  width,
  height,
  previewMode,
  margin,
}) => {
  const dayName = time.toLocaleDateString("en-US", { weekday: "long" });
  const day = time.getDate();
  const month = time.toLocaleString("en-US", { month: "short" });
  const year = time.getFullYear();
  const bg = useMemo(() => hexToRgba(bgColor, 0.2), [bgColor]);

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius: height / 2,
          backgroundColor: bg,
          justifyContent: "center",
          alignItems: "center",
          margin,
          marginLeft: 0,
        },
      ]}
    >
      <View
        style={[
          { justifyContent: "center", alignItems: "center" },
          previewMode && { transform: [{ scale: 0.5 }] },
        ]}
      >
        <Text style={styles.dayName}>{dayName}</Text>
        <Text style={styles.pillText}>
          {day} {month} <Text style={{ color: bgColor }}>{year}</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pillText: {
    fontSize: 24,
    color: "white",
    flexShrink: 1,
    width: "auto",
  },
  dayName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff2d21",
  },
});

export default memo(PillDateDisplay, (prevProps, nextProps) => {
  const prevTime = prevProps.time;
  const nextTime = nextProps.time;
  return (
    prevTime.getDate() === nextTime.getDate() &&
    prevTime.getMonth() === nextTime.getMonth() &&
    prevTime.getFullYear() === nextTime.getFullYear() &&
    prevProps.bgColor === nextProps.bgColor &&
    prevProps.previewMode === nextProps.previewMode &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.margin === nextProps.margin
  );
});
