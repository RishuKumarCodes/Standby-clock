// HomePage.js
import React, { useState } from "react";
import { StyleSheet, View, Animated } from "react-native";
import PagerView from "react-native-pager-view";
import {
  GestureHandlerRootView,
  LongPressGestureHandler,
  PinchGestureHandler,
  State,
} from "react-native-gesture-handler";
import ClockScreen from "./homeTabs/ClockScreen";
import TimerScreen from "./homeTabs/TimerScreen";
import SettingsScreen from "./settings";
import { useScreenSettings } from "../context/ScreenSettingsContext";

export default function HomePage() {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [opacityAnim] = useState(new Animated.Value(1));
  const [showSettings, setShowSettings] = useState(false);
  const { setActiveScreen } = useScreenSettings();

  const animateToSettings = () => {
    if (showSettings) return;
    setShowSettings(true);
    // Indicate that we're now on the settings screen
    setActiveScreen("settings");
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateBackHome = (callback) => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(callback);
  };

  const handleSettingsClose = () => {
    animateBackHome(() => {
      setShowSettings(false);
      // Set active screen back to home
      setActiveScreen("home");
    });
  };

  const onLongPressHandler = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      animateToSettings();
    }
  };

  const onPinchHandlerStateChange = (event) => {
    if (
      event.nativeEvent.state === State.END &&
      event.nativeEvent.scale < 0.8
    ) {
      animateToSettings();
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PinchGestureHandler onHandlerStateChange={onPinchHandlerStateChange}>
        <LongPressGestureHandler
          onHandlerStateChange={onLongPressHandler}
          minDurationMs={300}
        >
          <Animated.View
            style={[
              styles.container,
              { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
            ]}
          >
            <PagerView style={styles.pagerView} initialPage={1}>
              <View key="1" style={styles.page}>
                <TimerScreen />
              </View>
              <View key="2" style={styles.page}>
                <ClockScreen />
              </View>
            </PagerView>
          </Animated.View>
        </LongPressGestureHandler>
      </PinchGestureHandler>

      {showSettings && <SettingsScreen onClose={handleSettingsClose} />}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pagerView: { flex: 1 },
  page: { flex: 1 },
});
