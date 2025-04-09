import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useClockStatus } from "../../context/ClockStatusContext";
import CalendarComponent from "./CalendarComponent";
import SettingsPopup from "./SettingsPopup";

const deviceWidth = Dimensions.get("screen").width;

const taskbarSource = require("../../../assets/images/windowsTaskbar.png");
const { width: taskbarImgWidth, height: taskbarImgHeight } =
  Image.resolveAssetSource(taskbarSource);
const taskbarAspectRatio = taskbarImgWidth / taskbarImgHeight;
const taskbarCalculatedHeight = deviceWidth / taskbarAspectRatio;

const pad = (num) => (num < 10 ? "0" + num : num);

export default function WindowsClock({ previewMode }) {
  const { hour, min, date, day, month, year } = useClockStatus();

  const [taskbarVisible, setTaskbarVisible] = useState(true);
  const [calendarVisible, setCalendarVisible] = useState(true);
  const [shortcutsVisible, setShortcutsVisible] = useState(true);

  const [showEditButton, setShowEditButton] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const handleScreenTap = () => {
    setShowEditButton(true);
    setTimeout(() => {
      setShowEditButton(false);
    }, 2000);
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenTap}>
      <View style={styles.container}>
        <ImageBackground
          source={require("../../../assets/images/windowsDarkWallpaper.png")}
          style={[styles.background]}
          resizeMode="cover"
        >
          {shortcutsVisible && (
            <Image
              source={require("../../../assets/images/windowsIcons.png")}
              style={styles.windowsShotcuts}
            />
          )}

          <Text
            style={[
              styles.timeText,
              { transform: [{ scale: previewMode ? 0.4 : 1 }] },
            ]}
          >
            {pad(hour) + ":" + pad(min)}
          </Text>

          {calendarVisible ? (
            <CalendarComponent
              clockDay={day}
              clockMonth={month}
              clockDate={date}
              clockYear={year}
              previewMode={previewMode}
            />
          ) : (
            <View style={{ flex: 1 }}></View>
          )}

          {taskbarVisible && (
            <Image
              source={taskbarSource}
              style={[
                styles.taskbar,
                {
                  width: previewMode ? deviceWidth/2.7 : deviceWidth,
                  height: previewMode
                    ? taskbarCalculatedHeight/2.7
                    : taskbarCalculatedHeight,
                },
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

          <SettingsPopup
            isVisible={isModalVisible}
            closeModal={() => setIsModalVisible(false)}
            taskbarVisible={taskbarVisible}
            calendarVisible={calendarVisible}
            shortcutsVisible={shortcutsVisible}
            setTaskbarVisible={setTaskbarVisible}
            setCalendarVisible={setCalendarVisible}
            setShortcutsVisible={setShortcutsVisible}
          />
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  windowsShotcuts: {
    position: "absolute",
    top: 10,
    left: 10,
    aspectRatio: 5 / 1,
    height: "85%",
    width: "10%",
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
  taskbar: {
    resizeMode: "contain",
  },
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
});
