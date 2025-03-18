import React, { createContext, useContext, useState, useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";

const ScreenSettingsContext = createContext();

export const ScreenSettingsProvider = ({ children }) => {
  const [navBarVisible, setNavBarVisible] = useState(false);
  const [statusBarVisible, setStatusBarVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationBarVisible, setNotificationBarVisible] = useState(true); // ✅ Add this state

  useEffect(() => {
    NavigationBar.setVisibilityAsync(navBarVisible ? "visible" : "hidden");
  }, [navBarVisible]);

  useEffect(() => {
    <StatusBar hidden={!statusBarVisible} />;
  }, [statusBarVisible]);

  useEffect(() => {
    if (!notificationsEnabled) {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
    } else {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });
    }
  }, [notificationsEnabled]);

  useEffect(() => {
    if (!notificationBarVisible) {
      Notifications.dismissAllNotificationsAsync(); // ✅ Hide all notifications when toggled off
    }
  }, [notificationBarVisible]);

  return (
    <ScreenSettingsContext.Provider
      value={{
        navBarVisible,
        setNavBarVisible,
        statusBarVisible,
        setStatusBarVisible,
        notificationsEnabled,
        setNotificationsEnabled,
        notificationBarVisible, // ✅ Expose this in the context
        setNotificationBarVisible, // ✅ Expose setter function
      }}
    >
      {children}
    </ScreenSettingsContext.Provider>
  );
};

export const useScreenSettings = () => useContext(ScreenSettingsContext);
