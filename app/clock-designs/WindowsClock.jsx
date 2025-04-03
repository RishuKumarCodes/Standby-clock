import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableWithoutFeedback,
  Modal,
  Button,
  Switch,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

// Get device width (including notch area)
const deviceWidth = Dimensions.get("screen").width;

// Dynamically compute the intrinsic aspect ratio for the taskbar image
const taskbarSource = require("../../assets/images/windowsTaskbar.png");
const { width: taskbarImgWidth, height: taskbarImgHeight } =
  Image.resolveAssetSource(taskbarSource);
const taskbarAspectRatio = taskbarImgWidth / taskbarImgHeight;
const taskbarCalculatedHeight = deviceWidth / taskbarAspectRatio;

// Function to format date as "Wednesday, April 2"
const formatDate = (date) => {
  const options = { weekday: "long", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

// Function to get time in "8:20" format
const formatTime = (date) => {
  return (
    date.getHours() +
    ":" +
    (date.getMinutes() < 10 ? "0" : "") +
    date.getMinutes()
  );
};

// Generate calendar days
function getCalendarDates(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);

  const firstDayOfWeek = firstOfMonth.getDay();
  const lastDateOfMonth = lastOfMonth.getDate();
  const daysInMonth = [...Array(lastDateOfMonth)].map((_, i) => i + 1);
  const leadingBlanks = [...Array(firstDayOfWeek)].map(() => null);
  const totalCells = leadingBlanks.length + daysInMonth.length;
  const trailingBlanks =
    totalCells % 7 ? [...Array(7 - (totalCells % 7))].map(() => null) : [];

  return [...leadingBlanks, ...daysInMonth, ...trailingBlanks];
}

export default function WindowsClock() {
  const [currentTime, setCurrentTime] = useState(formatTime(new Date()));
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const calendarDays = useMemo(() => getCalendarDates(today), [today]);

  // UI visibility states with default values
  const [taskbarVisible, setTaskbarVisible] = useState(true);
  const [calendarVisible, setCalendarVisible] = useState(true);
  const [shortcutsVisible, setShortcutsVisible] = useState(true);

  // State for edit button visibility and modal popup
  const [showEditButton, setShowEditButton] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Load saved settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsString = await AsyncStorage.getItem("uiSettings");
        if (settingsString) {
          const settings = JSON.parse(settingsString);
          setTaskbarVisible(settings.taskbarVisible);
          setCalendarVisible(settings.calendarVisible);
          setShortcutsVisible(settings.shortcutsVisible);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };
    loadSettings();
  }, []);

  // Save settings when any of the visibility states change
  useEffect(() => {
    const saveSettings = async () => {
      try {
        const settings = { taskbarVisible, calendarVisible, shortcutsVisible };
        await AsyncStorage.setItem("uiSettings", JSON.stringify(settings));
      } catch (error) {
        console.error("Failed to save settings:", error);
      }
    };
    saveSettings();
  }, [taskbarVisible, calendarVisible, shortcutsVisible]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(formatTime(new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Handle single tap to show edit button for 2 seconds
  const handleScreenTap = () => {
    setShowEditButton(true);
    setTimeout(() => {
      setShowEditButton(false);
    }, 2000);
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenTap}>
      <ImageBackground
        source={require("../../assets/images/windowsDarkWallpaper.png")}
        style={styles.background}
        resizeMode="cover"
      >
        {shortcutsVisible && (
          <Image
            source={require("../../assets/images/windowsIcons.png")}
            style={styles.windowsShotcuts}
          />
        )}

        <Text style={styles.timeText}>{currentTime}</Text>

        {calendarVisible ? (
          <View style={styles.calendarContainer}>
            <View style={styles.calendarDateTxt}>
              <Text style={styles.dateText}>{formatDate(today)}</Text>
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
                  {monthNames[currentMonth]} {currentYear}
                </Text>
              </View>
              <View style={styles.dayLabelsRow}>
                {dayLabels.map((day) => (
                  <Text key={day} style={styles.dayLabel}>
                    {day}
                  </Text>
                ))}
              </View>
              <View style={styles.daysContainer}>
                {calendarDays.map((day, index) => {
                  const isToday = day === currentDay;
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
        ) : (
          <View style={{ flex: 1 }}></View>
        )}

        {taskbarVisible && (
          <Image
            source={taskbarSource}
            style={[
              styles.taskbar,
              { width: deviceWidth, height: taskbarCalculatedHeight },
            ]}
            resizeMode="contain"
          />
        )}

        {showEditButton && (
          <View style={styles.editButtonContainer}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsModalVisible(true)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}

        <Modal visible={isModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Modal Header styled like a Windows title bar */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>Settings</Text>
                <View style={styles.modalHeaderButtons}>
                  <TouchableOpacity style={styles.modalButtonDisabled} disabled>
                    <Ionicons name="remove-outline" size={20} color="#000" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setIsModalVisible(false)}
                  >
                    <Ionicons name="close" size={20} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
              {/* Windows-like path just below the header */}
              <View style={styles.modalPathContainer}>
                <Text style={styles.modalPathText}>
                  <Text style={styles.dimmedText}>Settings</Text> &gt;
                  Personalisation
                </Text>
              </View>
              {/* Modal body with overflow scroll */}
              <ScrollView style={styles.modalBody}>
                <View style={styles.switchRow}>
                  <Text>Always show taskbar</Text>
                  <Switch
                    value={taskbarVisible}
                    onValueChange={(val) => setTaskbarVisible(val)}
                  />
                </View>
                <View style={styles.switchRow}>
                  <Text>Show Calendar on desktop</Text>
                  <Switch
                    value={calendarVisible}
                    onValueChange={(val) => setCalendarVisible(val)}
                  />
                </View>
                <View style={styles.switchRow}>
                  <Text>Show desktop shotcuts</Text>
                  <Switch
                    value={shortcutsVisible}
                    onValueChange={(val) => setShortcutsVisible(val)}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  windowsShotcuts: {
    position: "absolute",
    top: 10,
    left: 10,
    height: "85%",
    resizeMode: "contain",
  },
  timeText: {
    position: "absolute",
    top: "13%",
    left: "16%",
    fontSize: 76,
    color: "#FFF",
    fontFamily: "Poppins-ExtraLight",
  },
  // ----------------------------------------------- calendar styling -----------------------------------------------
  calendarContainer: {
    marginLeft: "auto",
    marginTop: "auto",
    marginRight: 15,
    marginBottom: 15,
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

  // ----------------------------------------------- Taskbar styling ---------------------------------------
  taskbar: {
    resizeMode: "contain",
  },
  // ----------------------------------------------- edit button styling ------------------------------------
  editButtonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: "20%",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "white",
    borderRadius: 4,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  editButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },

  // ---------------------------------- settings screen popup styling ----------------------------------
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 9, 37, 0.62)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "50%",
    backgroundColor: "#c3cfdb",
    opacity: 0.93,
    borderRadius: 8,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  modalHeaderTitle: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
  modalHeaderButtons: {
    flexDirection: "row",
  },
  modalButton: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  modalButtonDisabled: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    opacity: 0.5,
  },
  modalButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  modalPathContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  modalPathText: {
    fontSize: 18,
    color: "#000",
  },
  dimmedText: {
    color: "gray",
  },
  modalBody: {
    padding: 20,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 2,
    borderRadius: 4,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
  },
});
