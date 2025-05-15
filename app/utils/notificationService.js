import dayjs from "dayjs";
import * as Notifications from "expo-notifications";
import {
  getInitialReminders,
  updateReminder,
} from "../storage/remindersStorage";

/**
 * Parse "HH:MM" → total minutes
 */
function parseIntervalToMinutes(interval) {
  if (!interval) return null;
  const [h, m] = interval.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Save the notificationId back into storage so we can cancel/update it later
 */
async function persistNotificationId(reminderId, notificationId) {
  const all = await getInitialReminders();
  const rem = all.find((r) => r.id === reminderId);
  if (!rem) return;
  // inject notificationId and persist
  await updateReminder({ ...rem, notificationId });
}

/**
 * Schedule (or re-schedule) one OS notification for this reminder.
 * Cancels any previously scheduled one, then sets the new schedule.
 */
export async function scheduleReminderNotification(reminder) {
  // 1) cancel old
  if (reminder.notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(
        reminder.notificationId
      );
    } catch (e) {
      console.warn("Failed to cancel old notification:", e);
    }
  }

  // 2) build payload
  const content = {
    title: reminder.title,
    body: reminder.title,     // or use a separate body field if you have one
    sound: true,
    data: { reminderId: reminder.id },
  };

  // 3) build trigger
  let trigger = null;

  if (reminder.repeatType === "daily") {
    // "06:00 am" → [hour, minute]
    const [hour, minute] = dayjs(reminder.startTime, "hh:mm a")
      .format("HH:mm")
      .split(":")
      .map(Number);
    trigger = { hour, minute, repeats: true };

  } else if (reminder.repeatType === "hourly") {
    const mins = parseIntervalToMinutes(reminder.interval);
    if (mins) trigger = { seconds: mins * 60, repeats: true };

  } else {
    // one-off (if you ever need it): require `reminder.startDateTime` as ISO
    if (reminder.startDateTime) {
      const when = dayjs(reminder.startDateTime);
      if (when.isAfter(dayjs())) trigger = when.toDate();
    }
  }

  if (!trigger) {
    console.warn("No valid trigger for reminder", reminder.id);
    return;
  }

  // 4) schedule it
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content,
      trigger,
    });
    // 5) persist the new ID
    await persistNotificationId(reminder.id, notificationId);
  } catch (err) {
    console.error("Error scheduling notification:", err);
  }
}

/**
 * Loop all reminders; if both enabled+SendNotification, schedule OS push.
 */
export async function scheduleAllReminders() {
  const all = await getInitialReminders();
  for (const r of all) {
    if (r.enabled && r.SendNotification) {
      await scheduleReminderNotification(r);
    }
  }
}

/**
 * JS-thread in-app fallback: calls onFire(reminder) whenever `enabled` ticks.
 */
function scheduleInAppReminder(reminder, onFire) {
  const now = dayjs();

  if (reminder.repeatType === "daily") {
    const [h, m] = dayjs(reminder.startTime, "hh:mm a")
      .format("HH:mm")
      .split(":")
      .map(Number);

    let next = now.hour(h).minute(m).second(0);
    if (next.isBefore(now)) next = next.add(1, "day");
    const delay = next.diff(now);

    setTimeout(function fireDaily() {
      onFire(reminder);
      setTimeout(fireDaily, 24 * 60 * 60 * 1000);
    }, delay);

  } else if (reminder.repeatType === "hourly") {
    const mins = parseIntervalToMinutes(reminder.interval);
    if (!mins) return;

    setTimeout(function fireHourly() {
      onFire(reminder);
      setInterval(() => onFire(reminder), mins * 60 * 1000);
    }, mins * 60 * 1000);
  }
}

/**
 * Public: wire up all in-app popups for reminders where enabled === true.
 */
export async function scheduleAllInAppReminders(onFire) {
  const all = await getInitialReminders();
  all
    .filter((r) => r.enabled)
    .forEach((r) => scheduleInAppReminder(r, onFire));
}
