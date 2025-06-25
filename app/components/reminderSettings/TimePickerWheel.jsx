import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { View, Text, ScrollView, StyleSheet, Vibration } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// constants
const ITEM_HEIGHT = 35;
const VISIBLE_ITEMS = 3;
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const PADDING = (WHEEL_HEIGHT - ITEM_HEIGHT) / 2;

// Wheel component: memoized, glitch-free
const Wheel = React.memo(({ data, selectedValue, onValueChange, suffix }) => {
  const scrollRef = useRef(null);
  const lastHapticIndex = useRef(null);
  const lastSnappedIndex = useRef(null);

  const initialIndex = useMemo(
    () => data.indexOf(selectedValue),
    [data, selectedValue]
  );

  useEffect(() => {
    if (scrollRef.current && initialIndex >= 0) {
      scrollRef.current.scrollTo({
        y: initialIndex * ITEM_HEIGHT,
        animated: false,
      });
      lastSnappedIndex.current = initialIndex;
    }
  }, [initialIndex]);

  const handleScroll = useCallback((e) => {
    const y = e.nativeEvent.contentOffset.y;
    const idx = Math.floor((y + ITEM_HEIGHT / 2) / ITEM_HEIGHT);
    if (idx !== lastHapticIndex.current) {
      Vibration.vibrate(1);
      lastHapticIndex.current = idx;
    }
  }, []);

  const handleMomentumScrollEnd = useCallback(
    (e) => {
      const y = e.nativeEvent.contentOffset.y;
      let idx = Math.round(y / ITEM_HEIGHT);
      idx = Math.max(0, Math.min(idx, data.length - 1));

      if (idx !== lastSnappedIndex.current) {
        scrollRef.current?.scrollTo({ y: idx * ITEM_HEIGHT, animated: true });
        const val = data[idx];
        if (val !== selectedValue) {
          onValueChange(val);
        }
        lastSnappedIndex.current = idx;
      }
    },
    [data, onValueChange, selectedValue]
  );

  return (
    <View style={styles.wheelContainer}>
      <ScrollView
        ref={scrollRef}
        style={{ height: WHEEL_HEIGHT }}
        contentContainerStyle={{ paddingVertical: PADDING }}
        snapToInterval={ITEM_HEIGHT}
        snapToAlignment="center"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        nestedScrollEnabled
      >
        {data.map((item, idx) => {
          const isSelected = item === selectedValue;
          return (
            <View key={idx} style={styles.item}>
              <Text
                style={[styles.itemText, isSelected && styles.itemTextSelected]}
              >
                {item}
                {suffix ? ` ${suffix}` : ""}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      <LinearGradient
        colors={["#061713", "transparent"]}
        style={styles.fadeTop}
        pointerEvents="none"
      />
      <LinearGradient
        colors={["transparent", "#061713"]}
        style={styles.fadeBottom}
        pointerEvents="none"
      />
    </View>
  );
});

const TimePickerWheel = ({
  mode = "timer",
  onChange,
  defaultHours = 0,
  defaultMinutes = 0,
  defaultAmpm ,
}) => {
  const [hours, setHours] = useState(defaultHours);
  const [minutes, setMinutes] = useState(defaultMinutes);
  const [ampm, setAmpm] = useState(defaultAmpm);

  useEffect(() => {
    if (typeof onChange === "function") {
      const payload =
        mode === "time" ? { hours, minutes, ampm } : { hours, minutes };
      onChange(payload);
    }
  }, [hours, minutes, ampm, mode, onChange]);

  const hourData = useMemo(
    () =>
      mode === "time"
        ? Array.from({ length: 12 }, (_, i) => i + 1)
        : Array.from({ length: 25 }, (_, i) => i),
    [mode]
  );

  const minuteData = useMemo(
    () => Array.from({ length: 61 }, (_, i) => i ),
    []
  );
  const ampmData = useMemo(() => ["am", "pm"], []);

  return (
    <View style={styles.container}>
      <Wheel
        data={hourData}
        selectedValue={hours}
        onValueChange={setHours}
        suffix={mode === "timer" ? "hrs" : ""}
      />
      {mode != "timer" && (
        <Text style={{ color: "#e8e8e8", padding: 2 }}>:</Text>
      )}
      <Wheel
        data={minuteData}
        selectedValue={minutes}
        onValueChange={setMinutes}
        suffix={mode === "timer" ? "mins" : ""}
      />
      {mode === "time" && (
        <Wheel
          data={ampmData}
          selectedValue={ampm}
          onValueChange={setAmpm}
          suffix={""}
        />
      )}
      <View
        style={[styles.centerLine, { top: PADDING }]}
        pointerEvents="none"
      />
    </View>
  );
};

export default TimePickerWheel;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    height: WHEEL_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  wheelContainer: {
    height: WHEEL_HEIGHT,
    overflow: "hidden",
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal:4,
    paddingHorizontal: 17,
  },
  itemText: {
    fontSize: 17,
    color: "#e8e8e8",
  },
  itemTextSelected: {},
  fadeTop: {
    position: "absolute",
    top: 0,
    height: ITEM_HEIGHT * 1.5,
    width: "100%",
  },
  fadeBottom: {
    position: "absolute",
    bottom: 0,
    height: ITEM_HEIGHT * 1.5,
    width: "100%",
  },
  centerLine: {
    position: "absolute",
    height: ITEM_HEIGHT,
    width: "100%",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#333",
  },
});
