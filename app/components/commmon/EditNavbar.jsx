import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { MdTxt } from "@/app/components/ui/CustomText";

const EditNavbar = ({ tabs, activeTab, onTabChange, onSave }) => {
  const isSingleTab = tabs.length === 1;
  return (
    <View style={styles.navbar}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              !isSingleTab && styles.tab,
              isSingleTab && styles.singleTab,
              activeTab === tab.id && !isSingleTab && styles.activeTab,
            ]}
            onPress={() => onTabChange(tab.id)}
          >
            {tab.icon && (
              <View
                style={
                  isSingleTab && {
                    transform: [{ scale: 1.3 }],
                    marginRight: 5,
                  }
                }
              >
                {tab.icon}
              </View>
            )}
            <MdTxt
              style={[
                styles.tabText,
                isSingleTab && { fontSize: 20 },
                activeTab === tab.id && styles.activeTabText,
              ]}
            >
              {tab.label}
            </MdTxt>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.saveButton} onPress={onSave}>
        <MdTxt style={styles.saveButtonText}>Done</MdTxt>
      </TouchableOpacity>
    </View>
  );
};

export default EditNavbar;

const styles = StyleSheet.create({
  navbar: {
    paddingVertical: 15,
    flexDirection: "row",
    gap: 5,
  },
  saveButton: {
    backgroundColor: "#E6F904",
    marginRight: 15,
    paddingHorizontal: 15,
    marginVertical: "auto",
    paddingVertical: 6,
    borderRadius: 20,
  },
  saveButtonText: {
    color: "black",
  },
  tabsContainer: {
    paddingHorizontal: 15,
  },
  singleTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 6,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 6,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
    gap: 7,
  },
  activeTab: {
    backgroundColor: "#0b3f2eff",
  },
  tabText: {
    paddingTop: 2.5,
    fontSize: 13,
    color: "#999",
  },
  activeTabText: {
    color: "white",
    fontWeight: "600",
  },
});
