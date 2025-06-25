import { StyleSheet, View, Text } from "react-native";
import React from "react";
import { H1Light } from "@/app/components/ui/CustomText";
import { ClockVariant, ThemeProps } from "@/app/types/ThemesTypes";
import Svg, { G, Path, Text as SvgText } from "react-native-svg";

const VARIANT_CONFIG: Record<
  ClockVariant,
  { scaleFactor: number; fontFactor: number }
> = {
  full: { scaleFactor: 1, fontFactor: 1 },
  themeCard: { scaleFactor: 0.55, fontFactor: 0.36 },
  smallPreview: { scaleFactor: 0.24, fontFactor: 0.12 },
  colorSettings: { scaleFactor: 0.72, fontFactor: 0.45 },
};

// Mini donut chart component
const MiniDonutChart = ({
  scaleFactor,
  fontFactor,
}: {
  scaleFactor: number;
  fontFactor: number;
}) => {
  const RADIUS = 60 * scaleFactor;
  const STROKE_WIDTH = 18 * scaleFactor;
  const CENTER = RADIUS + STROKE_WIDTH / 2;

  const data = [
    { name: "Focus", value: 45, color: "#276BF6" },
    { name: "Break", value: 15, color: "#19B953" },
    { name: "Deep Work", value: 30, color: "#F3620D" },
    { name: "Meetings", value: 10, color: "#F4C807" },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const polarToCartesian = (
    cx: number,
    cy: number,
    r: number,
    angleDeg: number
  ) => {
    const a = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(a),
      y: cy + r * Math.sin(a),
    };
  };

  const describeArc = (
    cx: number,
    cy: number,
    r: number,
    startAngle: number,
    endAngle: number
  ) => {
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
  };

  let currentAngle = 0;
  const GAP_DEGREES = 20;

  const segments = data.map((item) => {
    const angle = (item.value / total) * (360 - data.length * GAP_DEGREES); // Account for gaps
    const startAngle = currentAngle + GAP_DEGREES / 2;
    const endAngle = startAngle + angle;
    currentAngle = endAngle + GAP_DEGREES / 2;

    return {
      path: describeArc(CENTER, CENTER, RADIUS, startAngle, endAngle),
      color: item.color,
      name: item.name,
      value: item.value,
    };
  });

  return (
    <View style={styles.chartWrapper}>
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
          y={CENTER + 2 * scaleFactor}
          fill="#bbb"
          fontSize={12 * scaleFactor}
          textAnchor="middle"
        >
          Analytics
        </SvgText>
      </Svg>

      <View style={styles.legend}>
        {segments.map((seg, i) => (
          <View key={i} style={styles.legendItem}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: seg.color,
                  width: 8 * scaleFactor,
                  height: 8 * scaleFactor,
                  borderRadius: 4 * scaleFactor,
                },
              ]}
            />
            <Text style={[styles.label, { fontSize: 17 * fontFactor }]}>
              {seg.name} ({seg.value}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const PreviewScreen = ({ color, variant = "full" }: ThemeProps) => {
  const { scaleFactor } = VARIANT_CONFIG[variant];
  const { fontFactor } = VARIANT_CONFIG[variant];

  return (
    <View style={{ flexDirection: "row", flex: 1 }}>
      <View style={styles.leftCard}>
        <H1Light
          style={{
            fontSize: 40 * fontFactor,
            backgroundColor: "#191919",
            padding: "10%",
            borderRadius: 23 * scaleFactor,
            color: "#ccc",
            textAlign: "center",
          }}
        >
          Focus Sessions Analytics
        </H1Light>
      </View>
      <View style={[styles.rightCard]}>
        <MiniDonutChart scaleFactor={scaleFactor} fontFactor={fontFactor} />
      </View>
    </View>
  );
};

export default PreviewScreen;

const styles = StyleSheet.create({
  leftCard: {
    height: "100%",
    padding: "5%",
    paddingRight: "2%",
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
  },
  rightCard: {
    height: "100%",
    width: "60%",
    paddingVertical: "5.5%",
    justifyContent: "center",
    alignItems: "center",
  },
  chartWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  legend: {
    marginLeft: "6%",
    flexShrink: 1,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "6%",
  },
  dot: {
    marginRight: 6,
  },
  label: {
    color: "#EEE",
  },
  startBtn: {
    backgroundColor: "#002918",
    padding: "3.5%",
    width: "90%",
    alignItems: "center",
    paddingBottom: "1%",
    borderRadius: 40,
  },
});
