import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_KEY = "REMINDERS_DATA";

export type RepeatType = "hourly" | "daily";

export interface Reminder {
  id: string;
  enabled: boolean;
  title: string;
  startTime: string;
  color?: string;
  isDefault?: boolean;
  repeatType: RepeatType;
  interval?: string;
  daysOfWeek?: number[];
  SendNotification: boolean;
  soundName: string | null;
}

export const DEFAULT_REMINDERS: Reminder[] = [
  {
    id: "1",
    enabled: false,
    title: "Drink water reminder",
    startTime: "06:00 am",
    color: "#c9d5d6",
    isDefault: true,
    repeatType: "hourly",
    interval: "0:45",
    SendNotification: true,
    soundName: "water-drop",
  },
  {
    id: "2",
    enabled: false,
    title: "Take a break",
    startTime: "10:00 am",
    color: "#B6F36B",
    isDefault: true,
    repeatType: "daily",
    daysOfWeek: [1, 2, 3, 4, 5],
    SendNotification: true,
    soundName: "default",
  },
];

export async function getInitialReminders(): Promise<Reminder[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed = json ? JSON.parse(json) : null;
    if (parsed?.length) {
      return parsed;
    }
  } catch (e) {
    console.error("Error reading reminders", e);
  }

  // Fallback to defaults
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_REMINDERS));
  return DEFAULT_REMINDERS;
}

export async function saveReminder(reminder: Reminder): Promise<Reminder[]> {
  const all = await getInitialReminders();
  const updated = [...all, reminder];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export async function updateReminder(reminder: Reminder): Promise<Reminder[]> {
  const all = await getInitialReminders();
  const updated = all.map((r) => (r.id === reminder.id ? reminder : r));
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export async function deleteReminder(id: string): Promise<Reminder[]> {
  const all = await getInitialReminders();
  const toDelete = all.find((r) => r.id === id);
  if (toDelete?.isDefault) {
    console.warn("Default reminders cannot be deleted.");
    return all;
  }
  const updated = all.filter((r) => r.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
