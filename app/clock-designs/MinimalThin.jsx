import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import Svg, { Path } from "react-native-svg";

/* ====================================================
   Helper Functions
   ==================================================== */
const pad = (num) => (num < 10 ? "0" + num : String(num));

const formatTime = (date) => {
  const hours = date.getHours();
  const hours12 = hours % 12 || 12;
  const minutes = date.getMinutes();
  return `${pad(hours12)}:${pad(minutes)}`;
};

const formatCountdown = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${pad(m)}:${pad(s)}`;
};

/* ====================================================
   HalfCircleProgress Component (Memoized)
   ==================================================== */
const HalfCircleProgress = React.memo(
  ({ progress, size, strokeWidth, color, backgroundColor }) => {
    const cx = size / 2;
    const cy = size / 2;
    const r = (size - strokeWidth) / 2;
    const bgPath = `M ${cx + r} ${cy} A ${r} ${r} 0 0 0 ${cx - r} ${cy}`;
    let progressPath = "";

    if (progress > 0) {
      const angle = progress * Math.PI;
      const endX = cx + r * Math.cos(angle);
      const endY = cy - r * Math.sin(angle);
      const largeArcFlag = progress > 0.5 ? 1 : 0;
      progressPath = `M ${
        cx + r
      } ${cy} A ${r} ${r} 0 ${largeArcFlag} 0 ${endX} ${endY}`;
    }

    return (
      <Svg width={size} height={size} style={{ transform: [{ scaleX: -1 }] }}>
        <Path
          d={bgPath}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {progressPath && (
          <Path
            d={progressPath}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
          />
        )}
      </Svg>
    );
  }
);

/* ====================================================
   ClockDisplay Component (Memoized)
   ==================================================== */
const ClockDisplay = React.memo(
  ({
    isTimerVisible,
    color,
    largeClockFontSize,
    smallClockFontSize,
    clockTime,
  }) =>
    isTimerVisible ? (
      <Text
        style={[styles.topLeftClock, { color, fontSize: smallClockFontSize }]}
      >
        {clockTime}
      </Text>
    ) : (
      <Text style={[styles.clockText, { color, fontSize: largeClockFontSize }]}>
        {clockTime}
      </Text>
    )
);

/* ====================================================
   Main Component: MinimalThin
   ==================================================== */
export default function MinimalThin({
  color = "#32CD32",
  previewMode = false,
}) {
  // Constants & State
  const DEFAULT_FOCUS = 25 * 60; // 25 minutes
  const [clockTime, setClockTime] = useState(formatTime(new Date()));
  const [focusTimeLeft, setFocusTimeLeft] = useState(DEFAULT_FOCUS);
  const [focusDuration, setFocusDuration] = useState(DEFAULT_FOCUS);
  const [isFocusRunning, setIsFocusRunning] = useState(false);
  const [isTimerVisible, setIsTimerVisible] = useState(false);
  const [focusStart, setFocusStart] = useState(null);
  const clockTimerRef = useRef(null);

  // Window dimensions & orientation
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const displayWidth = isLandscape ? width : height;
  const displayHeight = isLandscape ? height : width;

  // Scaling factor for preview mode
  const scaleFactor = previewMode ? 0.3 : 1;

  // Computed sizes (scaled in preview mode)
  const largeClockFontSize = useMemo(
    () => displayWidth * 0.23 * scaleFactor,
    [displayWidth, scaleFactor]
  );
  const smallClockFontSize = useMemo(
    () => displayWidth * 0.085 * scaleFactor,
    [displayWidth, scaleFactor]
  );
  const progressSize = useMemo(
    () => displayWidth * 0.6 * scaleFactor,
    [displayWidth, scaleFactor]
  );
  const strokeWidth = 8;
  const ICON_SIZE = 30;
  const ACTION_ICON_SIZE = 40;

  /* ----------------------------------------------------
     Clock Update (Once Per Minute)
     ---------------------------------------------------- */
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClockTime(formatTime(now));
      const msToNextMinute =
        (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
      clockTimerRef.current = setTimeout(updateClock, msToNextMinute);
    };
    updateClock();
    return () => {
      if (clockTimerRef.current) clearTimeout(clockTimerRef.current);
    };
  }, []);

  /* ----------------------------------------------------
     Focus Timer Update (Once Per Second)
     ---------------------------------------------------- */
  useEffect(() => {
    let focusTimerTimeout;
    const updateFocusTimer = () => {
      if (isFocusRunning && focusStart) {
        const now = new Date();
        const elapsed = Math.floor((now - focusStart) / 1000);
        const remaining = Math.max(focusDuration - elapsed, 0);
        setFocusTimeLeft((prev) => (prev !== remaining ? remaining : prev));
        if (remaining === 0) {
          setIsFocusRunning(false);
          return;
        }
        const delay = 1000 - now.getMilliseconds();
        focusTimerTimeout = setTimeout(updateFocusTimer, delay);
      }
    };
    updateFocusTimer();
    return () => {
      if (focusTimerTimeout) clearTimeout(focusTimerTimeout);
    };
  }, [isFocusRunning, focusStart, focusDuration]);

  /* ----------------------------------------------------
     Button Callback Functions (No Actions in Preview)
     ---------------------------------------------------- */
  const startFocus = useCallback(() => {
    if (previewMode) return;
    if (!isTimerVisible) {
      // Fresh start
      setIsTimerVisible(true);
      setFocusDuration(DEFAULT_FOCUS);
      setFocusTimeLeft(DEFAULT_FOCUS);
      setFocusStart(Date.now());
      setIsFocusRunning(true);
    } else if (!isFocusRunning) {
      // Resume timer: adjust focusStart to maintain progress
      const elapsed = focusDuration - focusTimeLeft;
      setFocusStart(Date.now() - elapsed * 1000);
      setIsFocusRunning(true);
    }
  }, [
    isTimerVisible,
    isFocusRunning,
    focusTimeLeft,
    focusDuration,
    previewMode,
  ]);

  const pauseFocus = useCallback(() => {
    if (previewMode) return;
    setIsFocusRunning(false);
  }, [previewMode]);

  const subtractTenMinutes = useCallback(() => {
    if (previewMode) return;
    if (isFocusRunning && focusStart) {
      const elapsed = Math.floor((Date.now() - focusStart) / 1000);
      let newTotal = focusDuration - 600;
      newTotal = Math.max(newTotal, Math.max(600, elapsed + 1)); // Ensure valid total
      const newRemaining = Math.max(newTotal - elapsed, 0);
      setFocusDuration(newTotal);
      setFocusTimeLeft(newRemaining);
      if (newRemaining === 0) setIsFocusRunning(false);
    } else {
      setFocusDuration((prev) => Math.max(prev - 600, 600));
      setFocusTimeLeft((prev) => Math.max(prev - 600, 0));
    }
  }, [isFocusRunning, focusStart, focusDuration, previewMode]);

  const addTenMinutes = useCallback(() => {
    if (previewMode) return;
    if (isFocusRunning && focusStart) {
      const elapsed = Math.floor((Date.now() - focusStart) / 1000);
      const newTotal = focusDuration + 600;
      const newRemaining = newTotal - elapsed;
      setFocusDuration(newTotal);
      setFocusTimeLeft(newRemaining);
    } else {
      setFocusDuration((prev) => prev + 600);
      setFocusTimeLeft((prev) => prev + 600);
    }
  }, [isFocusRunning, focusStart, focusDuration, previewMode]);

  const closeTimer = useCallback(() => {
    if (previewMode) return;
    setIsFocusRunning(false);
    setIsTimerVisible(false);
    setFocusTimeLeft(DEFAULT_FOCUS);
    setFocusDuration(DEFAULT_FOCUS);
    setFocusStart(null);
  }, [previewMode]);

  /* ----------------------------------------------------
     Compute Progress for the Timer (0 to 1)
     ---------------------------------------------------- */
  const progress = useMemo(
    () => (focusDuration ? 1 - focusTimeLeft / focusDuration : 0),
    [focusTimeLeft, focusDuration]
  );

  /* ====================================================
     Render Component
     ==================================================== */
  return (
    <View style={styles.container}>
      <ClockDisplay
        isTimerVisible={isTimerVisible}
        color={color}
        largeClockFontSize={largeClockFontSize}
        smallClockFontSize={smallClockFontSize}
        clockTime={clockTime}
      />

      {isTimerVisible ? (
        <View
          style={[
            styles.timerContainer,
            { marginTop: displayHeight * 0.5 * scaleFactor },
          ]}
        >
          <HalfCircleProgress
            progress={progress}
            size={progressSize}
            strokeWidth={strokeWidth}
            color={color}
            backgroundColor="#333"
          />

          <View
            style={[
              styles.countdownOverlay,
              { width: progressSize, height: progressSize },
            ]}
          >
            <View style={styles.innerContent}>
              <Text
                style={[
                  styles.countdownText,
                  { color, fontSize: displayWidth * 0.1 * scaleFactor },
                ]}
              >
                {formatCountdown(focusTimeLeft)}
              </Text>

              <View style={styles.controlsRow}>
                <TouchableOpacity
                  disabled={previewMode}
                  pointerEvents={previewMode ? "none" : "auto"}
                  onPress={!previewMode ? subtractTenMinutes : null}
                  style={styles.iconButton}
                >
                  <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 16 16">
                    <Path
                      d="M2 8 L14 8"
                      stroke="#aaa"
                      strokeWidth="1"
                      fill="none"
                    />
                  </Svg>
                </TouchableOpacity>

                {isFocusRunning ? (
                  <TouchableOpacity
                    disabled={previewMode}
                    pointerEvents={previewMode ? "none" : "auto"}
                    onPress={!previewMode ? pauseFocus : null}
                    style={styles.actionButton}
                  >
                    <Svg
                      width={ACTION_ICON_SIZE}
                      height={ACTION_ICON_SIZE}
                      viewBox="0 0 16 16"
                    >
                      <Path
                        d="M5 3 L5 13 M11 3 L11 13"
                        fill="none"
                        stroke="#ccc"
                        strokeWidth="1"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />
                    </Svg>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    disabled={previewMode}
                    pointerEvents={previewMode ? "none" : "auto"}
                    onPress={!previewMode ? startFocus : null}
                    style={styles.actionButton}
                  >
                    <Svg
                      width={ACTION_ICON_SIZE}
                      height={ACTION_ICON_SIZE}
                      viewBox="0 0 16 16"
                    >
                      <Path
                        d="M5 3 L12 8 L5 13 Z"
                        fill="none"
                        stroke="#ccc"
                        strokeWidth="1"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />
                    </Svg>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  disabled={previewMode}
                  pointerEvents={previewMode ? "none" : "auto"}
                  onPress={!previewMode ? addTenMinutes : null}
                  style={styles.iconButton}
                >
                  <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 16 16">
                    <Path
                      d="M8 2 L8 14 M2 8 L14 8"
                      stroke="#aaa"
                      strokeWidth="1"
                      fill="none"
                    />
                  </Svg>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          disabled={previewMode}
          pointerEvents={previewMode ? "none" : "auto"}
          onPress={!previewMode ? startFocus : null}
          style={styles.startButton}
        >
          <Text style={[styles.startButtonText, { color }]}>Focus</Text>
        </TouchableOpacity>
      )}

      {isTimerVisible && (
        <View style={styles.exitButtonContainer}>
          <TouchableOpacity
            disabled={previewMode}
            pointerEvents={previewMode ? "none" : "auto"}
            onPress={!previewMode ? closeTimer : null}
            style={styles.exitButton}
          >
            <Svg width={20} height={20} viewBox="0 0 16 16">
              <Path
                d="M10 3 L5 8 L10 13"
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

/* ====================================================
   Styles
   ==================================================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  clockText: {
    fontWeight: "100",
    textAlign: "center",
  },
  topLeftClock: {
    position: "absolute",
    top: 10,
    left: 10,
    fontWeight: "100",
  },
  startButton: {
    marginTop: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#333",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  startButtonText: {
    fontSize: 16,
  },
  timerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  countdownOverlay: {
    position: "absolute",
    bottom: "-15%",
    left: 0,
  },
  innerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  countdownText: {
    fontWeight: "100",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 35,
    marginTop: 20,
  },
  iconButton: {
    padding: 8,
  },
  actionButton: {},
  exitButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 35,
  },
  exitButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: "rgb(17, 17, 17)",
  },
});
