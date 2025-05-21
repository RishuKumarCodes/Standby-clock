import React, { createContext, useContext, useMemo } from "react";
import { usePageSettingsStorage } from "../storage/PageSettingsStorage.js";

const PageSettingsContext = createContext();

export function PageSettingsProvider({ children }) {
  const {
    userColor,
    setUserColor,
    showChargingStatus,
    setShowChargingStatus,
    activePage,
    setActivePage,
    loading,
  } = usePageSettingsStorage();

  const contextValue = useMemo(
    () => ({
      userColor,
      setUserColor,
      showChargingStatus,
      setShowChargingStatus,
      activePage,
      setActivePage,
      loading,
    }),
    [userColor, showChargingStatus, activePage, loading]
  );

  return (
    <PageSettingsContext.Provider value={contextValue}>
      {children}
    </PageSettingsContext.Provider>
  );
}

export function PageSettings() {
  return useContext(PageSettingsContext);
}
