import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { Svg, G, Path, Circle } from "react-native-svg";

// Simple hook to capture the previous value of a prop/state
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ColorPaletteIcon = ({ isActive, size = 27.5 }) => {
  const currentColor = isActive ? "black" : "white";

  // Coordinates for each dot
  const circles = [
    { cx: 17, cy: 8.8 },
    { cx: 11.65, cy: 6.5 },
    { cx: 6.85, cy: 8.9 },
    { cx: 7.56, cy: 15.26 },
  ];

  // One Animated.Value per dot, starting at scale=1
  const animations = useRef(circles.map(() => new Animated.Value(1))).current;
  // Ref to the running master animation
  const animRef = useRef();

  // Capture previous isActive to detect false→true transitions
  const prevIsActive = usePrevious(isActive);

  useEffect(() => {
    // Only kick off/reset animation when we just flipped false→true
    if (!prevIsActive && isActive) {
      // Reset all dots to scale=1
      animations.forEach(anim => anim.setValue(1));
      // Stop any lingering animation
      if (animRef.current) {
        animRef.current.stop();
      }

      // Build a staggered sequence for each dot
      const staggered = animations.map((anim, idx) =>
        Animated.sequence([
          Animated.delay(idx * 80), // stagger start
          Animated.timing(anim, {
            toValue: 1.9,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
        ])
      );

      // Run them all in parallel (each respects its delay)
      animRef.current = Animated.parallel(staggered);
      animRef.current.start();
    }
  }, [isActive, prevIsActive, animations]);

  // On unmount, ensure we stop any running animation
  useEffect(() => {
    return () => {
      if (animRef.current) {
        animRef.current.stop();
      }
    };
  }, []);

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <G
        stroke={currentColor}
        strokeWidth={0.9}
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* Palette outline */}
        <Path d="M19.54 5.08A10.61 10.61 0 0 0 11.91 2a10 10 0 0 0-.05 20 2.58 2.58 0 0 0 2.53-1.89 2.52 2.52 0 0 0-.57-2.28.5.5 0 0 1 .37-.83h1.65A6.15 6.15 0 0 0 22 11.33a8.48 8.48 0 0 0-2.46-6.25z" />

        {/* Animated color dots */}
        {circles.map(({ cx, cy }, idx) => {
          // Interpolate the animated scale value [1 → 1.5] into an r [1.5 → 2.25]
          const rAnim = animations[idx].interpolate({
            inputRange: [1, 1.5],
            outputRange: [1.5, 2.25],
          });
          return (
            <AnimatedCircle
              key={idx}
              cx={cx}
              cy={cy}
              fill={currentColor}
              r={rAnim}
            />
          );
        })}
      </G>
    </Svg>
  );
};

export default ColorPaletteIcon;
