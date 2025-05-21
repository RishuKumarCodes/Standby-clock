import React, { memo, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { useClockStatus, useSeconds } from "../../context/ClockStatusContext";
import BatteryCharging from "../../components/commmon/CircleChargingProgressBar";
import { ClockVariant, ThemeProps } from "../../types/ThemesTypes";

const DIGIT_WIDTH = 50;
const DIGIT_HEIGHT = 100;
const OFF_COLOR = "#1c1c1c";
const DEFAULT_ON_COLOR = "#32CD32";
const DATE_ON_COLOR = "#737373";

const segmentsPath = {
  a: "M 14,0 L 36,0 L 40,6 L 36,12 L 14,12 L 10,6 Z",
  b: "M 38,12 L 42,8 L 46,8 L 50,12 L 50,44 L 46,48 L 42,48 L 38,44 Z",
  c: "M 38,56 L 42,52 L 46,52 L 50,56 L 50,88 L 46,92 L 42,92 L 38,88 Z",
  d: "M 14,88 L 36,88 L 40,94 L 36,100 L 14,100 L 10,94 Z",
  e: "M 0,56 L 4,52 L 8,52 L 12,56 L 12,88 L 8,92 L 4,92 L 0,88 Z",
  f: "M 0,12 L 4,8 L 8,8 L 12,12 L 12,44 L 8,48 L 4,48 L 0,44 Z",
  g: "M 14,44 L 36,44 L 40,50 L 36,56 L 14,56 L 10,50 Z",
};

const DIGIT_SEGMENTS = {
  0: ["a", "b", "c", "d", "e", "f"],
  1: ["b", "c"],
  2: ["a", "b", "g", "e", "d"],
  3: ["a", "b", "g", "c", "d"],
  4: ["f", "g", "b", "c"],
  5: ["a", "f", "g", "c", "d"],
  6: ["a", "f", "g", "c", "d", "e"],
  7: ["a", "b", "c"],
  8: ["a", "b", "c", "d", "e", "f", "g"],
  9: ["a", "b", "c", "d", "f", "g"],
};

const SegmentDigit = memo(
  ({
    digit,
    onColor,
    offColor,
  }: {
    digit: string;
    onColor: string;
    offColor: string;
  }) => (
    <Svg width={DIGIT_WIDTH} height={DIGIT_HEIGHT}>
      {Object.keys(segmentsPath).map((segKey) => (
        <Path
          key={segKey}
          d={segmentsPath[segKey]}
          fill={DIGIT_SEGMENTS[digit]?.includes(segKey) ? onColor : offColor}
        />
      ))}
    </Svg>
  )
);

const SegmentColon = memo((onColor: String) => (
  <Svg width={14} height={DIGIT_HEIGHT}>
    <Circle cx={7} cy={30} r={5} fill={onColor} />
    <Circle cx={7} cy={70} r={5} fill={onColor} />
  </Svg>
));

const SegmentSlash = memo((onColor: String) => (
  <Svg width={DIGIT_WIDTH} height={DIGIT_HEIGHT}>
    <Path
      d="M12,88 L38,12"
      stroke={onColor}
      strokeWidth={8}
      strokeLinecap="round"
    />
  </Svg>
));

const pad = (num: number) => (num < 10 ? `0${num}` : `${num}`);

const HourMinuteClock = memo(
  ({ hour, min, color }: { hour: number; min: number; color: string }) => {
    const formattedHM = useMemo(() => pad(hour) + ":" + pad(min), [hour, min]);
    const hmChars = useMemo(() => formattedHM.split(""), [formattedHM]);

    return (
      <View style={styles.row}>
        {hmChars.map((char, index) => (
          <View style={styles.digitContainer} key={index}>
            {char === ":" ? (
              <SegmentColon onColor={color} />
            ) : (
              <SegmentDigit digit={char} onColor={color} offColor={OFF_COLOR} />
            )}
          </View>
        ))}
      </View>
    );
  }
);

const SecondsDigit = memo(
  ({ seconds, color }: { seconds: number; color: string }) => {
    const formattedSec = useMemo(() => ":" + pad(seconds), [seconds]);
    const secChars = useMemo(() => formattedSec.split(""), [formattedSec]);

    return (
      <View style={styles.row}>
        {secChars.map((char, index) => (
          <View style={styles.digitContainer} key={index}>
            {char === ":" ? (
              <SegmentColon onColor={color} />
            ) : (
              <SegmentDigit digit={char} onColor={color} offColor={OFF_COLOR} />
            )}
          </View>
        ))}
      </View>
    );
  }
);

const VARIANT_CONFIG: Record<
  ClockVariant,
  { clockScaleFactor: number; dateScaleFactor: number }
> = {
  full: { clockScaleFactor: 1, dateScaleFactor: 0.23 },
  themeCard: { clockScaleFactor: 0.32, dateScaleFactor: 0.1 },
  smallPreview: { clockScaleFactor: 0.13, dateScaleFactor: 0 },
  colorSettings: { clockScaleFactor: 0.41, dateScaleFactor: 0.12 },
};

export default function SegmentClock({
  color = DEFAULT_ON_COLOR,
  previewMode = false,
  variant = "full",
}: ThemeProps) {
  const { hour, min, date, monthNumber } = useClockStatus();
  const seconds = useSeconds();
  const formattedDate = useMemo(
    () => pad(date) + "/" + pad(monthNumber),
    [date, monthNumber]
  );
  const dateChars = useMemo(() => formattedDate.split(""), [formattedDate]);

  const { clockScaleFactor, dateScaleFactor } = VARIANT_CONFIG[variant];

  return (
    <View style={styles.container}>
      <View style={{ transform: [{ scale: clockScaleFactor }] }}>
        <View style={styles.row}>
          <HourMinuteClock hour={hour} min={min} color={color} />
          <SecondsDigit seconds={seconds} color={color} />
        </View>
      </View>
      <View
        style={[
          styles.dateContainer,
          { transform: [{ scale: dateScaleFactor }] },
          previewMode && { bottom: -20 },
          previewMode && { right: "-30%" },
        ]}
      >
        {dateChars.map((char, index) => (
          <View style={styles.digitContainer} key={index}>
            {char === "/" ? (
              <SegmentSlash onColor={DATE_ON_COLOR} />
            ) : (
              <SegmentDigit
                digit={char}
                onColor={DATE_ON_COLOR}
                offColor={OFF_COLOR}
              />
            )}
          </View>
        ))}
      </View>
      <BatteryCharging />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  digitContainer: {
    marginHorizontal: 10,
  },
  dateContainer: {
    position: "absolute",
    bottom: 10,
    right: -20,
    flexDirection: "row",
    alignItems: "center",
    transform: [{ scale: 0.3 }],
  },
});
