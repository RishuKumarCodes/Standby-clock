import { Pressable, StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useMemo, useState } from "react";
import { LineChart } from "react-native-chart-kit";
import { MdTxt } from "@/app/components/ui/CustomText";
import { ScrollView } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");

const BG = "#000";
const TEXT = "#EEE";
const CARD_BG = "#1C1C1E";
const ACTIVE = "#007AFF";

type Timer = {
  id: string;
  name: string;
};

type HistoryEntry = Record<string, number> & { date: string };

interface LineChartComponentProps {
  history: HistoryEntry[];
  timers: Timer[];
  COLORS: string[];
  primaryColor: string;
}

const formatLabel = (iso: string) => {
  const d = new Date(iso);
  const D = d.getDate().toString().padStart(2, "0");
  return `\n${D}`;
};

const LineChartComponent: React.FC<LineChartComponentProps> = ({
  history,
  timers,
  COLORS,
  primaryColor,
}) => {
  const [span, setSpan] = useState<7 | 30 | 90>(30);
  const [unit, setUnit] = useState<'minutes' | 'hours'>('minutes');

  const { lineLabels, lineDatasets, maxValue } = useMemo(() => {
    const raw = history.slice(-span);
    let labels: string[], datasets: any[];

    // Convert seconds to chosen unit
    const convertTime = (seconds: number) => {
      if (unit === 'minutes') {
        return parseFloat((seconds / 60).toFixed(1));
      } else {
        return parseFloat((seconds / 3600).toFixed(2));
      }
    };

    if (span === 90) {
      const bucketSize = Math.ceil(90 / 15);
      const buckets: Record<number, HistoryEntry[]> = {};
      raw.forEach((d, i) => {
        const b = Math.floor(i / bucketSize);
        (buckets[b] = buckets[b] || []).push(d);
      });

      labels = Object.values(buckets).map((arr) => {
        const s = formatLabel(arr[0].date);
        const e = formatLabel(arr[arr.length - 1].date);
        return `${s}–${e}`;
      });

      datasets = timers.map((t, i) => ({
        data: Object.values(buckets).map((arr) =>
          convertTime(arr.reduce((s, d) => s + (d[t.id] || 0), 0))
        ),
        color: () => COLORS[i % COLORS.length],
        strokeWidth: 2,
      }));
    } else {
      labels = raw.map((d) => formatLabel(d.date));
      datasets = timers.map((t, i) => ({
        data: raw.map((d) => convertTime(d[t.id] || 0)),
        color: () => COLORS[i % COLORS.length],
        strokeWidth: 2,
      }));
    }

    // Calculate max value across all datasets for better scaling
    const allValues = datasets.flatMap(d => d.data);
    const maxVal = Math.max(...allValues, unit === 'minutes' ? 5 : 0.1); // Minimum scale

    return {
      lineLabels: labels,
      lineDatasets: datasets,
      maxValue: maxVal,
    };
  }, [history, timers, span, unit]);

  // Dynamic chart configuration based on unit and data
  const chartConfig = {
    backgroundGradientFrom: BG,
    backgroundGradientTo: BG,
    decimalPlaces: unit === 'minutes' ? 1 : 2,
    color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
    labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
    propsForLabels: { fontSize: "10" },
    propsForBackgroundLines: {
      stroke: "rgba(255, 255, 255, 0.14)",
      strokeWidth: "1.2",
      strokeDasharray: "",
    },
    propsForDots: {
      r: "2.5",
    },
    // Set a reasonable Y-axis range to make small values visible
    yAxisInterval: unit === 'minutes' ? Math.max(1, Math.ceil(maxValue / 10)) : Math.max(0.1, Math.ceil(maxValue / 10)),
  };

  // Determine best unit based on data
  const suggestedUnit = useMemo(() => {
    const totalSeconds = history.slice(-span).reduce((total, day) => {
      return total + timers.reduce((dayTotal, timer) => {
        return dayTotal + (day[timer.id] || 0);
      }, 0);
    }, 0);
    
    const avgPerDay = totalSeconds / span;
    return avgPerDay > 3600 ? 'hours' : 'minutes'; // If avg > 1 hour per day, use hours
  }, [history, timers, span]);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={styles.filterRow}>
          {[7, 30, 90].map((v) => (
            <Pressable
              key={v}
              onPress={() => setSpan(v)}
              style={[
                styles.filterButton,
                span === v && { backgroundColor: primaryColor },
              ]}
            >
              <MdTxt
                style={[
                  styles.filterText,
                  span === v && styles.filterTextActive,
                ]}
              >
                {v}d
              </MdTxt>
            </Pressable>
          ))}
        </View>
        
        <View style={styles.filterRow}>
          {['minutes', 'hours'].map((u) => (
            <Pressable
              key={u}
              onPress={() => setUnit(u as 'minutes' | 'hours')}
              style={[
                styles.filterButton,
                { marginRight: 5 },
                unit === u && { backgroundColor: primaryColor },
              ]}
            >
              <MdTxt
                style={[
                  styles.filterText,
                  unit === u && styles.filterTextActive,
                ]}
              >
                {u}
              </MdTxt>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Suggested unit hint */}
      {/* {unit !== suggestedUnit && (
        <View style={{ marginBottom: 8 }}>
          <Text style={{ color: '#888', fontSize: 12, textAlign: 'center' }}>
            💡 Try "{suggestedUnit}" for better visibility
          </Text>
        </View>
      )} */}

      <View style={{ paddingBottom: 8 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            justifyContent: "flex-end",
            flexDirection: "row",
            flexWrap: "nowrap",
            marginBottom: 8,
          }}
        >
          {timers.map((t, i) => (
            <View
              key={t.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 12,
              }}
            >
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: COLORS[i % COLORS.length],
                  marginRight: 4,
                }}
              />
              <Text style={{ color: TEXT, fontSize: 12 }}>{t.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <LineChart
        data={{
          labels: lineLabels,
          datasets: lineDatasets.length > 0 ? lineDatasets : [
            // Fallback empty dataset to prevent crashes
            {
              data: lineLabels.map(() => 0),
              color: () => 'rgba(255,255,255,0.2)',
              strokeWidth: 1,
            }
          ],
        }}
        withHorizontalLines={true}
        withVerticalLines={false}
        width={width - 15}
        height={240}
        chartConfig={chartConfig}
        bezier
        formatYLabel={(y) => `${parseFloat(y).toFixed(unit === 'minutes' ? 1 : 2)}${unit === 'minutes' ? 'm' : 'h'}`}
        style={styles.chart}
        fromZero={true} // This ensures the chart starts from 0
      />

      {/* Debug info (remove in production) */}
      {/* <View style={{ marginTop: 8, padding: 8, backgroundColor: '#111', borderRadius: 4 }}>
        <Text style={{ color: '#666', fontSize: 10 }}>
          Debug: Max value: {maxValue.toFixed(2)} {unit}, 
          Datasets: {lineDatasets.length}, 
          Data points: {lineDatasets[0]?.data?.length || 0}
        </Text>
        {lineDatasets.map((dataset, i) => (
          <Text key={i} style={{ color: COLORS[i % COLORS.length], fontSize: 10 }}>
            {timers[i]?.name}: [{dataset.data.slice(0, 5).map(v => v.toFixed(1)).join(', ')}...]
          </Text>
        ))}
      </View> */}
    </>
  );
};

export default LineChartComponent;

const styles = StyleSheet.create({
  filterRow: { flexDirection: "row", marginVertical: 12 },
  filterButton: {
    paddingVertical: 6,
    paddingBottom: 2,
    paddingHorizontal: 14,
    marginRight: 5,
    backgroundColor: CARD_BG,
    borderRadius: 20,
  },
  filterText: { color: "#888", fontSize: 14 },
  filterTextActive: { color: "#000" },
  title: { color: TEXT, fontSize: 16, fontWeight: "600", marginBottom: 4 },
  chart: { borderRadius: 8, marginVertical: 8, marginLeft: -20 },
});