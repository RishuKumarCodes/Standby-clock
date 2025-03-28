import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native"; // Added View import

import { H1Light } from "../components/CustomText";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <H1Light type="title">This screen doesn't exist.</H1Light>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>{" "}
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    backgroundColor: "#E6F904",
    borderRadius: 40,
    paddingHorizontal: 20,
  },
  linkText: {
    color: "#000",
    textAlign: "center",
  },
});
