import React, { Suspense, lazy } from "react";
import { View } from "react-native";
import { useClockStyle } from "../../context/ClockStyleContext.js";

const MinimalBold = lazy(() => import("../../themes/date&Time/MinimalBold.jsx"));
const MinimalThin = lazy(() => import("../../themes/date&Time/MinimalThin.jsx"));
const AnalogClock = lazy(() => import("../../themes/date&Time/AnalogClock.jsx"));
const WeatherBattery = lazy(() =>
  import("../../themes/date&Time/WeatherBattery.jsx")
);
const WindowsClock = lazy(() => import("../../themes/date&Time/WindowsClock/WindowsClock.jsx"));
const SegmentClock = lazy(() => import("../../themes/date&Time/SegmentClock.jsx"));
const CircleTheme = lazy(() =>
  import("../../themes/date&Time/circleTheme/CircleTheme.jsx")
);
const EarthClock = lazy(() =>
  import("../../themes/date&Time/EarthClock/EarthClock.jsx")
);

const clockComponents = {
  MinimalBold,
  MinimalThin,
  AnalogClock,
  WeatherBattery,
  SegmentClock,
  CircleTheme,
  EarthClock,
  WindowsClock,
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
