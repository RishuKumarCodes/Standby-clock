import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { useKeepAwake } from "expo-keep-awake";
import AlternatingDimOverlay from "../components/commmon/AlternatingDimOverlay";
import SleepOverlay from "../components/commmon/SleepOverlay.jsx";
import { useSleepOverlay } from "../context/SleepOverlayContext";
import { useScreenSettings } from "../context/ScreenSettingsContext";
import { getInitialPages } from "../storage/pageWidgetsStorage";
import { componentMap, categoryProviders } from "../registry/pageRegistry";
import { PageSettings } from "../context/PageSettingsContext";

export default React.memo(function HomePage() {
  useKeepAwake();
  const { sleepMode, isScreenBlack, toggleSleepOverlay } = useSleepOverlay();
  const { activeScreen } = useScreenSettings();
  const { userColor, activePage, setActivePage, loading } = PageSettings();

  const [pages, setPages] = useState([]);
  const pagerRef = useRef(null);

  // Load initial pages and set the active page
  useEffect(() => {
    if (loading) return;
    (async () => {
      const initial = await getInitialPages();
      setPages(initial);

      const saved =
        activePage?.id && initial.find((p) => p.id === activePage.id);
      const next = saved || initial[0] || null;
      if (next) setActivePage(next);
    })();
  }, [loading]);

  // Refresh pages when returning to home screen
  useEffect(() => {
    if (activeScreen !== "home") return;
    (async () => {
      const fresh = await getInitialPages();
      setPages(fresh);
    })();
  }, [activeScreen]);

  // Determine the index of the active page
  const activeIndex = pages.findIndex((p) => p.id === activePage?.id);

  // Imperatively jump to the correct page whenever pages or activeIndex changes
  useEffect(() => {
    if (pagerRef.current && pages.length > 0 && activeIndex >= 0) {
      pagerRef.current.setPageWithoutAnimation(activeIndex);
    }
  }, [pages, activeIndex]);

  const onPageScrollStateChanged = ({ nativeEvent }) => {
    if (nativeEvent.pageScrollState !== "idle") return;
    const idx = pendingIndexRef.current;
    pendingIndexRef.current = null;
    const page = pages[idx];
    if (page) {
      setActivePage(page);
    }
  };

  const pendingIndexRef = useRef(null);
  const onPageSelected = ({ nativeEvent }) => {
    pendingIndexRef.current = nativeEvent.position;
  };

  // Double-tap to toggle sleep overlay
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
              <PagerView
                ref={pagerRef}
                style={styles.pagerView}
                initialPage={0}
                offscreenPageLimit={2}
                onPageSelected={onPageSelected}
                onPageScrollStateChanged={onPageScrollStateChanged}
                transitionStyle="scroll"
              >
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
