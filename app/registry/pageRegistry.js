import React, { lazy } from "react";

// Clock themes
const MinimalBold = lazy(() => import("../themes/date&Time/MinimalBold"));
const MinimalThin = lazy(() => import("../themes/date&Time/MinimalThin"));
const AnalogClock = lazy(() => import("../themes/date&Time/AnalogClock"));
const SegmentClock = lazy(() => import("../themes/date&Time/SegmentClock"));
const CircleTheme = lazy(() =>
  import("../themes/date&Time/circleTheme/CircleTheme")
);
const EarthClock = lazy(() =>
  import("../themes/date&Time/EarthClock/EarthClock")
);
const WindowsClock = lazy(() =>
  import("../themes/date&Time/WindowsClock/WindowsClock")
);

export const componentMap = {
  // clock themes
  MinimalBold,
  MinimalThin,
  AnalogClock,
  SegmentClock,
  CircleTheme,
  EarthClock,
  WindowsClock,
};

import { ClockContextProvider } from "../context/ClockStatusContext";
import { WeatherContextProvider } from "../context/ClockStatusContext";
import { TodosContextProvider } from "../context/ClockStatusContext";
import { NotesContextProvider } from "../context/ClockStatusContext";

export const categoryProviders = {
  clock: ClockContextProvider,
  weather: WeatherContextProvider,
  todos: TodosContextProvider,
  notes: NotesContextProvider,
};
