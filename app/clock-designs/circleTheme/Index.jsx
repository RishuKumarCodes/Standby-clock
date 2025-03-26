// app/clock-designs/circleTheme/index.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, StyleSheet } from "react-native";

// Import components from our "_components" folder
import AnalogClock from "./_components/AnalogClock";
import PillDateDisplay from "./_components/PillDateDisplay";
import CircleTimeDigit from "./_components/CircleTimeDigit";
import BatteryCircle from "./_components/BatteryCircle";

// Import battery hook from our "_helpers" file
import { useBatteryInfo } from "./_helpers";

export default function CircleTheme({ color = "#000", previewMode = false }) {
  const [time, setTime] = useState(new Date());
  const [leftSize, setLeftSize] = useState(0);
  const [rightSize, setRightSize] = useState(0);
  const { batteryLevel, batteryState } = useBatteryInfo();
  const elementMargin = previewMode ? 2 : 10;

  useEffect(() => {
    const intervalId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const onLayoutLeft = useCallback(
    ({ nativeEvent }) => {
      const { width, height } = nativeEvent.layout;
      const size = Math.min(width, height) - 2 * elementMargin;
      setLeftSize(size > 0 ? size : 0);
    },
    [elementMargin]
  );

  const onLayoutRight = useCallback(
    ({ nativeEvent }) => {
      const { width, height } = nativeEvent.layout;
      const size = Math.min(width, height) - 2 * elementMargin;
      setRightSize(size > 0 ? size : 0);
    },
    [elementMargin]
  );

  const leftInnerStyle = useMemo(
    () => ({
      width: leftSize,
      height: leftSize,
      margin: elementMargin,
    }),
    [leftSize, elementMargin]
  );

  const rightContainerStyle = useMemo(
    () => ({
      width: rightSize,
      height: rightSize,
      margin: elementMargin,
    }),
    [rightSize, elementMargin]
  );

  const pillWidth = rightSize - 2 * elementMargin;
  const pillHeight = rightSize / 2 - 2 * elementMargin;
  const circleSize = rightSize / 2 - 2 * elementMargin;

  return (
    <View style={styles.container}>
      {/* Left half */}
      <View style={styles.leftContainer} onLayout={onLayoutLeft}>
        <View style={leftInnerStyle}>
          <AnalogClock time={time} bgColor={color} size={leftSize} />
        </View>
      </View>

      {/* Right half */}
      <View style={styles.rightContainer} onLayout={onLayoutRight}>
        <View style={rightContainerStyle}>
          {/* Top half: Pill display */}
          <View
            style={{
              width: rightSize,
              height: rightSize / 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PillDateDisplay
              time={time}
              bgColor={color}
              width={pillWidth}
              height={pillHeight}
              previewMode={previewMode}
              margin={elementMargin}
            />
          </View>

          {/* Bottom half: Two circles side by side */}
          <View
            style={{
              width: rightSize,
              height: rightSize / 2,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircleTimeDigit
              time={time}
              bgColor={color}
              size={circleSize}
              previewMode={previewMode}
              margin={elementMargin}
            />
            <BatteryCircle
              batteryLevel={batteryLevel}
              batteryState={batteryState}
              bgColor={color}
              size={circleSize}
              previewMode={previewMode}
              margin={elementMargin}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  leftContainer: {
    flex: 1,
    margin: 15,
    marginRight: 0,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  rightContainer: {
    margin: 10,
    marginLeft: 0,
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
});
