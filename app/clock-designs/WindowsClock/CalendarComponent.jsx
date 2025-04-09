import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

function getCalendarDates(baseDate) {
  if (isNaN(baseDate.getTime())) return [];

  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstOfMonth.getDay();

  const lastDateOfMonth = lastOfMonth.getDate();
  if (!lastDateOfMonth || lastDateOfMonth < 1) return [];

  const daysInMonth = [...Array(lastDateOfMonth)].map((_, i) => i + 1);
  const leadingBlanks = [...Array(firstDayOfWeek)].map(() => null);
  const totalCells = leadingBlanks.length + daysInMonth.length;
  const trailingBlanks =
    totalCells % 7 ? [...Array(7 - (totalCells % 7))].map(() => null) : [];

  return [...leadingBlanks, ...daysInMonth, ...trailingBlanks];
}

function CalendarComponent({
  clockDay,
  clockMonth,
  clockDate,
  clockYear,
  previewMode,
}) {
  const baseDate = useMemo(() => {
    const parsedMonth = (() => {
      const testDate = new Date(`1 ${clockMonth} ${clockYear}`);
      return isNaN(testDate.getTime())
        ? new Date().getMonth()
        : testDate.getMonth();
    })();

    const validDay = Number(clockDate) > 0 ? Number(clockDate) : 1;
    const validYear = Number(clockYear) || new Date().getFullYear();

    return new Date(validYear, parsedMonth, validDay);
  }, [clockYear, clockMonth, clockDate]);

  const calendarDays = useMemo(() => getCalendarDates(baseDate), [baseDate]);

  const dayLabels = useMemo(
    () => ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    []
  );

  return (
    <View style={styles.Container}>
      <View style={[styles.baseStyle, previewMode && styles.calendarContainer]}>
        <View
          style={[
            styles.wrapper,
            { transform: [{ scale: previewMode ? 0.35 : 1 }] },
          ]}
        >
          <View style={styles.calendarDateTxt}>
            <Text style={styles.dateText}>
              {clockDay + ", " + clockMonth + " " + clockDate}
            </Text>
            <MaterialIcons
              style={styles.dateDropdown}
              name="keyboard-arrow-down"
              size={24}
              color="black"
            />
          </View>
          <View style={styles.calendar}>
            <View style={styles.calendarHeader}>
              <Text style={styles.monthText}>
                {clockMonth} {clockYear}
              </Text>
            </View>
            <View style={styles.dayLabelsRow}>
              {dayLabels.map((label) => (
                <Text key={label} style={styles.dayLabel}>
                  {label}
                </Text>
              ))}
            </View>
            <View style={styles.daysContainer}>
              {calendarDays.map((day, index) => {
                const isToday = day === Number(clockDate);
                return (
                  <View key={index} style={styles.dayBox}>
                    {day ? (
                      <Text
                        style={[styles.dayText, isToday && styles.todayText]}
                      >
                        {day}
                      </Text>
                    ) : (
                      <Text style={styles.blankDay}> </Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default React.memo(CalendarComponent);

const styles = StyleSheet.create({
  Container: {
    width: "100%",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    flex: 1,
  },
  calendarContainer: {
    height: "88%",
    width: "35%",
    marginLeft: "auto",
    alignItems: "center",
    justifyContent: "center",
  },
  baseStyle: {},
  wrapper: {
    margin: 15,
    width: 268,
    borderRadius: 12,
    overflow: "hidden",
  },
  calendarDateTxt: {
    padding: 15,
    paddingVertical: "10",
    backgroundColor: "rgba(223, 237, 248, 0.89)",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateDropdown: {
    backgroundColor: "white",
    width: 25,
    height: 25,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  dateText: {
    fontSize: 17,
    fontWeight: "500",
    color: "#000",
  },
  calendar: {
    backgroundColor: "rgba(255, 255, 255, 0.84)",
    padding: 15,
    paddingVertical: 9,
  },
  calendarHeader: {
    paddingBottom: 12,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  dayLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  dayLabel: {
    flex: 1,
    textAlign: "center",
    fontWeight: "600",
    color: "#777",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayBox: {
    width: 34,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  dayText: {
    textAlign: "center",
    aspectRatio: 1,
    fontSize: 18,
    color: "#000",
  },
  todayText: {
    fontSize: 18,
    color: "#fff",
    backgroundColor: "#0078D4",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 40,
  },
  blankDay: {
    fontSize: 18,
    color: "transparent",
  },
});
