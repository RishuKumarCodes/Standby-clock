import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsPopup({
  isVisible,
  closeModal,
  taskbarVisible,
  calendarVisible,
  shortcutsVisible,
  setTaskbarVisible,
  setCalendarVisible,
  setShortcutsVisible,
}) {
  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Modal Header styled like a Windows title bar */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderTitle}>Settings</Text>
            <View style={styles.modalHeaderButtons}>
              <TouchableOpacity style={styles.modalButtonDisabled} disabled>
                <Ionicons name="remove-outline" size={20} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Ionicons name="close" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
          {/* Windows-like path just below the header */}
          <View style={styles.modalPathContainer}>
            <Text style={styles.modalPathText}>
              <Text style={styles.dimmedText}>Settings</Text> &gt;
              Personalisation
            </Text>
          </View>
          {/* Modal body with overflow scroll */}
          <ScrollView style={styles.modalBody}>
            <View style={styles.switchRow}>
              <Text>Always show taskbar</Text>
              <Switch
                value={taskbarVisible}
                onValueChange={(val) => setTaskbarVisible(val)}
              />
            </View>
            <View style={styles.switchRow}>
              <Text>Show Calendar on desktop</Text>
              <Switch
                value={calendarVisible}
                onValueChange={(val) => setCalendarVisible(val)}
              />
            </View>
            <View style={styles.switchRow}>
              <Text>Show desktop shotcuts</Text>
              <Switch
                value={shortcutsVisible}
                onValueChange={(val) => setShortcutsVisible(val)}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 9, 37, 0.62)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "50%",
    backgroundColor: "#c3cfdb",
    opacity: 0.93,
    borderRadius: 8,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  modalHeaderTitle: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
  modalHeaderButtons: {
    flexDirection: "row",
  },
  modalButton: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  modalButtonDisabled: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    opacity: 0.5,
  },
  modalPathContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  modalPathText: {
    fontSize: 18,
    color: "#000",
  },
  dimmedText: {
    color: "gray",
  },
  modalBody: {
    padding: 20,
  },
  switchRow: {
    height:46,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 2,
    borderRadius: 4,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
  },
});
