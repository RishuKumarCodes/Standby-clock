import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { H1Txt, MdTxt } from "@/app/components/ui/CustomText";
import {
  loadTimerState,
  saveTimerState,
  logSessionUsage,
  Timer,
  getSettings,
  TimerSettings,
} from "@/app/storage/themesStorage/todos/DailyHabitTimer";
import TickIcon from "@/assets/icons/TickIcon";
import { Audio } from "expo-av";
import SettingsPage from "./SettingsPage";

type RightPaneProps = {
  selectedIndex: number;
  timers: Timer[];
  formatTime: (secs: number) => string;
  color: string;
  onAutoStartNext?: () => void;
  shouldAutoStart?: boolean;
  setShouldAutoStart?: (value: boolean) => void;
};

const RightPane: React.FC<RightPaneProps> = ({
  selectedIndex,
  timers,
  formatTime,
  color,
  onAutoStartNext,
  shouldAutoStart,
  setShouldAutoStart,
}) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartTimeRef = useRef<number | null>(null);
  const lastLoggedSecondsRef = useRef<number>(0);
  const currentTimerIdRef = useRef<string | null>(null);

  const [remainingSecs, setRemainingSecs] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [settings, setSettings] = useState<TimerSettings>({
    autoStartNext: false,
    beepOnStart: false,
  });

  const loadSettings = async () => {
    try {
      const savedSettings = await getSettings();
      setSettings(savedSettings);
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSettingsChange = () => {
    loadSettings();
  };

  const playBeepSound = async () => {
    if (!settings.beepOnStart) return;

    try {
      const { sound } = await Audio.Sound.createAsync(
        require("@/assets/sounds/timerStart.mp3"),
        { shouldPlay: true }
      );
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.warn("Could not play beep sound:", error);
    }
  };

  // Helper function to save current timer state and log session
  const saveCurrentTimerState = async () => {
    if (currentTimerIdRef.current && sessionStartTimeRef.current !== null) {
      if (timerRunning) {
        const sessionDuration = sessionStartTimeRef.current - remainingSecs;
        if (sessionDuration > 0) {
          try {
            await logSessionUsage(sessionDuration, currentTimerIdRef.current);
          } catch (error) {
            console.error("Failed to log session usage:", error);
          }
        }
      }

      try {
        await saveTimerState(currentTimerIdRef.current, remainingSecs);
      } catch (error) {
        console.error("Failed to save timer state:", error);
      }
    }
  };

  // 1. On timer index change: save current state, then reset and load new state
  useEffect(() => {
    const timer = timers[selectedIndex];
    if (!timer) return;

    // If we're switching from one timer to another, save the current state first
    const switchingTimers =
      currentTimerIdRef.current && currentTimerIdRef.current !== timer.id;

    const handleTimerSwitch = async () => {
      if (switchingTimers) {
        await saveCurrentTimerState();
      }

      // Stop current timer and clean up
      setTimerRunning(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Reset session tracking
      sessionStartTimeRef.current = null;
      lastLoggedSecondsRef.current = 0;
      currentTimerIdRef.current = timer.id;

      // Load saved state for this timer
      const loadedSeconds = await loadTimerState(timer.id, timer.duration);
      setRemainingSecs(loadedSeconds);
      setCompleted(loadedSeconds === 0);
    };

    handleTimerSwitch();
  }, [selectedIndex, timers]);

  // Added useEffect to handle auto-start when shouldAutoStart flag is set
  useEffect(() => {
    if (
      shouldAutoStart &&
      setShouldAutoStart &&
      remainingSecs > 0 &&
      !completed
    ) {
      const autoStartTimer = setTimeout(async () => {
        sessionStartTimeRef.current = remainingSecs;
        setTimerRunning(true);
        await playBeepSound();
        setShouldAutoStart(false);
      }, 1000);

      return () => clearTimeout(autoStartTimer);
    }
  }, [
    shouldAutoStart,
    setShouldAutoStart,
    remainingSecs,
    completed,
    settings.beepOnStart,
  ]);

  // 2. Handle timer start/stop
  const toggleTimer = async () => {
    const timer = timers[selectedIndex];
    if (!timer) return;

    if (timerRunning) {
      setTimerRunning(false);

      if (sessionStartTimeRef.current !== null) {
        const sessionDuration = sessionStartTimeRef.current - remainingSecs;
        if (sessionDuration > 0) {
          try {
            await logSessionUsage(sessionDuration, timer.id);
            lastLoggedSecondsRef.current += sessionDuration;
          } catch (error) {
            console.error("Failed to log session usage:", error);
          }
        }
      }

      // Save current state
      try {
        await saveTimerState(timer.id, remainingSecs);
      } catch (error) {
        console.error("Failed to save timer state:", error);
      }

      sessionStartTimeRef.current = null;
    } else {
      // Starting the timer
      sessionStartTimeRef.current = remainingSecs;
      setTimerRunning(true);
      // Added beep sound when timer starts
      await playBeepSound();
    }
  };

  // 3. Handle ticking
  useEffect(() => {
    if (timerRunning && remainingSecs > 0) {
      timerRef.current = setInterval(() => {
        setRemainingSecs((prevSecs) => {
          const newSecs = prevSecs - 1;

          // Save state periodically (every 10 seconds) to prevent data loss
          if (newSecs % 10 === 0) {
            const timer = timers[selectedIndex];
            if (timer) {
              saveTimerState(timer.id, newSecs).catch(console.error);
            }
          }

          // Check if timer completed
          if (newSecs === 0) {
            setCompleted(true);
          }

          return newSecs;
        });
      }, 1000);
    } else {
      // Clear interval when not running or completed
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timerRunning, remainingSecs, selectedIndex, timers]);

  // 4. Auto-stop when timer reaches 0
  useEffect(() => {
    if (remainingSecs === 0 && timerRunning) {
      setTimerRunning(false);
      setCompleted(true);

      // Log the final session
      const timer = timers[selectedIndex];
      if (timer && sessionStartTimeRef.current !== null) {
        const sessionDuration = sessionStartTimeRef.current - remainingSecs;
        if (sessionDuration > 0) {
          logSessionUsage(sessionDuration, timer.id).catch(console.error);
        }
      }

      sessionStartTimeRef.current = null;

      // Added auto start next timer functionality
      if (settings.autoStartNext && timers.length > 1) {
        // Auto start next timer and navigate to it after a brief delay
        setTimeout(() => {
          const nextIndex = (selectedIndex + 1) % timers.length;
          // console.log(`Auto starting next timer: ${timers[nextIndex]?.name}`);
          if (onAutoStartNext) {
            onAutoStartNext();
          }
        }, 2000);
      }
    }
  }, [
    remainingSecs,
    timerRunning,
    selectedIndex,
    timers,
    settings.autoStartNext,
    onAutoStartNext,
  ]);

  // 5. Save state when component unmounts or app goes to background
  useEffect(() => {
    return () => {
      saveCurrentTimerState();
    };
  }, []);

  const timeStr = formatTime(remainingSecs);
  const parts = timeStr.split(":");

  const hasHours = parts.length === 3;
  const [hourMinPart, secPart] = hasHours
    ? [`${parts[0]}:${parts[1]}`, parts[2]]
    : [timeStr, null];
  
  return (
    <View style={styles.rightPane}>
      {selectedIndex < timers.length ? (
        <>
          {completed ? (
            <>
              <View style={styles.doneButton}>
                <TickIcon color={"#000"} size={30} />
                <MdTxt style={{ paddingTop: 3, color: "#000", fontSize: 20 }}>
                  done
                </MdTxt>
              </View>
              <H1Txt style={{ fontSize: 104, color }}>
                {formatTime(remainingSecs)}
              </H1Txt>
            </>
          ) : (
            <>
              <H1Txt
                style={{
                  fontSize: 104,
                  color,
                  textAlign: "center",
                  width: "100%",
                }}
              >
                {hourMinPart}
              </H1Txt>
              {hasHours && (
                <MdTxt
                  style={{
                    fontSize: 40,
                    color: "#aaa",
                    lineHeight: 36,
                    position: "absolute",
                    textAlign: "right",
                    paddingRight: 20,
                    paddingBottom: 4,
                    left: 0,
                    width: "100%",
                  }}
                >{`\n${secPart}`}</MdTxt>
              )}
            </>
          )}
          <TouchableOpacity
            onPress={toggleTimer}
            style={[
              styles.button,
              { backgroundColor: timerRunning ? "#290006" : "#002918" },
            ]}
          >
            <MdTxt
              style={{
                fontSize: 30,
                color: timerRunning ? "#EF3352" : "#009c5b",
              }}
            >
              {timerRunning ? "Stop" : "Start"}
            </MdTxt>
          </TouchableOpacity>
        </>
      ) : (
        <SettingsPage onSettingsChange={handleSettingsChange} />
      )}
    </View>
  );
};

export default RightPane;

const styles = StyleSheet.create({
  rightPane: {
    paddingRight: 50,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  doneButton: {
    position: "absolute",
    top: "6%",
    right: "5%",
    backgroundColor: "#6FFF84",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingLeft: 5,
    paddingRight: 10,
    borderRadius: 40,
  },
  button: {
    width: "80%",
    aspectRatio: 6 / 2,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  editModeTxt: {
    color: "#777",
    fontSize: 18,
    paddingHorizontal: 12,
    textAlign: "center",
  },
});