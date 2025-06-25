import { Dimensions, StyleSheet, View } from "react-native";
import EditPage from "./EditPage";
import { FlatList } from "react-native-gesture-handler";
import { H1Txt, H1Light } from "@/app/components/ui/CustomText";
import FlagIcon from "@/assets/icons/Flag";
const LeftPane = ({
  setSelectedIndex,
  selectedIndex,
  pagerRef,
  timers,
  setModalVisible,
  setTimers,
  formatTime,
}) => {
  const SCREEN_HEIGHT = Dimensions.get("window").height;
  const visibleHeight = Dimensions.get("screen").height;

  return (
    <View style={styles.leftPane}>
      <FlatList
        ref={pagerRef}
        data={[...timers, { name: "edit", duration: -1 }]}
        keyExtractor={(_, i) => i.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          height:
            visibleHeight * [...timers, { name: "edit", duration: -1 }].length,
        }}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.y / SCREEN_HEIGHT
          );
          setSelectedIndex(index);
        }}
        renderItem={({ item, index }) => (
          <View style={{ height: visibleHeight, width: "100%" }}>
            {item.duration === -1 ? (
              <EditPage
                timers={timers}
                setTimers={setTimers}
                selectedIndex={selectedIndex}
                pagerRef={pagerRef}
                setModalVisible={setModalVisible}
              />
            ) : (
              <View style={styles.timerPane}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <FlagIcon color={"#777"} size={32} />
                  <H1Light style={styles.timerDuration}>
                    {formatTime(item.duration)}
                  </H1Light>
                </View>
                <H1Txt style={styles.timerTitle}>{item.name}</H1Txt>
                <H1Txt style={styles.nextTimer}>
                  Next: {timers[(index + 1) % timers.length]?.name || "N/A"}
                </H1Txt>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default LeftPane;

const styles = StyleSheet.create({
  leftPane: { flex: 1.5 },
  timerPane: {
    flex: 1,
    justifyContent: "flex-end",
    padding: "9%",
    paddingRight: 0,
  },
  timerTitle: { fontSize: 55 },
  timerDuration: { fontSize: 23, color: "#777" },
  nextTimer: { fontSize: 32, marginVertical: -20, color: "#555" },
});
