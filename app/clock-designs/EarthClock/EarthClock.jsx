import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { Video } from "expo-av";
import { useFonts } from "expo-font";
import * as Battery from "expo-battery";
import BatteryIndicator from "./BatteryIndicator.js";

export default function EarthClock({ color, previewMode }) {
  const [fontsLoaded] = useFonts({
    Wallpoet: require("../../../assets/fonts/Wallpoet-Regular.ttf"),
  });

  // State to hold battery percentage and charging status
  const [batteryPercentage, setBatteryPercentage] = useState(100);
  const [batteryCharging, setBatteryCharging] = useState(false);

  // State to hold current date/time
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update the current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Initial fetch for battery level and state
    async function fetchBatteryInfo() {
      try {
        const level = await Battery.getBatteryLevelAsync();
        const batteryState = await Battery.getBatteryStateAsync();
        setBatteryPercentage(Math.floor(level * 100));
        setBatteryCharging(batteryState === 2);
      } catch (error) {
        console.error("Error fetching battery info:", error);
      }
    }

    fetchBatteryInfo();

    // Set up listeners for battery level and state changes
    const levelSubscription = Battery.addBatteryLevelListener(
      ({ batteryLevel }) => {
        setBatteryPercentage(Math.floor(batteryLevel * 100));
      }
    );

    const stateSubscription = Battery.addBatteryStateListener(
      ({ batteryState }) => {
        setBatteryCharging(batteryState === 2);
      }
    );

    // Cleanup listeners on unmount
    return () => {
      clearInterval(timer);
      levelSubscription && levelSubscription.remove();
      stateSubscription && stateSubscription.remove();
    };
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  // Scaling factor for text and BatteryIndicator in preview mode.
  const scaleFactor = previewMode ? 0.35 : 1;
  const batteryScaleFactor = previewMode ? 0.5 : 1;

  // Convert current time to 12-hour format and determine AM/PM
  let hours = currentTime.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {previewMode ? (
          <Image
            source={require("../../../assets/images/EarthRotationThumbnail.png")}
            style={styles.image}
          />
        ) : (
          <Video
            source={require("../../../assets/EarthRotation.mp4")}
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
          {currentTime.toLocaleDateString("en-US", { weekday: "long" })}
        </Text>
      </View>
      <View style={styles.time}>
        <Text
          style={[
            styles.timeText,
            { color: "#fff", fontSize: 100 * scaleFactor },
          ]}
        >
          {hours.toString().padStart(2, "0")}
        </Text>
        <Text
          style={[
            styles.timeText,
            { color: "#fff", fontSize: 100 * scaleFactor },
          ]}
        >
          {currentTime.getMinutes().toString().padStart(2, "0")}
        </Text>
      </View>
      <Text
        style={[styles.ampmText, { color: "#aaa", fontSize: 30 * scaleFactor }]}
      >
        {ampm}
      </Text>
      <View style={styles.date}>
        <Text style={[styles.monthtxt, { color, fontSize: 40 * scaleFactor }]}>
          {currentTime.toLocaleDateString("en-US", { month: "long" })}
        </Text>
        <Text
          style={[
            styles.datetxt,
            { color: "#fff", fontSize: 88 * scaleFactor },
          ]}
        >
          {currentTime.getDate().toString().padStart(2, "0")}
        </Text>
      </View>
      <View style={styles.battery}>
        <View style={{ transform: [{ scale: batteryScaleFactor }] }}>
          <BatteryIndicator
            batteryLevel={batteryPercentage}
            charging={batteryCharging}
            color={color}
          />
        </View>
        <Text
          style={[
            styles.batteryPercentage,
            { color, fontSize: 20 * scaleFactor },
          ]}
        >
          {batteryPercentage}
        </Text>
      </View>
    </View>
  );
}

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
  },
  dateText: {
    fontFamily: "Wallpoet",
  },
  timeText: {
    fontFamily: "Wallpoet",
  },
  ampmText: {
    position:"absolute",
    top:'47%',
    right:"23%",
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
