import React, { useMemo, memo } from "react";
import Svg, { Circle, Line } from "react-native-svg";

const VIEWBOX = 100;
const C = VIEWBOX / 2;

const AnalogClock = ({ hour, min, color, bgCol }) => {
  const { hourAngle, minuteAngle, dims, markers } = useMemo(() => {
    const hourAngle = ((hour % 12) + min / 60) * 30 - 90;
    const minuteAngle = min * 6 - 90;

    const dims = {
      hourHand: VIEWBOX * 0.18,
      minuteHand: VIEWBOX * 0.275,
      minuteTail: -VIEWBOX * 0.1,
      hourStroke: VIEWBOX * 0.03,
      minuteStroke: VIEWBOX * 0.025,
      outerDot: VIEWBOX * 0.057,
      innerDot: VIEWBOX * 0.04,
      markerDist: C * 0.75,
      markerOuter: VIEWBOX * 0.02,
      markerInner: VIEWBOX * 0.019,
    };

    const markers = Array.from({ length: 12 }, (_, i) => {
      const isCardinal = i % 3 === 0;
      return {
        key: i,
        radius: isCardinal ? dims.markerOuter : dims.markerInner,
        fill: isCardinal ? "#fff" : bgCol,
        rotation: i * 30,
      };
    });

    return { bgCol, hourAngle, minuteAngle, dims, markers };
  }, [hour, min, color]);

  return (
    <Svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <Circle cx={C} cy={C} r={C} fill={bgCol} />

      {/* Markers */}
      {markers.map(({ key, radius, fill, rotation }) => (
        <Circle
          key={key}
          cx={C}
          cy={C - dims.markerDist}
          r={radius}
          fill={fill}
          transform={`rotate(${rotation}, ${C}, ${C})`}
        />
      ))}

      {/* Minute hand */}
      <Line
        x1={C - dims.minuteTail}
        y1={C}
        x2={C + dims.minuteHand}
        y2={C}
        stroke={color}
        strokeWidth={dims.minuteStroke}
        strokeLinecap="round"
        transform={`rotate(${minuteAngle}, ${C}, ${C})`}
      />

      {/* Hour hand */}
      <Line
        x1={C}
        y1={C}
        x2={C + dims.hourHand}
        y2={C}
        stroke="#fff"
        strokeWidth={dims.hourStroke}
        strokeLinecap="round"
        transform={`rotate(${hourAngle}, ${C}, ${C})`}
      />

      {/* Center cap */}
      <Circle cx={C} cy={C} r={dims.outerDot} fill="#fff" />
      <Circle cx={C} cy={C} r={dims.innerDot} fill="#333" />
    </Svg>
  );
};

export default memo(AnalogClock);
