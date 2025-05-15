import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { Svg, G, Path, Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ColorPaletteIcon = ({ isActive, size = 27.5 }) => {
  const currentColor = isActive ? "black" : "white";

  const circles = [
    { cx: 17, cy: 8.8 },
    { cx: 11.65, cy: 6.5 },
    { cx: 6.85, cy: 8.9 },
    { cx: 7.56, cy: 15.26 },
  ];

  // one Animated.Value per dot
  const animations = useRef(circles.map(() => new Animated.Value(1))).current;
  // ref to hold the running animation
  const animRef = useRef();

  useEffect(() => {
    // reset all radii & stop any running animation
    animations.forEach((anim) => anim.setValue(1));
    if (animRef.current) {
      animRef.current.stop();
    }

    if (isActive) {
      // build per-dot sequences with staggered start
      const staggered = animations.map((anim, idx) =>
        Animated.sequence([
          Animated.delay(idx * 100), // stagger
          Animated.timing(anim, {
            toValue: 1.9,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );

      // run all in parallel (each respects its own delay)
      const master = Animated.parallel(staggered);
      animRef.current = master;
      master.start();
    }

    return () => {
      if (animRef.current) {
        animRef.current.stop();
      }
      animations.forEach((anim) => anim.setValue(1));
    };
  }, [isActive, animations]);

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <G
        stroke={currentColor}
        strokeWidth={0.9}
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* Palette shape */}
        <Path d="M19.54 5.08A10.61 10.61 0 0 0 11.91 2a10 10 0 0 0-.05 20 2.58 2.58 0 0 0 2.53-1.89 2.52 2.52 0 0 0-.57-2.28.5.5 0 0 1 .37-.83h1.65A6.15 6.15 0 0 0 22 11.33a8.48 8.48 0 0 0-2.46-6.25z" />

        {/* Animated color dots */}
        {circles.map(({ cx, cy }, idx) => {
          // interpolate [1 → 1.5] scale to [1.5 → 2.25] radius
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
