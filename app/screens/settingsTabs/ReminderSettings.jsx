import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import {
  H1Light,
  H1Txt,
  H2Txt,
  MdTxt,
} from "@/app/components/ui/CustomText.jsx";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import useReminders from "@/app/hooks/useReminders";
import { scheduleReminderNotification } from "@/app/utils/notificationService";
import {
  updateReminder,
  saveReminder,
  deleteReminder,
} from "@/app/storage/remindersStorage";
import ReminderForm from "../../components/reminderSettings/ReminderForm";
import ToggleButton from "@/app/components/ui/ToggleButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import TimerIcon from "../../../assets/icons/TimerIcon.jsx";

const ReminderSettings = () => {
  const { reminders, setReminders } = useReminders();
  const [editingReminder, setEditingReminder] = useState(null);

  const screenWidth = Dimensions.get("window").width;
  const [slideAnim] = useState(new Animated.Value(screenWidth));
  useEffect(() => {
    if (editingReminder !== null) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [editingReminder]);

  const handleEditReminder = (reminder) => {
    setEditingReminder(reminder);
  };

  const handleAddNew = () => {
    const newReminder = {
      id: Date.now(),
      enabled: true,
    };
    setEditingReminder(newReminder);
  };

  const handleSaveEdit = async (updatedReminder) => {
    const exists = reminders.some((r) => r.id === updatedReminder.id);
    if (exists) {
      const updatedReminders = await updateReminder(updatedReminder);
      setReminders(updatedReminders);
    } else {
      const updatedReminders = await saveReminder(updatedReminder);
      setReminders(updatedReminders);
    }
    scheduleReminderNotification(updatedReminder);
    closeModal();
  };

  const handleDelete = async (reminderId) => {
    const updatedReminders = await deleteReminder(reminderId);
    setReminders(updatedReminders);
    closeModal();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: screenWidth,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setEditingReminder(null);
    });
  };

  const toggleReminderEnbled = async (r) => {
    const updatedReminder = {
      ...r,
      enabled: !r.enabled,
    };
    const updatedReminders = await updateReminder(updatedReminder);
    setReminders(updatedReminders);
  };

  const daysOfWeekMap = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      >
        <View style={styles.heading}>
          <H1Txt>Reminders</H1Txt>
          <TouchableOpacity
            onPress={handleAddNew}
            style={{ flexDirection: "row", gap: 4 }}
          >
            <Ionicons name="add" size={24} color="white" />
            <MdTxt style={{ paddingTop: 1.5 }}>Add new</MdTxt>
          </TouchableOpacity>
        </View>
        <MdTxt
          style={{
            marginBottom: 20,
            paddingHorizontal: 5,
            color: "#deb435",
          }}
        >
          ! This feature is currently not stable in some devices.
        </MdTxt>
        <View style={styles.cardsContainer}>
          {reminders.map((r) => (
            <TouchableOpacity
              key={r.id}
              style={[styles.card, { backgroundColor: r.color || "#161c1a" }]}
              onPress={() => handleEditReminder(r)}
            >
              <H2Txt style={styles.title}>{r.title}</H2Txt>
              {r.repeatType === "hourly" && (
                <H1Light
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ color: "#000" }}
                >
                  <View style={{ paddingRight: 5 }}>
                    <TimerIcon />
                  </View>
                  {(() => {
                    const [h, m] = r.interval.split(":").map(Number);
                    if (h === 0) return `${m}min`;
                    return `${h}h${m > 0 ? ` ${m}m` : ""}`;
                  })()}
                </H1Light>
              )}
              <View style={styles.daysName}>
                {r.repeatType === "daily" &&
                  r.daysOfWeek.map((value, index) => (
                    <H1Light style={{ color: "#000" }} key={index}>
                      {daysOfWeekMap[value]}
                    </H1Light>
                  ))}
              </View>
              <View style={styles.cardRow}>
                {r.startTime && (
                  <MdTxt style={{ color: "#000" }}>at {r.startTime}</MdTxt>
                )}
                <ToggleButton
                  style={{ marginLeft: "auto" }}
                  value={r.enabled}
                  onValueChange={() => toggleReminderEnbled(r)}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {editingReminder && (
        <>
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>
          <Animated.View
            style={[
              styles.slideInModal,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            <Pressable onPress={closeModal} style={styles.popupCloseBtn}>
              <EvilIcons name="close" size={44} color="white" />
            </Pressable>
            <ReminderForm
              initData={editingReminder}
              onSubmit={handleSaveEdit}
              onDelete={handleDelete}
              closeModal={closeModal}
            />
          </Animated.View>
        </>
      )}
    </>
  );
};

export default ReminderSettings;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 36,
    paddingHorizontal: 5,
  },
  heading: {
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  card: {
    width: "32.5%",
    borderRadius: 25,
    padding: 20,
    justifyContent: "space-between",
  },
  title: {
    color: "#000",
    textOverflow: "wrap",
  },
  daysName: {
    borderRadius: 40,
    flexDirection: "row",
    gap: 3,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 10,
  },
  popupCloseBtn: {
    position: "absolute",
    right: "100%",
    margin: 15,
    marginTop: 20,
  },
  slideInModal: {
    position: "absolute",
    backgroundColor: "#15211d",
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    top: 0,
    bottom: 0,
    right: 0,
    width: 405,
    zIndex: 20,
    elevation: 5,
  },
});
