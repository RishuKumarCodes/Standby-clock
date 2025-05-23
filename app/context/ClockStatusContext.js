import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import * as Battery from "expo-battery";

const TimeContext = createContext();
const SecondsContext = createContext();
const BatteryContext = createContext();
const FormatContext = createContext();
const ClockStatusContext = createContext();

// ---------- TIME PROVIDER (EXCLUDES SECONDS) ----------
function TimeProvider({ children }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const now = new Date();
    const msToNextMinute =
      (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

    const timeout = setTimeout(() => {
      setTime(new Date());
      const interval = setInterval(() => {
        setTime(new Date());
      }, 60000);
      return () => clearInterval(interval);
    }, msToNextMinute);

    return () => clearTimeout(timeout);
  }, []);

  const timeData = useMemo(
    () => ({
      hour: time.getHours(),
      minute: time.getMinutes(),
      date: time.getDate(),
      day: time.toLocaleString("en-US", { weekday: "long" }),
      month: time.toLocaleString("en-US", { month: "long" }),
      monthNumber: time.getMonth() + 1,
      year: time.getFullYear(),
    }),
    [time]
  );

  return (
    <TimeContext.Provider value={timeData}>{children}</TimeContext.Provider>
  );
}

// ---------- SECONDS PROVIDER (UPDATES EVERY SECOND) ----------
function SecondsProvider({ children }) {
  const [seconds, setSeconds] = useState(new Date().getSeconds());

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(new Date().getSeconds());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SecondsContext.Provider value={seconds}>
      {children}
    </SecondsContext.Provider>
  );
}

// ---------- BATTERY PROVIDER ----------
function BatteryProvider({ children }) {
  const [battery, setBattery] = useState(null);
  const [chargingStatus, setChargingStatus] = useState(false);

  const fetchBatteryStatus = useCallback(async () => {
    try {
      const batteryLevel = await Battery.getBatteryLevelAsync();
      const charging = await Battery.getBatteryStateAsync();

      setBattery(Math.floor(batteryLevel * 100));

      const isCharging =
        charging === Battery.BatteryState.CHARGING ||
        charging === Battery.BatteryState.FULL;
      setChargingStatus(isCharging);
    } catch (error) {
      console.warn("Battery error:", error);
    }
  }, []);

  const batteryLevelWhileCharging = useMemo(() => {
    return chargingStatus ? battery : null;
  }, [chargingStatus, battery]);

  useEffect(() => {
    fetchBatteryStatus();

    const batteryStateSubscription = Battery.addBatteryStateListener(
      ({ batteryState }) => {
        const isCharging =
          batteryState === Battery.BatteryState.CHARGING ||
          batteryState === Battery.BatteryState.FULL;
        setChargingStatus(isCharging);
      }
    );

    const interval = setInterval(fetchBatteryStatus, 60000);

    return () => {
      batteryStateSubscription.remove();
      clearInterval(interval);
    };
  }, [fetchBatteryStatus]);

  return (
    <BatteryContext.Provider
      value={{ battery, chargingStatus, batteryLevelWhileCharging }}
    >
      {children}
    </BatteryContext.Provider>
  );
}

// ---------- FORMAT PROVIDER ----------
function FormatProvider({ children }) {
  const [is24HourFormat, setIs24HourFormat] = useState(false);

  return (
    <FormatContext.Provider value={{ is24HourFormat, setIs24HourFormat }}>
      {children}
    </FormatContext.Provider>
  );
}

// ---------- COMPOSITE PROVIDER ----------
export function ClockStatusProvider({ children }) {
  return (
    <FormatProvider>
      <BatteryProvider>
        <TimeProvider>
          <SecondsProvider>
            <CombinedClockStatus>{children}</CombinedClockStatus>
          </SecondsProvider>
        </TimeProvider>
      </BatteryProvider>
    </FormatProvider>
  );
}

function CombinedClockStatus({ children }) {
  const time = useContext(TimeContext);
  const { battery, chargingStatus, batteryLevelWhileCharging } =
    useContext(BatteryContext);
  const { is24HourFormat, setIs24HourFormat } = useContext(FormatContext);

  const hour = is24HourFormat ? time.hour : time.hour % 12 || 12;
  const ampm = time.hour >= 12 ? "PM" : "AM";
  const year = time.year;

  const clockStatus = useMemo(
    () => ({
      hour,
      min: time.minute,
      date: time.date,
      day: time.day,
      month: time.month,
      monthNumber: time.monthNumber,
      ampm,
      year,
      battery,
      chargingStatus,
      batteryLevelWhileCharging,
      is24HourFormat,
      setIs24HourFormat,
    }),
    [
      hour,
      time.minute,
      time.date,
      time.day,
      time.month,
      time.monthNumber,
      ampm,
      year,
      battery,
      chargingStatus,
      batteryLevelWhileCharging,
      is24HourFormat,
    ]
  );

  return (
    <ClockStatusContext.Provider value={clockStatus}>
      {children}
    </ClockStatusContext.Provider>
  );
}

// ---------- CUSTOM HOOKS ----------
export function useClockStatus() {
  return useContext(ClockStatusContext);
}

export function useSeconds() {
  return useContext(SecondsContext);
}
