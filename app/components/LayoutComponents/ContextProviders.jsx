import React from "react";
import { GridSettingsProvider } from "../../context/GridSettingsContext";
import { ScreenSettingsProvider } from "../../context/ScreenSettingsContext";
import { ClockStyleProvider } from "../../context/ClockStyleContext";
import { ClockStatusProvider } from "../../context/ClockStatusContext";
import { SleepOverlayProvider } from "../../context/SleepOverlayContext";

export default function ContextProviders({ children }) {
  return (
    <GridSettingsProvider>
      <ScreenSettingsProvider>
        <SleepOverlayProvider>
          <ClockStyleProvider>
            <ClockStatusProvider>
              {children}
            </ClockStatusProvider>
          </ClockStyleProvider>
        </SleepOverlayProvider>
      </ScreenSettingsProvider>
    </GridSettingsProvider>
  );
}
