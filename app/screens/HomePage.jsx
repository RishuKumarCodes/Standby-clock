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
import SettingsScreen from "./settings"; // Import settings screen

export default function HomePage() {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [opacityAnim] = useState(new Animated.Value(1));
  const [showSettings, setShowSettings] = useState(false);

  // Animate home page exit animation when opening settings
  const animateToSettings = () => {
    if (showSettings) return;
    setShowSettings(true);
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

  // Animate home page back to normal when closing settings with a callback
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

  // onClose for settings overlay
  const handleSettingsClose = () => {
    // Animate home page reverse animation and remove settings overlay immediately after animation ends
    animateBackHome(() => {
      setShowSettings(false);
    });
  };

  const onLongPressHandler = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      animateToSettings();
    }
  };

  const onPinchHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END && event.nativeEvent.scale < 0.8) {
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

      {/* Render SettingsScreen overlay when showSettings is true */}
      {showSettings && <SettingsScreen onClose={handleSettingsClose} />}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pagerView: { flex: 1 },
  page: { flex: 1 },
});
