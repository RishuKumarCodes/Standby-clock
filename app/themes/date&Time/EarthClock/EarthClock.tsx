import React, { useMemo } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { Video } from "expo-av";
import { useFonts } from "expo-font";
import BatteryIndicator from "./BatteryIndicator";
import { useClockStatus } from "../../../context/ClockStatusContext";
import { ClockVariant, ThemeProps } from "@/app/types/ThemesTypes";

const VARIANT_CONFIG: Record<
  ClockVariant,
  { scaleFactor: number; batteryScaleFactor: number }
> = {
  full: { scaleFactor: 1, batteryScaleFactor: 1 },
  themeCard: { scaleFactor: 0.28, batteryScaleFactor: 0.35 },
  smallPreview: { scaleFactor: 0.1, batteryScaleFactor: 0.2 },
  colorSettings: { scaleFactor: 0.41, batteryScaleFactor: 0.45 },
};

function EarthClock({ color, variant = "full" }: ThemeProps) {
  const { hour, min, date, day, ampm, battery, chargingStatus, month } =
    useClockStatus();

  const pad = (num: number) => (num < 10 ? "0" + num : num);

  const [fontsLoaded] = useFonts({
    Wallpoet: require("../../../../assets/fonts/Wallpoet-Regular.ttf"),
  });

  const { scaleFactor, batteryScaleFactor } = useMemo(
    () => VARIANT_CONFIG[variant],
    [variant]
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {variant != "full" ? (
          <Image
            source={require("../../../../assets/images/EarthRotationThumbnail.png")}
            style={styles.image}
          />
        ) : (
          <Video
            source={require("../../../../assets/video/EarthRotation.mp4")}
            style={styles.video}
            isLooping
            resizeMode="cover"
            shouldPlay
            isMuted
          />
        )}
      </View>
      <View style={styles.day}>
        <Text style={[styles.dateText, { color, fontSize: 55 * scaleFactor }]}>
          {day}
        </Text>
      </View>
      <View style={styles.time}>
        <Text
          style={[
            styles.timeText,
            { color: "#fff", fontSize: 100 * scaleFactor },
          ]}
        >
          {pad(hour)}
        </Text>
        <Text
          style={[
            styles.timeText,
            { color: "#fff", fontSize: 100 * scaleFactor },
          ]}
        >
          {pad(min)}
        </Text>
      </View>
      <Text
        style={[styles.ampmText, { color: "#aaa", fontSize: 30 * scaleFactor }]}
      >
        {ampm}
      </Text>
      <View style={styles.date}>
        <Text style={[styles.monthtxt, { color, fontSize: 40 * scaleFactor }]}>
          {month}
        </Text>
        <Text
          style={[
            styles.datetxt,
            { color: "#fff", fontSize: 88 * scaleFactor },
          ]}
        >
          {pad(date)}
        </Text>
      </View>
      <View style={styles.battery}>
        <View>
          <BatteryIndicator
            batteryLevel={battery}
            charging={chargingStatus}
            color={color}
            scale={batteryScaleFactor}
          />
          <Text
            style={[
              styles.batteryPercentage,
              { color, fontSize: 20 * scaleFactor },
            ]}
          >
            {battery}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default React.memo(EarthClock);

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    flexDirection: "row",
  },
  leftContainer: {
    width: "85%",
    overflow: "hidden",
    position: "relative",
  },
  day: {
    position: "absolute",
    right: 8,
    top: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  time: {
    top: "25%",
    position: "absolute",
    right: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  date: {
    position: "absolute",
    bottom: 8,
    left: 8,
  },
  battery: {
    position: "absolute",
    bottom: "2%",
    right: "2%",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  dateText: {
    fontFamily: "Wallpoet",
  },
  timeText: {
    fontFamily: "Wallpoet",
  },
  ampmText: {
    position: "absolute",
    top: "47%",
    right: "23%",
    fontFamily: "Wallpoet",
    marginLeft: 5,
  },
  monthtxt: {
    fontFamily: "Wallpoet",
  },
  datetxt: {
    fontFamily: "Wallpoet",
  },
  batteryPercentage: {
    position: "absolute",
    bottom: "20%",
    right: 4,
    fontFamily: "Wallpoet",
  },
  image: {
    width: "95%",
    height: "100%",
  },
  video: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: -15,
    width: "100%",
  },
});
