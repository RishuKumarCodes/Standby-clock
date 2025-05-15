// components/SoundSelector.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Modal,
  Pressable,
  StyleSheet,
  SafeAreaView,
  FlatList,
  useWindowDimensions,
  Animated,
  Easing,
  PanResponder,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { H1Light, H1Txt, MdTxt } from "../CustomText";

const ANIMATION_DURATION = 250;
const SHEET_HEIGHT = 300; // Max sheet height (for slide calculations)
const DRAG_CLOSE_THRESHOLD = SHEET_HEIGHT * 0.25; // drag 25% to close

const SoundSelector = ({
  soundOptions,
  soundName,
  setsoundName,
  handlePlaySound,
  visible = true,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const { width } = useWindowDimensions();

  const selectedLabel =
    soundOptions.find((o) => o.value === soundName)?.label || "Select Sound";

  /** Animate modal in */
  const openModal = () => {
    setModalVisible(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  /** Animate modal out, then unmount */
  const closeModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: SHEET_HEIGHT,
        duration: ANIMATION_DURATION,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
    });
  };

  /** Sync modalVisible when `visible` prop flips */
  // useEffect(() => {
  //   if (visible) {
  //     openModal();
  //   } else if (modalVisible) {
  //     closeModal();
  //   }
  // }, [visible]);

  /** PanResponder for drag-to-close */
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dy }) => dy > 5,
      onPanResponderMove: (_, { dy }) => {
        if (dy > 0) {
          slideAnim.setValue(dy);
          fadeAnim.setValue(1 - dy / SHEET_HEIGHT);
        }
      },
      onPanResponderRelease: (_, { dy }) => {
        if (dy > DRAG_CLOSE_THRESHOLD) {
          closeModal();
        } else {
          // bounce back
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: ANIMATION_DURATION,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: ANIMATION_DURATION,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  // If the parent hides the component entirely
  if (!visible && !modalVisible) return null;

  // Trigger button
  const Trigger = () => (
    <View style={styles.container}>
      <MdTxt style={styles.label}>Notification Sound</MdTxt>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={openModal}
      >
        <MdTxt style={styles.buttonText}>{selectedLabel}</MdTxt>
        <MaterialIcons name="unfold-more" size={20} color="#fff" />
      </Pressable>
    </View>
  );

  return (
    <>
      <Trigger />

      <Modal
        visible={modalVisible}
        transparent
        statusBarTranslucent
        onRequestClose={closeModal}
      >
        {/* Fade-in backdrop catches taps */}
        <Pressable style={styles.backdrop} onPress={closeModal}>
          <Animated.View
            style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}
          />
        </Pressable>

        {/* Sliding sheet with panResponder */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.sheet,
            { width: Math.min(width, 500) },
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <SafeAreaView>
            <View style={styles.pullBar} />
            <H1Txt style={styles.title}>Choose Sound</H1Txt>

            <FlatList
              data={soundOptions}
              keyExtractor={(item) => item.value}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => {
                const isSelected = item.value === soundName;
                return (
                  <View style={styles.optionRow}>
                    <Pressable
                      onPress={() => handlePlaySound(item.asset)}
                      style={({ pressed }) => pressed && styles.optionPressed}
                    >
                      <MdTxt>{item.label}</MdTxt>
                    </Pressable>

                    <Pressable
                      onPress={() => {
                        setsoundName(item.value);
                        closeModal();
                      }}
                      hitSlop={8}
                    >
                      <View
                        style={[
                          styles.radioOuter,
                          isSelected && styles.radioOuterSelected,
                        ]}
                      >
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                    </Pressable>
                  </View>
                );
              }}
            />
          </SafeAreaView>
        </Animated.View>
      </Modal>
    </>
  );
};

export default SoundSelector;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    color: "#fff",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
  },
  buttonPressed: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  buttonText: {
    color: "#fff",
    marginRight: 4,
    fontSize: 14,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    backgroundColor: "#22332d",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: SHEET_HEIGHT,
    paddingVertical: 12,
    paddingHorizontal: 20,
    zIndex: 2,
    // shadow + elevation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  pullBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#555",
    alignSelf: "center",
    marginBottom: 12,
  },
  title: {
    color: "#d1d1d1",
    textAlign: "center",
  },
  list: {
    paddingBottom: 20,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  optionPressed: {
    opacity: 0.5,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#888",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderWidth: 1,
    borderColor: "#E6F904",
  },
  radioInner: {
    width: 14,
    height: 14,
    borderRadius: 6,
    backgroundColor: "#E6F904",
  },
});
