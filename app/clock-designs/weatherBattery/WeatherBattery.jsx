import React from "react";
import { useFonts } from "expo-font";
import WeatherClockContent from "./WeatherClockContent";

export default function WeatherBattery(props) {
  const [fontsLoaded] = useFonts({
    "Oswald-Regular": require("../../../assets/fonts/Oswald-Regular.ttf"),
  });

  if (!fontsLoaded) return null;
  return <WeatherClockContent {...props} />;
}
