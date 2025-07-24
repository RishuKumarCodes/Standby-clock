import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from "react-native";
import EditNavbar from "./EditNavbar";
import { ScrollView } from "react-native-gesture-handler";
import { EvilIcons } from "@expo/vector-icons";
import { BackHandler } from "react-native";

const EditPageFrame = ({
  visible,
  onClose,
  onSave,
  tabs = [],
  contentStyle = {},
  overlayStyle = {},
  children,
}) => {
  const [activeTab, setActiveTab] = useState(
    tabs.length > 0 ? tabs[0].id : null
  );
  const screenWidth = Dimensions.get("window").width;
  const [slideAnim] = useState(new Animated.Value(screenWidth));

  useEffect(() => {
    const animateIn = () => {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    };

    const animateOut = () => {
      Animated.timing(slideAnim, {
        toValue: screenWidth,
        duration: 150,
        useNativeDriver: true,
      }).start();
    };

    const onBackPress = () => {
      if (visible) {
        handleOverlayPress();
        return true;
      }
      return false;
    };

    if (visible) {
      animateIn();

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => backHandler.remove();
    } else {
      animateOut();
    }
  }, [visible]);

  const handleOverlayPress = () => {
    Animated.timing(slideAnim, {
      toValue: screenWidth,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const animtedOnSave = () => {
    Animated.timing(slideAnim, {
      toValue: screenWidth,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      onSave();
    });
  };

  const getCurrentTabContent = () => {
    if (children) return children;
    const currentTab = tabs.find((tab) => tab.id === activeTab);
    return currentTab ? currentTab.content : null;
  };

  if (!visible) return null;

  return (
    <>
      <TouchableWithoutFeedback
        onPress={handleOverlayPress}
        pointerEvents="box-none"
      >
        <View style={[styles.backdrop, overlayStyle]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.slideInModal,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <View style={[styles.modalContent, contentStyle]}>
          {tabs.length > 0 && (
            <EditNavbar
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onSave={animtedOnSave}
            />
          )}
          <ScrollView style={styles.tabContent}>
            {getCurrentTabContent()}
          </ScrollView>
        </View>
        <View
          pointerEvents="none"
          style={{ position: "absolute", right: "100%", padding: 20 }}
        >
          <EvilIcons name="close" size={44} color="white" />
        </View>
      </Animated.View>
    </>
  );
};

export default EditPageFrame;

const styles = StyleSheet.create({
  modalContent: {
    width: "100%",
    height: "100%",
    backgroundColor: "#15211d",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 0,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 10,
  },
  slideInModal: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: 465,
    backgroundColor: "#15211d",
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    zIndex: 20,
    elevation: 5,
  },
});
