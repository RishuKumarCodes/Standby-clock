// components/SoundSelector.jsx
import React, { useState } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { MdTxt } from "../CustomText"; // Adjust the path if needed

const SoundSelector = ({
  soundOptions,
  soundName,
  setsoundName,
  handlePlaySound,
  visible = true,
}) => {
  const [showModal, setShowModal] = useState(false);
  const selectedLabel =
    soundOptions.find((o) => o.value === soundName)?.label || "Select Sound";

  if (!visible) return null;

  return (
    <View style={styles.rowBetween}>
      <MdTxt>Notification sound:</MdTxt>

      <TouchableOpacity
        style={[styles.dropdownButton, { opacity: 0.6 }]}
        onPress={() => setShowModal(true)}
      >
        <MdTxt style={styles.dropdownButtonText}>{selectedLabel}</MdTxt>
        <MaterialIcons name="unfold-more" size={20} color="white" />
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContent}>
          <MdTxt style={styles.modalTitle}>Choose Sound</MdTxt>

          {soundOptions.map((opt) => {
            const selected = opt.value === soundName;

            return (
              <View key={opt.value} style={styles.soundOption}>
                <TouchableOpacity onPress={() => handlePlaySound(opt.asset)}>
                  <MdTxt style={styles.soundLabel}>{opt.label}</MdTxt>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setsoundName(opt.value);
                    setShowModal(false);
                  }}
                >
                  <View
                    style={[
                      styles.indicator,
                      selected && styles.indicatorSelected,
                    ]}
                  >
                    {selected && <View style={styles.indicatorInner} />}
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </Modal>
    </View>
  );
};

export default SoundSelector;

const styles = StyleSheet.create({
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 5,
  },
  dropdownButtonText: { color: "#fff", paddingTop: 4 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#282c34",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "50%",
  },

  modalTitle: { fontSize: 18, color: "#fff", marginBottom: 10 },
  soundOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  soundLabel: { color: "#fff", fontSize: 16 },
  indicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  indicatorSelected: { borderColor: "#4CD964" },
  indicatorInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CD964",
  },
});
