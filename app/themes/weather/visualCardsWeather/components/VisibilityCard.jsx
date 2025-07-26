import { LinearGradient } from "expo-linear-gradient";
import { View, Text, StyleSheet } from "react-native";

const VisibilityCard = ({ data }) => {
  const visibilityValue = data?.current?.visibility || 2;

  const getVisibilityStatus = (visibility) => {
    if (visibility >= 10) return { status: "Excellent", color: "#4CAF50" };
    if (visibility >= 5) return { status: "Good", color: "#8BC34A" };
    if (visibility >= 2) return { status: "Moderate", color: "#FFC107" };
    if (visibility >= 1) return { status: "Poor", color: "#FF9800" };
    return { status: "Very Poor", color: "#F44336" };
  };

  const visibilityInfo = getVisibilityStatus(visibilityValue);

  const generateVisibilityLines = () => {
    const lines = [];
    const maxLines = 6;
    const maxVisibility = 15;
    const normalizedVisibility =
      Math.min(visibilityValue, maxVisibility) / maxVisibility;

    for (let i = 0; i < maxLines; i++) {
      const reverseIndex = maxLines - 1 - i;

      const lineThreshold = (reverseIndex + 1) / maxLines;
      const isActive = normalizedVisibility >= lineThreshold;

      const baseOpacity = isActive ? 1 : 0.2;
      const opacityReduction = reverseIndex * 0.15;
      const finalOpacity = Math.max(baseOpacity - opacityReduction, 0.1);

      const baseWidth = 80;
      const widthReduction = reverseIndex * 10;
      const lineWidth = Math.max(baseWidth - widthReduction, 30);

      lines.push(
        <View
          key={i}
          style={[
            styles.visibilityLine,
            {
              opacity: finalOpacity,
              width: lineWidth,
              backgroundColor: isActive ? "#00FF7F" : "rgba(255,255,255,0.3)",
            },
          ]}
        />
      );
    }
    return lines;
  };

  return (
    <LinearGradient
      colors={["#3f3f3fff", "#033133ff"]}
      style={styles.widget}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.widgetTitle}>Visibility</Text>
      <View style={{ marginVertical: "auto" }}>
        <View style={styles.visibilityContainer}>
          <View style={styles.visibilityLines}>
            {generateVisibilityLines()}
          </View>
          <View>
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              <Text style={styles.visibilityMain}>{visibilityValue}</Text>
              <Text style={styles.visibilityLabel}>km</Text>
            </View>
            <Text style={styles.rangeText}>15</Text>
            <Text style={styles.rangeLabel}>max range</Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: visibilityInfo.color },
            ]}
          />
          <Text style={styles.statusText}>{visibilityInfo.status}</Text>
        </View>
      </View>

      <Text style={styles.widgetSubtext}>
        Improving with a peak visibility distance of 15 km expected at 6:00 am.
      </Text>
    </LinearGradient>
  );
};

export default VisibilityCard;

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
  visibilityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  visibilityLines: {
    flexDirection: "column",
    alignItems: "center",
    height: 70,
    justifyContent: "space-between",
  },
  visibilityLine: {
    height: 3,
    backgroundColor: "#00FF7F",
    borderRadius: 1.5,
    marginBottom: 2,
  },
  visibilityMain: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  visibilityLabel: {
    color: "white",
    fontSize: 11,
    opacity: 0.8,
    marginBottom: 6,
    marginLeft: 2,
  },
  rangeText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  rangeLabel: {
    color: "white",
    fontSize: 11,
    opacity: 0.8,
  },
});
