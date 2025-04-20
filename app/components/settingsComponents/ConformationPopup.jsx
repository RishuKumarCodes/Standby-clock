import React, { useEffect, useRef } from "react";
import { Modal, View, Pressable, StyleSheet, Animated } from "react-native";
import { MdTxt } from "../CustomText";

const ConformationPopup = ({
  visible,
  message,
  confirmText = "Confirm",
  cancelText,
  onConfirm,
  onCancel,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none">
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <MdTxt>{message}</MdTxt>
          <View style={styles.buttonRow}>
            {cancelText && (
              <Pressable style={styles.cancelButton} onPress={onCancel}>
                <MdTxt>{cancelText}</MdTxt>
              </Pressable>
            )}
            <Pressable style={styles.confirmButton} onPress={onConfirm}>
              <MdTxt style={{ color: "#000" }}>{confirmText}</MdTxt>
            </Pressable>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    zIndex: 50000,
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: 350,
    backgroundColor: "#1b2b26",
    borderRadius: 25,
    padding: 25,
    gap: 20,
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 50,
    backgroundColor: "#0c4532",
    alignItems: "center",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 10,
    marginLeft: 10,
    borderRadius: 50,
    backgroundColor: "#E6F904",
    alignItems: "center",
  },
});

export default ConformationPopup;
