import React, { createContext, useContext, useState, useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ScreenSettingsContext = createContext();

export const ScreenSettingsProvider = ({ children }) => {
  const [navBarVisible, setNavBarVisible] = useState(false);
  const [statusBarVisible, setStatusBarVisible] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [activeScreen, setActiveScreen] = useState("home");

  // Load settings when the provider mounts
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedNavBar = await AsyncStorage.getItem("navBarVisible");
        const storedStatusBar = await AsyncStorage.getItem("statusBarVisible");

        if (storedNavBar !== null) {
          setNavBarVisible(storedNavBar === "true");
        }
        if (storedStatusBar !== null) {
          setStatusBarVisible(storedStatusBar === "true");
        }
      } catch (error) {
        console.error("Error loading screen settings:", error);
      } finally {
        setSettingsLoaded(true);
      }
    };

    loadSettings();
  }, []);

  // Save navBarVisible changes and update NavigationBar once settings are loaded
  useEffect(() => {
    const saveNavBarSetting = async () => {
      try {
        await AsyncStorage.setItem("navBarVisible", navBarVisible.toString());
      } catch (error) {
        console.error("Error saving nav bar setting:", error);
      }
    };

    if (settingsLoaded) {
      saveNavBarSetting();
      NavigationBar.setVisibilityAsync(navBarVisible ? "visible" : "hidden");
      NavigationBar.setBackgroundColorAsync("#000");
    }
  }, [navBarVisible, settingsLoaded]);

  // Save statusBarVisible changes once settings are loaded
  useEffect(() => {
    const saveStatusBarSetting = async () => {
      try {
        await AsyncStorage.setItem(
          "statusBarVisible",
          statusBarVisible.toString()
        );
      } catch (error) {
        console.error("Error saving status bar setting:", error);
      }
    };

    if (settingsLoaded) {
      saveStatusBarSetting();
    }
  }, [statusBarVisible, settingsLoaded]);

  // Optionally, render nothing until the settings are loaded
  if (!settingsLoaded) {
    return null;
  }

  return (
    <ScreenSettingsContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        navBarVisible,
        setNavBarVisible,
        statusBarVisible,
        setStatusBarVisible,
      }}
    >
      {children}
    </ScreenSettingsContext.Provider>
  );
};

export const useScreenSettings = () => useContext(ScreenSettingsContext);

// A component to render the status bar based on the current setting
export const ScreenSettings = () => {
  const { statusBarVisible } = useScreenSettings();
  return <StatusBar hidden={!statusBarVisible} style="light" />;
};
