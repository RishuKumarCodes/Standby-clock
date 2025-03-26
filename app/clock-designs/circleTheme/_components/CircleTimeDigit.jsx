import React, { useMemo, memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { hexToRgba, pad } from "../_helpers";

const DefaultClockIcon = ({ width = 30, height = 30 }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24">
    <Path
      d="M12.5,11.8740234V7c0-0.276123-0.223877-0.5-0.5-0.5S11.5,6.723877,11.5,7v5
         c0.0001221,0.0824585,0.0206299,0.1636353,0.0595703,0.2363281l1.5,2.7988281
         c0.0869751,0.1623535,0.2562256,0.2637329,0.4404297,0.2636719
         c0.0825195,0.0003052,0.1638184-0.0202026,0.2363281-0.0595703
         c0.0002441-0.0001221,0.0004272-0.0002441,0.0006714-0.0003662
         c0.2429199-0.1306152,0.3340454-0.4334717,0.2034302-0.6763916L12.5,11.8740234z 
         M12,2C6.4771729,2,2,6.4771729,2,12s4.4771729,10,10,10
         c5.5201416-0.0064697,9.9935303-4.4798584,10-10
         C22,6.4771729,17.5228271,2,12,2z 
         M12,21c-4.9705811,0-9-4.0294189-9-9s4.0294189-9,9-9
         c4.9683228,0.0054321,8.9945679,4.0316772,9,9
         C21,16.9705811,16.9705811,21,12,21z"
      fill="#fff"
    />
  </Svg>
);

const CircleTimeDigit = ({ time, bgColor, size, previewMode, margin }) => {
  const timeString = `${pad(time.getHours())}:${pad(time.getMinutes())}`;
  const bg = useMemo(() => hexToRgba(bgColor, 0.2), [bgColor]);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
        justifyContent: "center",
        alignItems: "center",
        margin,
        marginLeft: 0,
      }}
    >
      <View
        style={[
          { justifyContent: "center", alignItems: "center" },
          previewMode && { transform: [{ scale: 0.5 }] },
        ]}
      >
        <DefaultClockIcon width={30} height={30} />
        <Text style={[styles.circleText, { color: bgColor }]}>
          {timeString}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  circleText: {
    fontSize: 20,
    marginTop: 5,
    textAlign: "center",
  },
});

export default memo(CircleTimeDigit, (prevProps, nextProps) => {
  const prevTime = prevProps.time;
  const nextTime = nextProps.time;
  return (
    prevTime.getHours() === nextTime.getHours() &&
    prevTime.getMinutes() === nextTime.getMinutes() &&
    prevProps.bgColor === nextProps.bgColor &&
    prevProps.previewMode === nextProps.previewMode &&
    prevProps.size === nextProps.size &&
    prevProps.margin === nextProps.margin
  );
});
