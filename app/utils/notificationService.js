import dayjs from "dayjs";
import { getInitialReminders } from "../storage/remindersStorage";

// Already existing
export async function scheduleReminderNotification(reminder) {
  // ... unchanged ...
}

// Already existing
export async function scheduleAllReminders() {
  const reminders = await getInitialReminders();
  const toSchedule = reminders.filter((r) => r.enabled && r.SendNotification);
  for (const r of toSchedule) await scheduleReminderNotification(r);
}

// Modified version with onFire callback
function parseIntervalToMinutes(interval) {
  if (!interval) return null;
  const [h, m] = interval.split(":").map(Number);
  return h * 60 + m;
}

function scheduleInAppReminder(reminder, onFire) {
  const now = dayjs();

  if (reminder.repeatType === "daily") {
    const [hStr, mStr] = dayjs(reminder.startTime, "hh:mm a")
      .format("HH:mm")
      .split(":"); 
    let next = now.hour(+hStr).minute(+mStr).second(0);
    if (next.isBefore(now)) next = next.add(1, "day");
    const delay = next.diff(now);

    setTimeout(function fireDaily() {
      onFire(reminder);
      setTimeout(fireDaily, 24 * 60 * 60 * 1000);
    }, delay);
  } else if (reminder.repeatType === "hourly") {
    const minutes = parseIntervalToMinutes(reminder.interval);
    if (!minutes) return;

    setTimeout(function fireHourly() {
      onFire(reminder);
      setInterval(() => onFire(reminder), minutes * 60 * 1000);
    }, minutes * 60 * 1000);
  }
}

// ✅ Use this in your Layout.js
export async function scheduleAllInAppReminders(onFire) {
  const reminders = await getInitialReminders();
  const enabled = reminders.filter((r) => r.enabled);
  enabled.forEach((r) => scheduleInAppReminder(r, onFire));
}
