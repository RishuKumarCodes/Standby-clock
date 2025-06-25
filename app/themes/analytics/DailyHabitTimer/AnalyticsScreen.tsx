import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import Summary from "./components/Summary";
import LineChartComponent from "./components/LineChartComponent";
import PieChartComponent from "./components/PieChartComponent";
import CalendarGridGraph from "./components/CalendarGridGraph";

import {
  get90DayHistory,
  getTimers,
} from "@/app/storage/themesStorage/todos/DailyHabitTimer";
import { ThemeProps } from "@/app/types/ThemesTypes";
import PreviewScreen from "./components/PreviewScreen";
import { DimTxt, H1Light, MdTxt } from "@/app/components/ui/CustomText";

const BG = "#000";
const TEXT = "#EEE";
const COLORS = [
  "#276BF6",
  "#19B953",
  "#F3620D",
  "#F4C807",
  "#EC2986",
  "#D128E3",
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
];

const fmt = (sec: number) => {
  if (!sec) return "0.0m";
  const totalMinutes = sec / 60;

  // If less than 60 minutes, show decimal minutes
  if (totalMinutes < 60) {
    return `${totalMinutes.toFixed(1)}m`;
  }

  // If 60+ minutes, show hours with decimal minutes
  const h = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  if (remainingMinutes === 0) {
    return `${h}h`;
  }

  return `${h}h ${remainingMinutes.toFixed(1)}m`;
};

type DayEntry = {
  date: string;
  total: number;
  completionPercentage: number;
};

type Timer = {
  id: string;
  name: string;
  duration: number;
};

const buildCalendar = (
  history: Record<string, number>[],
  timers: Timer[],
  filterId: string
): (DayEntry | null)[][] => {
  const days: DayEntry[] = [];

  for (let i = 89; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const log = history.find((h) => h.date === iso) || {};

    let total: number;
    let completionPercentage: number;

    if (filterId === "all") {
      // For "all": sum actual time and target time, then calculate percentage
      const actualTotal = timers.reduce((s, t) => s + (log[t.id] || 0), 0);
      const targetTotal = timers.reduce((s, t) => s + t.duration, 0);
      total = actualTotal;
      completionPercentage =
        targetTotal > 0 ? Math.min((actualTotal / targetTotal) * 100, 100) : 0;
    } else {
      // For individual timer: calculate completion percentage
      const timer = timers.find((t) => t.id === filterId);
      if (timer) {
        const actualTime = log[filterId] || 0;
        total = actualTime;
        completionPercentage = Math.min(
          (actualTime / timer.duration) * 100,
          100
        );
      } else {
        total = 0;
        completionPercentage = 0;
      }
    }

    days.push({
      date: iso,
      total,
      completionPercentage: Math.round(completionPercentage),
    });
  }

  const firstWeekday = new Date(days[0].date).getDay();
  const cells: (DayEntry | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...days,
  ];
  while (cells.length % 7) cells.push(null);

  const weeks: (DayEntry | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7) as (DayEntry | null)[]);
  }

  return weeks;
};

export default function AnalyticsScreen({
  color,
  variant = "full",
}: ThemeProps) {
  const [history, setHistory] = useState<any[]>([]);
  const [timers, setTimers] = useState<Timer[]>([]);
  const [filterTimer, setFilterTimer] = useState<"all" | string>("all");

  useEffect(() => {
    (async () => {
      setHistory(await get90DayHistory());
      setTimers(await getTimers());
    })();
  }, []);

  if (variant != "full") {
    return <PreviewScreen variant={variant} color={color} />;
  }

  const { calendarWeeks, monthLabels, maxCal } = useMemo(() => {
    const weeks = buildCalendar(history, timers, filterTimer);
    const allTotals = weeks
      .flat()
      .filter(Boolean)
      .map((d) => d!.total);
    const maxVal = Math.max(...allTotals, 1);

    let prevMonth = -1;
    const monthLabels = weeks.map((week) => {
      const firstDay = week.find((d) => d);
      if (!firstDay) return "";
      const m = new Date(firstDay.date).getMonth();
      if (m !== prevMonth) {
        prevMonth = m;
        return new Date(firstDay.date).toLocaleString("default", {
          month: "short",
        });
      }
      return "";
    });

    return {
      calendarWeeks: weeks,
      monthLabels,
      maxCal: maxVal,
    };
  }, [history, timers, filterTimer]);

  if (!history.length || !timers.length) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS[0]} />
        <MdTxt>Fetching data...</MdTxt>
        <DimTxt>Use focus sessions to see your analytics</DimTxt>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={{ height: 30 }}></View>
      <View style={{ flexDirection: "row" }}>
        <Summary history={history} timers={timers} fmt={fmt} />
        <PieChartComponent
          history={history}
          timers={timers}
          fmt={fmt}
          colors={COLORS}
        />
      </View>

      <View style={{ height: 40 }}></View>

      <LineChartComponent
        history={history}
        timers={timers}
        COLORS={COLORS}
        primaryColor={color}
      />

      <View style={{ height: 30 }}></View>

      <CalendarGridGraph
        filterTimer={filterTimer}
        setFilterTimer={setFilterTimer}
        timers={timers}
        calendarWeeks={calendarWeeks}
        monthLabels={monthLabels}
        maxCal={maxCal}
        primaryColor={color}
      />
      <View style={{ height: 40 }}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    padding: 8,
    height: "100%",
    width: "100%",
    position: "absolute",
    paddingHorizontal: 35,
  },
  loader: {
    position: "absolute",
    height: "100%",
    width: "100%",
    flex: 1,
    backgroundColor: BG,
    justifyContent: "center",
    alignItems: "center",
  },
});
