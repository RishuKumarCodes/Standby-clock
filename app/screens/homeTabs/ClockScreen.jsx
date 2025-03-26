import React from "react";
import MinimalBold from "../../clock-designs/MinimalBold.jsx";
import MinimalThin from "../../clock-designs/MinimalThin.jsx";
import AnalogClock from "../../clock-designs/AnalogClock.jsx";
import weatherBattery from "../../clock-designs/weatherBattery/WeatherBattery.jsx";
import NeonClock from "../../clock-designs/NeonClock.jsx";
import SegmentClock from "../../clock-designs/SegmentClock.jsx";
import CircleTheme from "../../clock-designs/circleTheme/CircleTheme.jsx";
import { useClockStyle } from "../../context/ClockStyleContext.js";

const clockComponents = {
  MinimalBold,
  MinimalThin,
  AnalogClock,
  weatherBattery,
  SegmentClock,
  CircleTheme,
  NeonClock,
};

export default function ClockScreen() {
  const { clockStyle, userColor } = useClockStyle();
  const ClockComponent = clockComponents[clockStyle] || MinimalBold;

  return <ClockComponent color={userColor} />;
}
