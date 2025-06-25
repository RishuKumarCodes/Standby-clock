import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Pressable,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import { getTimers } from "../../../storage/themesStorage/todos/DailyHabitTimer";

import AddTimerModal from "./components/AddTimerModal";
import RightPane from "./components/RightPane";
import LeftPane from "./components/LeftPane";
import { MdTxt } from "@/app/components/ui/CustomText";
import AnalyticsScreen from "../../analytics/DailyHabitTimer/AnalyticsScreen";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { BackHandler } from "react-native";
import { ThemeProps } from "@/app/types/ThemesTypes";
import PreviewScreen from "./components/PreviewScreen";

interface Timer {
  name: string;
  duration: number;
}

export default function DualPaneTimer({ color, variant = "full" }: ThemeProps) {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [shouldAutoStart, setShouldAutoStart] = useState(false);

  const pagerRef = useRef<FlatList<Timer>>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadTimers = async () => {
      const data = await getTimers();
      if (data) setTimers(data);
    };
    loadTimers();
  }, []);

  // to handle back button for analytics page.
  useEffect(() => {
    if (!showAnalytics) return;

    const backAction = () => {
      setShowAnalytics(false);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // cleanup
  }, [showAnalytics]);

  if (variant != "full") {
    return <PreviewScreen variant={variant} color={color} />;
  }

  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = String(secs % 60).padStart(2, "0");

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${seconds}`;
    } else if (minutes > 0) {
      return `${minutes}:${seconds}`;
    } else {
      return `0:${seconds}`;
    }
  };

  const handleAnyTouch = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      timerRef.current = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 1700);
    });
  }, [fadeAnim]);

  const handleAutoStartNext = useCallback(() => {
    const nextIndex = (selectedIndex + 1) % timers.length;
    const SCREEN_HEIGHT = Dimensions.get("screen").height;

    if (pagerRef.current) {
      pagerRef.current.scrollToOffset({
        offset: nextIndex * SCREEN_HEIGHT,
        animated: true,
      });
    }

    setSelectedIndex(nextIndex);
    setShouldAutoStart(true);
  }, [selectedIndex, timers.length]);

  return (
    <>
      <Pressable style={styles.container} onPressIn={handleAnyTouch}>
        <LeftPane
          setSelectedIndex={setSelectedIndex}
          selectedIndex={selectedIndex}
          pagerRef={pagerRef}
          timers={timers}
          setTimers={setTimers}
          setModalVisible={setModalVisible}
          formatTime={formatTime}
        />

        <RightPane
          selectedIndex={selectedIndex}
          timers={timers}
          formatTime={formatTime}
          color={color}
          onAutoStartNext={handleAutoStartNext}
          shouldAutoStart={shouldAutoStart}
          setShouldAutoStart={setShouldAutoStart}
        />

        <AddTimerModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          timers={timers}
          setTimers={setTimers}
          pagerRef={pagerRef}
        />

        <Animated.View style={[styles.anaylitics, { opacity: fadeAnim }]}>
          <TouchableOpacity onPress={() => setShowAnalytics(true)}>
            <MdTxt style={{ fontSize: 18, color: "#ddd" }}>Analytics</MdTxt>
          </TouchableOpacity>
        </Animated.View>
      </Pressable>
      {showAnalytics && (
        <>
          <AnalyticsScreen color={color} />
          <Pressable
            onPress={() => setShowAnalytics(false)}
            style={styles.analyticsCloseBtn}
          >
            <EvilIcons name="close" size={40} color="#fff" className="" />
          </Pressable>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row" },
  topBar: {
    height: 50,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    backgroundColor: "#fafafa",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  analyticsBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#007AFF",
    borderRadius: 4,
  },
  analyticsBtnText: {
    color: "#fff",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  anaylitics: {
    position: "absolute",
    top: "6%",
    left: "3%",
    backgroundColor: "#212121",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 1.7,
    paddingHorizontal: 12,
    borderRadius: 40,
  },
  analyticsCloseBtn: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#212121",
    padding: 10,
    width: 70,
    height: 70,
    borderBottomRightRadius: 60,
  },
});
