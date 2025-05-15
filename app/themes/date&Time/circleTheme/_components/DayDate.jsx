import React, { memo, useState, useMemo, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";

const DayDate = ({ day, date, month, color, bgCol, gap }) => {
  const [containerWidth, setContainerWidth] = useState(0);

  const daySize = useMemo(
    () => (containerWidth ? containerWidth * 0.095 : 20),
    [containerWidth]
  );
  const dateSize = useMemo(
    () => (containerWidth ? containerWidth * 0.09 : 20),
    [containerWidth]
  );

  const handleLayout = useCallback((e) => {
    setContainerWidth(e.nativeEvent.layout.width);
  }, []);

  const Bubble = useCallback(
    ({ children }) => (
      <View style={[styles.bubble, { backgroundColor: bgCol }]}>
        {children}
      </View>
    ),
    [bgCol]
  );

  return (
    <View style={{ flex: 1, gap }} onLayout={handleLayout}>
      <Bubble>
        <Text style={[styles.dayText, { color: color, fontSize: daySize }]}>
          <Feather name="sun" size={daySize + 5} color={color} />
          {"  "}
          {day.toUpperCase()}
        </Text>
      </Bubble>
      <Bubble>
        <Text style={[styles.dateText, { fontSize: dateSize }]}>
          <Feather name="calendar" size={dateSize + 3} color="#dedede" />
          {"  "}
          {`${date} ${month}`}
        </Text>
      </Bubble>
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    borderRadius: 50,
    justifyContent: "center",
    flex: 1,
  },
  dayText: {
    marginLeft: "11%",
    marginTop: "3.5%",
    fontFamily: "Poppins-SemiBold",
  },
  dateText: {
    marginLeft: "11%",
    marginTop: "3.5%",
    fontFamily: "Poppins-Regular",
    color: "#bfbfbf",
  },
});

export default memo(
  DayDate,
  (prev, next) =>
    prev.color === next.color &&
    prev.bgCol === next.bgCol &&
    prev.day === next.day &&
    prev.date === next.date &&
    prev.month === next.month &&
    prev.gap === next.gap
);
