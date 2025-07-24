import { StyleSheet, View } from "react-native";
import React from "react";

import MinimalBold from "../../themes/date&Time/MinimalBold.tsx";
import MinimalThin from "../../themes/date&Time/MinimalThin.jsx";
import AnalogClock from "../../themes/date&Time/AnalogClock.tsx";
import WeatherBattery from "../../themes/date&Time/WeatherBattery.tsx";
import WindowsClock from "../../themes/date&Time/WindowsClock/WindowsClock.tsx";
import SegmentClock from "../../themes/date&Time/SegmentClock.tsx";
import CircleTheme from "../../themes/date&Time/circleTheme/CircleTheme.tsx";
import EarthClock from "../../themes/date&Time/EarthClock/EarthClock.tsx";

import MinimalWeather from "../../themes/weather/minimalWeather/MinimalWeather";
import SunriseMoonrise from "../../themes/weather/sunriseMoonrise/SunriseMoonrise";
import ConsoleLogClock from "../../themes/weather/ConsoleLogClock";
import WeatherWidget from "../../themes/weather/WeatherWidget";
import WeatherCards from "../../themes/weather/visualCardsWeather/WeatherCards.tsx";
import WeatherDashboard from "../../themes/weather/WeatherDashboard.tsx";

import TimerScreen from "../../themes/Focus/TimerTodoCombo.jsx/TimerScreen.jsx";
import DailyHabitTimer from "../../themes/Focus/dailyHabitTimer/DailyHabitTimer";
import FullScreenTimer from "../../themes/Focus/FullScreenTimer";

import DailyHabit from "../../themes/todos/DailyHabit.tsx";

import AnalyticsScreen from "../../themes/analytics/DailyHabitTimer/AnalyticsScreen";

const allComponents = {
  MinimalBold,
  MinimalThin,
  AnalogClock,
  WeatherBattery,
  WindowsClock,
  EarthClock,
  SegmentClock,
  CircleTheme,

  MinimalWeather,
  SunriseMoonrise,
  WeatherWidget,
  ConsoleLogClock,
  WeatherCards,
  WeatherDashboard,

  TimerScreen,
  DailyHabitTimer,
  FullScreenTimer,

  DailyHabit,

  AnalyticsScreen,
};

const PagePreview = ({ activePage, userColor }) => {
  const PreviewComponent = allComponents[activePage.component] || MinimalBold;

  return (
    <View style={styles.clockPreviewContainer} pointerEvents="none">
      <PreviewComponent
        previewMode={true}
        variant={"colorSettings"}
        color={userColor || "#9ac78f"}
      />
    </View>
  );
};

export default PagePreview;

const styles = StyleSheet.create({
  clockPreviewContainer: {
    alignItems: "center",
    aspectRatio: 19.5 / 9,
    marginTop: 10,
    marginBottom: 7,
    backgroundColor: "#000",
    borderRadius: 15,
    overflow: "hidden",
    width: "100%",
  },
});
