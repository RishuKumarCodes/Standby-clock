import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  ScrollView,
  Dimensions,
} from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { H1Txt, H1Light, MdTxt } from "@/app/components/CustomText";
const screenHeight = Dimensions.get("window").height;
const RateUs = () => {
  const handleRateUs = () => {
    Linking.openURL(
      "https://play.google.com/store/apps/details?id=YOUR_APP_PACKAGE"
    );
  };

  const handleFeedback = () => {
    Linking.openURL(
      "mailto:rishukumar9233@gmail.com?subject=Feedback for StandBy Clock"
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <H1Light style={styles.title}>
        We hope you're enoying our NO-ads experience.
      </H1Light>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleFeedback}>
          <MaterialIcons
            style={styles.btnIcon}
            name="feedback"
            size={24}
            color="black"
          />
          <View>
            <MdTxt style={styles.buttonText}>Share your Feedback</MdTxt>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleRateUs}>
          <Entypo
            style={styles.btnIcon}
            name="google-play"
            size={24}
            color="black"
          />
          <MdTxt style={styles.buttonText}>Rate us on Google Play</MdTxt>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <H1Txt>How it all started</H1Txt>
        <MdTxt style={styles.description}>
          I was looking for a minimal desk clock app but couldn’t find one that
          was truly useful for me. Started as a side project—a byproduct of my
          search for something clean, useful, and which adds a touch of minimal
          style to your workspace. Every detail was designed to be clean,
          eye-friendly, and optimized for a smooth user experience.{" "}
        </MdTxt>
      </View>
    </ScrollView>
  );
};

export default RateUs;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: screenHeight * 0.25,
    paddingBottom: 40,
    justifyContent: "space-around",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 10,
    width: "90%",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    maxWidth: "90%",
  },

  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 35,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#182722",
    borderWidth: 1,
    borderColor: "#E6F904",
    borderRadius: 50,
    padding: 5,
  },
  btnIcon: {
    backgroundColor: "#E6F904",
    padding: 12,
    borderRadius: 30,
  },
  buttonText: {
    paddingLeft: 10,
    paddingRight: 20,
  },

  description: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
    color: "#999",
  },
});
