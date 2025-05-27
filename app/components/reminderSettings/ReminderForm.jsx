import React, { useState } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { MdTxt, DimTxt } from "@/app/components/ui/CustomText.jsx";
import ToggleButton from "@/app/components/ui/ToggleButton";
import TimePickerWheel from "./TimePickerWheel";
import PrioritySelectorDropdown from "./PrioritySelectorDropdown";
import SoundSelector from "./SoundSelector";
import ConformationPopup from "@/app/components/ui/ConformationPopup";
import { Pressable, TextInput } from "react-native-gesture-handler";
import { Audio } from "expo-av";
import DeleteIcon from "../../../assets/icons/DeleteIcon.jsx";
import TickIcon from "../../../assets/icons/TickIcon.jsx";

const colorOptions = [
  { label: "Critical", value: "#ff6161" },
  { label: "High", value: "#FDDE67" },
  { label: "medium", value: "#B6F36B" },
  { label: "Low", value: "#C8A0FF" },
  { label: "None", value: "#c9d5d6" },
];

const soundOptions = [
  {
    label: "Default",
    value: "default",
    asset: require("@/assets/sounds/default.mp3"),
  },
  {
    label: "Chime",
    value: "chime",
    asset: require("@/assets/sounds/chime.mp3"),
  },
  {
    label: "Alarm",
    value: "alarm",
    asset: require("@/assets/sounds/alarm.mp3"),
  },
  { label: "Bell", value: "bell", asset: require("@/assets/sounds/bell.mp3") },
];

