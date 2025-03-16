import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";

const ClockSection = ({ hours12, minuteStr, color }) => (
  <View style={styles.clockSection}>
    <Text style={[styles.bigTime, { color }]}>
      {hours12}:{minuteStr}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  clockSection: {
    alignItems: "center",
    justifyContent: "center",
  },
  bigTime: {
    fontSize: 290,
    fontFamily: "Oswald-Regular",
    letterSpacing: -8,
    textAlign: "center",
    includeFontPadding: false,
    lineHeight: 400,
  },
});

export default memo(ClockSection);
