import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import ThemesCards from "../../components/pagesThemeSettings/ThemesCards.jsx";
import Sidebar from "../../components/pagesThemeSettings/Sidebar.jsx";
import PagesPreviews from "../../components/pagesThemeSettings/PagesPreviews.jsx";

const PagesThemes = () => {
  const [activeTab, setActiveTab] = useState("dateTime");

  return (
    <View style={styles.container}>
      <PagesPreviews />
      <View style={styles.bottomRow}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <ThemesCards style={styles.flex} activeTab={activeTab} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomRow: {
    flex: 1,
    flexDirection: "row",
  },
  flex: {
    flex: 1,
  },
});

export default PagesThemes;
