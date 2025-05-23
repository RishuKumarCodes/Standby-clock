import React from "react";
import { View, StyleSheet } from "react-native";
import TimerComponent from "./componentsTimerPage/TimerComponent.jsx";
import TodoComponent from "./componentsTimerPage/TodoComponent.jsx";

const TimerScreen = ({ previewMode, color }) => {
  return (
    <View style={[styles.container]}>
      <View style={styles.timerSection}>
        <TimerComponent
          totalTime={1500}
          previewMode={previewMode}
          primaryColor={color}
        />
      </View>
      <View style={[styles.todoSection, { flex: 1 }]}>
        <TodoComponent previewMode={previewMode} primaryColor={color} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  timerSection: {
    width: "45%",
  },
  todoSection: {
    flex: 1,
    paddingLeft: 20,
    justifyContent: "center",
  },
});

export default TimerScreen;
