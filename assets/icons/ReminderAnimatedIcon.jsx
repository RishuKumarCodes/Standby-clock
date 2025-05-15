import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { Svg, Path, Line } from "react-native-svg";

const ReminderIcon = ({ isActive, size = 24 }) => {
  const hand1Anim = useRef(new Animated.Value(0)).current;
  const hand2Anim = useRef(new Animated.Value(0)).current;
  const bellShake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      Animated.parallel([
        Animated.timing(hand1Anim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(hand2Anim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(bellShake, {
            toValue: 1,
            duration: 60,
            useNativeDriver: true,
          }),
          Animated.timing(bellShake, {
            toValue: -1,
            duration: 60,
            useNativeDriver: true,
          }),
          Animated.timing(bellShake, {
            toValue: 1,
            duration: 60,
            useNativeDriver: true,
          }),
          Animated.timing(bellShake, {
            toValue: 0,
            duration: 60,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        hand1Anim.setValue(0);
        hand2Anim.setValue(0);
        bellShake.setValue(0);
      });
    }
  }, [isActive]);

  const hand1Rotate = hand1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '125deg'],
  });

  const hand2Rotate = hand2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['125deg', '360deg'],
  });

  const bellShakeRotate = bellShake.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-8deg', '0deg', '8deg'],
  });

  const currentColor = isActive ? 'black' : 'white';
  const handStroke = 1.5;
  const handLength = 6;

  return (
    <Animated.View style={{paddingBottom:2}}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* Clock outline */}
        <Path
          d="M12,22.75A9.75,9.75,0,1,1,21.75,13,9.761,9.761,0,0,1,12,22.75Z"
          fill="none"
          stroke={currentColor}
          strokeWidth={1}
        />
      </Svg>

      {/* Bell Shake Animation */}
      <Animated.View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          transform: [{ rotate: bellShakeRotate }],
        }}
      >
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {/* Bells */}
          <Path
            d="M2 5.75A.75.75 0 011.55 4.4l4-3a.75.75 0 01.9 1.2l-4 3A.748.748 0 012 5.75z"
            fill={currentColor}
          />
          <Path
            d="M22 5.75a.748.748 0 01-.449-.15l-4-3a.75.75 0 11.9-1.2l4 3A.75.75 0 0122 5.75z"
            fill={currentColor}
          />
        </Svg>
      </Animated.View>

      {/* Hand 1 */}
      <Animated.View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          transform: [{ rotate: hand1Rotate }],
        }}
      >
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Line
            x1="12"
            y1="12"
            x2="12"
            y2={12 - handLength}
            stroke={currentColor}
            strokeWidth={handStroke}
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>

      {/* Hand 2 */}
      <Animated.View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          transform: [{ rotate: hand2Rotate }],
        }}
      >
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Line
            x1="12"
            y1="12"
            x2="12"
            y2={12 - handLength}
            stroke={currentColor}
            strokeWidth={handStroke}
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
};

export default ReminderIcon;
