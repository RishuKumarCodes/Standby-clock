import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import 'react-native-reanimated';
import ContextProviders from "./components/LayoutComponents/ContextProviders";
import FontLoader from "./components/LayoutComponents/FontLoader";
import NotificationSetup from "./components/LayoutComponents/NotificationSetup";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";

import ReminderPopup from "./components/commmon/ReminderPopup";
import { ScreenSettings } from "./context/ScreenSettingsContext.js";

export default function Layout() {
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentReminder, setCurrentReminder] = useState(null);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
            onDone={() => {
              setPopupVisible(false);
            }}
          />
        </ContextProviders>
      </FontLoader>
    </GestureHandlerRootView>
  );
}
