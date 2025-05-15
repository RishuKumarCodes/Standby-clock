// components/LayoutComponents/NotificationSetup.jsx

import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import {
  scheduleAllReminders,
  scheduleAllInAppReminders,
} from "../../utils/notificationService";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // use the new keys instead of deprecated shouldShowAlert
    shouldShowBanner: true,
    shouldShowList:   false,
    shouldPlaySound:  true,
    shouldSetBadge:   false,
  }),
});

export default function NotificationSetup({ onInAppReminder }) {
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") return;

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name:       "Default",
          importance: Notifications.AndroidImportance.MAX,
        });
      }

      // OS notifications for enabled && SendNotification
      await scheduleAllReminders();
      // In-app popups for enabled only
      await scheduleAllInAppReminders(onInAppReminder);
    })();
  }, [onInAppReminder]);

  return null;
}
