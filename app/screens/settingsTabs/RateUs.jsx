import {
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
  ScrollView,
  Dimensions,
  Share,
} from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { H1Txt, H1Light, MdTxt } from "@/app/components/ui/CustomText";
const screenHeight = Dimensions.get("window").height;
const RateUs = () => {
  const handleRateUs = () => {
    Linking.openURL(
      "https://play.google.com/store/apps/details?id=com.rishukumarcodes.Standbyclock"
    );
  };

  const handleFeedback = () => {
    Linking.openURL(
      "https://docs.google.com/forms/d/e/1FAIpQLSeW2dbnms9xrzU2SHe9lLUSy2JQzj2GiF7JTNK9uZb12o4GBg/viewform?usp=header"
    );
  };

  const handleShareApp = async () => {
    try {
      const result = await Share.share({
        message:
          "Check out this clean and minimal desk clock app I found: https://play.google.com/store/apps/details?id=com.rishukumarcodes.Standbyclock",
      });

      // Optional: check if shared or dismissed
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.error("Error sharing app:", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.Container}>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          gap: 8,
          content: "center",
          position: "absolute",
          top: 30,
          right: 20,
        }}
        onPress={handleShareApp}
      >
        <Entypo
          style={{ paddingTop: 2 }}
          name="share"
          size={20}
          color="white"
        />
        <MdTxt style={{ fontSize: 17 }}>Share App</MdTxt>
      </TouchableOpacity>
      <H1Light style={styles.title}>
        We hope you're enoying our NO-ads experience.
      </H1Light>
      <View style={styles.card}>
        <H1Light style={styles.cardTitle}>
          Got suggestions or found a bug?
        </H1Light>
        <MdTxt style={styles.cardSubtitle}>
          Help us improve by sharing your thoughts, or leaving a rating.
        </MdTxt>

        <View style={styles.cardButtons}>
          <TouchableOpacity style={styles.button} onPress={handleFeedback}>
            <MaterialIcons
              style={styles.btnIcon}
              name="feedback"
              size={24}
              color="black"
            />
            <MdTxt style={styles.buttonText}>Share Feedback</MdTxt>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleRateUs}>
            <Entypo
              style={styles.btnIcon}
              name="google-play"
              size={24}
              color="black"
            />
            <MdTxt style={styles.buttonText}>Rate on Play Store</MdTxt>
          </TouchableOpacity>
        </View>
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
  Container: {
    paddingTop: screenHeight * 0.28,
    paddingBottom: 50,
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

  card: {
    backgroundColor: "#121715",
    borderRadius: 32,
    borderColor: "#0f1a16",
    borderWidth: 1,
    padding: 35,
    paddingHorizontal: 20,
    width: "85%",
    alignItems: "center",
    marginVertical: 50,
  },

  cardTitle: {
    fontSize: 20,
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#777",
    textAlign: "center",
    marginBottom: 35,
  },
  cardButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },

  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(16, 36, 29)",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(176, 255, 231, 0.1)",
    padding: 8,
    shadowColor: "rgba(176, 255, 231, 0.77)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 28,
  },

  btnIcon: {
    backgroundColor: "#E6F904",
    padding: 9,
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
