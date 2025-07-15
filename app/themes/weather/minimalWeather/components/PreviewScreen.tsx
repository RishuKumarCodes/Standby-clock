import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { H1Txt, MdTxt } from "@/app/components/ui/CustomText";
import { ClockVariant, ThemeProps } from "@/app/types/ThemesTypes";

const VARIANT_CONFIG: Record<
  ClockVariant,
  { Size: number; SmTxt: number; scaleFactor: number }
> = {
  full: { Size: 1, SmTxt: 1, scaleFactor: 1 },
  themeCard: { Size: 32, SmTxt: 8, scaleFactor: 0.73 },
  smallPreview: { Size: 15, SmTxt: 4, scaleFactor: 0.7 },
  colorSettings: { Size: 40, SmTxt: 11, scaleFactor: 0.75 },
};

const PreviewScreen = ({ color, variant = "full" }: ThemeProps) => {
  const { Size, SmTxt } = VARIANT_CONFIG[variant];

  return (
    <View style={styles.previewContainer}>
      <View style={styles.firstRow}>
        <MdTxt style={{ fontSize: SmTxt }}>California, USA</MdTxt>
        <MdTxt style={{ fontSize: SmTxt, color }}>Tue, 10: 14</MdTxt>
      </View>
      <View style={styles.secRow}>
        <MdTxt style={[styles.temp, { color, fontSize: Size }]}>🌤️ 20°C</MdTxt>
        <MdTxt style={[styles.desc, { opacity: 0.7, fontSize: SmTxt }]}>
          Partly Cloudy
        </MdTxt>
      </View>
      <View style={styles.thirdRow}>
        <View style={styles.RowCard}>
          <MdTxt style={[styles.label, { fontSize: SmTxt * 0.7 }]}>
            Air quality
          </MdTxt>
          <MdTxt style={{ fontSize: SmTxt }}>30</MdTxt>
        </View>
        <View style={styles.RowCard}>
          <MdTxt style={[styles.label, { fontSize: SmTxt * 0.7 }]}>
            Humidity
          </MdTxt>
          <MdTxt style={{ fontSize: SmTxt }}>87%</MdTxt>
        </View>
        <View style={styles.RowCard}>
          <MdTxt style={[styles.label, { fontSize: SmTxt * 0.7 }]}>Wind</MdTxt>
          <MdTxt style={{ fontSize: SmTxt }}>6.1 km/h</MdTxt>
        </View>
        <View style={styles.RowCard}>
          <MdTxt style={[styles.label, { fontSize: SmTxt * 0.7 }]}>
            Visibility
          </MdTxt>
          <MdTxt style={{ fontSize: SmTxt }}>24.1 Km</MdTxt>
        </View>
        <View style={styles.RowCard}>
          <MdTxt style={[styles.label, { fontSize: SmTxt * 0.7 }]}>
            Pressure
          </MdTxt>
          <MdTxt style={{ fontSize: SmTxt }}>994 mb</MdTxt>
        </View>
      </View>
    </View>
  );
};

export default PreviewScreen;

const styles = StyleSheet.create({
  previewContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    padding: "4%",
    paddingHorizontal: "6%",
  },
  firstRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  secRow: {
    flexDirection: "row",
    marginBottom: "-8%",
    gap: "3%",
    paddingLeft: "3%",
  },
  temp: {
    marginBottom: 8,
  },
  desc: {
    marginTop: "6%",
    fontWeight: "bold",
    marginBottom: 4,
  },
  thirdRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  RowCard: {
    alignItems: "center",
  },
  label: { color: "#aaa", marginBottom: "-8%" },
});
