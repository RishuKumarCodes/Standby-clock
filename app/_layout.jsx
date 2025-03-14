// app/_layout.jsx
import { Stack } from "expo-router";
import { ClockStyleProvider } from "./context/ClockStyleContext";

export default function Layout() {
  return (
    <ClockStyleProvider>
      <Stack
        screenOptions={{
          headerShown: false, // We handle custom headers ourselves
        }}
      />
    </ClockStyleProvider>
  );
}
