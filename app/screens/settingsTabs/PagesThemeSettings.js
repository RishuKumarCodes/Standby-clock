import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";

import PagesPreviews from "../../components/pagesThemeSettings/PagesPreviews.jsx";
import PageRearrangeOverlay from "../../components/pagesThemeSettings/PageRearrangeOverlay.jsx";
import Sidebar from "../../components/pagesThemeSettings/Sidebar.jsx";
import ThemesCards from "../../components/pagesThemeSettings/ThemesCards.jsx";
import { PageSettings } from "@/app/context/PageSettingsContext";

import { getInitialPages, updatePage } from "@/app/storage/pageWidgetsStorage";

const PagesThemes = () => {
  const [pages, setPages] = useState([]);
  const { activePage, setActivePage } = PageSettings();

  const [activeTab, setActiveTab] = useState("dateTime");
  const [rearrangeOverlay, setRearrangeOverlay] = useState(false);

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

  const toggleOverlay = () => {
    setRearrangeOverlay((prev) => !prev);
  };

  return (
    <>
      <View style={styles.container}>
        <View>
          <PagesPreviews
            pages={pages}
            activePage={activePage}
            setPages={setPages}
            setActivePage={setActivePage}
            toggleOverlay={toggleOverlay}
          />
        </View>

        <View style={styles.bottomRow}>
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <ThemesCards
            activeTab={activeTab}
            activePage={activePage}
            onChangePage={handlePageChange}
          />
        </View>
      </View>

      <PageRearrangeOverlay
        pages={pages}
        activePage={activePage}
        setPages={setPages}
        setActivePage={setActivePage}
        toggleOverlay={toggleOverlay}
        visible={rearrangeOverlay}
        onClose={toggleOverlay}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  bottomRow: { flex: 1, flexDirection: "row" },
});

export default PagesThemes;
