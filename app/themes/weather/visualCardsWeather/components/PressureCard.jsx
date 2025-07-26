import { LinearGradient } from "expo-linear-gradient";
import { View, Text, StyleSheet } from "react-native";

const PressureCard = ({ data }) => {
  const pressureValue = data?.current?.pressure || 1003;

  const minPressure = 980;
  const maxPressure = 1040;
  const fillPercentage = Math.min(
    Math.max(
      ((pressureValue - minPressure) / (maxPressure - minPressure)) * 100,
      0
    ),
    100
  );

  return (
    <LinearGradient
      colors={["#3f1010ff", "#1d0101ff"]}
      style={styles.widget}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.widgetTitle}>Pressure</Text>
      <View style={{ marginVertical: "auto" }}>
        <View style={styles.pressureContainer}>
          <View>
            <View
              style={{ flexDirection: "row", alignItems: "flex-end", gap: 4 }}
            >
              <Text style={styles.pressureMain}>{pressureValue}</Text>
              <Text style={styles.pressureLabel}>mb</Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "flex-end", gap: 4 }}
            >
              <Text style={styles.timeText}>5:13 AM</Text>
              <Text style={styles.timeLabel}>(Now)</Text>
            </View>
          </View>
          <View style={styles.pressurePill}>
            <View
              style={[styles.pressureFill, { height: `${fillPercentage}%` }]}
            />
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: "#FF4500" }]} />
          <Text style={styles.statusText}>Rising</Text>
        </View>
      </View>

      <Text style={styles.widgetSubtext}>
        Rising in the last 3 hours. Expected to fall in the next 3 hours.
      </Text>
    </LinearGradient>
  );
};

export default PressureCard;

const styles = StyleSheet.create({
  widget: {
    overflow: "hidden",
    width: "100%",
    height: "100%",
    borderRadius: 20,
    padding: 20,
  },
  widgetTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 15,
    opacity: 0.9,
  },
  widgetSubtext: {
    color: "white",
    fontSize: 11,
    opacity: 0.7,
    lineHeight: 14,
    marginTop: 30,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  pressureContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginVertical: "auto",
    paddingVertical: 10,
  },
  pressurePill: {
    width: 40,
    height: 70,
    backgroundColor: "rgba(255, 255, 255, 0.23)",
    borderRadius: 50,
    position: "relative",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  pressureFill: {
    width: "100%",
    backgroundColor: "#9370DB",
    borderRadius: 10,
    position: "absolute",
    bottom: 0,
  },
  pressureMain: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  pressureLabel: {
    color: "white",
    fontSize: 11,
    opacity: 0.8,
    marginBottom: 4,
  },
  timeText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  timeLabel: {
    color: "white",
    fontSize: 11,
    opacity: 0.8,
    marginBottom: 4,
  },
});
