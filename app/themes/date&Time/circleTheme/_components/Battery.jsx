import React, { memo, useMemo, useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

const BatteryProgressBar = memo(({ percentage, fillColor, bgCol }) => (
  <View style={[styles.progressContainer, { backgroundColor: bgCol }]}>
    <View
      style={[
        styles.progressFill,
        {
          backgroundColor: fillColor,
          width: `${percentage}%`,
        },
      ]}
    />
  </View>
));

const ChargingIcon = memo(({ width = "26%", height = "26%" }) => (
  <Svg width={width} height={height} viewBox="0 0 100 100">
    <Path
      d="M63.3 9.5 21.8 52.2c-.7.7-.2 1.8.7 1.8h24c.8 0 1.3.8 1 1.5L32.4 89.4c-.5 1.1.9 2 1.7 1.1l43.8-49.6c.6-.7.1-1.8-.8-1.8H51.7c-.8 0-1.3-.8-.9-1.5l14.1-26.9c.6-1-.8-2-1.6-1.2z"
      fill="#FFD700"
    />
  </Svg>
));

const Battery = ({ battery, chargingStatus, color, bgCol }) => {
  const [containerWidth, setContainerWidth] = useState(0);

  const handleLayout = useCallback((event) => {
    setContainerWidth(event.nativeEvent.layout.width);
  }, []);

  const calculatedFontSize = useMemo(
    () => (containerWidth ? containerWidth * 0.27 : 45),
    [containerWidth]
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bgCol,
        },
      ]}
      onLayout={handleLayout}
    >
      <View style={styles.inner}>
        <BatteryProgressBar
          percentage={battery}
          fillColor={color}
          bgCol={bgCol}
        />

        <View style={styles.textRow}>
          <Text
            style={[styles.percentageText, { fontSize: calculatedFontSize }]}
          >
            {`${battery}%`}
          </Text>
          {chargingStatus && <ChargingIcon />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    aspectRatio: 1,
    borderRadius: "20%",
    padding: "6.5%",
    paddingBottom: "1%",
  },
  inner: {
    justifyContent: "space-between",
    height: "100%",
  },
  progressContainer: {
    position: "relative",
    justifyContent: "center",
    overflow: "hidden",
    width: "100%",
    height: "18%",
    borderRadius: "3%",
  },
  progressFill: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    borderRadius: "3%",
  },
  textRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  percentageText: {
    color: "#fff",
    fontFamily: "Poppins-ExtraLight",
  },
});

export default memo(Battery);
