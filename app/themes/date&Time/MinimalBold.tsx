import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useClockStatus } from "../../context/ClockStatusContext";
import BatteryCharging from "../../components/commmon/CircleChargingProgressBar";
import { ClockVariant, ThemeProps } from "../../types/ThemesTypes";
const pad = (num: number) => (num < 10 ? "0" + num : String(num));

const VARIANT_CONFIG: Record<
  ClockVariant,
  { widthFactor: number; fontFactor: number }
> = {
  full: { widthFactor: 1, fontFactor: 0.23 },
  themeCard: { widthFactor: 0.36, fontFactor: 0.2 },
  smallPreview: { widthFactor: 0.16, fontFactor: 0.18 },
  colorSettings: { widthFactor: 0.45, fontFactor: 0.2 },
};

export default function MinimalBold({ color, variant = "full" }: ThemeProps) {
  const { hour, min } = useClockStatus();

  const { widthFactor, fontFactor } = VARIANT_CONFIG[variant];
  const fullWidth = Dimensions.get("window").width;
  const baseWidth = fullWidth * widthFactor;
  const fontSize = baseWidth * fontFactor;

  return (
    <View style={styles.container}>
      <Text style={[styles.timeText, { color, fontSize }]}>
        {pad(hour)}:{pad(min)}
      </Text>
      <BatteryCharging />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    fontWeight: "bold",
    textAlign: "center",
  },
});
