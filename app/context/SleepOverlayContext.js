import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SleepOverlayContext = createContext();

export const SleepOverlayProvider = ({ children }) => {
  const [sleepMode, setSleepMode] = useState(true);
  const [isScreenBlack, setIsScreenBlack] = useState(false);

  useEffect(() => {
    const loadSleepMode = async () => {
      try {
        const savedSleepMode = await AsyncStorage.getItem("sleepMode");
        if (savedSleepMode !== null) {
          setSleepMode(JSON.parse(savedSleepMode));
        }
      } catch (error) {
        console.log("Error loading sleep mode enabled:", error);
      }
    };
    loadSleepMode();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("sleepMode", JSON.stringify(sleepMode)).catch(
      console.warn
    );
  }, [sleepMode]);

  useEffect(() => {
    if (!sleepMode) {
      setIsScreenBlack(false);
    }
  }, [sleepMode]);

  const toggleSleepOverlay = () => {
    if (sleepMode) {
      setIsScreenBlack((prev) => !prev);
    }
  };

  return (
    <SleepOverlayContext.Provider
      value={{
        sleepMode,
        setSleepMode,
        isScreenBlack,
        setIsScreenBlack,
        toggleSleepOverlay,
      }}
    >
      {children}
    </SleepOverlayContext.Provider>
  );
};

export const useSleepOverlay = () => useContext(SleepOverlayContext);
