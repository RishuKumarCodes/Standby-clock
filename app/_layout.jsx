import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import * as SystemUI from "expo-system-ui";
import { Stack } from "expo-router";

import FontLoader from "./components/LayoutComponents/FontLoader";
import NotificationSetup from "./components/LayoutComponents/NotificationSetup";
import ContextProviders from "./components/LayoutComponents/ContextProviders";
import ReminderPopup from "./components/commmon/ReminderPopup";
import { ScreenSettings } from "./context/ScreenSettingsContext.js";

export default function Layout() {
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentReminder, setCurrentReminder] = useState(null);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    if (Platform.OS === "android") {
      SystemUI.setBackgroundColorAsync("transparent");
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#000" }}>
      <FontLoader>
        <NotificationSetup
          onInAppReminder={(rem) => {
            setCurrentReminder(rem);
            setPopupVisible(true);
          }}
        />
        <ContextProviders>
          <Stack screenOptions={{ headerShown: false }} />
          <ScreenSettings />
          <ReminderPopup
            visible={popupVisible}
            reminder={currentReminder || { title: "", color: "#2196F3" }}
            onDismiss={() => setPopupVisible(false)}
            onDone={() => setPopupVisible(false)}
          />
        </ContextProviders>
      </FontLoader>
    </GestureHandlerRootView>
  );
}
