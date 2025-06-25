import { ClockVariant } from "@/app/types/ThemesTypes";
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Animated,
  ViewStyle,
  TextStyle,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

interface FullScreenTimerProps {
  color?: string;
  initialDuration?: number;
  onFinish?: () => void;
  variant?: ClockVariant;
}

const VARIANT_CONFIG: Record<
  ClockVariant,
  {
    scaleFactor: number;
    TimerFontSize: number;
    timerHeight: number;
    labelFontsize: number;
    btnSize: number;
  }
> = {
  full: {
    scaleFactor: 1,
    TimerFontSize: 130,
    timerHeight: 110,
    labelFontsize: 18,
    btnSize: 30,
  },
  themeCard: {
    scaleFactor: 0.36,
    TimerFontSize: 40,
    timerHeight: 38,
    labelFontsize: 5,
    btnSize: 10,
  },
  smallPreview: {
    scaleFactor: 0.16,
    TimerFontSize: 20,
    timerHeight: 20,
    labelFontsize: 0.18,
    btnSize: 4,
  },
  colorSettings: {
    scaleFactor: 0.36,
    TimerFontSize: 55,
    timerHeight: 45,
    labelFontsize: 10,
    btnSize: 12,
  },
};

const FullScreenTimer: React.FC<FullScreenTimerProps> = ({
  color = "#FFD60A",
  initialDuration = 25 * 60,
  variant = "full",
  onFinish,
}) => {
  const [totalDur, setTotalDur] = useState(initialDuration);
  const [remaining, setRemaining] = useState(initialDuration);
  const [isPaused, setIsPaused] = useState(true);

  const progress = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  const { TimerFontSize, labelFontsize, btnSize, timerHeight } =
    VARIANT_CONFIG[variant];

  const fmt = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const updateProgress = (remainingTime: number) => {
    const prog = (totalDur - remainingTime) / totalDur;
    progress.setValue(prog);
  };

  const startTimer = () => {
    const start = Date.now();
    const end = start + remaining * 1000;

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const newRemaining = Math.max(0, Math.round((end - now) / 1000));

      setRemaining(newRemaining);
      updateProgress(newRemaining);

      if (newRemaining <= 0 && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsPaused(true);
        onFinish?.();
      }
    }, 1000);
  };

  const resume = () => {
    if (remaining <= 0 || !isPaused) return;
    setIsPaused(false);
    startTimer();
  };

  const pause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPaused(true);
  };

  const togglePause = () => {
    isPaused ? resume() : pause();
  };

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const ini = initialDuration;
    setTotalDur(ini);
    setRemaining(ini);
    progress.setValue(0);
    setIsPaused(true);
  };

  const adjust = (delta: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const MIN_DURATION = 300; // in seconds

    const newTotal = Math.max(MIN_DURATION, totalDur + delta);
    const newRem = Math.min(
      Math.max(MIN_DURATION, remaining + delta),
      newTotal
    );

    setTotalDur(newTotal);
    setRemaining(newRem);

    if (!isPaused) {
      updateProgress(newRem);
      startTimer();
    }
  };

  const fillWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: variant === "full" ? ["0%", "100%"] : ["40%", "100%"],
  });

  return (
    <View
      style={[
        styles.container,
        variant !== "full" && { aspectRatio: 19.5 / 9 },
      ]}
    >
      <Animated.View
        style={[styles.fillPane, { backgroundColor: color, width: fillWidth }]}
      />

      <View style={[styles.overlay]}>
        <View style={styles.controls}>
          <Pressable onPress={togglePause} style={[styles.iconBtn]}>
            <Ionicons
              name={isPaused ? "play" : "pause"}
              size={btnSize}
              color="#000"
            />
          </Pressable>

          <Pressable onPress={reset} style={[styles.iconBtn]}>
            <Ionicons name="close" size={btnSize} color="#000" />
          </Pressable>
        </View>

        <View style={styles.timerBox}>
          <Text style={[styles.label, { fontSize: labelFontsize }]}>TIMER</Text>
          <View style={{ flexDirection: "row", gap: "4%" }}>
            {isPaused && (
              <View style={{ justifyContent: "center", gap: 3 }}>
                <Pressable
                  onPress={() => adjust(300)}
                  style={styles.plusMinusBtn}
                >
                  <Ionicons name="add" size={btnSize} color="#888" />
                </Pressable>
                <Pressable
                  onPress={() => adjust(-300)}
                  style={styles.plusMinusBtn}
                >
                  <Ionicons name="remove" size={btnSize} color="#888" />
                </Pressable>
              </View>
            )}
            <Text
              style={[
                styles.timerText,
                { fontSize: TimerFontSize, lineHeight: timerHeight },
              ]}
            >
              {fmt(remaining)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default FullScreenTimer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,

  fillPane: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
  } as ViewStyle,

  overlay: {
    flex: 1,
    padding: "3.3%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  } as ViewStyle,

  controls: {
    flexDirection: "row",
    gap: "8%",
  } as ViewStyle,

  iconBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 74,
    height: "30%",
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1,
  } as ViewStyle,

  plusMinusBtn: {
    padding: "2%",
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1,
  } as ViewStyle,

  // ---------------------------------------------------------

  timerBox: {
    flex: 1,
    alignItems: "flex-end",
  } as ViewStyle,

  label: {
    color: "#888",
    letterSpacing: 2,
    margin: "5%",
  } as TextStyle,

  timerText: {
    color: "#fff",
    fontWeight: "600",
  } as TextStyle,
});
