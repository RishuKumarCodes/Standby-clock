import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BatteryIcon, ChargingIcon } from "./BatteryComponents";

const BatteryInfo = memo(({ batteryPercentage, isCharging }) => (
  <View style={styles.batteryContainer}>
    <BatteryIcon percentage={batteryPercentage} color="#aaa" />
    <Text style={[styles.batteryText, { color: "#aaa" }]}>{batteryPercentage}%</Text>
    {isCharging && <ChargingIcon style={styles.chargingIcon} />}
  </View>
));

const InfoSection = memo(
  ({ dayName, dayNumber, temperature, amPm, batteryPercentage, isCharging, color }) => (
    <View style={styles.infoSection}>
      <View>
        <Text style={styles.dayText}>
          <Text style={{ color }}>{dayName}</Text>
          <Text style={{ color: "#aaa" }}> {dayNumber}</Text>
        </Text>
        <Text style={[styles.tempText, { color: "#aaa" }]}>{temperature}°</Text>
      </View>
      <View>
        <Text style={[styles.amPmText, { color }]}>{amPm}</Text>
        <BatteryInfo batteryPercentage={batteryPercentage} isCharging={isCharging} />
      </View>
    </View>
  ),
  (prevProps, nextProps) =>
    prevProps.dayName === nextProps.dayName &&
    prevProps.dayNumber === nextProps.dayNumber &&
    prevProps.temperature === nextProps.temperature &&
    prevProps.amPm === nextProps.amPm &&
    prevProps.batteryPercentage === nextProps.batteryPercentage &&
    prevProps.isCharging === nextProps.isCharging &&
    prevProps.color === nextProps.color
);

const styles = StyleSheet.create({
  infoSection: {
    paddingRight: 50,
    height: "60%",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  dayText: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
  },
  tempText: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
  },
  amPmText: {
    fontSize: 26,
    fontWeight: "700",
  },
  batteryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  batteryText: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 5,
  },
  chargingIcon: {
    marginLeft: 4,
  },
});

export default InfoSection;
