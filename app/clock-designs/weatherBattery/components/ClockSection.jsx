import React, { memo } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const ClockSection = ({ hours12, minuteStr, color, sizePercentage = 0.42 , previewMode}) => {
  // Compute font size as a percentage of the screen width.
  const computedFontSize = width * sizePercentage;

  // Increase lineHeight slightly to prevent text cropping
  const computedLineHeight = computedFontSize * 1.26;

  return (
    <View style={styles.clockSection}>
      <Text
        style={[
          styles.bigTime,
          {
            color,
            fontSize: previewMode ? computedFontSize : computedFontSize * 0.6,
            lineHeight: previewMode ? computedLineHeight : computedLineHeight * 0.6,
          },
        ]}
      >
        {hours12}:{minuteStr}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  clockSection: {
    alignItems: "center",
    justifyContent: "center",
  },
  bigTime: {
    fontFamily: "Oswald-Regular",
    // backgroundColor: "gray",
    letterSpacing: -8,
    textAlign: "center",
    includeFontPadding: false,
  },
});

export default memo(ClockSection);
