import React, { useEffect } from "react";
import { Modal, View, StyleSheet, TouchableOpacity } from "react-native";
import { H1Light, H1Txt } from "../ui/CustomText";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { Audio } from "expo-av";
import TimerIcon from "../../../assets/icons/TimerIcon.jsx";
import TickIcon from "../../../assets/icons/TickIcon.jsx";

export default function ReminderPopup({
  visible,
  reminder,
  onDismiss,
  onDone,
}) {
  const soundFiles = {
    default: require("@/assets/sounds/default.mp3"),
    chime: require("@/assets/sounds/chime.mp3"),
    alarm: require("@/assets/sounds/alarm.mp3"),
    bell: require("@/assets/sounds/bell.mp3"),
  };

  useEffect(() => {
    let playbackObject;

    const playSound = async () => {
      if (!visible) return;

      const module = soundFiles[reminder.soundName];
      if (!module) {
        console.warn(`No sound found for "${reminder.soundName}"`);
        return;
      }

      try {
        const { sound } = await Audio.Sound.createAsync(module);
        playbackObject = sound;
        await sound.playAsync();
      } catch (e) {
        console.log("Error playing sound", e);
      }
    };

    playSound();

    return () => {
      if (playbackObject) {
        playbackObject.unloadAsync();
      }
    };
  }, [visible, reminder.soundName]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View
          style={[
            styles.popup,
            { backgroundColor: reminder.color || "#4caf50" },
          ]}
        >
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TimerIcon />
            <H1Txt style={styles.title}>{reminder.title}</H1Txt>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.dismissBtn} onPress={onDismiss}>
              <View style={{ marginBottom: 10 }}>
                <EvilIcons name="close" size={44} color="black" />
              </View>
              <H1Light style={styles.buttonText}>Dismiss</H1Light>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.doneBtn]} onPress={onDone}>
              <TickIcon />
              <H1Light style={styles.buttonText}>Done</H1Light>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    zIndex: 400,
    flex: 1,
    backgroundColor: "#00000080",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  popup: {
    borderRadius: 25,
    marginBottom: 20,
    width: 450,
    paddingTop: 25,
    paddingBottom: 7,
    paddingHorizontal: 30,
    elevation: 10,
  },
  title: {
    color: "#000",
    marginBottom: 20,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dismissBtn: {
    flexDirection: "row",
    gap: 2,
    alignItems: "center",
    paddingVertical: 4,
  },
  doneBtn: {
    flexDirection: "row",
    gap: 2,
    alignItems: "center",
    paddingVertical: 4,
    paddingRight: 7,
  },
  buttonText: {
    marginTop: 5,
    color: "#000",
    fontWeight: "600",
  },
});
