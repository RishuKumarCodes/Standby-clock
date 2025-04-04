import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ClockStyleContext = createContext();

export function ClockStyleProvider({ children }) {
  const [clockStyle, setClockStyle] = useState("MinimalBold");
  const [userColor, setUserColor] = useState("#fff");
  const [showChargingStatus, setShowChargingStatus] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [savedStyle, savedColor, savedShowChargingStatus] =
          await Promise.all([
            AsyncStorage.getItem("clockStyle"),
            AsyncStorage.getItem("userColor"),
            AsyncStorage.getItem("showChargingStatus"),
          ]);
        if (savedStyle !== null) setClockStyle(savedStyle);
        if (savedColor !== null) setUserColor(savedColor);
        if (savedShowChargingStatus !== null)
          setShowChargingStatus(JSON.parse(savedShowChargingStatus));
      } catch (err) {
        console.warn("Error loading saved preferences:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (clockStyle !== null) {
      AsyncStorage.setItem("clockStyle", clockStyle).catch((err) =>
        console.warn("Error saving clockStyle:", err)
      );
    }
  }, [clockStyle]);

  useEffect(() => {
    if (userColor !== null) {
      AsyncStorage.setItem("userColor", userColor).catch((err) =>
        console.warn("Error saving userColor:", err)
      );
    }
  }, [userColor]);

  useEffect(() => {
    AsyncStorage.setItem("showChargingStatus", JSON.stringify(showChargingStatus))
      .catch((err) => console.warn("Error saving showChargingStatus:", err));
  }, [showChargingStatus]);

  const contextValue = useMemo(
    () => ({
      clockStyle,
      setClockStyle,
      userColor,
      setUserColor,
      showChargingStatus,
      setShowChargingStatus,
    }),
    [clockStyle, userColor, showChargingStatus]
  );

  return (
    <ClockStyleContext.Provider value={contextValue}>
      {children}
    </ClockStyleContext.Provider>
  );
}

export function useClockStyle() {
  return useContext(ClockStyleContext);
}
