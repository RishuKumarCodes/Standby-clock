import uuid from "react-native-uuid";
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { H1Light } from "../CustomText";
import {
  AddNewPage,
  deletePage,
  getInitialPages,
} from "@/app/storage/pageWidgetsStorage";
import { categoryProviders, componentMap } from "@/app/registry/pageRegistry";
import { useClockStyle } from "@/app/context/ClockStyleContext";
import ConformationPopup from "@/app/components/ui/ConformationPopup";

const PagesPreviews = () => {
  const [pages, setPages] = useState([]);
  const { userColor } = useClockStyle();
  const [activePage, setActivePage] = useState();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [PageIdToBeDeleted, setPageIdToBeDeleted] = useState("");

  useEffect(() => {
    async function fetch() {
      const pages = await getInitialPages();
      setPages(pages);
      setActivePage(pages[0]?.id);
    }
    fetch();
  }, []);

  const onAddNew = async () => {
    const newPage = {
      id: String(uuid.v4()),
      component: "MinimalBold",
      category: "Date & time",
    };
    const updated = await AddNewPage(newPage);
    setPages(updated);
    setActivePage(newPage.id);
  };

  return (
    <>
      <View>
        <ScrollView
          horizontal
          keyboardShouldPersistTaps="handled"
          showsHorizontalScrollIndicator={false}
          removeClippedSubviews={false}
          contentContainerStyle={[
            styles.container,
            {
              justifyContent: "center",
              alignItems: "center",
              minWidth: "100%",
            },
          ]}
        >
          {pages.map((page) => {
            const Comp = componentMap[page.component];
            const ContextProvider = categoryProviders[page.category];
            const content = (
              <React.Suspense fallback={<View style={styles.card} />}>
                <Comp color={userColor} previewMode={true} />
              </React.Suspense>
            );
            return (
              <Pressable
                key={page.id}
                onPress={() => {
                  setActivePage(page.id);
                }}
                onLongPress={() => {
                  setPageIdToBeDeleted(page.id);
                  setShowDeletePopup(true);
                }}
                style={({ pressed }) => [
                  styles.card,
                  activePage === page.id && styles.activeCard,
                  pressed && { opacity: 0.7 },
                ]}
              >
                {ContextProvider ? (
                  <ContextProvider>{content}</ContextProvider>
                ) : (
                  content
                )}
              </Pressable>
            );
          })}
          <TouchableOpacity onPress={onAddNew} style={styles.addNew}>
            <H1Light>+</H1Light>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {pages.length > 1 ? (
        <ConformationPopup
          visible={showDeletePopup}
          message={`Are you sure to delete this page?`}
          cancelText="Cancel"
          confirmText="Delete"
          onConfirm={async () => {
            setShowDeletePopup(false);
            const updated = await deletePage(PageIdToBeDeleted);
            setPages(updated);
          }}
          onCancel={() => setShowDeletePopup(false)}
        />
      ) : (
        <ConformationPopup
          visible={showDeletePopup}
          message={`There should be at least one page`}
          confirmText="Got it !"
          onConfirm={async () => {
            setShowDeletePopup(false);
          }}
          onCancel={() => setShowDeletePopup(false)}
        />
      )}
    </>
  );
};

export default PagesPreviews;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    justifyContent: "center",
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
  },
  activeCard: {
    borderWidth: 1.5,
    borderColor: "rgb(205, 250, 236)",
  },
  addNew: {
    height: 62,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.7,
    paddingTop: 4,
    backgroundColor: "#000",
    borderRadius: 10,
  },
});
