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
