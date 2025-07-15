import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { H1Txt, MdTxt } from "@/app/components/ui/CustomText";
import { MoonComponent } from "./RenderMoon";
import { useClockStatus } from "@/app/context/ClockStatusContext";
import { useFonts } from "expo-font";

interface WeatherData {
  moonPhase: number;
  sunrise: string;
  sunset: string;
  description: string;
  location: string;
  temperature: number;
}

interface RightComponentProps {
  weatherData: WeatherData;
}

const RightComponent: React.FC<RightComponentProps> = ({ weatherData }) => {
  const { hour, min, ampm, date, day, month } = useClockStatus();

  const [fontsLoaded] = useFonts({
    Nasa: require("@/assets/fonts/Nasa.ttf"),
  });

  const getMoonPhaseDescription = (phase: number) => {
    if (phase < 0.03 || phase > 0.97) return "New Moon";
    if (phase < 0.22) return "Waxing Crescent";
    if (phase < 0.28) return "First Quarter";
    if (phase < 0.47) return "Waxing Gibbous";
    if (phase < 0.53) return "Full Moon";
    if (phase < 0.72) return "Waning Gibbous";
    if (phase < 0.78) return "Last Quarter";
    return "Waning Crescent";
  };

  return (
    <View style={styles.container}>
      <View style={styles.moonSection}>
        <View
          style={{
            transform: [{ rotate: "-25deg" }],
          }}
        >
          <MoonComponent
            weatherData={weatherData}
            containerWidth={150}
            containerHeight={150}
          />
        </View>
        <View style={styles.moonTextContainer}>
          <H1Txt style={styles.infoValue}>
            {getMoonPhaseDescription(weatherData.moonPhase)}
          </H1Txt>
          <MdTxt style={styles.infoValue}>
            {day.slice(0, 3)} {date} {month.slice(0, 3)}
          </MdTxt>
        </View>
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>
          {hour}:{min}
        </Text>
        <Text style={styles.ampm}>{ampm}</Text>
      </View>
    </View>
  );
};

export default RightComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  moonSection: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  moonTextContainer: {
    marginRight: "5%",
  },
  infoValue: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "400",
  },
  timeContainer: {
    flexDirection: "row",
    opacity: 0.7,
    alignItems: "flex-end",
  },
  timeText: {
    fontSize: 84,
    fontFamily: "Nasa",
    color: "#fff",
    paddingRight: 12,
  },
  ampm: {
    fontSize: 34,
    marginBottom: 10,
    fontFamily: "Nasa",
    color: "#fff",
    paddingRight: 14,
  },
});
