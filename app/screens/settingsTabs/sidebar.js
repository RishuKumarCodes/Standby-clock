import React, { useRef, useEffect, useCallback, memo } from "react";
import {
  View,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import GeneralSettingsIcon from "../../../assets/icons/GeneralSettingsIcon.jsx";
// import ReminderIcon from "../../../assets/icons/ReminderIcon.jsx";
import SettingsAnimatedIcon from "../../../assets/icons/SettingsAnimatedIcon.jsx";
import HeartIcon from "../../../assets/icons/HeartAnimatedIcon.jsx";
import ThemesIcon from "../../../assets/icons/ThemesAnimatedIcon.jsx";
import ReminderIcon from "../../../assets/icons/ReminderAnimatedIcon.jsx";
import ColorPalleteIcon from "../../../assets/icons/ColorPalleteAnimatedIcon.jsx";

const SidebarItem = memo(({ isActive, onPress, children }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const radiusAnim = useRef(new Animated.Value(isActive ? 20 : 50)).current;

  useEffect(() => {
    Animated.timing(radiusAnim, {
      toValue: isActive ? 20 : 50,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isActive, radiusAnim]);

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.7,
      useNativeDriver: false,
      overshootClamping: true,
      stiffness: 100,
      damping: 30,
      mass: 1,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: false,
      overshootClamping: true,
      stiffness: 300,
      damping: 30,
      mass: 1,
    }).start();
  }, [scaleAnim]);

  return (
    <Animated.View
      style={[
        styles.item,
        {
          borderRadius: radiusAnim,
          transform: [{ scale: scaleAnim }],
          backgroundColor: isActive ? "#E6F904" : "#182722",
        },
      ]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={styles.pressable}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
});

const Sidebar = ({ activeTab, setActiveTab, onClose }) => {
  const handleTabPress = useCallback(
    (tab) => () => setActiveTab(tab),
    [setActiveTab]
  );

  return (
    <View style={styles.sidebar}>
      <Pressable style={styles.goBack} onPress={onClose}>
        <Entypo name="chevron-thin-left" size={24} color="white" />
      </Pressable>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SidebarItem
          isActive={activeTab === "clock"}
          onPress={handleTabPress("clock")}
        >
          <ThemesIcon isActive={activeTab === "clock"} />
        </SidebarItem>
        <SidebarItem
          isActive={activeTab === "colors"}
          onPress={handleTabPress("colors")}
        >
          <ColorPalleteIcon isActive={activeTab === "colors"} />
        </SidebarItem>

        {/* <SidebarItem
          isActive={activeTab === "colors"}
          onPress={handleTabPress("colors")}
        >
          <Ionicons
            name="color-palette-outline"
            size={24}
            color={activeTab === "colors" ? "black" : "white"}
          />
        </SidebarItem> */}

        <SidebarItem
          isActive={activeTab === "reminders"}
          onPress={handleTabPress("reminders")}
        >
          <ReminderIcon isActive={activeTab === "reminders"} />
        </SidebarItem>

        <SidebarItem
          isActive={activeTab === "general"}
          onPress={handleTabPress("general")}
        >
          <SettingsAnimatedIcon isActive={activeTab === "general"} />
        </SidebarItem>
        <SidebarItem
          isActive={activeTab === "rateUs"}
          onPress={handleTabPress("rateUs")}
        >
          <HeartIcon isActive={activeTab === "rateUs"} />
        </SidebarItem>

        {/* <SidebarItem
          isActive={activeTab === "rateUs"}
          onPress={handleTabPress("rateUs")}
        >
          <AntDesign
            name="hearto"
            size={24}
            color={activeTab === "rateUs" ? "black" : "white"}
          />
        </SidebarItem> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 60,
    paddingTop: 40,
  },
  goBack: {
    alignItems: "center",
    marginBottom: 23,
  },
  item: {
    height: 60,
    marginBottom: 13,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  pressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default memo(Sidebar);
