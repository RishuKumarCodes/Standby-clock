import { LinearGradient } from "expo-linear-gradient";
import { View, Text, StyleSheet } from "react-native";

const HumidityCard = ({ data }) => (
  <LinearGradient
    colors={["#50340bff", "#2b1900ff"]}
    style={styles.widget}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <Text style={styles.widgetTitle}>Humidity</Text>
    <View style={{ marginVertical: "auto" }}>
      <View style={styles.humidityContainer}>
        <View style={styles.humidityBars}>
          {[...Array(7)].map((_, i) => (
            <View
              key={i}
              style={[styles.humidityBar, { height: i < 6 ? "100%" : "80%" }]}
            />
          ))}
        </View>
        <View>
          <Text style={styles.humidityMain}>
            {data?.current?.humidity || 93}%
          </Text>
          <Text style={styles.humidityLabel}>Relative Humidity</Text>
          <Text style={styles.dewPoint}>{data?.current?.dewPoint || 26}°</Text>
          <Text style={styles.dewPointLabel}>Dew point</Text>
        </View>
      </View>
      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, { backgroundColor: "#FFA500" }]} />
        <Text style={styles.statusText}>Extremely humid</Text>
      </View>
    </View>

    <Text style={styles.widgetSubtext}>Steady at 93%.</Text>
  </LinearGradient>
);
export default HumidityCard;

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
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFA500",
    marginRight: 8,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  humidityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  humidityBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 70,
  },
  humidityBar: {
    width: 6,
    backgroundColor: "#4A90E2",
    marginRight: 5,
    borderRadius: 3,
  },
  humidityMain: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  humidityLabel: {
    color: "white",
    fontSize: 11,
    opacity: 0.8,
  },
  dewPoint: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  dewPointLabel: {
    color: "white",
    fontSize: 11,
    opacity: 0.8,
  },
});
