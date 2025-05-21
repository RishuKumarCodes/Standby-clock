import React from "react";
import { GridSettingsProvider } from "../../context/GridSettingsContext";
import { ScreenSettingsProvider } from "../../context/ScreenSettingsContext";
import { PageSettingsProvider } from "../../context/PageSettingsContext";
import { ClockStatusProvider } from "../../context/ClockStatusContext";
import { SleepOverlayProvider } from "../../context/SleepOverlayContext";

export default function ContextProviders({ children }) {
  return (
    <GridSettingsProvider>
      <ScreenSettingsProvider>
        <SleepOverlayProvider>
          <PageSettingsProvider>
            <ClockStatusProvider>
              {children}
            </ClockStatusProvider>
          </PageSettingsProvider>
        </SleepOverlayProvider>
      </ScreenSettingsProvider>
    </GridSettingsProvider>
  );
}
