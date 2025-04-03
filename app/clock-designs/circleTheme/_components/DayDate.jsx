import React, { useMemo, memo, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { hexToRgba } from "../_helpers";

const DayDate = ({ time, bgColor, size, margin }) => {
  const bg = useMemo(() => hexToRgba(bgColor, 0.155), [bgColor]);

  const dayName = time
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();
  const day = time.getDate();
  const month = time.toLocaleString("en-US", { month: "short" });
  const [containerWidth, setContainerWidth] = useState(0);
  const daySize = containerWidth ? containerWidth * 0.13 : 20;
  const dateSize = containerWidth ? containerWidth * 0.145 : 20;

  return (
    <View
      style={{
        width: size,
        margin,
        gap: margin * 2,
        marginLeft: 0,
      }}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
      }}
    >
      <View
        style={[
          {
            borderRadius: size / 2,
            backgroundColor: bg,
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          },
        ]}
      >
        <Text
          style={[styles.dayTxt, { color: bgColor }, { fontSize: daySize }]}
        >
          {dayName}
        </Text>
      </View>
      <View
        style={{
          borderRadius: size / 2,
          backgroundColor: bg,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Text
          style={[styles.dateTxt, { color: "#fff" }, { fontSize: dateSize }]}
        >
          {day} {month}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dayTxt: {
    fontFamily: "Poppins-SemiBold",
    marginTop: "4%",
    textAlign: "center",
  },
  dateTxt: {
    fontFamily: "Poppins-Regular",
    marginTop: "4%",
    textAlign: "center",
  },
});

export default memo(DayDate, (prevProps, nextProps) => {
  const prevTime = prevProps.time;
  const nextTime = nextProps.time;
  return (
    prevTime.getHours() === nextTime.getHours() &&
    prevTime.getMinutes() === nextTime.getMinutes() &&
    prevProps.bgColor === nextProps.bgColor &&
    prevProps.previewMode === nextProps.previewMode &&
    prevProps.size === nextProps.size &&
    prevProps.margin === nextProps.margin
  );
});
