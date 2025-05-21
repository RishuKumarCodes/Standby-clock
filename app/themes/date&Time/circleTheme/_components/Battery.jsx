import React, { memo, useMemo, useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import ChargingIcon from "../../../../../assets/icons/ChargingIndicatorIcon.jsx";

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
          {chargingStatus && <ChargingIcon width="26%" height="26%" />}
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
