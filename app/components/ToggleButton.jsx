import React, { useRef, useEffect } from "react";
import { TouchableOpacity, Animated, StyleSheet, Easing } from "react-native";

export default function ToggleButton({ value, onValueChange, style }) {
  const activeTrackColor = "#E6F904";
  const inactiveTrackColor = "#182722";

  const activeBorderColor = "#21362f";
  const inactiveBorderColor = "#999";

  const activeThumbColor = "#00593b";
  const inactiveThumbColor = "#707070";

  const animation = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: value ? 1 : 0,
      duration: 130,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start();
  }, [value, animation]);

  // Interpolate the track background color
  const trackBackground = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveTrackColor, activeTrackColor],
  });

  // Interpolate the border color based on toggle state
  const animatedBorderColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveBorderColor, activeBorderColor],
  });

  // Interpolate the thumb’s horizontal position
  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  // Choose thumb color based on toggle state
  const thumbColor = value ? activeThumbColor : inactiveThumbColor;

  const toggleSwitch = () => {
    onValueChange(!value);
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={toggleSwitch} style={style}>
      <Animated.View
        style={[
          styles.track,
          {
            backgroundColor: trackBackground,
            borderColor: animatedBorderColor,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX }],
              backgroundColor: thumbColor,
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: "center",
    borderWidth: 1,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 12,
  },
});
