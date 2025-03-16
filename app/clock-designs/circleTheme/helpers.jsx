import React, { useState, useEffect } from "react";
import * as Battery from "expo-battery";

export const hexToRgba = (hex, opacity, intensity = 0.8) => {
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  r = Math.round(r + (255 - r) * (1 - opacity) * intensity);
  g = Math.round(g + (255 - g) * (1 - opacity) * intensity);
  b = Math.round(b + (255 - b) * (1 - opacity) * intensity);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const pad = (n) => (n < 10 ? `0${n}` : n);

export const useBatteryInfo = () => {
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [batteryState, setBatteryState] = useState(null);

  useEffect(() => {
    let batteryLevelListener;
    let batteryStateListener;

    const fetchBatteryInfo = async () => {
      try {
        const [level, state] = await Promise.all([
          Battery.getBatteryLevelAsync(),
          Battery.getBatteryStateAsync(),
        ]);
        setBatteryLevel(level);
        setBatteryState(state);
      } catch (error) {
        console.warn("Battery fetch error:", error);
      }
    };

    fetchBatteryInfo();

    batteryLevelListener = Battery.addBatteryLevelListener(
      ({ batteryLevel }) => {
        setBatteryLevel(batteryLevel);
      }
    );
    batteryStateListener = Battery.addBatteryStateListener(
      ({ batteryState }) => {
        setBatteryState(batteryState);
      }
    );

    return () => {
      batteryLevelListener?.remove();
      batteryStateListener?.remove();
    };
  }, []);

  return { batteryLevel, batteryState };
};
