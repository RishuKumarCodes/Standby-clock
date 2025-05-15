import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { MdTxt } from "../CustomText";
import { ScrollView } from "react-native-gesture-handler";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: "dateTime", label: "Date & Time" },
    { key: "calendar", label: "Calendar" },
    { key: "weather", label: "Weather" },
    { key: "focus", label: "Focus" },
    { key: "todos", label: "Todos" },
    { key: "music", label: "Music" },
    { key: "anaylitics", label: "Anaylitics" },
    { key: "others", label: "Others" },
  ];

  return (
    <ScrollView style={styles.sidebar}>
      {tabs.map(({ key, label }) => {
        const isActive = activeTab === key;
        return (
          <TouchableOpacity
            key={key}
            style={[styles.sidebarItem, isActive && styles.sidebarItemActive]}
            onPress={() => setActiveTab(key)}
          >
            <MdTxt
              style={[isActive ? styles.activeTxt : null, { fontSize: 15.2 }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {label}
            </MdTxt>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  sidebar: {
    marginTop: 25,
    marginBottom: 10,
    marginRight: 5,
    minWidth: 120,
    maxWidth: 120,
  },
  sidebarItem: {
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    borderTopLeftRadius: 5.5,
    borderBottomLeftRadius: 5.5,
    paddingHorizontal: 10,
    height: 45,
    paddingTop: 3,
    opacity: 0.55,
    justifyContent: "center",
  },
  sidebarItemActive: {
    backgroundColor: "#17241f",
    opacity: 1,
  },
  activeTxt: {
    fontSize: 15.2,
    fontFamily: "Poppins-SemiBold",
    overflow: "hidden",
    wordWrap: "nowrap",
  },
});
