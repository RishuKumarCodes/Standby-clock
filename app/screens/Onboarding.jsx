import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import PagerView from "react-native-pager-view";
import { H1Light, MdTxt } from "../components/ui/CustomText";
import { Image } from "react-native";
import { Video } from "expo-av";

import onboardImage from "../../assets/images/onboardScreenIcon.jpg";
import PageSwitchDemo from "../../assets/video/PageSwitchDemo.mp4";
import OpenSettingsDemo from "../../assets/video/OpenSettingsDemo.mp4";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.95;
const CARD_HEIGHT = height * 0.9;

export default function Onboarding({ visible, onDone }) {
  const [page, setPage] = useState(0);
  const pagerRef = useRef(null);

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1.12)).current;

  useEffect(() => {
    if (visible) {
      setPage(0);
      opacity.setValue(0);
      scale.setValue(1.12);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, opacity, scale]);

  const slides = [
    { title: "Welcome to Focus-Dock!", image: onboardImage },
    {
      title: "Switch Pages",
      body: "Swipe left and right to switch between pages.",
      Video: PageSwitchDemo,
    },
    {
      title: "Open Settings",
      body: "Pinch or long-press on the home screen to open Settings.",
      Video: OpenSettingsDemo,
    },
  ];

  if (!visible) return null;
  const isLast = page === slides.length - 1;

  function closePopup() {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1.12,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => onDone());
  }

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity,
          transform: [{ scale }],
        },
      ]}
    >
      <View style={styles.card}>
        <PagerView
          style={styles.pager}
          initialPage={0}
          ref={pagerRef}
          onPageSelected={(e) => setPage(e.nativeEvent.position)}
        >
          {slides.map((s, i) => (
            <View key={i} style={styles.page}>
              {s.image ? (
                <Image source={s.image} style={styles.leftSide} />
              ) : (
                <Video
                  source={s.Video}
                  style={styles.leftSide}
                  resizeMode="cover"
                  shouldPlay
                  isLooping
                  isMuted
                  useNativeControls={false}
                />
              )}
              <View style={styles.rightSide}>
                <H1Light style={styles.title}>{s.title}</H1Light>
                {s.body && <MdTxt style={styles.body}>{s.body}</MdTxt>}
              </View>
            </View>
          ))}
        </PagerView>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            isLast ? closePopup() : pagerRef.current.setPage(page + 1)
          }
        >
          <MdTxt style={styles.buttonText}>
            {isLast ? "Finish" : "Next →"}
          </MdTxt>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: "#fff",
    borderRadius: 34,
    overflow: "hidden",
  },
  pager: { flex: 1 },
  page: {
    flexDirection: "row",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  leftSide: {
    width: "50%",
    aspectRatio: 1,
    objectFit: "contain",
  },
  rightSide: { width: "50%", flex: 1 },
  title: { textAlign: "center", color: "#000" },
  body: { color: "#777", fontSize: 17, textAlign: "center" },
  button: {
    position: "absolute",
    bottom: 10,
    right: 10,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 100,
    backgroundColor: "#E6F904",
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
  },
  buttonText: { paddingTop: 2, color: "#000", fontSize: 18 },
});
