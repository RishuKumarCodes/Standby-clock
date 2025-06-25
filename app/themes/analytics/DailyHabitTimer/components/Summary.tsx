import { StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import { H1Light, MdTxt } from "@/app/components/ui/CustomText";

interface SummaryProps {
  history: Record<string, number>[];
  timers: { id: string; name: string }[];
  fmt: (sec: number) => string;
}

const Summary: React.FC<SummaryProps> = ({ history, timers, fmt }) => {
  const { summary } = useMemo(() => {
    const weekTotal = history
      .slice(-7)
      .reduce(
        (sum, d) => sum + timers.reduce((s, t) => s + (d[t.id] || 0), 0),
        0
      );
    const avgDay = history.length
      ? Math.floor(
          history.reduce(
            (sum, d) => sum + timers.reduce((s, t) => s + (d[t.id] || 0), 0),
            0
          ) / history.length
        )
      : 0;

    // Get today's total
    const todayISO = new Date().toISOString().slice(0, 10);
    const todayEntry = history.find(d => d.date === todayISO);
    const todayTotal = todayEntry 
      ? timers.reduce((s, t) => s + (todayEntry[t.id] || 0), 0)
      : 0;

    let streak = 0,
      bestStreak = 0;
    history
      .map((d) => timers.reduce((s, t) => s + (d[t.id] || 0), 0))
      .forEach((sec) => {
        if (sec > 0) {
          streak++;
          bestStreak = Math.max(bestStreak, streak);
        } else streak = 0;
      });

    return {
      summary: { weekTotal, avgDay, bestStreak, todayTotal },
    };
  }, [history, timers]);

  return (
    <View style={styles.summaryRow}>
      <View style={{ flexDirection: "row", flex: 1 }}>
        <View style={styles.card}>
          <MdTxt style={styles.cardLabel}>Today</MdTxt>
          <H1Light style={styles.cardValue}>{fmt(summary.todayTotal)}</H1Light>
        </View>

        <View style={styles.card}>
          <MdTxt style={styles.cardLabel}>This Week</MdTxt>
          <H1Light style={styles.cardValue}>{fmt(summary.weekTotal)}</H1Light>
        </View>
      </View>
      <View style={{ flexDirection: "row", flex: 1 }}>
        <View style={styles.card}>
          <MdTxt style={styles.cardLabel}>Avg/Day</MdTxt>
          <H1Light style={styles.cardValue}>{fmt(summary.avgDay)}</H1Light>
        </View>

        <View style={styles.card}>
          <MdTxt style={styles.cardLabel}>Best Streak</MdTxt>
          <H1Light
            style={styles.cardValue}
          >{`${summary.bestStreak} days`}</H1Light>
        </View>
      </View>
    </View>
  );
};

export default Summary;

const styles = StyleSheet.create({
  summaryRow: {
    justifyContent: "space-between",
    flex: 1,
    padding: 8,
    alignItems: "center",
  },
  card: {
    width: "50%",
    flex: 1,
    margin: 2.5,
    padding: 15,
    borderRadius: 20,
    justifyContent: "space-between",
    backgroundColor: "#191919",
  },
  cardValue: { fontSize: 28, color: "#EEE", marginBottom: -8 },

  cardLabel: {
    fontSize: 15,
    color: "#999",
  },
});