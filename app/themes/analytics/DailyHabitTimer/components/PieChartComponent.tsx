import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { G, Path, Text as SvgText } from "react-native-svg";

const RADIUS = 80;
const STROKE_WIDTH = 24;
const GAP_DEGREE = 3; // degrees of gap between slices
const CENTER = RADIUS + STROKE_WIDTH / 2; // true geometric center

type Timer = { id: string; name: string };

interface Props {
  history: Record<string, number>[];
  timers: Timer[];
  fmt: (sec: number) => string;
  colors: string[];
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(a),
    y: cy + r * Math.sin(a),
  };
}

// Draw from startAngle → endAngle, clockwise (sweepFlag=1)
function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M",
    start.x,
    start.y,
    "A",
    r,
    r,
    0,
    largeArcFlag,
    1,
    end.x,
    end.y,
  ].join(" ");
}

export default function DonutChart({ history, timers, colors, fmt }: Props) {
  // 1) compute totals
  const rawTotals = timers.map((t) =>
    history.reduce((sum, day) => sum + (day[t.id] || 0), 0)
  );

  // 2) filter out zeros
  const data = timers
    .map((t, i) => ({ timer: t, total: rawTotals[i] }))
    .filter((d) => d.total > 0);

  if (data.length === 0) {
    return (
      <View style={[styles.wrapper, { justifyContent: "center" }]}>
        <Text style={{ color: "#EEE" }}>No data to display</Text>
      </View>
    );
  }

  const grandTotal = data.reduce((sum, d) => sum + d.total, 0);

  // 3) figure out how much angle is reserved for gaps + round caps
  const capAngleDeg = (STROKE_WIDTH / 2 / RADIUS) * (180 / Math.PI);
  const reserved = data.length * (2 * capAngleDeg + GAP_DEGREE);

  // 4) split the remaining
  const available = 360 - reserved;
  const sliceAngles = data.map((d) => (d.total / grandTotal) * available);

  // 5) build segments
  let cursor = 0;
  const segments = sliceAngles.map((sweep, i) => {
    const start = cursor + capAngleDeg + GAP_DEGREE / 2;
    const end = start + sweep;
    cursor += sweep + 2 * capAngleDeg + GAP_DEGREE;
    return {
      path: describeArc(CENTER, CENTER, RADIUS, start, end),
      color: colors[i % colors.length],
      label: `${data[i].timer.name} (${fmt(data[i].total)})`,
    };
  });

  return (
    <View style={styles.wrapper}>
      <Svg width={CENTER * 2} height={CENTER * 2}>
        <G>
          {segments.map((seg, idx) => (
            <Path
              key={idx}
              d={seg.path}
              stroke={seg.color}
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeLinecap="round"
            />
          ))}
        </G>
        <SvgText
          x={CENTER}
          y={CENTER + 4}
          fill="#bbb"
          fontSize="16"
          textAnchor="middle"
        >
          90d Stats
        </SvgText>
      </Svg>

      <View style={styles.legend}>
        {segments.map((seg, i) => (
          <View key={i} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: seg.color }]} />
            <Text style={styles.label}>{seg.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  legend: {
    marginLeft: 16,
    flexShrink: 1,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  label: {
    color: "#EEE",
    fontSize: 13,
  },
});
