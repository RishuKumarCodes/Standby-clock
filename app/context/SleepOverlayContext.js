import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SleepOverlayContext = createContext();

export const SleepOverlayProvider = ({ children }) => {
  const [sleepMode, setSleepMode] = useState(false);
  const [isScreenBlack, setIsScreenBlack] = useState(false);

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
