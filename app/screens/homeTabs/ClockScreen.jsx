import React, { Suspense, lazy } from "react";
import { View } from "react-native";
import { useClockStyle } from "../../context/ClockStyleContext.js";

const MinimalBold = lazy(() => import("../../clock-designs/MinimalBold.jsx"));
const MinimalThin = lazy(() => import("../../clock-designs/MinimalThin.jsx"));
const AnalogClock = lazy(() => import("../../clock-designs/AnalogClock.jsx"));
const WeatherBattery = lazy(() =>
  import("../../clock-designs/weatherBattery/WeatherBattery.jsx")
);
const NeonClock = lazy(() => import("../../clock-designs/NeonClock.jsx"));
const SegmentClock = lazy(() => import("../../clock-designs/SegmentClock.jsx"));
const CircleTheme = lazy(() =>
  import("../../clock-designs/circleTheme/CircleTheme.jsx")
);

const clockComponents = {
  MinimalBold,
  MinimalThin,
  AnalogClock,
  WeatherBattery,
  SegmentClock,
  CircleTheme,
  NeonClock,
};

export default function ClockScreen() {
  const { clockStyle, userColor } = useClockStyle();
  const ClockComponent = clockComponents[clockStyle] || MinimalBold;

  return (
    <Suspense fallback={<View style={{ flex: 1, backgroundColor: "black" }} />}>
      <ClockComponent color={userColor} />
    </Suspense>
  );
}
