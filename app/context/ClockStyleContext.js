import React, { createContext, useContext, useState } from "react";
const ClockStyleContext = createContext();
export function ClockStyleProvider({ children }) {
  const [clockStyle, setClockStyle] = useState("default"); 

  return (
    <ClockStyleContext.Provider value={{ clockStyle, setClockStyle }}>
      {children}
    </ClockStyleContext.Provider>
  );
}

export function useClockStyle() {
  return useContext(ClockStyleContext);
}
