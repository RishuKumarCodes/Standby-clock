import {
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Alert,
} from "react-native";

import React, { useState } from "react";
import {
  Timer,
  updateTimers,
} from "@/app/storage/themesStorage/todos/DailyHabitTimer";
import uuid from "react-native-uuid";
import { MdTxt } from "@/app/components/ui/CustomText";
import TimePickerWheel from "@/app/components/reminderSettings/TimePickerWheel";

const AddTimerModal = ({
  modalVisible,
  setModalVisible,
  timers,
  setTimers,
  pagerRef,
}) => {
  const [newName, setNewName] = useState("");
  
  // Initialize with default values for timer mode
  const [intervalHr, setIntervalHr] = useState(0);
  const [intervalMin, setIntervalMin] = useState(0);

  const addTimer = () => {
    if (!newName.trim()) {
      Alert.alert(
        "Invalid Input",
        "Please enter a timer name."
      );
      return;
    }

    // Convert hours and minutes to total seconds
    const totalSeconds = (intervalHr * 3600) + (intervalMin * 60);
    
    if (totalSeconds <= 0) {
      Alert.alert(
        "Invalid Duration",
        "Please set a duration greater than 0."
      );
      return;
    }

    const newTimer: Timer = {
      id: String(uuid.v4()),
      name: newName.trim(),
      duration: totalSeconds, // Save in seconds
    };
    
    const updatedTimers = [...timers, newTimer];

    updateTimers(updatedTimers);
    setTimers(updatedTimers);
    setNewName("");
    setIntervalHr(0);
    setIntervalMin(30);
    setModalVisible(false);

    setTimeout(() => {
      pagerRef.current?.scrollToIndex({ index: updatedTimers.length - 1 });
    }, 100);
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackground} />
        </TouchableWithoutFeedback>
        
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <MdTxt style={styles.modalTitle}>New Timer</MdTxt>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelBtn}
              >
                <MdTxt>Cancel</MdTxt>
              </TouchableOpacity>
              <TouchableOpacity onPress={addTimer} style={styles.saveBtn}>
                <MdTxt
                  style={{
                    color: "#000",
                  }}
                >
                  Add
                </MdTxt>
              </TouchableOpacity>
            </View>
          </View>
          
          <TextInput
            placeholderTextColor="#888"
            placeholder="Enter name"
            value={newName}
            onChangeText={setNewName}
            style={[styles.input, { fontSize: 18, fontWeight: "600" }]}
          />
          
          <View style={styles.timeRow}>
            <MdTxt style={styles.label}>Set timer duration:</MdTxt>
            <TimePickerWheel
              mode="timer"
              defaultHours={intervalHr}
              defaultMinutes={intervalMin}
              onChange={({ hours, minutes }) => {
                setIntervalHr(hours);
                setIntervalMin(minutes);
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddTimerModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.72)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalContent: {
    width: 500,
    backgroundColor: "#1b2b26",
    borderRadius: 25,
    padding: 18,
    paddingHorizontal: 20,
    gap: 10,
  },
  modalTitle: { fontSize: 22 },
  input: {
    borderBottomWidth: 1,
    borderColor: "#555",
    marginVertical: 8,
    paddingHorizontal: 8,
    color: "#fff", // Add text color for visibility
    paddingVertical: 10,
  },
  timeRow: {
    backgroundColor: "#061713",
    padding: 10,
    paddingBottom: 0,
    borderRadius: 20,
    overflow: "hidden",
    alignItems: "center",
    minHeight: 150, // Ensure adequate height for the wheel
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
  },
  label: { 
    color: "#aaa", 
    fontSize: 14,
    marginBottom: 10,
  },
  saveBtn: {
    padding: 7,
    paddingBottom: 5,
    paddingHorizontal: 20,
    backgroundColor: "#E6F904",
    borderRadius: 30,
    minWidth: 80,
    alignItems: "center",
  },
  cancelBtn: {
    padding: 7,
    paddingBottom: 5,
    paddingHorizontal: 20,
    backgroundColor: "#0c4532",
    borderRadius: 30,
    minWidth: 80,
    alignItems: "center",
  },
});