import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ClockStyleContext = createContext();

export function ClockStyleProvider({ children }) {
  const [clockStyle, setClockStyle] = useState("MinimalBold");
  const [userColor, setUserColor] = useState("#fff");

  useEffect(() => {
    (async () => {
      try {
        const [savedStyle, savedColor] = await Promise.all([
          AsyncStorage.getItem("clockStyle"),
          AsyncStorage.getItem("userColor"),
        ]);
        if (savedStyle !== null) setClockStyle(savedStyle);
        if (savedColor !== null) setUserColor(savedColor);
      } catch (err) {
        console.warn("Error loading saved preferences:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // clockStyle
  useEffect(() => {
    if (clockStyle !== null) {
      AsyncStorage.setItem("clockStyle", clockStyle).catch((err) =>
        console.warn("Error saving clockStyle:", err)
      );
    }
  }, [clockStyle]);

  // userColor
  useEffect(() => {
    if (userColor !== null) {
      AsyncStorage.setItem("userColor", userColor).catch((err) =>
        console.warn("Error saving userColor:", err)
      );
    }
  }, [userColor]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ clockStyle, setClockStyle, userColor, setUserColor }),
    [clockStyle, userColor]
  );

  return (
    <ClockStyleContext.Provider value={contextValue}>
      {children}
    </ClockStyleContext.Provider>
  );
}

export function useClockStyle() {
  return useContext(ClockStyleContext);
}
