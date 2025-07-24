import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
  Animated,
} from "react-native";
import EditIcon from "@/assets/icons/EditIcon";
import { EditPage } from "../../themes/weather/Common/EditPage";

interface TouchEditContainer {
  children: ReactNode;
  style?: ViewStyle;
  lat?: number;
  lon?: number;
  buttonColor?: string;
  buttonSize?: number;
  iconSize?: number;
  showDuration?: number;
  fadeInDuration?: number;
  fadeOutDuration?: number;
  setShowModal: (value: boolean) => void;
}

export const TouchEditContainer: React.FC<TouchEditContainer> = ({
  children,
  style,
  buttonColor = "#121212",
  buttonSize = 50,
  iconSize = 28,
  showDuration = 2000,
  fadeInDuration = 200,
  fadeOutDuration = 300,
  setShowModal,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  const revealButton = useCallback(
    (_e: GestureResponderEvent) => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }

      setIsVisible(true);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: fadeInDuration,
        useNativeDriver: true,
      }).start();

      // Set timeout to start fade out after specified duration
      hideTimer.current = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: fadeOutDuration,
          useNativeDriver: true,
        }).start((finished) => {
          if (finished) {
            setIsVisible(false);
          }
        });
      }, showDuration);
    },
    [fadeAnim, showDuration, fadeInDuration, fadeOutDuration]
  );

  useEffect(() => {
    return () => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
    };
  }, []);

  const handleEditPress = useCallback(() => {
    setShowModal(true);
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
    }
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start((finished) => {
      if (finished) {
        setIsVisible(false);
      }
    });
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Pressable style={[styles.pressableArea, style]} onPressIn={revealButton}>
        {children}
      </Pressable>

      {isVisible && (
        <Animated.View
          style={[
            styles.editButtonContainer,
            {
              opacity: fadeAnim,
              width: buttonSize,
              height: buttonSize,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.editButton,
              {
                backgroundColor: buttonColor,
                width: buttonSize,
                height: buttonSize,
                borderRadius: buttonSize,
                padding: iconSize,
              },
            ]}
            onPress={handleEditPress}
            activeOpacity={0.8}
          >
            <EditIcon size={iconSize} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  pressableArea: {
    width: "100%",
    height: "100%",
  },
  editButtonContainer: {
    position: "absolute",
    bottom: 25,
    right: 25,
  },
  editButton: {
    justifyContent: "center",
    alignItems: "center",
  },
});
