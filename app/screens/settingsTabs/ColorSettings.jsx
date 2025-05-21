import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { PageSettings } from "../../context/PageSettingsContext";
import { H1Txt } from "@/app/components/ui/CustomText";
import ColorPallete from "../../components/colorSettingsComponents/ColorPallete.jsx";
import Buttons from "../../components/colorSettingsComponents/Buttons.jsx";
import PagePreview from "../../components/colorSettingsComponents/PagePreview.jsx";

export default function ColorSettings() {
  const { userColor, setUserColor, activePage } = PageSettings();
  const [tempColor, setTempColor] = useState(userColor);

  return (
    <View style={styles.container}>
      <View style={styles.sectionsContainer}>
        <ScrollView style={styles.leftSection}>
          <H1Txt>Select color:</H1Txt>
          <PagePreview activePage={activePage} userColor={userColor} />
          <Buttons
            setTempColor={setTempColor}
            tempColor={tempColor}
            userColor={userColor}
            setUserColor={setUserColor}
          />
        </ScrollView>

        <ColorPallete
          userColor={userColor}
          setUserColor={setUserColor}
          setTempColor={setTempColor}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingLeft: 5,
  },
  sectionsContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 20,
    justifyContent: "space-between",
  },

  leftSection: {
    flex: 1,
    paddingVertical: 36,
  },
});
