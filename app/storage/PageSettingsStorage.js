import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function usePageSettingsStorage() {
  const [userColor, setUserColor] = useState("#7aaaf1");
  const [showChargingStatus, setShowChargingStatus] = useState(true);
  const [activePage, setActivePage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [storedColor, storedShowCharging, storedId] = await Promise.all([
          AsyncStorage.getItem("userColor"),
          AsyncStorage.getItem("showChargingStatus"),
          AsyncStorage.getItem("activePageId"),
        ]);

        if (storedColor !== null) setUserColor(storedColor);

        if (storedShowCharging !== null)
          setShowChargingStatus(JSON.parse(storedShowCharging));
        if (storedId !== null) {
          setActivePage({ id: storedId });
        }
      } catch (err) {
        console.warn("Error loading page settings:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // userColor
  useEffect(() => {
    AsyncStorage.setItem("userColor", userColor).catch((err) =>
      console.warn("Error saving userColor:", err)
    );
  }, [userColor]);

  // showChargingStatus
  useEffect(() => {
    AsyncStorage.setItem(
      "showChargingStatus",
      JSON.stringify(showChargingStatus)
    ).catch((err) => console.warn("Error saving showChargingStatus:", err));
  }, [showChargingStatus]);

  // activePage
  useEffect(() => {
    if (activePage?.id) {
      AsyncStorage.setItem("activePageId", activePage.id).catch((e) =>
        console.warn("Error saving activePageId:", e)
      );
    }
  }, [activePage]);

  return {
    userColor,
    setUserColor,
    showChargingStatus,
    setShowChargingStatus,
    activePage,
    setActivePage,
    loading,
  };
}
