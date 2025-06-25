import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { FlatList } from "react-native-gesture-handler";
import { H1Txt, H2Txt, MdTxt } from "@/app/components/ui/CustomText";
import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import ConformationPopup from "@/app/components/ui/ConformationPopup";
import { updateTimers } from "@/app/storage/themesStorage/todos/DailyHabitTimer";
import Ionicons from "@expo/vector-icons/Ionicons";

const EditPage = ({
  timers,
  setTimers,
  selectedIndex,
  pagerRef,
  setModalVisible,
}) => {
  const [deletePopupIndex, setDeletePopupIndex] = React.useState<number | null>(
    null
  );

  const deleteTimer = (index: number) => {
    const updated = timers.filter((_, i) => i !== index);
    setTimers(updated);
    if (selectedIndex >= updated.length) {
      pagerRef.current?.scrollToIndex({
        index: Math.max(0, updated.length - 1),
      });
    }
    updateTimers(updated);
    setDeletePopupIndex(null); // Close the popup after deletion
  };

  const moveTimer = (index: number, direction: "up" | "down") => {
    const newTimers = [...timers];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= timers.length) return;
    [newTimers[index], newTimers[swapIndex]] = [
      newTimers[swapIndex],
      newTimers[index],
    ];
    setTimers(newTimers);
    updateTimers(newTimers);
  };

  return (
    <>
      <View style={styles.editPane}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 15,
          }}
        >
          <TouchableOpacity style={styles.analyticsBtn}>
            <MdTxt style={{ fontSize: 18, color: "#ddd" }}>Analytics</MdTxt>
          </TouchableOpacity>
          <H2Txt style={styles.editTitle}>Edit timers</H2Txt>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add-outline" size={24} color="black" />
            <Text style={{ fontSize: 16 }}> Add Timer</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={timers}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.timerRow}>
              <MdTxt
                style={[styles.timerName]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.name}
              </MdTxt>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => moveTimer(index, "up")}>
                  <AntDesign name="caretup" size={15} color="#ccc" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => moveTimer(index, "down")}>
                  <AntDesign name="caretdown" size={15} color="#ccc" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setDeletePopupIndex(index)}>
                  <EvilIcons name="close" size={24} color="#EF3352" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      {/* Move the popup outside the FlatList to avoid multiple instances */}
      {deletePopupIndex !== null && (
        <ConformationPopup
          visible={true}
          message={`Deleting "${timers[deletePopupIndex]?.name}" will also delete all its history.`}
          cancelText={"Cancel"}
          confirmText={"Delete"}
          onConfirm={() => deleteTimer(deletePopupIndex)}
          onCancel={() => setDeletePopupIndex(null)}
        />
      )}
    </>
  );
};

export default EditPage;

const styles = StyleSheet.create({
  editPane: {
    flex: 1,
    padding: 26,
    paddingRight: 10,
    paddingBottom: 0,
  },
  editTitle: {
    fontSize: 17,
  },
  timerRow: {
    backgroundColor: "#111",
    borderRadius: 13,
    paddingHorizontal: 20,
    marginBottom: 4,
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timerName: { fontSize: 18, maxWidth: "70%" },
  actions: { flexDirection: "row", gap: 20 },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 7,
    paddingRight: 12,
    alignSelf: "center",
    padding: 5,
    backgroundColor: "#cce5ff",
    borderRadius: 20,
  },
  analyticsBtn: {
    backgroundColor: "#212121",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 1.7,
    paddingHorizontal: 12,
    borderRadius: 40,
  },
});
