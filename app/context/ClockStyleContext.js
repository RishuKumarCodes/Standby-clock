import React, { createContext, useContext, useState } from "react";

/**
 * 1. Create the Context
 */
const ClockStyleContext = createContext();

/**
 * 2. Define a Provider component that wraps your app.
 *    It holds the style state and a setter function.
 */
export function ClockStyleProvider({ children }) {
  const [clockStyle, setClockStyle] = useState("default"); 
  // "default" is the initial style

  return (
    <ClockStyleContext.Provider value={{ clockStyle, setClockStyle }}>
      {children}
    </ClockStyleContext.Provider>
  );
}

/**
 * 3. Custom hook for easy access to context
 */
export function useClockStyle() {
  return useContext(ClockStyleContext);
}
