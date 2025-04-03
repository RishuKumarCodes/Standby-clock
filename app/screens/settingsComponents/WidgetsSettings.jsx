import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import React from "react";
import { H1Txt } from "@/app/components/CustomText";
import { ScrollView } from "react-native-gesture-handler";

const WidgetsSettings = () => {
  return (
    <ScrollView>
      <View style={styles.container}>
        <H1Txt>Customize Widgets</H1Txt>
      </View>
    </ScrollView>
  );
};

export default WidgetsSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 36,
  },
});
