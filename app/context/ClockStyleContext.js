import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ClockStyleContext = createContext();

export function ClockStyleProvider({ children }) {
  const [clockStyle, setClockStyle] = useState(null);
  const [userColor, setUserColor] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);

  // Load saved preferences on app start
  useEffect(() => {
    (async () => {
      try {
        const savedStyle = await AsyncStorage.getItem("clockStyle");
        const savedColor = await AsyncStorage.getItem("userColor");
        const savedTheme = await AsyncStorage.getItem("selectedTheme");

        if (savedStyle !== null) setClockStyle(savedStyle);
        if (savedColor !== null) setUserColor(savedColor);
        if (savedTheme !== null) setSelectedTheme(savedTheme);
      } catch (err) {
        console.warn("Error loading saved preferences:", err);
      }
    })();
  }, []);

  // Save settings when they change
  useEffect(() => {
    if (clockStyle !== null) {
      AsyncStorage.setItem("clockStyle", clockStyle).catch(console.warn);
    }
  }, [clockStyle]);

  useEffect(() => {
    if (userColor !== null) {
      AsyncStorage.setItem("userColor", userColor).catch(console.warn);
    }
  }, [userColor]);

  useEffect(() => {
    if (selectedTheme !== null) {
      AsyncStorage.setItem("selectedTheme", selectedTheme).catch(console.warn);
    }
  }, [selectedTheme]);

  return (
    <ClockStyleContext.Provider value={{ clockStyle, setClockStyle, userColor, setUserColor, selectedTheme, setSelectedTheme }}>
      {children}
    </ClockStyleContext.Provider>
  );
}

export function useClockStyle() {
  return useContext(ClockStyleContext);
}
