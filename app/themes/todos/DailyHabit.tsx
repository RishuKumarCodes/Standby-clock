import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { H1Light, MdTxt } from "@/app/components/ui/CustomText";
import DeleteIcon from "@/assets/icons/DeleteIcon";
import { ScrollView } from "react-native";
import { ClockVariant, ThemeProps } from "@/app/types/ThemesTypes";
import EditIcon from "@/assets/icons/EditIcon";

// Keys for AsyncStorage
const DATA_KEY = "@HabitTracker:data";
const LIST_KEY = "@HabitTracker:habits";

// Helper: get last 7 days as YYYY-MM-DD
const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
};

const VARIANT_CONFIG: Record<ClockVariant, { scaleFactor: number }> = {
  full: { scaleFactor: 15.5 },
  themeCard: { scaleFactor: 5 },
  smallPreview: { scaleFactor: 2.7 },
  colorSettings: { scaleFactor: 5 },
};

const DailyHabit = ({ color, variant = "full" }: ThemeProps) => {
  const [editMode, setEditMode] = useState(false);

  const [habits, setHabits] = useState([]);
  const [data, setData] = useState({});
  const [days] = useState(getLast7Days());
  const [loading, setLoading] = useState(true);
  const [newHabit, setNewHabit] = useState("");
  const { scaleFactor } = VARIANT_CONFIG[variant];
  const CELL_SIZE = scaleFactor * 2.25;

  useEffect(() => {
    (async () => {
      try {
        // 1. Load or init habits list
        const rawList = await AsyncStorage.getItem(LIST_KEY);
        const parsedList = rawList
          ? JSON.parse(rawList)
          : [
              { key: "exercise", label: "Exercise" },
              { key: "cold_shower", label: "Cold shower" },
              { key: "readBook", label: "Read book" },
              { key: "earlyBed", label: "Early to Bed" },
            ];
        setHabits(parsedList);

        // 2. Load or init toggle-data
        const rawData = await AsyncStorage.getItem(DATA_KEY);
        const parsedData = rawData ? JSON.parse(rawData) : {};
        // prune to last 7 days
        const freshData = {};
        days.forEach((d) => {
          freshData[d] = parsedData[d] || {};
        });
        setData(freshData);
      } catch (e) {
        console.warn("Load failed", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [days]);

  // Helpers to persist
  const saveData = async (newData) => {
    try {
      await AsyncStorage.setItem(DATA_KEY, JSON.stringify(newData));
    } catch (e) {
      console.warn("Save data failed", e);
    }
  };
  const saveHabits = async (newList) => {
    try {
      await AsyncStorage.setItem(LIST_KEY, JSON.stringify(newList));
    } catch (e) {
      console.warn("Save list failed", e);
    }
  };

  // Toggle a single cell
  const onToggle = (date, habitKey) => {
    const updated = {
      ...data,
      [date]: {
        ...data[date],
        [habitKey]: !data[date]?.[habitKey],
      },
    };
    setData(updated);
    saveData(updated);
  };

  // Delete a habit
  const onDelete = (habitKey) => {
    const filtered = habits.filter((h) => h.key !== habitKey);
    setHabits(filtered);
    saveHabits(filtered);
  };

  // Add a new habit
  const onAdd = () => {
    const label = newHabit.trim();
    if (!label) return;
    // make key safe + unique
    const key =
      label.toLowerCase().replace(/\s+/g, "_").slice(0, 20) + "_" + Date.now();
    const newList = [...habits, { key, label }];
    setHabits(newList);
    saveHabits(newList);
    setNewHabit("");
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 20 }} color="#fff" />;
  }

  return (
    <View
      style={[
        styles.container,
        variant !== "full" ? { aspectRatio: 19 / 8.7 } : null,
      ]}
    >
      {/* Header */}
      <View style={styles.row}>
        <View style={[styles.labelCell]}>
          <Pressable onPress={() => setEditMode(!editMode)}>
            <MdTxt style={[styles.editscaleFactor, { fontSize: scaleFactor }]}>
              {editMode ? (
                "done"
              ) : (
                <EditIcon size={scaleFactor * 1.4} color={"#e6e6e6"} />
              )}
            </MdTxt>
          </Pressable>
        </View>
        <View style={styles.headerRow}>
          {days.map((d, i) => (
            <View
              key={d}
              style={[
                styles.headerCell,
                { width: CELL_SIZE },
                i === days.length - 1
                  ? { backgroundColor: "#1c1c1c", borderRadius: 40, padding: 1 }
                  : null,
              ]}
            >
              <H1Light
                style={[
                  styles.headerText,
                  { fontSize: scaleFactor * 1.6 },
                  i === days.length - 1 ? styles.lastDayText : null,
                ]}
              >
                {new Date(d)
                  .toLocaleDateString(undefined, { weekday: "short" })
                  .slice(0, 1)}
              </H1Light>
            </View>
          ))}
        </View>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled">
        {/* ← only show Add-row when in editMode */}
        {editMode && (
          <View style={styles.addRow}>
            <MdTxt>Enter new habit name:</MdTxt>
            <TextInput
              value={newHabit}
              onChangeText={setNewHabit}
              placeholder="New habit"
              placeholderTextColor="#777"
              style={styles.input}
            />
            <Pressable
              onPress={onAdd}
              style={[styles.addscaleFactor, { backgroundColor: color }]}
            >
              <MdTxt style={{ color: "#000" }}>+ Add</MdTxt>
            </Pressable>
          </View>
        )}

        {/* Habit Rows */}
        {habits.map((h) => (
          <View key={h.key} style={styles.row}>
            <View style={styles.labelCell}>
              {editMode && (
                <TouchableOpacity onPress={() => onDelete(h.key)}>
                  <DeleteIcon size={27} color={"#ff5e5e"} />
                </TouchableOpacity>
              )}
              <MdTxt
                numberOfLines={1}
                style={[
                  styles.labelText,
                  { fontSize: scaleFactor * 1.5, paddingTop: 5 },
                ]}
              >
                {h.label}
              </MdTxt>
            </View>
            <View style={styles.checkBoxes}>
              {days.map((d) => {
                const done = !!data[d]?.[h.key];
                return (
                  <TouchableOpacity
                    key={`${h.key}-${d}`}
                    style={[
                      styles.cell,
                      {
                        backgroundColor: done ? color : "#222",
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        borderRadius: scaleFactor / 2,
                      },
                    ]}
                    onPress={() => onToggle(d, h.key)}
                  />
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default DailyHabit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "6.4%",
    paddingBottom: 0,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "3%",
    gap: "2%",
  },

  headerRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerCell: {
    alignItems: "center",
  },

  editscaleFactor: {
    backgroundColor: "#171717",
    padding: "2.5%",
    paddingHorizontal: "7%",
    paddingTop: "3%",
    borderRadius: 30,
  },
  checkBoxes: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  labelCell: {
    flexDirection: "row",
    alignItems: "center",
    gap: "6.2%",
    overflow: "hidden",
    width: "25%",
  },

  labelText: {
    color: "#aaa",
    fontSize: 23,
  },

  cell: {
    marginHorizontal: 2,
    marginVertical: 4,
  },

  headerText: {
    fontSize: 20,
  },

  lastDayText: {
    fontFamily: "Poppins-semibold",
    color: "#ff4529",
  },

  addRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    backgroundColor: "#141414",
    padding: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
  },

  input: {
    marginLeft: 20,
    flex: 1,
    height: 40,
    color: "#fff",
    backgroundColor: "#000",
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 6,
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
    marginRight: 8,
  },
  addscaleFactor: {
    backgroundColor: "#333",
    padding: 5.5,
    paddingTop: 5.5,
    paddingRight: 17,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
  },
});
