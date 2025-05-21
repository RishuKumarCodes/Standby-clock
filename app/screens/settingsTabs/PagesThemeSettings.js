import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";

import PagesPreviews from "../../components/pagesThemeSettings/PagesPreviews.jsx";
import Sidebar from "../../components/pagesThemeSettings/Sidebar.jsx";
import ThemesCards from "../../components/pagesThemeSettings/ThemesCards.jsx";
import { PageSettings } from "@/app/context/PageSettingsContext";

import { getInitialPages, updatePage } from "@/app/storage/pageWidgetsStorage";

const PagesThemes = () => {
  const [pages, setPages] = useState([]);
  const { activePage, setActivePage } = PageSettings();

  const [activeTab, setActiveTab] = useState("dateTime");

  useEffect(() => {
    (async () => {
      const initial = await getInitialPages();
      setPages(initial);
    })();
  }, []);

  const handlePageChange = async (updatedPage) => {
    await updatePage(updatedPage);
    setPages((old) =>
      old.map((p) => (p.id === updatedPage.id ? updatedPage : p))
    );
    if (activePage?.id === updatedPage.id) {
      setActivePage(updatedPage);
    }
  };

  return (
    <View style={styles.container}>
      <PagesPreviews
        pages={pages}
        activePage={activePage}
        setPages={setPages}
        setActivePage={setActivePage}
      />

      <View style={styles.bottomRow}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <ThemesCards
          activeTab={activeTab}
          activePage={activePage}
          onChangePage={handlePageChange}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  bottomRow: { flex: 1, flexDirection: "row" },
});

export default PagesThemes;
