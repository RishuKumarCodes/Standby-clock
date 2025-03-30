import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GridSettingsContext = createContext();

export function GridSettingsProvider({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [gridOverlayEnabled, setGridOverlayEnabled] = useState(false); 
  const [gridOpacity, setGridOpacity] = useState(1);

  // Load settings from AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const savedGridOverlay = await AsyncStorage.getItem("gridOverlayEnabled");
        const savedGridOpacity = await AsyncStorage.getItem("gridOpacity");

        if (savedGridOverlay !== null) setGridOverlayEnabled(JSON.parse(savedGridOverlay));
        if (savedGridOpacity !== null) {
          const opacityValue = parseFloat(savedGridOpacity);
          if (!isNaN(opacityValue)) setGridOpacity(opacityValue);
        }
      } catch (err) {
        console.warn("Error loading grid settings:", err);
      } finally {
        setIsLoaded(true); 
      }
    })();
  }, []);

  // Save settings when they change (only after loading)
  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem("gridOverlayEnabled", JSON.stringify(gridOverlayEnabled)).catch(console.warn);
    }
  }, [gridOverlayEnabled, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem("gridOpacity", gridOpacity.toString()).catch(console.warn);
    }
  }, [gridOpacity, isLoaded]);

  // Prevent rendering before settings are loaded
  if (!isLoaded) return null;

  return (
    <GridSettingsContext.Provider value={{ gridOverlayEnabled, setGridOverlayEnabled, gridOpacity, setGridOpacity }}>
      {children}
    </GridSettingsContext.Provider>
  );
}

export const useGridSettings = () => useContext(GridSettingsContext);
