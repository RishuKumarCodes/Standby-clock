import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { MdTxt } from "../ui/CustomText";
import { ScrollView } from "react-native-gesture-handler";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: "dateTime", label: "Date & Time" },
    { key: "calendar", label: "Calendar" },
    { key: "weather", label: "Weather" },
    { key: "focus", label: "Focus" },
    { key: "todos", label: "Todos" },
    { key: "music", label: "Music" },
    { key: "analytics", label: "Analytics" },
  ];

  return (
    <ScrollView style={styles.sidebar} showsVerticalScrollIndicator={false}>
      <View style={styles.itemContainer}>
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
      </View>
    </ScrollView>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  sidebar: {
    minWidth: 120,
    maxWidth: 120,
    marginRight: 5,
    marginTop: 10,
  },
  itemContainer: {
    paddingVertical: 15,
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
