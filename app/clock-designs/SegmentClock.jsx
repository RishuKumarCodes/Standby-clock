import React, { useState, useEffect, useRef, memo } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";

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

const SegmentDigit = memo(({ digit, onColor, offColor }) => (
  <Svg width={DIGIT_WIDTH} height={DIGIT_HEIGHT}>
    {Object.keys(segmentsPath).map((segKey) => (
      <Path
        key={segKey}
        d={segmentsPath[segKey]}
        fill={DIGIT_SEGMENTS[digit]?.includes(segKey) ? onColor : offColor}
      />
    ))}
  </Svg>
));

const SegmentColon = memo(({ onColor }) => (
  <Svg width={14} height={DIGIT_HEIGHT}>
    <Circle cx={7} cy={30} r={5} fill={onColor} />
    <Circle cx={7} cy={70} r={5} fill={onColor} />
  </Svg>
));

const SegmentSlash = memo(({ onColor }) => (
  <Svg width={DIGIT_WIDTH} height={DIGIT_HEIGHT}>
    <Path
      d="M12,88 L38,12"
      stroke={onColor}
      strokeWidth={8}
      strokeLinecap="round"
    />
  </Svg>
));

function pad(num) {
  return num < 10 ? `0${num}` : `${num}`;
}

function getFormattedTime(now) {
  const hour12 = now.getHours() % 12 || 12;
  return `${pad(hour12)}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function getFormattedDate(now) {
  return `${pad(now.getDate())}/${pad(now.getMonth() + 1)}`;
}

export default function SegmentClock({
  color = DEFAULT_ON_COLOR,
  previewMode = false,
}) {
  const [clockData, setClockData] = useState(() => {
    const now = new Date();
    return {
      timeString: getFormattedTime(now),
      dateString: getFormattedDate(now),
    };
  });
  const timerRef = useRef(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClockData({
        timeString: getFormattedTime(now),
        dateString: getFormattedDate(now),
      });
      timerRef.current = setTimeout(updateClock, 1000 - (Date.now() % 1000));
    };
    updateClock();
    return () => clearTimeout(timerRef.current);
  }, []);

  const timeChars = clockData.timeString.split("");
  const dateChars = clockData.dateString.split("");

  // When in preview mode, we scale down the main clock.
  const clockScaleFactor = previewMode ? 0.3 : 1;

  return (
    <View style={styles.container}>
      {previewMode ? (
        <>
          <View style={{ transform: [{ scale: clockScaleFactor }] }}>
            <View style={styles.row}>
              {timeChars.map((char, index) => (
                <View style={styles.digitContainer} key={index}>
                  {char === ":" ? (
                    <SegmentColon onColor={color} />
                  ) : (
                    <SegmentDigit
                      digit={char}
                      onColor={color}
                      offColor={OFF_COLOR}
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
          <View
            style={[
              styles.dateContainer,
              { bottom: -20 },
              { transform: [{ scale: 0.1 }] },
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
        </>
      ) : (
        <View style={styles.row}>
          {timeChars.map((char, index) => (
            <View style={styles.digitContainer} key={index}>
              {char === ":" ? (
                <SegmentColon onColor={color} />
              ) : (
                <SegmentDigit
                  digit={char}
                  onColor={color}
                  offColor={OFF_COLOR}
                />
              )}
            </View>
          ))}
        </View>
      )}

      {/* Render the date only in non-preview mode */}
      {!previewMode && (
        <View style={styles.dateContainer}>
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