const ReminderForm = ({ initData = {}, onSubmit, onDelete, closeModal }) => {
  const [title, setTitle] = useState(initData.title || "");
  const [color, setColor] = useState(initData.color || "#c9d5d6");

  const timeString = initData.startTime || "08:00 pm";
  const [time, am_pm] = timeString.split(" ");
  const [initH, initM] = time.split(":").map((v) => parseInt(v, 10));

  const [startHour, setStartHour] = useState(isNaN(initH) ? 8 : initH);
  const [startMinute, setStartMinute] = useState(isNaN(initM) ? 0 : initM);
  const [ampm, setampm] = useState(am_pm ? am_pm : "am");

  const [repeatType, setRepeatType] = useState(initData.repeatType || "daily");

  const rawInterval = initData.interval ?? "0:30";
  const [intervalH, intervalM] = rawInterval
    .split(":")
    .map((v) => parseInt(v, 10));

  const [intervalHr, setIntervalHr] = useState(
    isNaN(intervalH) ? 0 : intervalH
  );
  const [intervalMin, setIntervalMin] = useState(
    isNaN(intervalM) ? 30 : intervalM
  );
  const [daysOfWeek, setdaysOfWeek] = useState(
    Array.isArray(initData.daysOfWeek) ? initData.daysOfWeek : [1, 2, 3, 4, 5]
  );

  const [SendNotification, setSendNotification] = useState(
    initData.SendNotification !== undefined ? initData.SendNotification : true
  );
  const [soundName, setsoundName] = useState(initData.soundName || "default");
  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

  const toggleDay = (day) => {
    setdaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

  const handlePlaySound = async (asset) => {
    try {
      const { sound } = await Audio.Sound.createAsync(asset);
      await sound.playAsync();
    } catch (e) {
      console.warn("Failed to play sound", e);
    }
  };

  const handleSave = () => {
    const hh = startHour < 10 ? `0${startHour}` : `${startHour}`;
    const mm = startMinute < 10 ? `0${startMinute}` : `${startMinute}`;
    onSubmit({
      ...initData,
      title,
      startTime: `${hh}:${mm} ${ampm}`,
      color,
      repeatType,
      interval: `${intervalHr}:${intervalMin}`,
      soundName,
      SendNotification,
      daysOfWeek,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.formCard}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      >
        {/* Title & Priority */}
        <View style={styles.rowBetween}>
          <TextInput
            style={styles.reminderName}
            placeholder="Title"
            placeholderTextColor="#888"
            value={title}
            onChangeText={setTitle}
          />
          <PrioritySelectorDropdown
            color={color}
            setColor={setColor}
            options={colorOptions}
            defaultLabel="Priority"
          />
        </View>

        {/* Time Picker */}
        <View style={styles.timeRow}>
          <MdTxt style={styles.label}>Reminder starts at:</MdTxt>
          <TimePickerWheel
            mode="time"
            defaultHours={startHour}
            defaultMinutes={startMinute}
            defaultAmpm={ampm}
            onChange={({ hours, minutes, ampm }) => {
              setStartHour(hours);
              setStartMinute(minutes);
              setampm(ampm);
            }}
          />
        </View>

        {/* Repeat Selection */}
        <View style={styles.rowBetween}>
          <MdTxt>Repeat:</MdTxt>
          <View style={styles.repetitions}>
            {["hourly", "daily"].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.toggleOption,
                  repeatType === type && styles.activeToggle,
                ]}
                onPress={() => setRepeatType(type)}
              >
                <MdTxt
                  style={[
                    styles.toggleText,
                    repeatType === type && styles.activeToggleText,
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </MdTxt>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {repeatType === "hourly" && (
          <View style={styles.timeRow}>
            <MdTxt style={styles.label}>Remind in every:</MdTxt>
            <TimePickerWheel
              mode="timer"
              defaultHours={intervalHr}
              defaultMinutes={intervalMin}
              onChange={({ hours, minutes }) => {
                setIntervalHr(hours);
                setIntervalMin(minutes);
                setampm(ampm);
              }}
            />
          </View>
        )}
        {repeatType === "daily" && (
          <View style={styles.dayRow}>
            {weekdays.map((d, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.dayButton,
                  daysOfWeek.includes(idx) && styles.daySelected,
                ]}
                onPress={() => toggleDay(idx)}
              >
                <MdTxt
                  style={
                    daysOfWeek.includes(idx)
                      ? styles.textSelected
                      : styles.dayText
                  }
                >
                  {d}
                </MdTxt>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Notification Toggle */}
        <View style={[styles.rowBetween, { alignItems: "flex-start" }]}>
          <View>
            <MdTxt>Send notification alert:</MdTxt>
            <DimTxt>reminds via notification when app is closed</DimTxt>
          </View>
          <ToggleButton
            value={SendNotification}
            onValueChange={setSendNotification}
          />
        </View>

        {/* Notification Sound Selection */}
        <SoundSelector
          soundOptions={soundOptions}
          soundName={soundName}
          setsoundName={setsoundName}
          handlePlaySound={handlePlaySound}
          visible={SendNotification}
        />

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          {/* conformation popup */}
          {initData.isDefault ? (
            <ConformationPopup
              visible={showConfirmationPopup}
              message={`Cannot delete default reminder`}
              confirmText="Got it !"
              onConfirm={() => {
                setShowConfirmationPopup(false);
              }}
              onCancel={() => setShowConfirmationPopup(false)}
            />
          ) : (
            <ConformationPopup
              visible={showConfirmationPopup}
              message={`Delete "${initData.title}" reminder?`}
              confirmText="Delete"
              cancelText="Cancel"
              onConfirm={() => {
                onDelete(initData.id);
                setShowConfirmationPopup(false);
              }}
              onCancel={() => setShowConfirmationPopup(false)}
            />
          )}

          <Pressable
            onPress={() => setShowConfirmationPopup(true)}
            style={styles.actionBtns}
          >
            <DeleteIcon />
            <MdTxt style={{ fontSize: 13.5, opacity: 0.8 }}>Delete</MdTxt>
          </Pressable>

          <Pressable
            onPress={() => {
              handleSave();
              closeModal();
            }}
            style={styles.actionBtns}
          >
            <TickIcon />
            <MdTxt style={{ fontSize: 13.5, opacity: 0.8 }}>Save</MdTxt>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  formCard: { width: "100%", padding: 26, paddingTop: 20, gap: 22 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reminderName: {
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
    fontSize: 20,
    flex: 1,
  },
  timeRow: {
    backgroundColor: "#061713",
    padding: 10,
    paddingBottom: 0,
    borderRadius: 20,
    overflow: "hidden",
    alignItems: "center",
  },
  dayRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  dayButton: {
    alignItems: "center",
    alignItems: "center",
    paddingTop: 2,
    justifyContent: "center",
    height: 38,
    width: 38,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ebebeb",
  },
  daySelected: { backgroundColor: "#ebebeb" },
  dayText: { color: "#ebebeb", fontSize: 14 },
  textSelected: { color: "#000", fontSize: 14 },
  label: { color: "#aaa", fontSize: 14 },
  repetitions: {
    padding: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 80,
    backgroundColor: "#061713",
  },
  toggleOption: {
    alignItems: "center",
    padding: 5,
    paddingTop: 7,
    paddingHorizontal: 20,
    borderRadius: 40,
  },
  activeToggle: { backgroundColor: "#E6F904" },
  toggleText: { color: "#fff" },
  activeToggleText: { color: "#000" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 20,
  },
  actionBtns: {
    paddingHorizontal: 6,
    gap: 2,
    alignItems: "center",
    justifyContent: "flex-end",
  },
});

export default ReminderForm;
