import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function TimerScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Timer Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 24,
  },
});
