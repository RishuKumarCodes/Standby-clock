// AlternatingDimOverlay.js
import React, { useEffect, useState, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import Svg, { Defs, Pattern, Rect } from "react-native-svg";
import { useGridSettings } from "../../context/GridSettingsContext";
import { useScreenSettings } from "../../context/ScreenSettingsContext";

export default function AlternatingDimOverlay() {
  const { gridOverlayEnabled, gridOpacity } = useGridSettings();
  const { activeScreen } = useScreenSettings();
  
  // Only render on the home screen
  if (!gridOverlayEnabled || activeScreen !== "home") return null;

  const [toggle, setToggle] = useState(true);
  const fadeAnimA = useRef(new Animated.Value(1)).current;
  const fadeAnimB = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const GRID_SWITCH_INTERVAL = 60000;
    const interval = setInterval(() => {
      Animated.parallel([
        Animated.timing(fadeAnimA, {
          toValue: toggle ? 0 : 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnimB, {
          toValue: toggle ? 1 : 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setToggle(!toggle);
      });
    }, GRID_SWITCH_INTERVAL);

    return () => clearInterval(interval);
  }, [toggle]);

  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.overlay,
          { opacity: Animated.multiply(fadeAnimA, gridOpacity) },
        ]}
      >
        <Svg width="100%" height="100%">
          <Defs>
            <Pattern
              id="patternA"
              patternUnits="userSpaceOnUse"
              width="2"
              height="2"
            >
              <Rect x="0" y="0" width="1" height="1" fill="#000" />
              <Rect x="1" y="1" width="1" height="1" fill="#000" />
            </Pattern>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#patternA)" />
        </Svg>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.overlay,
          { opacity: Animated.multiply(fadeAnimB, gridOpacity) },
        ]}
      >
        <Svg width="100%" height="100%">
          <Defs>
            <Pattern
              id="patternB"
              patternUnits="userSpaceOnUse"
              width="2"
              height="2"
            >
              <Rect x="1" y="0" width="1" height="1" fill="#000" />
              <Rect x="0" y="1" width="1" height="1" fill="#000" />
            </Pattern>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#patternB)" />
        </Svg>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
