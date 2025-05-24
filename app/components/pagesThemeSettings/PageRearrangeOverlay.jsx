import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import React from "react";
import { DimTxt, H1Light, MdTxt } from "../ui/CustomText";
import uuid from "react-native-uuid";

import { PageSettings } from "@/app/context/PageSettingsContext";
import { categoryProviders, componentMap } from "@/app/registry/pageRegistry";
import ReorderIcon from "../../../assets/icons/reorder.jsx";
import {
  AddNewPage,
  deletePage,
  resetPage,
} from "@/app/storage/pageWidgetsStorage";

const PageRearrangeOverlay = ({ visible, onClose, pages, setPages }) => {
  const { userColor } = PageSettings();

  const onAddNew = async () => {
    const newPage = {
      id: String(uuid.v4()),
      component: "MinimalBold",
      category: "Date & time",
    };
    const updated = await AddNewPage(newPage);
    setPages(updated);
  };

  const deleteSelectedPage = async (toDeleteId) => {
    const updated = await deletePage(toDeleteId);
    setPages(updated);
  };

  const reset = async () => {
    const updated = await resetPage();
    setPages(updated);
  };

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.container}>
        <View style={styles.navbar}>
          {/* <TouchableOpacity
              onPress={onClose}
              style={[styles.btns, { backgroundColor: "#1b2b26" }]}
            >
              <MdTxt>Cancel</MdTxt>
            </TouchableOpacity> */}
          <TouchableOpacity
            onPress={reset}
            style={[styles.btns, { backgroundColor: "#0c4532" }]}
          >
            <MdTxt>Reset</MdTxt>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.btns, { backgroundColor: "#E6F904" }]}
          >
            <MdTxt style={{ color: "#000" }}>Done</MdTxt>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <ScrollView
            horizontal
            keyboardShouldPersistTaps="handled"
            showsHorizontalScrollIndicator={false}
            removeClippedSubviews={false}
            contentContainerStyle={styles.scrollview}
          >
            {pages.map((page) => {
              const Comp = componentMap[page.component];
              const ContextProvider = categoryProviders[page.category];
              const content = (
                <React.Suspense fallback={<View style={cardStyles.card} />}>
                  <Comp
                    color={userColor}
                    previewMode={true}
                    variant="smallPreview"
                    style={{ scale: 0.3 }}
                  />
                </React.Suspense>
              );

              return (
                <View style={cardStyles.container} key={page.id}>
                  <View style={{ alignItems: "center" }}>
                    <ReorderIcon />
                    <DimTxt style={{ color: "#0c4532" }}>
                      {page.category}
                    </DimTxt>
                  </View>
                  <View style={[cardStyles.card]}>
                    <View
                      pointerEvents="none"
                      style={cardStyles.cardContentContainer}
                    >
                      {ContextProvider ? (
                        <ContextProvider>{content}</ContextProvider>
                      ) : (
                        content
                      )}
                    </View>
                  </View>
                  <TouchableOpacity
                    style={cardStyles.deleteButton}
                    onPress={() => {
                      deleteSelectedPage(page.id);
                    }}
                  >
                    <MdTxt style={{ color: "#b30000" }}>Delete</MdTxt>
                  </TouchableOpacity>
                </View>
              );
            })}
            <Pressable style={cardStyles.createNew} onPress={onAddNew}>
              <H1Light style={cardStyles.plus}>+</H1Light>
              <MdTxt>Add new</MdTxt>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default PageRearrangeOverlay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(8, 13, 11, 0.94)",
  },
  navbar: {
    padding: 20,
    gap: 15,
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  body: {
    flex: 1,
    margin: "auto",
    justifyContent: "center",
  },
  scrollview: {
    justifyContent: "center",
    alignItems: "center",
    minWidth: "100%",
    paddingHorizontal: 30,
  },
  btns: {
    paddingVertical: 10,
    paddingHorizontal: 23,
    paddingTop: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
  },
});

const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: "rgb(157, 176, 158)",
    borderWidth: 6,
    borderColor: "rgb(172, 190, 173)",
    marginRight: 16,
    alignItems: "center",
    gap: 10,
    marginBottom: 50,
    padding: 3,
    borderRadius: 18,
  },
  card: {
    height: 62,
    aspectRatio: 19.5 / 9,
    backgroundColor: "#000",
    borderRadius: 8,
    overflow: "hidden",
  },
  cardContentContainer: {
    height: "100%",
    width: "100%",
  },
  deleteButton: {
    alignItems: "center",
    width: "75%",
    paddingHorizontal: 4,
  },
  createNew: {
    borderRadius: 18,
    height: 175,
    marginBottom: 50,
    width: 145,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(140, 156, 141)",
    borderWidth: 6,
    borderColor: "rgb(172, 190, 173)",
    marginRight: 16,
    marginBottom: 50,
    borderRadius: 18,
    gap: 10,
  },
  plus: {
    backgroundColor: "rgb(172, 190, 173)",
    aspectRatio: 1,
    textAlign: "center",
    paddingTop: 8,
    borderRadius: 50,
  },
});
