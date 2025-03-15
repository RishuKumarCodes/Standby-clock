import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ClockStyleContext = createContext();

export function ClockStyleProvider({ children }) {
  const [clockStyle, setClockStyle] = useState("digital");
  const [userColor, setUserColor] = useState("#FFFFFF");

  // Load saved theme & color on app start
  useEffect(() => {
    (async () => {
      try {
        const savedStyle = await AsyncStorage.getItem("clockStyle");
        const savedColor = await AsyncStorage.getItem("userColor");
        if (savedStyle) setClockStyle(savedStyle);
        if (savedColor) setUserColor(savedColor);
      } catch (err) {
        console.warn("Error loading saved style/color:", err);
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("clockStyle", clockStyle).catch(console.warn);
  }, [clockStyle]);

  useEffect(() => {
    AsyncStorage.setItem("userColor", userColor).catch(console.warn);
  }, [userColor]);

  return (
    <ClockStyleContext.Provider
      value={{ clockStyle, setClockStyle, userColor, setUserColor }}
    >
      {children}
    </ClockStyleContext.Provider>
  );
}

export function useClockStyle() {
  return useContext(ClockStyleContext);
}
