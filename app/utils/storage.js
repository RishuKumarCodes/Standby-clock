import AsyncStorage from '@react-native-async-storage/async-storage';

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
