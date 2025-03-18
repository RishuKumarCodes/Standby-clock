// SettingsScreen.jsx
import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import Sidebar from "./settingsComponents/sidebar.js";
import ClockSettings from "./settingsComponents/ClockSettings.js";
import ColorSettings from "./settingsComponents/ColorSettings.js";
import GeneralSettings from "./settingsComponents/GeneralSettings.jsx";

export default function SettingsScreen() {
  const [activeTab, setActiveTab] = useState("clock");

  return (
    <View style={styles.container}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <ScrollView
        style={styles.mainContent}
        contentContainerStyle={styles.mainContentContainer}
      >
        {activeTab === "clock" ? (
          <ClockSettings />
        ) : activeTab === "colors" ? (
          <ColorSettings />
        ) : activeTab === "general" ? (
          <GeneralSettings />
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", backgroundColor: "#000" },
  mainContent: { flex: 1, backgroundColor: "#000", paddingHorizontal: 20 },
  mainContentContainer: { paddingBottom: 40 },
});
