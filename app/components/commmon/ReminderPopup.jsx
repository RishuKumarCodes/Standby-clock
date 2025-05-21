import React, { useEffect } from "react";
import { Modal, View, StyleSheet, TouchableOpacity } from "react-native";
import { H1Light, H1Txt } from "../ui/CustomText";
import Svg, { Path } from "react-native-svg";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { Audio } from "expo-av";

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
            <Svg width={27} height={27} viewBox="0 0 32 32" fill="none">
              <Path
                d="M7.722 20.788A3 3 0 0 0 7 22.74V29H5a1 1 0 0 0 0 2h22a1 1 0 0 0 0-2h-2v-6.26a3 3 0 0 0-.722-1.952l-3.546-4.137a1 1 0 0 1 0-1.3l3.546-4.137A3 3 0 0 0 25 9.26V3h2a1 1 0 0 0 0-2H5a1 1 0 0 0 0 2h2v6.26a3 3 0 0 0 .722 1.952l3.546 4.137a1 1 0 0 1 0 1.3Zm5.065-6.741L9.241 9.911A1 1 0 0 1 9 9.26V3h14v6.26a1 1 0 0 1-.241.651l-3.546 4.136a2.986 2.986 0 0 0 0 3.905l3.546 4.137a1 1 0 0 1 .241.651V29H9v-6.26a1 1 0 0 1 .241-.651l3.546-4.137a2.986 2.986 0 0 0 0-3.905Z"
                fill="#000"
              />
              <Path
                d="M11 26a1 1 0 0 0 1 1h8a1 1 0 0 0 0-2h-8a1 1 0 0 0-1 1Z"
                fill="#000"
              />
            </Svg>
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
              <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M19.35352,6.64648a.49983.49983,0,0,1,0,.707l-10,10a.49984.49984,0,0,1-.707,0l-4-4a.5.5,0,0,1,.707-.707L9,16.293l9.64648-9.64649A.49983.49983,0,0,1,19.35352,6.64648Z"
                  fill="#000"
                />
              </Svg>
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
