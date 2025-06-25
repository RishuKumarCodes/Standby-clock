import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { DimTxt, H1Light, MdTxt } from "@/app/components/ui/CustomText";
import {
  getSettings,
  updateSettings,
  TimerSettings,
} from "@/app/storage/themesStorage/todos/DailyHabitTimer";
import ToggleButton from "@/app/components/ui/ToggleButton";

type SettingsPageProps = {
  onSettingsChange?: () => void;
};

const SettingsPage: React.FC<SettingsPageProps> = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState<TimerSettings>({
    autoStartNext: false,
    beepOnStart: false,
  });

  useEffect(() => {
    const loadSettings = async () => {
      const savedSettings = await getSettings();
      setSettings(savedSettings);
    };
    loadSettings();
  }, []);

  const handleToggleChange = async (
    key: keyof TimerSettings,
    value: boolean
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await updateSettings(newSettings);
    
    if (onSettingsChange) {
      onSettingsChange();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingItem}>
        <View style={styles.settingTextContainer}>
          <MdTxt style={styles.settingLabel}>Auto start next timer</MdTxt>
          <DimTxt style={styles.settingDescription}>
            Automatically start the next timer when current one completes
          </DimTxt>
        </View>
        <ToggleButton
          value={settings.autoStartNext}
          onValueChange={(value) => handleToggleChange("autoStartNext", value)}
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingTextContainer}>
          <MdTxt style={styles.settingLabel}>Beep on timer start</MdTxt>
          <DimTxt style={styles.settingDescription}>
            Play a sound when timer starts
          </DimTxt>
        </View>
        <ToggleButton
          value={settings.beepOnStart}
          onValueChange={(value): any =>
            handleToggleChange("beepOnStart", value)
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    gap: 10,
    paddingLeft: 20,
    justifyContent: "center",
  },
  settingItem: {
    backgroundColor: "#191919",
    padding: 17,
    borderRadius: 17,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 20,
  },
  settingLabel: {
    fontSize: 17,
    color: "#fff",
  },
  settingDescription: {
    fontSize: 13.5,
    color: "#888",
  },
});

export default SettingsPage;