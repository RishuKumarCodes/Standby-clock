import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Platform } from "react-native";
import * as Font from "expo-font";

export default function FontLoader({ children }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      "Poppins-ExtraLight": require("../../../assets/fonts/Poppins-ExtraLight.ttf"),
      "Poppins-Regular": require("../../../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-SemiBold": require("../../../assets/fonts/Poppins-SemiBold.ttf"),
    })
      .then(() => setLoaded(true))
      .catch((err) => console.error("Font load error:", err));
  }, []);

  if (!loaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return children;
}
