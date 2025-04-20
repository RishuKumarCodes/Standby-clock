import { useState, useEffect } from "react";
import { Reminder, getInitialReminders } from "../storage/remindersStorage";

export default function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    (async () => {
      const initial = await getInitialReminders();
      setReminders(initial);
    })();
  }, []);

  return { reminders, setReminders };
}
