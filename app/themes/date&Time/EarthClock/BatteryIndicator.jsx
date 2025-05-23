import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Animated } from "react-native";
import Svg, { Path } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);

function BatteryIndicator({
  batteryLevel = 100,
  charging = false,
  color,
  scale = 1,
}) {
  const filledCells = Math.floor(batteryLevel / 20);

  const cellPaths = [
    "M110.26,178.42h-57.44c-4.23,0-7.67-3.43-7.67-7.67l121.15-124.01c0-4.23,3.43-7.67,7.67-7.67h57.44c4.23,0,7.67,3.43,7.67,7.67l-121.15,124.01c0,4.23-3.43,7.67-7.67,7.67Z", // cell1
    "M197.14,178.42h-57.44c-4.23,0-7.67-3.43-7.67-7.67l121.15-124.01c0-4.23,3.43-7.67,7.67-7.67h57.44c4.23,0,7.67,3.43,7.67,7.67l-121.15,124.01c0,4.23-3.43,7.67-7.67,7.67Z", // cell2
    "M284.02,177.89h-57.44c-4.23,0-7.67-3.43-7.67-7.67l121.15-124.01c0-4.23,3.43-7.67,7.67-7.67h57.44c4.23,0,7.67,3.43,7.67,7.67l-121.15,124.01c0,4.23-3.43,7.67-7.67,7.67Z", // cell3
    "M369.26,178.42h-57.44c-4.23,0-7.67-3.43-7.67-7.67l121.15-124.01c0-4.23,3.43-7.67,7.67-7.67h57.44c4.23,0,7.67,3.43,7.67,7.67l-121.15,124.01c0,4.23-3.43,7.67-7.67,7.67Z", // cell4
    "M458.73,178.42h-57.44c-4.23,0-7.67-3.43-7.67-7.67l121.15-124.01c0-4.23,3.43-7.67,7.67-7.67h57.44c4.23,0,7.67,3.43,7.67,7.67l-121.15,124.01c0,4.23-3.43,7.67-7.67,7.67Z", // cell5
  ];

  const blinkOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (charging && filledCells > 0) {
      const blinkAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(blinkOpacity, {
            toValue: 0.35,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(blinkOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      blinkAnimation.start();
      return () => blinkAnimation.stop();
    } else {
      blinkOpacity.setValue(1);
    }
  }, [charging, filledCells, blinkOpacity]);

  return (
    <View style={{ width: 150 * scale }}>
      <View style={styles.svgContainer}>
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 829.85 226.94"
          preserveAspectRatio="xMidYMid meet"
        >
          <Path
            id="background"
            d="M829.85,197.15c-.23-2.12-.34-4.28-.3-6.47-18.62,1.04-32.09,4.49-33.71,13.13-5.86,1.21-8.68,8.76-14.52,10.3-17.61.08-35.21.17-52.82.18v-5.24c-59.39-.16-130.32-.05-189.71-.22l-25.04-19.24v-1.5h-2.24c.27-2.01-.91-2.82-2.15-3.52l46.12-45.36,47.43-46.06c-.11-.08-.23-.17-.34-.26l52.31-51.45h96.82v-5.24c77.59,0,.74,0,76.05,0,0-32.31-.35-4.85-.35-36.21-2.29,0-7.02,1.8-9.24,1.8-2.15,29.17-1.73-1.29-2.45,27.6-75.05,0,8.83.07-64.01.07v-5.24c-33.74-.18-67.49-.32-101.23-.45-2.46-.03-4.16-.24-5.55,2.28-3.41,4.52-8.85,8.08-12.94,12.39-2.39,5.9-8.97,8.12-12.82,13.14-4.18,3.2-4.96,8.24-10.15,10.52-5.47,4.1-9.29,9.44-13.75,14.4-3.42,2.22-1.54,7.2.17,10.4l-93.47,91.92c-6.49-4.65-7.54-3.67-7.54-3.67-3.52,3.88-38.06,34.86-44.4,33.34-58.17.12-116.35.3-174.52.43-5.8-.25-8.95-.82-7.92,6.09h-56.87c-1.27-5.57-7.72-10.11-12.72-12.72-2.38-7.37-8.18-13.11-21.45-11.53-31.09.23-62.18.47-93.27.64-14.22-2.03-32.84,4.81-44.85-2.94-1.28-2.15-2.57-3.06-5.04-3.38-1.27-4.68-7.14-5.88-8.23-10.48-3.66-1.81-4.42-6.58-8.98-6.73-1.82-5.77-8.98-9.32-12.72-14.22-9.03,2.54,2.12,11.8,5.99,13.47v1.5h1.5v1.5h1.5c2.27,5.25,9.65,11.25,14.22,14.22v1.5h1.5v1.5h1.5v1.5h1.5c.63,9.12,11.58,10.98,23.26,9.83,43.87-.26,87.75-.49,131.63-.85,5.07,5.11,12.97,13.78,19.45,17.96v1.5c15.97,7.43,43.19.91,62.85,2.99v5.99h193.05v-1.5l35.26-29.25,27.59,24.02h1.5c7.83,12.79,29.74,4.67,43.53,6.81,52.83-.03,105.66-.04,158.49-.08v-5.24c23.12-3.63,56.31,10.27,68.84-11.97h1.5v-1.5h1.5v-1.5c2.94.07,2.58-2.77,5.28-4.07,2.04-1.66,3.34-2.31,2.95-4.91,7.35.03,14.7.05,22.04.08Z"
            fill={color}
          />
          {cellPaths.map((d, index) => {
            const cellNumber = index + 1;
            const isFilled = cellNumber <= filledCells;
            const fillOpacity = isFilled ? 1 : 0.35;

            if (charging && isFilled && cellNumber === filledCells) {
              return (
                <AnimatedPath
                  key={`cell${cellNumber}`}
                  d={d}
                  fill={color}
                  opacity={blinkOpacity}
                />
              );
            } else {
              return (
                <Path
                  key={`cell${cellNumber}`}
                  d={d}
                  fill={color}
                  opacity={fillOpacity}
                />
              );
            }
          })}
        </Svg>
      </View>
    </View>
  );
}

export default React.memo(BatteryIndicator);

const styles = StyleSheet.create({
  svgContainer: {
    width: "100%",
    aspectRatio: 829.85 / 226.94,
  },
});
