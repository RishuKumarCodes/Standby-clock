import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import React from "react";
import { H1Txt } from "@/app/components/CustomText";

const WidgetsSettings = () => {
  return (
    <View style={styles.container}>
      <H1Txt>Customize Widgets</H1Txt>
    </View>
  );
};

export default WidgetsSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 36,
  },
});
