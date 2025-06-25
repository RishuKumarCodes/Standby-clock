import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import React, { useMemo } from "react";
import { MdTxt } from "@/app/components/ui/CustomText";

const CELL_SIZE = 20;
const CELL_MARGIN = 4;
const LEGEND_SIZE = 12;

type DayEntry = { 
  date: string; 
  total: number; 
  completionPercentage: number; // New field for completion percentage
};

type Timer = { 
  id: string; 
  name: string; 
  duration: number; // Timer duration in seconds
};

interface Props {
  setFilterTimer: (id: string) => void;
  filterTimer: string;
  timers: Timer[];
  calendarWeeks: (DayEntry | null)[][];
  monthLabels: string[]; // label per week index, empty string if none
  maxCal: number;
  primaryColor: string;
}

const LEGEND_STEPS = [
  { label: "0%", opacity: 0.1 },
  { label: "1-25%", opacity: 0.3 },
  { label: "26-50%", opacity: 0.5 },
  { label: "51-75%", opacity: 0.7 },
  { label: "76-100%", opacity: 0.9 },
];

// Helper function to calculate completion percentage opacity
const getCompletionOpacity = (completionPercentage: number): number => {
  if (completionPercentage === 0) return 0.1;
  if (completionPercentage <= 25) return 0.3;
  if (completionPercentage <= 50) return 0.5;
  if (completionPercentage <= 75) return 0.7;
  return 0.9; // 76-100%
};

const CalendarGridGraph: React.FC<Props> = ({
  filterTimer,
  setFilterTimer,
  timers,
  calendarWeeks,
  monthLabels,
  maxCal,
  primaryColor,
}) => {
  // Pre-compute each month's column span
  const monthSpans = useMemo(() => {
    const spans: { label: string; span: number }[] = [];
    for (let i = 0; i < monthLabels.length; i++) {
      const label = monthLabels[i];
      if (label) {
        let span = 1;
        let j = i + 1;
        while (j < monthLabels.length && monthLabels[j] === "") {
          span++;
          j++;
        }
        spans.push({ label, span });
        i = j - 1;
      }
    }
    return spans;
  }, [monthLabels]);

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          <Pressable
            onPress={() => setFilterTimer("all")}
            style={[
              styles.filterButton,
              filterTimer === "all" && { backgroundColor: primaryColor },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                filterTimer === "all" && styles.filterTextActive,
              ]}
            >
              All
            </Text>
          </Pressable>
          {timers.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => setFilterTimer(t.id)}
              style={[
                styles.filterButton,
                filterTimer === t.id && { backgroundColor: primaryColor },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  filterTimer === t.id && styles.filterTextActive,
                ]}
              >
                {t.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <MdTxt style={styles.title}>Last 90 Days</MdTxt>
      </View>

      <View style={styles.calendarSection}>
        <View style={{ marginLeft: 40 }}>
          {/* Day Cells */}
          <View style={styles.calendar}>
            {calendarWeeks.map((week, wi) => (
              <View
                key={wi}
                style={[
                  styles.weekColumn,
                  monthLabels[wi] && { marginLeft: CELL_MARGIN * 4 },
                ]}
              >
                {week.map((cell, di) => (
                  <View
                    key={di}
                    style={
                      cell
                        ? [
                            styles.dayCell,
                            {
                              backgroundColor: primaryColor,
                              opacity: getCompletionOpacity(cell.completionPercentage),
                            },
                          ]
                        : [styles.dayCell, styles.emptyCell]
                    }
                  />
                ))}
              </View>
            ))}
          </View>

          {/* Month Labels Row */}
          <View style={styles.monthRow}>
            {monthSpans.map(({ label, span }, idx) => (
              <MdTxt
                key={idx}
                style={[
                  styles.monthLabel,
                  { width: span * CELL_SIZE + (span - 1) * CELL_MARGIN },
                ]}
              >
                {label}
              </MdTxt>
            ))}
          </View>
        </View>

        {/* Legend */}
        <View style={{ gap: 4, marginBottom: 10, marginLeft: 20 }}>
          {LEGEND_STEPS.map(({ label, opacity }) => (
            <View key={label} style={styles.legendItem}>
              <View
                style={[
                  styles.legendBlock,
                  { backgroundColor: primaryColor, opacity },
                ]}
              />
              <MdTxt style={styles.legendText}>{label}</MdTxt>
            </View>
          ))}
        </View>
      </View>
    </>
  );
};

export default CalendarGridGraph;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  filterRow: { flexDirection: "row" },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
  },
  filterText: { color: "#888", fontSize: 14 },
  filterTextActive: { color: "#000" },
  title: { color: "#ccc", fontSize: 16 },

  calendarSection: {
    alignItems: "center",
    flexDirection: "row",
    gap: 40,
    marginTop: 15,
    justifyContent: "center",
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginLeft: CELL_SIZE / 1.2,
    marginBottom: 4,
  },
  monthLabel: {
    textAlign: "center",
    fontSize: 14,
    color: "#fff",
  },
  calendar: { flexDirection: "row" },
  weekColumn: { flexDirection: "column", marginRight: CELL_MARGIN },
  dayCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    marginBottom: CELL_MARGIN,
    borderRadius: 4,
  },
  emptyCell: { backgroundColor: "transparent" },
  legendItem: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    marginRight: 12,
  },
  legendBlock: {
    width: LEGEND_SIZE,
    height: LEGEND_SIZE,
    borderRadius: 2,
    marginRight: 4,
  },
  legendText: { fontSize: 13, color: "#fff" },
});