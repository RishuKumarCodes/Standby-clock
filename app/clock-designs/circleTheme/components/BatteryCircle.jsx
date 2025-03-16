import React, { useMemo, memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Rect, Path } from "react-native-svg";
import { hexToRgba } from "../helpers";

const BatteryIcon = ({ percentage, width = 10, height = 20 }) => {
  const strokeWidth = 2;
  const cornerRadius = 5;
  const innerCornerRadius = Math.max(0, cornerRadius - strokeWidth);
  const capWidth = 2;
  const capSpacing = 2;
  const batteryBodyWidth = width - capWidth - capSpacing;
  const batteryBodyHeight = height;
  const fillableWidth = batteryBodyWidth - strokeWidth * 2;
  const fillableHeight = batteryBodyHeight - strokeWidth * 2;
  const fillWidth = Math.max(0, (percentage / 100) * fillableWidth);

  return (
    <Svg width={width} height={height}>
      <Rect
        x={0}
        y={0}
        width={batteryBodyWidth}
        height={batteryBodyHeight}
        rx={cornerRadius}
        ry={cornerRadius}
        stroke="#fff"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Rect
        x={batteryBodyWidth + capSpacing}
        y={batteryBodyHeight * 0.25}
        width={capWidth}
        height={batteryBodyHeight * 0.5}
        fill="#fff"
        rx={1}
        ry={1}
      />
      <Rect
        x={strokeWidth}
        y={strokeWidth}
        width={fillWidth}
        height={fillableHeight}
        fill="#aaa"
        rx={innerCornerRadius}
        ry={innerCornerRadius}
      />
    </Svg>
  );
};

const ChargingIcon = ({ width = 16, height = 16 }) => (
  <Svg width={width} height={height} viewBox="0 0 100 100">
    <Path
      d="M63.3 9.5 21.8 52.2c-.7.7-.2 1.8.7 1.8h24c.8 0 1.3.8 1 1.5L32.4 89.4c-.5 1.1.9 2 1.7 1.1l43.8-49.6c.6-.7.1-1.8-.8-1.8H51.7c-.8 0-1.3-.8-.9-1.5l14.1-26.9c.6-1-.8-2-1.6-1.2z"
      fill="#FFD700"
    />
  </Svg>
);

const BatteryCircle = ({
  batteryLevel,
  batteryState,
  bgColor,
  size,
  previewMode,
  margin,
}) => {
  const batteryPercentage =
    batteryLevel != null ? Math.round(batteryLevel * 100) : 0;
  const isCharging = batteryState === 1;
  const bg = useMemo(() => hexToRgba(bgColor, 0.2), [bgColor]);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
        justifyContent: "center",
        alignItems: "center",
        margin,
      }}
    >
      <View
        style={[
          { justifyContent: "center", alignItems: "center" },
          previewMode && { transform: [{ scale: 0.5 }] },
        ]}
      >
        <BatteryIcon percentage={batteryPercentage} width={40} height={20} />
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}
        >
          <Text
            style={[styles.circleText, { color: bgColor }]}
          >{`${batteryPercentage}%`}</Text>
          {!isCharging && <ChargingIcon />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  circleText: {
    fontSize: 20,
    marginTop: 5,
    textAlign: "center",
  },
});

export default memo(BatteryCircle);
