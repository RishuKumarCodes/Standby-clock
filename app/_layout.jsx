import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import * as Font from "expo-font";
import { View, ActivityIndicator, Platform } from "react-native";
import * as Notifications from "expo-notifications";

import ReminderPopup from "./components/ReminderPopup";
import {
  scheduleAllReminders,
  scheduleAllInAppReminders,
} from "./utils/notificationService";

import { GridSettingsProvider } from "./context/GridSettingsContext.js";
import { ScreenSettingsProvider } from "./context/ScreenSettingsContext.js";
import { ClockStyleProvider } from "./context/ClockStyleContext.js";
import { ClockStatusProvider } from "./context/ClockStatusContext.js";
import { SleepOverlayProvider } from "./context/SleepOverlayContext.js";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Layout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentReminder, setCurrentReminder] = useState(null);

  useEffect(() => {
    Font.loadAsync({
      "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
      "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    })
      .then(() => setFontsLoaded(true))
      .catch((err) => console.error("Font loading error", err));
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") return;

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Default",
          importance: Notifications.AndroidImportance.MAX,
        });
      }

      await scheduleAllReminders();

      await scheduleAllInAppReminders((reminder) => {
        setCurrentReminder(reminder);
        setPopupVisible(true);
      });
    })();
  }, []);

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <GridSettingsProvider>
      <ScreenSettingsProvider>
        <SleepOverlayProvider>
          <ClockStyleProvider>
            <ClockStatusProvider>
              <Stack screenOptions={{ headerShown: false }} />
              <ReminderPopup
                visible={popupVisible}
                reminder={currentReminder || { title: "", color: "#2196F3" }}
                onDismiss={() => setPopupVisible(false)}
                onDone={() => {
                  setPopupVisible(false);
                }}
              />
            </ClockStatusProvider>
          </ClockStyleProvider>
        </SleepOverlayProvider>
      </ScreenSettingsProvider>
    </GridSettingsProvider>
  );
}
