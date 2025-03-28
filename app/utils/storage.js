// import AsyncStorage from "@react-native-async-storage/async-storage";

// // Theme
// export const saveTheme = async (theme) => {
//   try {
//     await AsyncStorage.setItem("selectedTheme", theme);
//   } catch (error) {
//     console.error("Error saving theme:", error);
//   }
// };

// export const getSavedTheme = async () => {
//   try {
//     const theme = await AsyncStorage.getItem("selectedTheme");
//     return theme || "MinimalBold";
//   } catch (error) {
//     console.error("Error retrieving theme:", error);
//     return "MinimalBold";
//   }
// };

// // Color Settings
// export const saveColorSettings = async (colorSettings) => {
//   try {
//     const jsonValue = JSON.stringify(colorSettings);
//     await AsyncStorage.setItem("colorSettings", jsonValue);
//   } catch (error) {
//     console.error("Error saving color settings:", error);
//   }
// };

// export const getColorSettings = async () => {
//   try {
//     const jsonValue = await AsyncStorage.getItem("colorSettings");
//     return jsonValue != null
//       ? JSON.parse(jsonValue)
//       : { primaryColor: "#fff", secondaryColor: "#000" };
//   } catch (error) {
//     console.error("Error retrieving color settings:", error);
//     return { primaryColor: "#fff", secondaryColor: "#000" };
//   }
// };

// // General Settings (e.g., grid overlay preferences)
// export const saveGeneralSettings = async (settings) => {
//   try {
//     const jsonValue = JSON.stringify(settings);
//     await AsyncStorage.setItem("generalSettings", jsonValue);
//   } catch (error) {
//     console.error("Error saving general settings:", error);
//   }
// };

// export const getGeneralSettings = async () => {
//   try {
//     const jsonValue = await AsyncStorage.getItem("generalSettings");
//     return jsonValue != null
//       ? JSON.parse(jsonValue)
//       : { gridOverlayEnabled: true, gridOpacity: 0.5 };
//   } catch (error) {
//     console.error("Error retrieving general settings:", error);
//     return { gridOverlayEnabled: true, gridOpacity: 0.5 };
//   }
// };

























// // utils/Storage.js
// import AsyncStorage from "@react-native-async-storage/async-storage";

// /* ---------- Clock Settings ---------- */

// // Save and retrieve the clock style
// const saveClockStyle = async (clockStyle) => {
//   try {
//     await AsyncStorage.setItem("clockStyle", clockStyle);
//   } catch (error) {
//     console.error("Error saving clock style:", error);
//   }
// };

// const getClockStyle = async () => {
//   try {
//     const style = await AsyncStorage.getItem("clockStyle");
//     return style !== null ? style : "defaultClockStyle"; // default value
//   } catch (error) {
//     console.error("Error retrieving clock style:", error);
//     return "defaultClockStyle";
//   }
// };

// // Save and retrieve the user color
// const saveUserColor = async (userColor) => {
//   try {
//     await AsyncStorage.setItem("userColor", userColor);
//   } catch (error) {
//     console.error("Error saving user color:", error);
//   }
// };

// const getUserColor = async () => {
//   try {
//     const color = await AsyncStorage.getItem("userColor");
//     return color !== null ? color : "#FFFFFF"; // default value (white)
//   } catch (error) {
//     console.error("Error retrieving user color:", error);
//     return "#FFFFFF";
//   }
// };

// // Save and retrieve the selected theme
// const saveSelectedTheme = async (theme) => {
//   try {
//     await AsyncStorage.setItem("selectedTheme", theme);
//   } catch (error) {
//     console.error("Error saving selected theme:", error);
//   }
// };

// const getSelectedTheme = async () => {
//   try {
//     const theme = await AsyncStorage.getItem("selectedTheme");
//     return theme !== null ? theme : "MinimalBold"; // default value
//   } catch (error) {
//     console.error("Error retrieving selected theme:", error);
//     return "MinimalBold";
//   }
// };

// /* ---------- Grid Settings ---------- */

// // Save and retrieve grid settings as a single object
// const saveGridSettings = async (settings) => {
//   try {
//     const jsonValue = JSON.stringify(settings);
//     await AsyncStorage.setItem("gridSettings", jsonValue);
//   } catch (error) {
//     console.error("Error saving grid settings:", error);
//   }
// };

// const getGridSettings = async () => {
//   try {
//     const jsonValue = await AsyncStorage.getItem("gridSettings");
//     if (jsonValue !== null) {
//       return JSON.parse(jsonValue);
//     } else {
//       // Default grid settings
//       return {
//         gridOverlayEnabled: true,
//         gridOpacity: 1,
//       };
//     }
//   } catch (error) {
//     console.error("Error retrieving grid settings:", error);
//     return {
//       gridOverlayEnabled: true,
//       gridOpacity: 1,
//     };
//   }
// };

// /* ---------- Screen Settings ---------- */

// // Save and retrieve screen settings as a single object
// const saveScreenSettings = async (settings) => {
//   try {
//     const jsonValue = JSON.stringify(settings);
//     await AsyncStorage.setItem("screenSettings", jsonValue);
//   } catch (error) {
//     console.error("Error saving screen settings:", error);
//   }
// };

// const getScreenSettings = async () => {
//   try {
//     const jsonValue = await AsyncStorage.getItem("screenSettings");
//     if (jsonValue !== null) {
//       return JSON.parse(jsonValue);
//     } else {
//       // Default screen settings
//       return {
//         navBarVisible: false,
//         statusBarVisible: false,
//         notificationsEnabled: true,
//         notificationBarVisible: true,
//       };
//     }
//   } catch (error) {
//     console.error("Error retrieving screen settings:", error);
//     return {
//       navBarVisible: false,
//       statusBarVisible: false,
//       notificationsEnabled: true,
//       notificationBarVisible: true,
//     };
//   }
// };

// // Default export as an object containing all helper functions
// export default {
//   saveClockStyle,
//   getClockStyle,
//   saveUserColor,
//   getUserColor,
//   saveSelectedTheme,
//   getSelectedTheme,
//   saveGridSettings,
//   getGridSettings,
//   saveScreenSettings,
//   getScreenSettings,
// };



import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const storage = () => {
  return (
    <View>
      <Text>storage</Text>
    </View>
  )
}

export default storage

const styles = StyleSheet.create({})