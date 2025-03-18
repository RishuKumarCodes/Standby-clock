// Sidebar.jsx (updated)
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const router = useRouter();

  return (
    <View style={styles.sidebar}>
      <TouchableOpacity
        style={styles.sidebarHeader}
        onPress={() => router.back()}
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color="white"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.sidebarHeaderText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.sidebarItem,
          activeTab === "clock" && styles.sidebarItemActive,
        ]}
        onPress={() => setActiveTab("clock")}
      >
        <Text style={styles.sidebarItemText}>Clock</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.sidebarItem,
          activeTab === "colors" && styles.sidebarItemActive,
        ]}
        onPress={() => setActiveTab("colors")}
      >
        <Text style={styles.sidebarItemText}>Colors</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.sidebarItem,
          activeTab === "general" && styles.sidebarItemActive,
        ]}
        onPress={() => setActiveTab("general")}
      >
        <Text style={styles.sidebarItemText}>General</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  sidebar: {
    width: 200,
    backgroundColor: "#0a0a0a",
    paddingTop: 40,
    paddingHorizontal: 12,
  },
  sidebarHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  sidebarHeaderText: { color: "#fff", fontSize: 20 },
  sidebarItem: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 50,
    marginBottom: 10,
  },
  sidebarItemActive: { backgroundColor: "#1f1f1f" },
  sidebarItemText: { color: "#fff", fontSize: 16 },
};

export default Sidebar;
