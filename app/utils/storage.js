import AsyncStorage from '@react-native-async-storage/async-storage';

// Theme
export const saveTheme = async (theme) => {
  try {
    await AsyncStorage.setItem('selectedTheme', theme);
  } catch (error) {
    console.error("Error saving theme:", error);
  }
};

export const getSavedTheme = async () => {
  try {
    const theme = await AsyncStorage.getItem('selectedTheme');
    return theme || 'ClassicTheme';
  } catch (error) {
    console.error("Error retrieving theme:", error);
    return 'ClassicTheme';
  }
};

// General Settings (e.g., grid overlay preferences)
export const saveGeneralSettings = async (settings) => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem('generalSettings', jsonValue);
  } catch (error) {
    console.error("Error saving general settings:", error);
  }
};

export const getGeneralSettings = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('generalSettings');
    return jsonValue != null ? JSON.parse(jsonValue) : { gridOverlayEnabled: true, gridOpacity: 0.5 };
  } catch (error) {
    console.error("Error retrieving general settings:", error);
    return { gridOverlayEnabled: true, gridOpacity: 0.5 };
  }
};

// Color Settings
export const saveColorSettings = async (colorSettings) => {
  try {
    const jsonValue = JSON.stringify(colorSettings);
    await AsyncStorage.setItem('colorSettings', jsonValue);
  } catch (error) {
    console.error("Error saving color settings:", error);
  }
};

export const getColorSettings = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('colorSettings');
    return jsonValue != null ? JSON.parse(jsonValue) : { primaryColor: "#fff", secondaryColor: "#000" };
  } catch (error) {
    console.error("Error retrieving color settings:", error);
    return { primaryColor: "#fff", secondaryColor: "#000" };
  }
};
