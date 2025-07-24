// components/commmon/LocationSettings.tsx
import React from "react";
import {
  ScrollView,
  View,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from "react-native";
import { MdTxt, H1Light } from "@/app/components/ui/CustomText";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface LocationSettingsProps {
  showLocation: boolean;
  autoLocation: boolean;
  customLocation: string;
  onToggleShow: (value: boolean) => void;
  onToggleAuto: (value: boolean) => void;
  onSetCustom: () => void;
}

const LocationSettings: React.FC<LocationSettingsProps> = ({
  showLocation,
  autoLocation,
  customLocation,
  onToggleShow,
  onToggleAuto,
  onSetCustom,
}) => (
  <ScrollView style={styles.container}>
    <H1Light style={styles.title}>Location Settings</H1Light>

    <View style={styles.item}>
      <MdTxt style={styles.label}>Show Location</MdTxt>
      <Switch
        value={showLocation}
        onValueChange={onToggleShow}
        trackColor={{ false: "#767577", true: "#E6F904" }}
        thumbColor={showLocation ? "#000" : "#f4f3f4"}
      />
    </View>

    <View style={styles.item}>
      <MdTxt style={styles.label}>Auto-detect Location</MdTxt>
      <Switch
        value={autoLocation}
        onValueChange={onToggleAuto}
        trackColor={{ false: "#767577", true: "#E6F904" }}
        thumbColor={autoLocation ? "#000" : "#f4f3f4"}
      />
    </View>

    <View style={styles.item}>
      <MdTxt style={styles.label}>Custom Location</MdTxt>
      <MdTxt style={styles.value}>{customLocation}</MdTxt>
    </View>

    <TouchableOpacity style={styles.button} onPress={onSetCustom}>
      <MaterialIcons name="location-on" size={20} color="black" />
      <MdTxt style={styles.buttonText}>Set Custom Location</MdTxt>
    </TouchableOpacity>
  </ScrollView>
);

export default LocationSettings;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, marginBottom: 20, color: "white" },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  label: { fontSize: 14, color: "#ccc", flex: 1 },
  value: { fontSize: 14, color: "#999" },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F904",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
    gap: 8,
  },
  buttonText: { color: "black", fontSize: 14, fontWeight: "600" },
});
