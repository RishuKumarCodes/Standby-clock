import { StyleSheet, View } from "react-native";
import React from "react";
import { H1Txt, MdTxt } from "@/app/components/ui/CustomText";
import { ClockVariant, ThemeProps } from "@/app/types/ThemesTypes";

const VARIANT_CONFIG: Record<ClockVariant, { scaleFactor: number }> = {
  full: { scaleFactor: 1 },
  themeCard: { scaleFactor: 0.36 },
  smallPreview: { scaleFactor: 0.17 },
  colorSettings: { scaleFactor: 0.49 },
};

const PreviewScreen = ({ color, variant = "full" }: ThemeProps) => {
  const { scaleFactor } = VARIANT_CONFIG[variant];
  return (
    <View style={{ flexDirection: "row", flex: 1 }}>
      <View style={[styles.leftCard]}>
        <H1Txt
          style={{
            fontSize: 44 * scaleFactor,
            color: "#fff",
            marginBottom: -15 * scaleFactor,
          }}
        >
          Focus Sessions
        </H1Txt>
        <H1Txt style={{ fontSize: 28 * scaleFactor, color: "#777" }}>
          Next: Study Maths
        </H1Txt>
      </View>
      <View style={styles.rightCard}>
        <H1Txt style={{ fontSize: 70 * scaleFactor, color }}>25:00</H1Txt>
        <View style={styles.startBtn}>
          <MdTxt style={{ color: "#009c5b", fontSize: 42 * scaleFactor }}>
            start
          </MdTxt>
        </View>
      </View>
    </View>
  );
};

export default PreviewScreen;

const styles = StyleSheet.create({
  leftCard: {
    height: "100%",
    width: "60%",
    padding: "5.5%",
    paddingBottom: "3%",
    justifyContent: "flex-end",
  },
  rightCard: {
    height: "100%",
    padding: "5.5%",
    paddingBottom: "2.5%",
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 0,
  },
  startBtn: {
    backgroundColor: "#002918",
    padding: "3.5%",
    width: "90%",
    alignItems: "center",
    paddingBottom: "1%",
    borderRadius: 40,
  },
});
