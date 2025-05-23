import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";

import uuid from "react-native-uuid";
import { H1Light } from "../ui/CustomText";

import EditIcon from "../../../assets/icons/EditIcon.jsx";
import { AddNewPage, deletePage } from "@/app/storage/pageWidgetsStorage";
import { categoryProviders, componentMap } from "@/app/registry/pageRegistry";
import { PageSettings } from "@/app/context/PageSettingsContext";
import ConformationPopup from "@/app/components/ui/ConformationPopup";

const PagesPreviews = ({
  pages,
  setPages,
  activePage,
  setActivePage,
  toggleOverlay,
}) => {
  const { userColor } = PageSettings();

  const [showDeletePopup, setShowDeletePopup] = React.useState(false);
  const [toDeleteId, setToDeleteId] = React.useState("");

  const onAddNew = async () => {
    const newPage = {
      id: String(uuid.v4()),
      component: "MinimalBold",
      category: "Date & time",
    };
    const updated = await AddNewPage(newPage);
    setPages(updated);
    setActivePage(newPage);
  };

  const onConfirmDelete = async () => {
    setShowDeletePopup(false);
    const updated = await deletePage(toDeleteId);
    setPages(updated);
    if (toDeleteId === activePage?.id) {
      setActivePage(updated[0] || null);
    }
  };

  return (
    <>
      <View style={[styles.container, { flexDirection: "row" }]}>
        <ScrollView
          horizontal
          keyboardShouldPersistTaps="handled"
          showsHorizontalScrollIndicator={false}
          removeClippedSubviews={false}
          contentContainerStyle={[
            {
              justifyContent: "center",
              alignItems: "center",
              minWidth: "91%",
              paddingHorizontal: 25,
            },
          ]}
        >
          {pages.map((page) => {
            const Comp = componentMap[page.component];
            const ContextProvider = categoryProviders[page.category];
            const content = (
              <React.Suspense fallback={<View style={styles.card} />}>
                <Comp
                  color={userColor}
                  previewMode={true}
                  variant={"smallPreview"}
                  style={{ scale: 0.3 }}
                />
              </React.Suspense>
            );

            return (
              <Pressable
                key={page.id}
                onPress={() => setActivePage(page)}
                onLongPress={() => {
                  setToDeleteId(page.id);
                  setShowDeletePopup(true);
                }}
                style={({ pressed }) => [
                  styles.card,
                  activePage?.id === page.id && styles.activeCard,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <View pointerEvents="none" style={styles.cardContentContainer}>
                  {ContextProvider ? (
                    <ContextProvider>{content}</ContextProvider>
                  ) : (
                    content
                  )}
                </View>
              </Pressable>
            );
          })}

          <TouchableOpacity onPress={onAddNew} style={styles.addNew}>
            <H1Light style={{ fontSize: 30, marginTop: 6 }}>+</H1Light>
          </TouchableOpacity>
        </ScrollView>
        <TouchableOpacity style={styles.editButton} onPress={toggleOverlay}>
          <EditIcon size={22} />
        </TouchableOpacity>
      </View>

      <ConformationPopup
        visible={showDeletePopup}
        message={
          pages.length > 1
            ? "Are you sure to delete this page?"
            : "There should be at least one page"
        }
        cancelText={pages.length > 1 ? "Cancel" : undefined}
        confirmText={pages.length > 1 ? "Delete" : "Got it !"}
        onConfirm={onConfirmDelete}
        onCancel={() => setShowDeletePopup(false)}
      />
    </>
  );
};

export default PagesPreviews;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    height: 84,
  },
  card: {
    height: 62,
    aspectRatio: 19.5 / 9,
    backgroundColor: "#000",
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 15,
    shadowColor: "rgb(205, 250, 236)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 14,
    overflow: "hidden",
  },
  cardContentContainer: {
    height: "100%",
    width: "100%",
  },
  activeCard: {
    borderWidth: 1.5,
    borderColor: "rgb(205, 250, 236)",
  },
  addNew: {
    height: 58,
    margin: 2,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.7,
    backgroundColor: "#1b2b26",
    borderRadius: 90,
  },

  editButton: {
    height: 54,
    width: 54,
    marginTop: 10,
    marginLeft: 10,
    backgroundColor: "#0c4532",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderTopRightRadius: 4,
  },
});
