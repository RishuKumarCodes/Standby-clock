import React, { useState, useMemo, useEffect } from "react";
import { View, StyleSheet, BackHandler } from "react-native";
import Sidebar from "./settingsTabs/sidebar.js";
import PagesThemes from "./settingsTabs/PagesThemeSettings.js";
import ColorSettings from "./settingsTabs/ColorSettings.jsx";
import ReminderSettings from "./settingsTabs/ReminderSettings.jsx";
import GeneralSettings from "./settingsTabs/GeneralSettings.jsx";
import RateUs from "./settingsTabs/RateUs.jsx";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen({ onClose }) {
  const [activeTab, setActiveTab] = useState("clock");

  const tabComponents = {
    clock: PagesThemes,
    colors: ColorSettings,
    reminders: ReminderSettings,
    general: GeneralSettings,
    rateUs: RateUs,
  };

  const ActiveComponent = useMemo(
    () => tabComponents[activeTab] || null,
    [activeTab]
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onClose();
        return true;
      }
    );
    return () => backHandler.remove();
  }, [onClose]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
        <View style={styles.container}>
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onClose={onClose}
          />
          <View style={styles.mainContent}>
            {ActiveComponent && <ActiveComponent />}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingLeft: 12,
    backgroundColor: "#080d0b",
  },
  container: {
    flex: 1,
    flexDirection: "row",
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 17,
  },
});
