import React, { useState, useCallback } from "react";
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
import { useKeepAwake } from "expo-keep-awake";

function HomePage() {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [opacityAnim] = useState(new Animated.Value(1));
  const [showSettings, setShowSettings] = useState(false);
  const { setActiveScreen } = useScreenSettings();

  useKeepAwake();

  const animateToSettings = useCallback(() => {
    if (showSettings) return;
    setShowSettings(true);
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
  }, [showSettings, scaleAnim, opacityAnim, setActiveScreen]);

  const animateBackHome = useCallback(
    (callback) => {
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
    },
    [scaleAnim, opacityAnim]
  );

  const handleSettingsClose = useCallback(() => {
    animateBackHome(() => {
      setShowSettings(false);
      setActiveScreen("home");
    });
  }, [animateBackHome, setActiveScreen]);

  const onLongPressHandler = useCallback(
    (event) => {
      if (event.nativeEvent.state === State.ACTIVE) {
        animateToSettings();
      }
    },
    [animateToSettings]
  );

  const onPinchHandlerStateChange = useCallback(
    (event) => {
      if (
        event.nativeEvent.state === State.END &&
        event.nativeEvent.scale < 0.8
      ) {
        animateToSettings();
      }
    },
    [animateToSettings]
  );

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

export default React.memo(HomePage);
