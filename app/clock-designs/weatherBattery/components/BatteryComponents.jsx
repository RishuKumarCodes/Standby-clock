import React, { memo } from "react";
import Svg, { Rect, Path } from "react-native-svg";

export const BatteryIcon = ({
  percentage,
  color = "#aaa",
  dimColor = "#999",
  width = 30,
  height = 14,
}) => {
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
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Rect
        x={batteryBodyWidth + capSpacing}
        y={batteryBodyHeight * 0.25}
        width={capWidth}
        height={batteryBodyHeight * 0.5}
        fill={color}
        rx={1}
        ry={1}
      />
      <Rect
        x={strokeWidth}
        y={strokeWidth}
        width={fillWidth}
        height={fillableHeight}
        fill={dimColor}
        rx={innerCornerRadius}
        ry={innerCornerRadius}
      />
    </Svg>
  );
};

export const ChargingIcon = ({
  width = 16,
  height = 16,
  color = "#FFD700",
}) => (
  <Svg width={width} height={height} viewBox="0 0 100 100">
    <Path
      d="M63.3 9.5 21.8 52.2c-.7.7-.2 1.8.7 1.8h24c.8 0 1.3.8 1 1.5L32.4 89.4c-.5 1.1.9 2 1.7 1.1l43.8-49.6c.6-.7.1-1.8-.8-1.8H51.7c-.8 0-1.3-.8-.9-1.5l14.1-26.9c.6-1-.8-2-1.6-1.2z"
      fill={color}
    />
  </Svg>
);

export default memo(BatteryIcon);
