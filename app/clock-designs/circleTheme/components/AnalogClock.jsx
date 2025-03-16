import React, { useMemo, memo } from "react";
import Svg, { Circle, Line } from "react-native-svg";
import { hexToRgba } from "../helpers";

const AnalogClock = ({ time, bgColor, size }) => {
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = ((hours % 12) + minutes / 60 + seconds / 3600) * 30 - 90;
  const minuteAngle = (minutes + seconds / 60) * 6 - 90;
  const center = size / 2;
  const hourHandLength = size * 0.18;
  const minuteHandLength = size * 0.25;

  const hourX = center + hourHandLength * Math.cos((hourAngle * Math.PI) / 180);
  const hourY = center + hourHandLength * Math.sin((hourAngle * Math.PI) / 180);
  const minuteX =
    center + minuteHandLength * Math.cos((minuteAngle * Math.PI) / 180);
  const minuteY =
    center + minuteHandLength * Math.sin((minuteAngle * Math.PI) / 180);

  const markers = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 12; i++) {
      const angleRad = (i * 30 - 90) * (Math.PI / 180);
      const markerDistance = center * 0.75;
      const markerX = center + markerDistance * Math.cos(angleRad);
      const markerY = center + markerDistance * Math.sin(angleRad);
      const isCardinal = i % 3 === 0;
      arr.push(
        <Circle
          key={i}
          cx={markerX}
          cy={markerY}
          r={isCardinal ? 7 : 4}
          fill={isCardinal ? "#fff" : hexToRgba(bgColor, 0.35)}
        />
      );
    }
    return arr;
  }, [center, bgColor]);

  const bgFill = useMemo(() => hexToRgba(bgColor, 0.2), [bgColor]);

  return (
    <Svg width={size} height={size}>
      <Circle cx={center} cy={center} r={center} fill={bgFill} />
      {markers}
      <Line
        x1={center}
        y1={center}
        x2={hourX}
        y2={hourY}
        stroke="white"
        strokeWidth={12}
        strokeLinecap="round"
      />
      <Line
        x1={center}
        y1={center}
        x2={minuteX}
        y2={minuteY}
        stroke="#db1f14"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Circle cx={center} cy={center} r={5} fill="#db1f14" />
    </Svg>
  );
};

export default memo(AnalogClock);
