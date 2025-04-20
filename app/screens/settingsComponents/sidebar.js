import React from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { Svg, Path } from "react-native-svg";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";

const Sidebar = ({ activeTab, setActiveTab, onClose }) => {
  const GeneralSettings = ({ color }) => (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path d="M14,6.51561739 C14,8.44860743 15.5670044,10.0156098 17.5,10.0156098 C19.4329966,10.0156098 21,8.4486064 21,6.51560977 C21,4.57131311 19.4364842,3.00779729 17.5077897,3.00779729 C15.5663361,3.01157885 14,4.58097424 14,6.51561739 Z M14.6835733,3.00199839 L6.50096799,3.00780395 C4.56633274,3.01157885 3,4.58097083 3,6.51560977 C3,8.4486064 4.56700338,10.0156098 6.5,10.0156098 L14.6713321,10.0156098 C13.6518334,9.19063303 13,7.92924628 13,6.51561739 C13,5.09538686 13.6568582,3.82832653 14.6835733,3.00199839 Z M17.5937693,2.00877801 C20.0395941,2.05902366 22,4.05057698 22,6.50000762 C22,9.00089115 19.9852814,11.0156098 17.5,11.0156098 L6.5,11.0156098 C4.01471863,11.0156098 2,9.00089115 2,6.51560977 C2,4.02944793 4.01285966,2.0126569 6.49963762,2.00780503 L17.4996452,2.00000013 C17.531818,1.9999773 17.5632832,2.00299364 17.5937693,2.00877801 L17.5937693,2.00877801 Z M6.40623066,13.008778 C6.43671678,13.0029936 6.46818199,12.9999773 6.50035477,13.0000001 L17.5003624,13.007805 C19.9871403,13.0126569 22,15.0294479 22,17.5156098 C22,20.0008911 19.9852814,22.0156098 17.5,22.0156098 L6.5,22.0156098 C4.01471863,22.0156098 2,20.0008911 2,17.5000076 C2,15.050577 3.96040588,13.0590237 6.40623066,13.008778 L6.40623066,13.008778 Z M10,17.5156174 C10,15.5809742 8.43366386,14.0115788 6.49221033,14.0077973 C4.56351582,14.0077973 3,15.5713131 3,17.5156098 C3,19.4486064 4.56700338,21.0156098 6.5,21.0156098 C8.43299559,21.0156098 10,19.4486074 10,17.5156174 Z M9.31642674,14.0019984 C10.3431418,14.8283265 11,16.0953869 11,17.5156174 C11,18.9292463 10.3481666,20.190633 9.32866789,21.0156098 L17.5,21.0156098 C19.4329966,21.0156098 21,19.4486064 21,17.5156098 C21,15.5809708 19.4336673,14.0115789 17.499032,14.007804 L9.31642674,14.0019984 Z" />
    </Svg>
  );

  const ReminderIcon = ({ color }) => (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 122.88 118.68"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path d="M73.23,104.88a17,17,0,0,1-2,5.34,17.28,17.28,0,0,1-3.79,4.48,16.76,16.76,0,0,1-5.11,3,17.25,17.25,0,0,1-5.86,1,17.47,17.47,0,0,1-5.87-1,16.47,16.47,0,0,1-5.09-3,17.06,17.06,0,0,1-3.79-4.48,16.78,16.78,0,0,1-2-5.52,1.8,1.8,0,0,1,1.46-2.09l.32,0H71.5a1.8,1.8,0,0,1,1.81,1.81,2.64,2.64,0,0,1-.08.49ZM104.36,15A30.08,30.08,0,1,1,62.72,42.78a30.55,30.55,0,0,1,18.72-28,29.79,29.79,0,0,1,11.37-2.05A31.24,31.24,0,0,1,104.31,15l0,0ZM87.68,42.24a5.54,5.54,0,0,1,.71-.65l.37-.26V29.89a3.18,3.18,0,0,1,5.44-2.25,3.17,3.17,0,0,1,.94,2.25V41.33a6,6,0,0,1,.92.75,5.91,5.91,0,0,1,.74.9h7.8a3.18,3.18,0,0,1,2.25.93l.06.06a3.2,3.2,0,0,1,.87,2.2,3.19,3.19,0,0,1-3.18,3.18H96.79A5.77,5.77,0,0,1,91.94,52a5.81,5.81,0,0,1-4.26-9.73Zm21.89-15.76a23.89,23.89,0,0,0-21.09-6.73A23.35,23.35,0,0,0,75.9,26.21a23,23,0,0,0-4.6,6.59,23.7,23.7,0,0,0,38.27,26.73,23.56,23.56,0,0,0,6.94-16.76,23.83,23.83,0,0,0-.6-5.32,23.54,23.54,0,0,0-1.77-5v0a17.19,17.19,0,0,0-2-3.09,34.8,34.8,0,0,0-2.57-2.81ZM66.05,6.64A36.29,36.29,0,0,1,70.33,8c.89.35,1.76.74,2.62,1.15a38.09,38.09,0,0,0-5.5,4.09A31.45,31.45,0,0,0,63.15,12a3,3,0,0,1-2.56-2.58,4.23,4.23,0,0,0-1.12-2.73,4.3,4.3,0,0,0-2.81-.8,4.14,4.14,0,0,0-2.79.75,4.33,4.33,0,0,0-1.09,2.76h0A3,3,0,0,1,50.37,12,32.09,32.09,0,0,0,45,13.5a31.19,31.19,0,0,0-5,2.41,32.19,32.19,0,0,0-4.45,3.2A32.84,32.84,0,0,0,31.76,23h0a34,34,0,0,0-3.12,4.5,36.21,36.21,0,0,0-2.38,5,30,30,0,0,0-1.51,5.36,31.67,31.67,0,0,0-.49,5.7V57.65a57,57,0,0,1-.4,6.84,49.83,49.83,0,0,1-1.22,6.38l0,.14a38.69,38.69,0,0,1-2.3,6.32A41.65,41.65,0,0,1,17,83.17l-.12.18a36.12,36.12,0,0,1-5.16,5.83l-.08.07h89.83a36.76,36.76,0,0,1-5.15-5.78h0c-.39-.56-.76-1.11-1.11-1.68a38.47,38.47,0,0,0,6.58-.9,31.2,31.2,0,0,0,3.72,4,50.63,50.63,0,0,0,6.24,4.85,3,3,0,0,1-1.66,5.43H3a3,3,0,0,1-1.53-5.52,52.83,52.83,0,0,0,6.19-4.84A30,30,0,0,0,11.94,80a.76.76,0,0,1,.11-.14,36,36,0,0,0,2.86-5,30.06,30.06,0,0,0,1.93-5.33l0-.11a43.26,43.26,0,0,0,1.05-5.61,50.68,50.68,0,0,0,.37-6.12V43.57a37.49,37.49,0,0,1,.61-6.75,36.4,36.4,0,0,1,1.78-6.42,39.69,39.69,0,0,1,2.81-5.88,37.12,37.12,0,0,1,3.7-5.31l0,0h0a38.5,38.5,0,0,1,4.53-4.59A40.25,40.25,0,0,1,37,10.82,39.25,39.25,0,0,1,42.92,8,38.32,38.32,0,0,1,47.3,6.59a9,9,0,0,1,2.64-4.34A9.66,9.66,0,0,1,56.71,0a9.76,9.76,0,0,1,6.71,2.32,9,9,0,0,1,2.63,4.32Z" />
    </Svg>
  );

  return (
    <View style={styles.sidebar}>
      <TouchableOpacity style={styles.GoBackBtn} onPress={onClose}>
        <Entypo name="chevron-thin-left" size={24} color="white" />
      </TouchableOpacity>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={[
            styles.sidebarItem,
            activeTab === "clock" && styles.sidebarItemActive,
          ]}
          onPress={() => setActiveTab("clock")}
        >
          <MaterialCommunityIcons
            name="clock-time-four-outline"
            size={24}
            color={activeTab === "clock" ? "black" : "white"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sidebarItem,
            activeTab === "colors" && styles.sidebarItemActive,
          ]}
          onPress={() => setActiveTab("colors")}
        >
          <Ionicons
            name="color-palette-outline"
            size={24}
            color={activeTab === "colors" ? "black" : "white"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sidebarItem,
            activeTab === "reminders" && styles.sidebarItemActive,
          ]}
          onPress={() => setActiveTab("reminders")}
        >
          <View style={styles.iconContainer}>
            <ReminderIcon
              color={activeTab === "reminders" ? "black" : "white"}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sidebarItem,
            activeTab === "general" && styles.sidebarItemActive,
          ]}
          onPress={() => setActiveTab("general")}
        >
          <View style={styles.iconContainer}>
            <GeneralSettings
              color={activeTab === "general" ? "black" : "white"}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sidebarItem,
            activeTab === "rateUs" && styles.sidebarItemActive,
          ]}
          onPress={() => setActiveTab("rateUs")}
        >
          <AntDesign
            name="hearto"
            size={24}
            color={activeTab === "rateUs" ? "black" : "white"}
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = {
  sidebar: {
    width: 60,
    paddingTop: 40,
  },
  GoBackBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 23,
  },
  sidebarItem: {
    height: 60,
    backgroundColor: "#182722",
    borderRadius: 50,
    marginBottom: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  sidebarItemActive: { backgroundColor: "#E6F904" },
  iconContainer: { justifyContent: "center", alignItems: "center" },
};

export default Sidebar;
