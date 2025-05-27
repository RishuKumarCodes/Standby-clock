import React from "react";
import {
  View,
  Pressable,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from "react-native";
import { PageSettings } from "../../context/PageSettingsContext.js";
import { MdTxt } from "../ui/CustomText.jsx";

// clock theme components...
import MinimalBold from "../../themes/date&Time/MinimalBold.tsx";
import MinimalThin from "../../themes/date&Time/MinimalThin.jsx";
import AnalogClock from "../../themes/date&Time/AnalogClock.tsx";
import WeatherBattery from "../../themes/date&Time/WeatherBattery.tsx";
import WindowsClock from "../../themes/date&Time/WindowsClock/WindowsClock.tsx";
import SegmentClock from "../../themes/date&Time/SegmentClock.tsx";
import CircleTheme from "../../themes/date&Time/circleTheme/CircleTheme.tsx";
import EarthClock from "../../themes/date&Time/EarthClock/EarthClock.tsx";

// focus theme components...
import TimerScreen from "../../themes/Focus/TimerTodoCombo.jsx/TimerScreen.jsx";
import FullScreenTimer from "../../themes/Focus/FullScreenTimer";

// timer theme components:
import DailyHabit from "../../themes/todos/DailyHabit.tsx";

const ThemesCards = ({ activeTab, activePage, onChangePage }) => {
  const { userColor } = PageSettings();

  const setClockStyle = (styleName) => {
    if (!activePage) return;
    const updated = { ...activePage, component: styleName };
    onChangePage(updated);
  };

  const dateTime = {
    MinimalBold,
    MinimalThin,
    AnalogClock,
    WeatherBattery,
    SegmentClock,
    CircleTheme,
    EarthClock,
    WindowsClock,
  };
  const calendar = {
    /* … */
  };
  const focus = { TimerScreen, FullScreenTimer };
  const todos = { DailyHabit };

  const themeMaps = { dateTime, calendar, focus, todos };
  const currentThemes = themeMaps[activeTab] || {};

  if (Object.keys(currentThemes).length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MdTxt>Coming Soon!</MdTxt>
      </View>
    );
  }

  const handleFeedback = () => {
    Linking.openURL(
      "https://docs.google.com/forms/d/e/1FAIpQLSeW2dbnms9xrzU2SHe9lLUSy2JQzj2GiF7JTNK9uZb12o4GBg/viewform?usp=header"
    );
  };

  return (
    <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {Object.keys(currentThemes).map((styleName) => {
          const PreviewComponent = currentThemes[styleName];
          return (
            <Pressable
              key={styleName}
              style={[
                styles.styleOption,
                activePage?.component === styleName && styles.selectedOption,
              ]}
              onPress={() => setClockStyle(styleName)}
            >
              <View style={styles.previewContainer} pointerEvents="none">
                <PreviewComponent
                  previewMode={true}
                  variant={"themeCard"}
                  color={userColor || "#fff"}
                />
              </View>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.suggestionBox}>
        <MdTxt style={styles.formTxt}>
          have any suggestions? feel free to share by
        </MdTxt>
        <TouchableOpacity onPress={handleFeedback}>
          <MdTxt style={styles.formLinkTxt}>clicking here.</MdTxt>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ThemesCards;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginTop: 9,
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 17,
  },
  styleOption: {
    backgroundColor: "#000",
    borderRadius: 20,
    width: "48%",
    aspectRatio: 19.5 / 9,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(205, 250, 236, 0.07)",
    shadowColor: "rgba(205, 250, 224, 0.8)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 9.5,
  },
  selectedOption: {
    borderColor: "#d8f904",
    borderWidth: 3.1,
    overflow: "hidden",
  },
  previewContainer: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    paddingBottom: 30,
    opacity: 0.75,
    alignItems: "center",
    justifyContent: "center",
  },
  suggestionBox: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    marginBottom: 35,
  },
  formTxt: {
    color: "#999",
    fontSize: 14,
  },
  formLinkTxt: {
    textDecorationLine: "underline",
    color: "#5e8deb",
    fontSize: 14,
  },
});
