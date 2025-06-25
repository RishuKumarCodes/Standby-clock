import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "DAILY_HABIT_TIMERS";
const STATE_KEY = "DAILY_HABIT_TIMER_STATE";
const HISTORY_KEY = "DAILY_HABIT_HISTORY";
const SETTINGS_KEY = "DAILY_HABIT_TIMER_SETTINGS";
const INITIALIZED_KEY = "DAILY_HABIT_TIMERS_INITIALIZED";

export interface Timer {
  id: string;
  name: string;
  duration: number;
}

interface StoredTimerState {
  remainingSecs: number;
  lastDate: string; // e.g. "2025-06-16"
}

export interface HistoryLog {
  [dateISO: string]: number;
}

export interface TimerSettings {
  autoStartNext: boolean;
  beepOnStart: boolean;
}

export const DEFAULT_TIMERS: Timer[] = [
  {
    id: "1",
    name: "Swipe up",
    duration: 60,
  },
  {
    id: "2",
    name: "Set focus sessions",
    duration: 60,
  },
  {
    id: "3",
    name: "study, Gym, break",
    duration: 60,
  },
];

const todayISO = () => new Date().toISOString().slice(0, 10);

// ─── Settings Persistence ───────────────────────────────────────────────
// Added settings functions
export const getSettings = async (): Promise<TimerSettings> => {
  const data = await AsyncStorage.getItem(SETTINGS_KEY);
  return data ? JSON.parse(data) : { autoStartNext: false, beepOnStart: false };
};

export const updateSettings = async (settings: TimerSettings) => {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

// ─── Timer List Persistence ───────────────────────────────────────────────
export const getTimers = async (): Promise<Timer[]> => {
  try {
    const isInitialized = await AsyncStorage.getItem(INITIALIZED_KEY);

    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data !== null && data !== "null") {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        if (isInitialized === null) {
          await AsyncStorage.setItem(INITIALIZED_KEY, "true");
        }
        return parsed;
      }
    }

    if (isInitialized === null) {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TIMERS));
        await AsyncStorage.setItem(INITIALIZED_KEY, "true");
        return DEFAULT_TIMERS;
      } catch (e) {
        console.error("Error writing default timers to storage:", e);
      }
    }
    return [];
  } catch (e) {
    console.error("Error reading timers from storage:", e);
    return [];
  }
};

export const updateTimers = async (timers: Timer[]) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(timers));
};

export const loadTimerState = async (
  id: string,
  defaultDuration: number
): Promise<number> => {
  const raw = await AsyncStorage.getItem(STATE_KEY);
  const allStates: Record<string, StoredTimerState> = raw
    ? JSON.parse(raw)
    : {};
  const state = allStates[id];
  if (!state || state.lastDate !== todayISO()) {
    return defaultDuration;
  }
  return state.remainingSecs;
};

export const saveTimerState = async (id: string, remainingSecs: number) => {
  const raw = await AsyncStorage.getItem(STATE_KEY);
  const allStates: Record<string, StoredTimerState> = raw
    ? JSON.parse(raw)
    : {};
  allStates[id] = { remainingSecs, lastDate: todayISO() };
  await AsyncStorage.setItem(STATE_KEY, JSON.stringify(allStates));
};

export const logSessionUsage = async (
  secsUsed: number,
  id: string
): Promise<void> => {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  const hist: Record<string, Record<string, number>> = raw
    ? JSON.parse(raw)
    : {};

  const today = todayISO();
  if (typeof hist[today] !== "object" || hist[today] === null) {
    hist[today] = {};
  }
  hist[today][id] = (hist[today][id] || 0) + secsUsed;

  const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;
  for (const dateStr of Object.keys(hist)) {
    if (new Date(dateStr).getTime() < cutoff) {
      delete hist[dateStr];
    }
  }

  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(hist));
};

export const get90DayHistory = async (): Promise<
  { date: string; [timerId: string]: number }[]
> => {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  const hist: Record<string, Record<string, number>> = raw
    ? JSON.parse(raw)
    : {};

  // grab your timers so you know which IDs to include
  const timers = await getTimers();
  const ids = timers.map((t) => t.id);

  const arr: { date: string; [timerId: string]: number }[] = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400e3);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    const date = d.toISOString().slice(0, 10);

    const entry: { date: string; [timerId: string]: number } = { date };
    ids.forEach((id) => {
      entry[id] = hist[date]?.[id] || 0;
    });
    arr.push(entry);
  }

  return arr;
};
