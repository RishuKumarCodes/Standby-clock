import React, { memo } from "react";
import Svg, { Rect, Path } from "react-native-svg";

export const RectangleBatteryIndicator = ({
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

export default memo(RectangleBatteryIndicator);
