import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
// import ClockScreen from "./homeTabs/ClockScreen";
// import TimerScreen from "./homeTabs/TimerScreen";
import { useKeepAwake } from "expo-keep-awake";
import AlternatingDimOverlay from "../components/AlternatingDimOverlay";
import SleepOverlay from "../components/SleepOverlay";
import { useSleepOverlay } from "../context/SleepOverlayContext";
import { useScreenSettings } from "../context/ScreenSettingsContext";
import { getInitialPages } from "../storage/pageWidgetsStorage";
import { componentMap, categoryProviders } from "../registry/pageRegistry";
import { useClockStyle } from "../context/ClockStyleContext";
// I have to remove the clockStyle from the clockStyleContext or maybe also move the "color" and "show battery percentage" too.
// also I've to delete the clock-designs folder and the homeTabs folder.
export default React.memo(function HomePage() {
  useKeepAwake();
  const { sleepMode, isScreenBlack, toggleSleepOverlay } = useSleepOverlay();
  const { activeScreen } = useScreenSettings();
  const { userColor } = useClockStyle();

  const [pages, setPages] = useState([]);

  useEffect(() => {
    async function load() {
      const initial = await getInitialPages();
      setPages(initial);
    }
    load();
  }, []);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDelay(300)
    .onEnd(() => {
      "worklet";
      if (activeScreen === "home" && sleepMode) {
        runOnJS(toggleSleepOverlay)();
      }
    });

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={doubleTap}>
        <View style={styles.container}>
          {activeScreen === "home" && sleepMode && isScreenBlack ? (
            <SleepOverlay />
          ) : (
            <>
              <PagerView style={styles.pagerView} initialPage={1}>
                {pages.map((page) => {
                  const Comp = componentMap[page.component];
                  const ContextProvider = categoryProviders[page.category];
                  const content = (
                    <React.Suspense fallback={<View style={styles.page} />}>
                      <Comp color={userColor} />
                    </React.Suspense>
                  );
                  return (
                    <View key={page.id} style={styles.page}>
                      {ContextProvider ? (
                        <ContextProvider>{content}</ContextProvider>
                      ) : (
                        content
                      )}
                    </View>
                  );
                })}
                {/* <View key="1" style={styles.page}>
                  <TimerScreen />
                </View>
                <View key="2" style={styles.page}>
                  <ClockScreen />
                </View> */}
              </PagerView>
              <AlternatingDimOverlay />
            </>
          )}
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  pagerView: { flex: 1 },
  page: { flex: 1 },
});
